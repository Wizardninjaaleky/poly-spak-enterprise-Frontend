import axios from 'axios';

/**
 * M-PESA Daraja API Integration Service
 * Handles STK Push, payment verification, and callbacks
 */

class MpesaService {
  constructor() {
    this.consumerKey = process.env.MPESA_CONSUMER_KEY;
    this.consumerSecret = process.env.MPESA_CONSUMER_SECRET;
    this.shortcode = process.env.MPESA_SHORTCODE;
    this.passkey = process.env.MPESA_PASSKEY;
    this.callbackUrl = process.env.MPESA_CALLBACK_URL || 'https://poly-spak-enterprise-backend-2.onrender.com/api/payments/mpesa/callback';
    this.environment = process.env.MPESA_ENVIRONMENT || 'sandbox'; // 'sandbox' or 'production'
    
    this.baseUrl = this.environment === 'production'
      ? 'https://api.safaricom.co.ke'
      : 'https://sandbox.safaricom.co.ke';
  }

  /**
   * Generate OAuth access token
   */
  async getAccessToken() {
    try {
      if (!this.consumerKey || !this.consumerSecret) {
        throw new Error('M-PESA credentials not configured');
      }

      const auth = Buffer.from(`${this.consumerKey}:${this.consumerSecret}`).toString('base64');
      
      const response = await axios.get(
        `${this.baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
        {
          headers: {
            Authorization: `Basic ${auth}`,
          },
        }
      );

      return response.data.access_token;
    } catch (error) {
      console.error('M-PESA OAuth Error:', error.response?.data || error.message);
      throw new Error('Failed to authenticate with M-PESA');
    }
  }

  /**
   * Generate password for STK Push
   */
  generatePassword() {
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(`${this.shortcode}${this.passkey}${timestamp}`).toString('base64');
    return { password, timestamp };
  }

  /**
   * Initiate STK Push payment request
   * @param {string} phoneNumber - Customer phone number (format: 254XXXXXXXXX)
   * @param {number} amount - Amount to charge
   * @param {string} accountReference - Order ID or reference
   * @param {string} transactionDesc - Description of transaction
   */
  async initiateSTKPush(phoneNumber, amount, accountReference, transactionDesc = 'Payment for Order') {
    try {
      // Validate inputs
      if (!phoneNumber || !amount || !accountReference) {
        throw new Error('Phone number, amount, and account reference are required');
      }

      if (!this.shortcode || !this.passkey) {
        throw new Error('M-PESA configuration incomplete. Please set MPESA_SHORTCODE and MPESA_PASSKEY');
      }

      // Format phone number
      const formattedPhone = this.formatPhoneNumber(phoneNumber);
      
      // Get access token
      const accessToken = await this.getAccessToken();
      
      // Generate password and timestamp
      const { password, timestamp } = this.generatePassword();

      // Prepare STK Push request
      const requestPayload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount), // Must be integer
        PartyA: formattedPhone, // Customer phone
        PartyB: this.shortcode, // Business shortcode
        PhoneNumber: formattedPhone,
        CallBackURL: this.callbackUrl,
        AccountReference: accountReference,
        TransactionDesc: transactionDesc,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpush/v1/processrequest`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        CheckoutRequestID: response.data.CheckoutRequestID,
        MerchantRequestID: response.data.MerchantRequestID,
        ResponseCode: response.data.ResponseCode,
        ResponseDescription: response.data.ResponseDescription,
        CustomerMessage: response.data.CustomerMessage,
      };
    } catch (error) {
      console.error('M-PESA STK Push Error:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.errorMessage || 'Failed to initiate payment',
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Query STK Push payment status
   * @param {string} checkoutRequestId - Checkout Request ID from STK Push
   */
  async querySTKPushStatus(checkoutRequestId) {
    try {
      const accessToken = await this.getAccessToken();
      const { password, timestamp } = this.generatePassword();

      const requestPayload = {
        BusinessShortCode: this.shortcode,
        Password: password,
        Timestamp: timestamp,
        CheckoutRequestID: checkoutRequestId,
      };

      const response = await axios.post(
        `${this.baseUrl}/mpesa/stkpushquery/v1/query`,
        requestPayload,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return {
        success: true,
        ResultCode: response.data.ResultCode,
        ResultDesc: response.data.ResultDesc,
        MerchantRequestID: response.data.MerchantRequestID,
        CheckoutRequestID: response.data.CheckoutRequestID,
      };
    } catch (error) {
      console.error('M-PESA Query Error:', error.response?.data || error.message);
      return {
        success: false,
        message: 'Failed to query payment status',
        error: error.response?.data || error.message,
      };
    }
  }

  /**
   * Format phone number to M-PESA format (254XXXXXXXXX)
   */
  formatPhoneNumber(phone) {
    let formatted = phone.replace(/\D/g, ''); // Remove non-digits
    
    if (formatted.startsWith('0')) {
      formatted = '254' + formatted.substring(1);
    } else if (formatted.startsWith('+254')) {
      formatted = formatted.substring(1);
    } else if (formatted.startsWith('254')) {
      // Already in correct format
    } else if (formatted.startsWith('7') || formatted.startsWith('1')) {
      formatted = '254' + formatted;
    }
    
    return formatted;
  }

  /**
   * Process M-PESA callback response
   */
  processCallback(callbackData) {
    try {
      const callback = callbackData.Body.stkCallback;
      
      if (callback.ResultCode === 0) {
        // Payment successful
        const metadata = {};
        if (callback.CallbackMetadata && callback.CallbackMetadata.Item) {
          callback.CallbackMetadata.Item.forEach(item => {
            metadata[item.Name] = item.Value;
          });
        }

        return {
          success: true,
          MerchantRequestID: callback.MerchantRequestID,
          CheckoutRequestID: callback.CheckoutRequestID,
          ResultCode: callback.ResultCode,
          ResultDesc: callback.ResultDesc,
          Amount: metadata.Amount,
          MpesaReceiptNumber: metadata.MpesaReceiptNumber,
          TransactionDate: metadata.TransactionDate,
          PhoneNumber: metadata.PhoneNumber,
        };
      } else {
        // Payment failed or cancelled
        return {
          success: false,
          MerchantRequestID: callback.MerchantRequestID,
          CheckoutRequestID: callback.CheckoutRequestID,
          ResultCode: callback.ResultCode,
          ResultDesc: callback.ResultDesc,
        };
      }
    } catch (error) {
      console.error('M-PESA Callback Processing Error:', error);
      throw new Error('Invalid callback data');
    }
  }
}

export default new MpesaService();
