const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Generate invoice PDF
const generateInvoice = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      // Create a new PDF document
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });

      // Create buffer to store PDF
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Company header
      doc.fontSize(20).font('Helvetica-Bold').text('POLYSPACK ENTERPRISES', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica').text('Fertilizer & Agricultural Solutions', { align: 'center' });
      doc.fontSize(10).text('P.O. Box 12345, Nairobi, Kenya', { align: 'center' });
      doc.text('Phone: +254 700 000 000 | Email: info@polyspack.com', { align: 'center' });
      doc.moveDown(2);

      // Invoice title
      doc.fontSize(18).font('Helvetica-Bold').text('INVOICE', { align: 'center' });
      doc.moveDown(1);

      // Invoice details
      const invoiceNumber = `INV-${order._id.toString().slice(-8).toUpperCase()}`;
      const invoiceDate = new Date().toLocaleDateString('en-KE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      doc.fontSize(12).font('Helvetica');
      doc.text(`Invoice Number: ${invoiceNumber}`, 50, doc.y);
      doc.text(`Invoice Date: ${invoiceDate}`, 350, doc.y - 15);
      doc.moveDown(1);

      doc.text(`Order Number: ${order.orderNumber}`, 50, doc.y);
      doc.text(`Payment Date: ${new Date(order.updatedAt).toLocaleDateString('en-KE')}`, 350, doc.y - 15);
      doc.moveDown(2);

      // Bill to section
      doc.fontSize(14).font('Helvetica-Bold').text('Bill To:', 50, doc.y);
      doc.moveDown(0.5);
      doc.fontSize(12).font('Helvetica');
      doc.text(user.name, 50, doc.y);
      doc.text(user.email, 50, doc.y + 15);
      if (order.delivery.type === 'delivery' && order.delivery.address) {
        doc.text(order.delivery.address.street, 50, doc.y + 30);
        doc.text(`${order.delivery.address.city}, ${order.delivery.address.county}`, 50, doc.y + 45);
        doc.text(`${order.delivery.address.town}, ${order.delivery.address.country}`, 50, doc.y + 60);
      }
      doc.moveDown(3);

      // Items table header
      const tableTop = doc.y;
      doc.fontSize(12).font('Helvetica-Bold');
      doc.text('Description', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Unit Price', 350, tableTop);
      doc.text('Total', 450, tableTop);

      // Table line
      doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();
      doc.moveDown(1);

      // Items
      let yPosition = doc.y;
      doc.fontSize(10).font('Helvetica');

      order.items.forEach((item) => {
        doc.text(item.productId.name, 50, yPosition);
        doc.text(item.qty.toString(), 300, yPosition);
        doc.text(`KSh ${item.price.toLocaleString()}`, 350, yPosition);
        doc.text(`KSh ${(item.price * item.qty).toLocaleString()}`, 450, yPosition);
        yPosition += 20;
      });

      // Table bottom line
      doc.moveTo(50, yPosition).lineTo(550, yPosition).stroke();
      doc.moveDown(1);

      // Totals section
      const totalsY = doc.y;
      doc.fontSize(12).font('Helvetica-Bold');

      // Subtotal
      const subtotal = order.totalAmount + order.discountAmount;
      doc.text('Subtotal:', 350, totalsY);
      doc.text(`KSh ${subtotal.toLocaleString()}`, 450, totalsY);

      // Discount
      if (order.discountAmount > 0) {
        doc.text('Discount:', 350, totalsY + 20);
        doc.text(`-KSh ${order.discountAmount.toLocaleString()}`, 450, totalsY + 20);
      }

      // Shipping
      doc.text('Shipping:', 350, totalsY + (order.discountAmount > 0 ? 40 : 20));
      doc.text(`KSh ${order.shippingAmount.toLocaleString()}`, 450, totalsY + (order.discountAmount > 0 ? 40 : 20));

      // Total
      doc.moveTo(350, totalsY + (order.discountAmount > 0 ? 55 : 35)).lineTo(550, totalsY + (order.discountAmount > 0 ? 55 : 35)).stroke();
      doc.text('TOTAL:', 350, totalsY + (order.discountAmount > 0 ? 65 : 45));
      doc.text(`KSh ${order.totalAmount.toLocaleString()}`, 450, totalsY + (order.discountAmount > 0 ? 65 : 45));

      doc.moveDown(3);

      // Payment information
      doc.fontSize(12).font('Helvetica-Bold').text('Payment Information:', 50, doc.y);
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica');
      doc.text(`Payment Method: M-Pesa`, 50, doc.y);
      doc.text(`Transaction Code: ${order.mpesaCode || 'N/A'}`, 50, doc.y + 15);
      doc.text(`Payment Status: Paid`, 50, doc.y + 30);
      doc.moveDown(2);

      // Footer
      doc.fontSize(10).font('Helvetica');
      doc.text('Thank you for your business!', 50, doc.y, { align: 'center' });
      doc.moveDown(0.5);
      doc.text('For any inquiries, please contact us at info@polyspack.com or +254 700 000 000', { align: 'center' });

      // Finalize PDF
      doc.end();

    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  generateInvoice
};
