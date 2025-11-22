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

// Send registration confirmation email
const sendRegistrationConfirmation = async (user) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
      to: user.email,
      subject: 'Welcome to Polyspack Enterprises - Registration Confirmed',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #2d5a27; color: white; padding: 20px; text-align: center;">
            <h1>Welcome to Polyspack Enterprises!</h1>
          </div>

          <div style="padding: 30px 20px;">
            <h2 style="color: #2d5a27;">Hello ${user.name}!</h2>
            <p>Thank you for registering with Polyspack Enterprises. Your account has been successfully created and you can now:</p>

            <ul style="background-color: #f9f9f9; padding: 20px; margin: 20px 0;">
              <li style="margin-bottom: 10px;">Browse our wide range of agricultural products</li>
              <li style="margin-bottom: 10px;">Place orders for seedlings, bags, electronics, and services</li>
              <li style="margin-bottom: 10px;">Track your order status in real-time</li>
              <li style="margin-bottom: 10px;">Manage your account and preferences</li>
              <li>Receive exclusive offers and updates</li>
            </ul>

            <div style="background-color: #fff3cd; padding: 15px; margin: 20px 0; border-left: 4px solid #ffc107;">
              <h4>Getting Started</h4>
              <p><strong>Login Email:</strong> ${user.email}</p>
              <p>You can now log in to your account and start shopping!</p>
            </div>

            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL || 'https://polyspackenterprises.co.ke'}/login"
                 style="background-color: #2d5a27; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Start Shopping Now
              </a>
            </div>

            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>

            <p style="margin-top: 30px;">Best regards,<br><strong>Polyspack Enterprises Team</strong></p>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; color: #666; font-size: 12px;">
              <p>This is an automated message. Please do not reply to this email.</p>
              <p>© ${new Date().getFullYear()} Polyspack Enterprises. All rights reserved.</p>
            </div>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Registration confirmation email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending registration confirmation email:', error);
    // Don't throw error to avoid breaking registration
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

export default {
  sendOrderConfirmation,
  sendPaymentVerified,
  sendRegistrationConfirmation,
  sendOrderStatusUpdate,
};
