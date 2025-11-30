import nodemailer from 'nodemailer';

// Email transporter configuration
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Send order confirmation email to customer
export async function sendOrderConfirmationEmail(order, user) {
  const orderItemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
        ${item.name || item.productName}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">
        ${item.quantity}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        KES ${(item.price || item.unitPrice).toLocaleString()}
      </td>
      <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        KES ${((item.price || item.unitPrice) * item.quantity).toLocaleString()}
      </td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: user.email || order.customerEmail,
    subject: `Order Confirmation - #${order.orderNumber || order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .order-info { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .order-table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
          .order-table th { background: #f3f4f6; padding: 12px; text-align: left; font-weight: bold; border-bottom: 2px solid #e5e7eb; }
          .total-row { background: #f9fafb; font-weight: bold; font-size: 16px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .info-box { background: #dbeafe; padding: 15px; border-left: 4px solid #2563eb; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Order Confirmed!</h1>
            <p style="margin: 0; font-size: 18px;">Thank you for your order</p>
          </div>
          <div class="content">
            <p>Dear ${user.firstName || user.name || 'Valued Customer'},</p>
            <p>We've received your order and are preparing it for delivery. Here are your order details:</p>
            
            <div class="order-info">
              <p><strong>Order Number:</strong> #${order.orderNumber || order._id}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt || Date.now()).toLocaleDateString('en-KE', { dateStyle: 'full' })}</p>
              <p><strong>Status:</strong> <span style="color: #059669; font-weight: bold;">${order.status || 'Confirmed'}</span></p>
            </div>

            <h2 style="color: #1f2937; margin-top: 30px;">Order Items</h2>
            <table class="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Quantity</th>
                  <th style="text-align: right;">Unit Price</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHTML}
                <tr class="total-row">
                  <td colspan="3" style="padding: 15px; text-align: right;">Total Amount:</td>
                  <td style="padding: 15px; text-align: right; color: #2563eb;">KES ${order.totalAmount?.toLocaleString() || 0}</td>
                </tr>
              </tbody>
            </table>

            ${order.deliveryAddress ? `
            <h2 style="color: #1f2937; margin-top: 30px;">Delivery Address</h2>
            <div class="order-info">
              <p>${order.deliveryAddress.street || ''}</p>
              <p>${order.deliveryAddress.city || ''}, ${order.deliveryAddress.county || ''}</p>
              <p>${order.deliveryAddress.country || 'Kenya'}</p>
              ${order.deliveryAddress.phone ? `<p><strong>Phone:</strong> ${order.deliveryAddress.phone}</p>` : ''}
            </div>
            ` : ''}

            <div class="info-box">
              <p><strong>What happens next?</strong></p>
              <ul style="margin: 10px 0; padding-left: 20px;">
                <li>We'll process your order within 24 hours</li>
                <li>You'll receive a shipping confirmation with tracking details</li>
                <li>Estimated delivery: 3-5 business days</li>
              </ul>
            </div>

            <p style="text-align: center;">
              <a href="${process.env.FRONTEND_URL || 'https://polyspackenterprises.co.ke'}/track?order=${order.orderNumber || order._id}" class="button">Track Your Order</a>
            </p>

            <p><strong>Need Help?</strong></p>
            <p>Our customer support team is here to assist you:</p>
            <ul>
              <li>Email: sales@polyspackenterprises.co.ke</li>
              <li>Phone: +254 742 312306</li>
              <li>WhatsApp: <a href="https://wa.me/254742312306">+254 742 312306</a></li>
            </ul>
          </div>
          <div class="footer">
            <p><strong>Polyspack Enterprises</strong></p>
            <p>Kenya's Leading Rigid Plastic Packaging Manufacturer</p>
            <p style="font-size: 12px; margin-top: 10px;">This is an automated email. Please do not reply directly to this message.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Order confirmation email sent to ${user.email || order.customerEmail}`);
    return { success: true };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

// Send order received notification to admin
export async function sendOrderNotificationToAdmin(order, user) {
  const adminEmail = process.env.ADMIN_EMAIL || 'sales@polyspackenterprises.co.ke';
  
  const orderItemsHTML = order.items.map(item => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${item.name || item.productName}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">KES ${((item.price || item.unitPrice) * item.quantity).toLocaleString()}</td>
    </tr>
  `).join('');

  const mailOptions = {
    from: `"Polyspack System" <${process.env.EMAIL_USER}>`,
    to: adminEmail,
    subject: `🔔 New Order Received - #${order.orderNumber || order._id}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .order-table { width: 100%; border-collapse: collapse; margin: 15px 0; background: white; }
          .order-table th { background: #f3f4f6; padding: 10px; text-align: left; border-bottom: 2px solid #e5e7eb; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; }
          .footer { background: #1f2937; color: white; padding: 15px; text-align: center; border-radius: 0 0 8px 8px; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>New Order Received</h1>
          </div>
          <div class="content">
            <p><strong>Order #${order.orderNumber || order._id}</strong></p>
            <p>Customer: ${user.firstName} ${user.lastName} (${user.email})</p>
            <p>Phone: ${user.phone || order.deliveryAddress?.phone || 'N/A'}</p>
            <p>Total: <strong style="color: #059669; font-size: 18px;">KES ${order.totalAmount?.toLocaleString() || 0}</strong></p>
            
            <h3>Order Items:</h3>
            <table class="order-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th style="text-align: center;">Qty</th>
                  <th style="text-align: right;">Total</th>
                </tr>
              </thead>
              <tbody>
                ${orderItemsHTML}
              </tbody>
            </table>

            ${order.deliveryAddress ? `
            <p><strong>Delivery Address:</strong><br>
            ${order.deliveryAddress.street || ''}<br>
            ${order.deliveryAddress.city || ''}, ${order.deliveryAddress.county || ''}</p>
            ` : ''}

            <p style="text-align: center; margin-top: 20px;">
              <a href="${process.env.FRONTEND_URL || 'https://polyspackenterprises.co.ke'}/admin/orders/${order._id}" class="button">View Order Details</a>
            </p>
          </div>
          <div class="footer">
            <p>Polyspack Admin Notification System</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Order notification sent to admin');
    return { success: true };
  } catch (error) {
    console.error('Error sending admin notification:', error);
    return { success: false, error: error.message };
  }
}
