const nodemailer = require('nodemailer');

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransporter({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// Send order confirmation email
const sendOrderConfirmation = async (order, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Confirmation - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">Order Confirmation</h2>
          <p>Dear ${user.name},</p>
          <p>Thank you for your order! Here are the details:</p>

          <div style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> ${order.status}</p>
            <p><strong>Total Amount:</strong> KES ${order.totalAmount}</p>
            <p><strong>Delivery Type:</strong> ${order.delivery.type}</p>
          </div>

          <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
            <h4>Payment Instructions</h4>
            <p><strong>Paybill Number:</strong> ${process.env.PAYBILL_NUMBER}</p>
            <p><strong>Account Number:</strong> ${process.env.ACCOUNT_NUMBER}</p>
            <p>Please complete your payment and upload the MPESA transaction code in your account.</p>
          </div>

          <p>If you have any questions, please contact us.</p>
          <p>Best regards,<br>Polyspack Enterprises Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Don't throw error to avoid breaking order creation
  }
};

// Send payment verification email
const sendPaymentVerified = async (order, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Payment Verified - Order ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #28a745;">Payment Verified!</h2>
          <p>Dear ${user.name},</p>
          <p>Your payment has been verified and your order is now being processed.</p>

          <div style="background-color: #d4edda; padding: 20px; margin: 20px 0; border-left: 4px solid #28a745;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>

          <p>You will receive updates on your order status. Thank you for shopping with us!</p>
          <p>Best regards,<br>Polyspack Enterprises Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Payment verification email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending payment verification email:', error);
  }
};

// Send order status update email
const sendOrderStatusUpdate = async (order, user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: `Order Update - ${order.orderNumber}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #007bff;">Order Status Update</h2>
          <p>Dear ${user.name},</p>
          <p>Your order status has been updated.</p>

          <div style="background-color: #e7f3ff; padding: 20px; margin: 20px 0; border-left: 4px solid #007bff;">
            <h3>Order Details</h3>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>New Status:</strong> ${order.status}</p>
          </div>

          <p>Thank you for your patience.</p>
          <p>Best regards,<br>Polyspack Enterprises Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Order status update email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending order status update email:', error);
  }
};

module.exports = {
  sendOrderConfirmation,
  sendPaymentVerified,
  sendOrderStatusUpdate,
};
