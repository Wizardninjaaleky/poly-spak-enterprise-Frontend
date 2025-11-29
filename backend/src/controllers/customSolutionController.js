import CustomSolution from '../models/CustomSolution.js';
import nodemailer from 'nodemailer';
import axios from 'axios';

// Email transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

// Create new quote request
export const createQuoteRequest = async (req, res) => {
  try {
    const {
      productType,
      capacity,
      material,
      color,
      features,
      quantity,
      urgency,
      timeline,
      name,
      email,
      company,
      phone,
      message,
    } = req.body;

    // Handle file uploads (if using Cloudinary or local storage)
    const files = req.files ? req.files.map(file => ({
      filename: file.originalname,
      path: file.path,
      size: file.size,
      mimetype: file.mimetype,
    })) : [];

    // Create new quote request
    const quoteRequest = new CustomSolution({
      productType,
      specifications: {
        capacity: parseInt(capacity),
        material,
        color,
        features: JSON.parse(features || '[]'),
      },
      volume: {
        quantity: parseInt(quantity),
        urgency,
        timeline,
      },
      contact: {
        name,
        email,
        company,
        phone,
      },
      message,
      files,
      status: 'pending',
      submittedAt: new Date(),
    });

    await quoteRequest.save();

    // Send confirmation email to customer
    await sendCustomerConfirmationEmail(quoteRequest);

    // Send notification to sales team
    await sendSalesTeamNotification(quoteRequest);

    // Send to CRM (optional - HubSpot/Pipedrive webhook)
    if (process.env.CRM_WEBHOOK_URL) {
      await sendToCRM(quoteRequest);
    }

    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      quoteId: quoteRequest._id,
    });
  } catch (error) {
    console.error('Error creating quote request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit quote request',
      error: error.message,
    });
  }
};

// Get all quote requests (Admin)
export const getAllQuoteRequests = async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;

    const filter = status ? { status } : {};
    
    const quoteRequests = await CustomSolution.find(filter)
      .sort({ submittedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    const count = await CustomSolution.countDocuments(filter);

    res.json({
      success: true,
      quoteRequests,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count,
    });
  } catch (error) {
    console.error('Error fetching quote requests:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote requests',
      error: error.message,
    });
  }
};

// Get quote request by ID
export const getQuoteRequestById = async (req, res) => {
  try {
    const quoteRequest = await CustomSolution.findById(req.params.id);

    if (!quoteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Quote request not found',
      });
    }

    res.json({
      success: true,
      quoteRequest,
    });
  } catch (error) {
    console.error('Error fetching quote request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quote request',
      error: error.message,
    });
  }
};

// Update quote status
export const updateQuoteStatus = async (req, res) => {
  try {
    const { status, estimatedPrice, estimatedTimeline } = req.body;

    const quoteRequest = await CustomSolution.findByIdAndUpdate(
      req.params.id,
      {
        status,
        estimatedPrice,
        estimatedTimeline,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!quoteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Quote request not found',
      });
    }

    // Send status update email to customer
    if (status === 'quoted') {
      await sendQuoteEmail(quoteRequest);
    }

    res.json({
      success: true,
      message: 'Quote request updated successfully',
      quoteRequest,
    });
  } catch (error) {
    console.error('Error updating quote request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update quote request',
      error: error.message,
    });
  }
};

// Add note to quote
export const addNote = async (req, res) => {
  try {
    const { note, author } = req.body;

    const quoteRequest = await CustomSolution.findById(req.params.id);

    if (!quoteRequest) {
      return res.status(404).json({
        success: false,
        message: 'Quote request not found',
      });
    }

    quoteRequest.notes.push({
      text: note,
      author,
      createdAt: new Date(),
    });

    await quoteRequest.save();

    res.json({
      success: true,
      message: 'Note added successfully',
      quoteRequest,
    });
  } catch (error) {
    console.error('Error adding note:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add note',
      error: error.message,
    });
  }
};

