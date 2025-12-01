# M-PESA Daraja API Integration Guide

## Overview
This document explains how to integrate M-PESA STK Push payments into the Polyspack e-commerce platform.

## Setup Requirements

### 1. Register on Safaricom Daraja Portal
1. Visit: https://developer.safaricom.co.ke
2. Create an account
3. Create a new app to get credentials

### 2. Get Credentials
You'll receive:
- **Consumer Key**: Used for OAuth authentication
- **Consumer Secret**: Used for OAuth authentication
- **Business Short Code**: Your Paybill/Till number (Currently: 522533)
- **Passkey**: Provided by Safaricom for STK Push
- **Callback URL**: Your server endpoint for payment notifications

### 3. Environment Variables
Add these to your `.env` file in the backend:

```bash
# M-PESA Configuration
MPESA_ENVIRONMENT=sandbox # or 'production'
MPESA_CONSUMER_KEY=your_consumer_key_here
MPESA_CONSUMER_SECRET=your_consumer_secret_here
MPESA_SHORTCODE=522533
MPESA_PASSKEY=your_passkey_here
MPESA_CALLBACK_URL=https://poly-spak-enterprise-backend-2.onrender.com/api/payments/mpesa/callback
```

### 4. Testing in Sandbox
Safaricom provides test credentials for sandbox:
- Use sandbox phone numbers (provided by Safaricom)
- Transactions don't use real money
- Test Consumer Key and Secret provided in portal

### 5. Production Checklist
Before going live:
- [ ] Complete business verification on Daraja portal
- [ ] Get production credentials
- [ ] Set `MPESA_ENVIRONMENT=production`
- [ ] Test with small real transactions
- [ ] Ensure callback URL is publicly accessible
- [ ] Monitor callback logs for 24 hours

## How It Works

### Payment Flow

1. **Customer Initiates Payment**
   - Customer clicks "Pay with M-PESA" on checkout
   - Frontend sends order ID and phone number to backend
   - Backend: `POST /api/payments/mpesa/initiate`

2. **STK Push Sent**
   - Backend calls Safaricom Daraja API
   - Customer receives STK Push prompt on phone
   - Customer enters M-PESA PIN

3. **Payment Processing**
   - Safaricom processes payment
   - Customer receives SMS confirmation
   - Safaricom calls our callback URL with result

4. **Order Updated**
   - Callback handler verifies payment
   - Updates order status to "paid"
   - Updates payment record with M-PESA receipt number

5. **Customer Confirmation**
   - Frontend polls payment status
   - Shows success message
   - Displays order details and tracking

## API Endpoints

### 1. Initiate Payment
```http
POST /api/payments/mpesa/initiate
Authorization: Bearer {token}
Content-Type: application/json

{
  "orderId": "6789abc123def456",
  "phoneNumber": "0712345678"
}

Response:
{
  "success": true,
  "message": "Payment request sent to your phone",
  "data": {
    "CheckoutRequestID": "ws_CO_01012024120000000001",
    "MerchantRequestID": "16945-45678-1",
    "paymentId": "payment_id_here",
    "orderId": "order_id_here"
  }
}
```

### 2. Check Payment Status
```http
GET /api/payments/mpesa/status/:checkoutRequestId
Authorization: Bearer {token}

Response:
{
  "success": true,
  "data": {
    "paymentId": "...",
    "orderId": "...",
    "orderNumber": "ORD-12345",
    "amount": 5000,
    "phoneNumber": "254712345678",
    "paymentStatus": "Verified",
    "transactionStatus": "completed",
    "mpesaCode": "RBK1A2B3C4",
    "checkoutRequestId": "ws_CO_...",
    "createdAt": "2024-01-01T12:00:00Z",
    "verifiedAt": "2024-01-01T12:01:00Z"
  }
}
```

### 3. Get Payment History
```http
GET /api/payments/mpesa/history
Authorization: Bearer {token}

Response:
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "amount": 5000,
      "paymentStatus": "Verified",
      "mpesaCode": "RBK1A2B3C4",
      "createdAt": "2024-01-01T12:00:00Z",
      "orderId": { ... }
    }
  ]
}
```

### 4. M-PESA Callback (Internal)
```http
POST /api/payments/mpesa/callback
Content-Type: application/json

{
  "Body": {
    "stkCallback": {
      "MerchantRequestID": "...",
      "CheckoutRequestID": "...",
      "ResultCode": 0,
      "ResultDesc": "The service request is processed successfully.",
      "CallbackMetadata": {
        "Item": [
          { "Name": "Amount", "Value": 5000 },
          { "Name": "MpesaReceiptNumber", "Value": "RBK1A2B3C4" },
          { "Name": "TransactionDate", "Value": 20240101120000 },
          { "Name": "PhoneNumber", "Value": 254712345678 }
        ]
      }
    }
  }
}
```

