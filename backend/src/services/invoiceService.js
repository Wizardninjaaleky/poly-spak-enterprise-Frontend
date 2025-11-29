import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

export const generateInvoice = async (order, user) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `invoice-${order._id}.pdf`;
      const filePath = path.join(process.cwd(), 'invoices', fileName);

      // Ensure invoices directory exists
      if (!fs.existsSync(path.join(process.cwd(), 'invoices'))) {
        fs.mkdirSync(path.join(process.cwd(), 'invoices'), { recursive: true });
      }

      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc.fontSize(20).text('INVOICE', { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text('Polyspack Enterprises', { align: 'center' });
      doc.fontSize(10).text('Kenya\'s Leading Plastic Packaging Manufacturer', { align: 'center' });
      doc.moveDown(2);

      // Invoice details
      doc.fontSize(10);
      doc.text(`Invoice Number: ${order._id}`);
      doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`);
      doc.text(`Order Status: ${order.orderStatus}`);
      doc.moveDown();

      // Customer details
      doc.text('Bill To:');
      doc.text(`${user.firstName} ${user.lastName}`);
      doc.text(`${user.email}`);
      if (user.phone) doc.text(`${user.phone}`);
      if (user.company) doc.text(`${user.company}`);
      doc.moveDown();

      // Shipping address
      if (order.shippingAddress) {
        doc.text('Ship To:');
        doc.text(`${order.shippingAddress.street}`);
        doc.text(`${order.shippingAddress.city}, ${order.shippingAddress.country}`);
        doc.moveDown();
      }

      // Items table
      doc.text('Items:', { underline: true });
      doc.moveDown(0.5);

      order.items.forEach((item, index) => {
        doc.text(
          `${index + 1}. ${item.productName} x ${item.quantity} @ KES ${item.price.toFixed(2)} = KES ${(item.quantity * item.price).toFixed(2)}`
        );
      });

      doc.moveDown();

      // Totals
      doc.text(`Subtotal: KES ${order.totalAmount.toFixed(2)}`);
      if (order.discount) {
        doc.text(`Discount: -KES ${order.discount.toFixed(2)}`);
      }
      if (order.tax) {
        doc.text(`Tax: KES ${order.tax.toFixed(2)}`);
      }
      doc.fontSize(12).text(`Total: KES ${order.totalAmount.toFixed(2)}`, { bold: true });

      doc.moveDown(2);
      doc.fontSize(10).text('Thank you for your business!', { align: 'center' });

      doc.end();

      stream.on('finish', () => {
        resolve(filePath);
      });

      stream.on('error', (error) => {
        reject(error);
      });
    } catch (error) {
      reject(error);
    }
  });
};

export const sendInvoiceEmail = async (userEmail, invoicePath) => {
  // Placeholder for email functionality
  console.log(`Sending invoice to ${userEmail}: ${invoicePath}`);
  return true;
};