// Helper: Send customer confirmation email
async function sendCustomerConfirmationEmail(quoteRequest) {
  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: quoteRequest.contact.email,
    subject: 'Quote Request Received - Polyspack Enterprises',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .quote-id { background: #dbeafe; padding: 15px; border-radius: 6px; margin: 20px 0; text-align: center; }
          .details { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; }
          .detail-row { display: flex; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
          .detail-label { font-weight: bold; width: 40%; }
          .detail-value { width: 60%; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Quote Request Received!</h1>
            <p>Thank you for choosing Polyspack Enterprises</p>
          </div>
          
          <div class="content">
            <div class="quote-id">
              <strong>Reference ID:</strong> ${quoteRequest._id}
            </div>
            
            <p>Dear ${quoteRequest.contact.name},</p>
            
            <p>We have received your custom solutions request and our packaging specialists are reviewing your requirements. You'll receive a detailed quote within <strong>24 hours</strong>.</p>
            
            <div class="details">
              <h3>Request Details:</h3>
              <div class="detail-row">
                <div class="detail-label">Product Type:</div>
                <div class="detail-value">${quoteRequest.productType}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Capacity:</div>
                <div class="detail-value">${quoteRequest.specifications.capacity}ml</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Material:</div>
                <div class="detail-value">${quoteRequest.specifications.material}</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Quantity:</div>
                <div class="detail-value">${quoteRequest.volume.quantity} units</div>
              </div>
              <div class="detail-row">
                <div class="detail-label">Timeline:</div>
                <div class="detail-value">${quoteRequest.volume.timeline}</div>
              </div>
            </div>
            
            <h3>What Happens Next?</h3>
            <ol>
              <li><strong>Review (2 hours):</strong> Our team analyzes your specifications</li>
              <li><strong>Quote (24 hours):</strong> You receive detailed pricing and timeline</li>
              <li><strong>Consultation:</strong> We schedule a call to discuss details</li>
              <li><strong>Production:</strong> Upon approval, we begin manufacturing</li>
            </ol>
            
            <p style="text-align: center;">
              <a href="https://polyspackenterprises.co.ke/custom-solutions/${quoteRequest._id}" class="button">View Your Request</a>
            </p>
            
            <p><strong>Need immediate assistance?</strong><br>
            📞 +254 700 000 000<br>
            ✉️ sales@polyspackenterprises.co.ke<br>
            💬 <a href="https://wa.me/254700000000">WhatsApp Us</a></p>
          </div>
          
          <div class="footer">
            <p><strong>Polyspack Enterprises</strong><br>
            Kenya's Leading Rigid Plastic Packaging Manufacturer<br>
            KEBS Certified | ISO 9001:2015 | Made in Kenya</p>
            <p style="font-size: 12px; margin-top: 10px;">
              <a href="https://polyspackenterprises.co.ke" style="color: #93c5fd;">Visit Website</a> | 
              <a href="https://polyspackenterprises.co.ke/products" style="color: #93c5fd;">View Products</a> | 
              <a href="https://polyspackenterprises.co.ke/about" style="color: #93c5fd;">About Us</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Customer confirmation email sent successfully');
  } catch (error) {
    console.error('Error sending customer confirmation email:', error);
  }
}

// Helper: Send sales team notification
async function sendSalesTeamNotification(quoteRequest) {
  const mailOptions = {
    from: `"Polyspack System" <${process.env.EMAIL_USER}>`,
    to: process.env.SALES_TEAM_EMAIL || 'sales@polyspackenterprises.co.ke',
    subject: `🔔 New Quote Request - ${quoteRequest.productType} (${quoteRequest.volume.quantity} units)`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 700px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
          .urgent { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          .details { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .detail-row { padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
          .label { font-weight: bold; display: inline-block; width: 180px; }
          .button { display: inline-block; background: #2563eb; color: white; padding: 12px 25px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2>🔔 New Custom Solutions Request</h2>
            <p>Immediate Action Required</p>
          </div>
          
          ${quoteRequest.volume.urgency === 'urgent' ? '<div class="urgent"><strong>⚠️ URGENT REQUEST</strong> - Customer needs quick turnaround</div>' : ''}
          
          <div class="details">
            <h3>Quote ID: ${quoteRequest._id}</h3>
            
            <div class="detail-row">
              <span class="label">Customer Name:</span>
              <span>${quoteRequest.contact.name}</span>
            </div>
            <div class="detail-row">
              <span class="label">Company:</span>
              <span>${quoteRequest.contact.company}</span>
            </div>
            <div class="detail-row">
              <span class="label">Email:</span>
              <span><a href="mailto:${quoteRequest.contact.email}">${quoteRequest.contact.email}</a></span>
            </div>
            <div class="detail-row">
              <span class="label">Phone:</span>
              <span><a href="tel:${quoteRequest.contact.phone}">${quoteRequest.contact.phone}</a></span>
            </div>
            
            <h3 style="margin-top: 20px;">Product Requirements:</h3>
            <div class="detail-row">
              <span class="label">Product Type:</span>
              <span>${quoteRequest.productType}</span>
            </div>
            <div class="detail-row">
              <span class="label">Capacity:</span>
              <span>${quoteRequest.specifications.capacity}ml</span>
            </div>
            <div class="detail-row">
              <span class="label">Material:</span>
              <span>${quoteRequest.specifications.material}</span>
            </div>
            <div class="detail-row">
              <span class="label">Color:</span>
              <span>${quoteRequest.specifications.color}</span>
            </div>
            ${quoteRequest.specifications.features.length > 0 ? `
            <div class="detail-row">
              <span class="label">Features:</span>
              <span>${quoteRequest.specifications.features.join(', ')}</span>
            </div>
            ` : ''}
            
            <h3 style="margin-top: 20px;">Order Volume:</h3>
            <div class="detail-row">
              <span class="label">Quantity:</span>
              <span><strong>${quoteRequest.volume.quantity} units</strong></span>
            </div>
            <div class="detail-row">
              <span class="label">Urgency:</span>
              <span>${quoteRequest.volume.urgency.toUpperCase()}</span>
            </div>
            <div class="detail-row">
              <span class="label">Timeline:</span>
              <span>${quoteRequest.volume.timeline}</span>
            </div>
            
            ${quoteRequest.message ? `
            <h3 style="margin-top: 20px;">Additional Message:</h3>
            <p style="background: white; padding: 15px; border-radius: 6px;">${quoteRequest.message}</p>
            ` : ''}
            
            ${quoteRequest.files.length > 0 ? `
            <h3 style="margin-top: 20px;">Attached Files (${quoteRequest.files.length}):</h3>
            <ul>
              ${quoteRequest.files.map(file => `<li>${file.filename} (${(file.size / 1024).toFixed(1)} KB)</li>`).join('')}
            </ul>
            ` : ''}
          </div>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.ADMIN_URL || 'https://polyspackenterprises.co.ke'}/admin/quotes/${quoteRequest._id}" class="button">View in Dashboard</a>
            <a href="mailto:${quoteRequest.contact.email}" class="button" style="background: #059669;">Reply to Customer</a>
          </div>
          
          <p style="text-align: center; color: #6b7280; font-size: 12px;">
            Submitted: ${new Date(quoteRequest.submittedAt).toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })} EAT
          </p>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Sales team notification sent successfully');
  } catch (error) {
    console.error('Error sending sales team notification:', error);
  }
}

// Helper: Send quote email when status updated
async function sendQuoteEmail(quoteRequest) {
  const mailOptions = {
    from: `"Polyspack Enterprises" <${process.env.EMAIL_USER}>`,
    to: quoteRequest.contact.email,
    subject: 'Your Custom Solutions Quote is Ready - Polyspack Enterprises',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #059669 0%, #047857 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; }
          .quote-box { background: white; padding: 25px; border-radius: 6px; margin: 20px 0; border: 2px solid #059669; }
          .price { font-size: 36px; font-weight: bold; color: #059669; text-align: center; margin: 20px 0; }
          .button { display: inline-block; background: #059669; color: white; padding: 15px 40px; text-decoration: none; border-radius: 6px; margin: 10px 0; font-weight: bold; }
          .footer { background: #1f2937; color: white; padding: 20px; text-align: center; border-radius: 0 0 8px 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Your Quote is Ready!</h1>
            <p>Reference ID: ${quoteRequest._id}</p>
          </div>
          
          <div class="content">
            <p>Dear ${quoteRequest.contact.name},</p>
            
            <p>Great news! We've prepared a detailed quote for your custom ${quoteRequest.productType} order.</p>
            
            <div class="quote-box">
              <h2 style="text-align: center; margin-top: 0;">Your Quote Summary</h2>
              ${quoteRequest.estimatedPrice ? `<div class="price">KSh ${quoteRequest.estimatedPrice.toLocaleString()}</div>` : ''}
              <p style="text-align: center;"><strong>Estimated Production Time:</strong> ${quoteRequest.estimatedTimeline || 'To be discussed'}</p>
              
              <h3>Specifications:</h3>
              <ul>
                <li><strong>Product:</strong> ${quoteRequest.productType}</li>
                <li><strong>Capacity:</strong> ${quoteRequest.specifications.capacity}ml</li>
                <li><strong>Material:</strong> ${quoteRequest.specifications.material}</li>
                <li><strong>Quantity:</strong> ${quoteRequest.volume.quantity} units</li>
              </ul>
            </div>
            
            <p><strong>This quote includes:</strong></p>
            <ul>
              <li>✓ Custom product manufacturing</li>
              <li>✓ Quality assurance testing</li>
              <li>✓ Packaging and labeling</li>
              <li>✓ Delivery to your location (within Kenya)</li>
              <li>✓ Technical support and after-sales service</li>
            </ul>
            
            <p style="text-align: center;">
              <a href="https://polyspackenterprises.co.ke/custom-solutions/${quoteRequest._id}" class="button">Review Full Quote</a>
            </p>
            
            <p><strong>Next Steps:</strong></p>
            <ol>
              <li>Review the detailed quote and specifications</li>
              <li>Schedule a consultation call with our team</li>
              <li>Finalize design details and approve the quote</li>
              <li>We begin production upon confirmation</li>
            </ol>
            
            <p><strong>Have questions? Contact us:</strong><br>
            📞 +254 700 000 000<br>
            ✉️ sales@polyspackenterprises.co.ke<br>
            💬 <a href="https://wa.me/254700000000">WhatsApp Us</a></p>
            
            <p style="background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin-top: 20px;">
              <strong>⏰ Quote Valid For:</strong> 30 days from today
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Polyspack Enterprises</strong><br>
            Kenya's Leading Rigid Plastic Packaging Manufacturer</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Quote email sent successfully');
  } catch (error) {
    console.error('Error sending quote email:', error);
  }
}

// Helper: Send to CRM
async function sendToCRM(quoteRequest) {
  try {
    const crmData = {
      properties: {
        email: quoteRequest.contact.email,
        firstname: quoteRequest.contact.name.split(' ')[0],
        lastname: quoteRequest.contact.name.split(' ').slice(1).join(' '),
        company: quoteRequest.contact.company,
        phone: quoteRequest.contact.phone,
        product_type: quoteRequest.productType,
        quantity: quoteRequest.volume.quantity,
        urgency: quoteRequest.volume.urgency,
        quote_id: quoteRequest._id.toString(),
      },
    };

    await axios.post(process.env.CRM_WEBHOOK_URL, crmData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.CRM_API_KEY}`,
      },
    });

    console.log('Quote sent to CRM successfully');
  } catch (error) {
    console.error('Error sending to CRM:', error.message);
    // Don't throw error - CRM integration failure shouldn't block quote submission
  }
}