## Frontend Integration

### 1. Update Checkout Page
```javascript
const handleMpesaPayment = async (orderId, phoneNumber) => {
  try {
    const response = await fetch(
      'https://poly-spak-enterprise-backend-2.onrender.com/api/payments/mpesa/initiate',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ orderId, phoneNumber }),
      }
    );

    const data = await response.json();
    
    if (data.success) {
      // Show "Check your phone" message
      setCheckoutRequestId(data.data.CheckoutRequestID);
      pollPaymentStatus(data.data.CheckoutRequestID);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error('Payment error:', error);
    alert('Failed to initiate payment');
  }
};

const pollPaymentStatus = async (checkoutRequestId) => {
  const maxAttempts = 30; // Poll for 60 seconds
  let attempts = 0;

  const interval = setInterval(async () => {
    attempts++;
    
    try {
      const response = await fetch(
        `https://poly-spak-enterprise-backend-2.onrender.com/api/payments/mpesa/status/${checkoutRequestId}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      const data = await response.json();
      
      if (data.success && data.data.paymentStatus === 'Verified') {
        clearInterval(interval);
        // Show success message
        router.push(`/order-confirmation/${data.data.orderId}`);
      } else if (data.data.paymentStatus === 'Failed') {
        clearInterval(interval);
        alert('Payment failed. Please try again.');
      }
      
      if (attempts >= maxAttempts) {
        clearInterval(interval);
        alert('Payment verification timeout. Please check your order status.');
      }
    } catch (error) {
      console.error('Status check error:', error);
    }
  }, 2000); // Check every 2 seconds
};
```

## Database Schema

### Payment Model
```javascript
{
  orderId: ObjectId (ref: Order),
  userId: ObjectId (ref: User),
  amount: Number,
  currency: String (default: 'KES'),
  paymentMethod: String (enum: ['mpesa', 'card', 'bank_transfer']),
  paymentStatus: String (enum: ['Pending', 'Verified', 'Failed', 'Refunded']),
  transactionStatus: String (enum: ['initiated', 'pending', 'completed', 'failed']),
  mpesaCode: String (M-PESA receipt number),
  checkoutRequestId: String (STK Push identifier),
  merchantRequestId: String,
  phoneNumber: String,
  transactionDate: Date,
  verifiedAt: Date,
  failureReason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Error Handling

### Common Error Codes
- **ResultCode 0**: Success
- **ResultCode 1**: Insufficient balance
- **ResultCode 2001**: Wrong PIN
- **ResultCode 1032**: Request cancelled by user
- **ResultCode 1037**: Timeout (user didn't enter PIN)

### Handle in Callback
```javascript
if (callback.ResultCode === 0) {
  // Payment successful
} else if (callback.ResultCode === 1) {
  failureReason = 'Insufficient M-PESA balance';
} else if (callback.ResultCode === 2001) {
  failureReason = 'Invalid M-PESA PIN entered';
} else if (callback.ResultCode === 1032) {
  failureReason = 'Payment cancelled by user';
} else if (callback.ResultCode === 1037) {
  failureReason = 'Payment timeout - no PIN entered';
}
```

## Security Best Practices

1. **Validate Callback Source**
   - Check IP address (Safaricom IPs)
   - Validate request signature (if provided)

2. **Idempotency**
   - Handle duplicate callbacks
   - Check payment status before updating

3. **Rate Limiting**
   - Already applied: `authLimiter` on M-PESA routes
   - Prevents brute force attacks

4. **Logging**
   - Log all M-PESA requests/responses
   - Monitor for suspicious activity
   - Keep audit trail for disputes

5. **Environment Isolation**
   - Use sandbox for testing
   - Never expose production credentials
   - Rotate keys regularly

## Testing Checklist

- [ ] Test successful payment flow
- [ ] Test insufficient balance (code 1)
- [ ] Test wrong PIN (code 2001)
- [ ] Test user cancellation (code 1032)
- [ ] Test timeout (code 1037)
- [ ] Test callback handling
- [ ] Test payment status polling
- [ ] Test multiple simultaneous payments
- [ ] Test with different phone number formats
- [ ] Monitor callback logs for 24 hours

## Support & Resources

- **Daraja Portal**: https://developer.safaricom.co.ke
- **Documentation**: https://developer.safaricom.co.ke/APIs
- **Support Email**: apisupport@safaricom.co.ke
- **Community**: Daraja Developer Slack

## Current Status

✅ Backend implementation complete
✅ M-PESA service class created
✅ Payment controller with STK Push
✅ Callback handler implemented
✅ Routes configured
✅ Payment model updated
⏳ Frontend checkout integration (next step)
⏳ Safaricom Daraja credentials needed
⏳ Production testing required
