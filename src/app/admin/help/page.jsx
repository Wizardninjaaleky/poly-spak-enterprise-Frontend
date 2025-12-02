'use client';

export default function HelpCenter() {
  const faqs = [
    {
      category: 'Getting Started',
      icon: '🚀',
      questions: [
        {
          q: 'How do I add a new product?',
          a: 'Navigate to Products > Add New Product. Fill in the product details, upload images from your device, and click "Create Product".'
        },
        {
          q: 'How do I manage orders?',
          a: 'Go to the Orders page to view all orders. You can filter by status, search by customer, and update order statuses.'
        }
      ]
    },
    {
      category: 'Products',
      icon: '📦',
      questions: [
        {
          q: 'How do I upload product images?',
          a: 'When creating or editing a product, click "Choose images from your device" and select one or more images. Images are uploaded directly from your PC or phone.'
        },
        {
          q: 'How do I edit a product?',
          a: 'Go to Products page, find the product you want to edit, and click the "Edit" button. Make your changes and save.'
        },
        {
          q: 'Can I delete a product?',
          a: 'Yes, click the "Delete" button on the product card. You\'ll be asked to confirm before deletion.'
        }
      ]
    },
    {
      category: 'Orders',
      icon: '📋',
      questions: [
        {
          q: 'How do I process an order?',
          a: 'Click on an order to view details. Update the status to "Processing", then "Completed" as you fulfill the order.'
        },
        {
          q: 'Can I export orders?',
          a: 'Yes! On the Orders page, click "Export to CSV" to download all orders data.'
        }
      ]
    },
    {
      category: 'Settings',
      icon: '⚙️',
      questions: [
        {
          q: 'How do I update contact information?',
          a: 'Go to Settings > General Settings to update phone number, email, and social media links.'
        },
        {
          q: 'How do I change my profile photo?',
          a: 'Go to My Profile and click the camera icon on your profile picture to upload a new photo from your device.'
        }
      ]
    }
  ];

  const quickLinks = [
    { icon: '📦', label: 'Manage Products', href: '/admin/products' },
    { icon: '📋', label: 'View Orders', href: '/admin/orders' },
    { icon: '⚙️', label: 'Settings', href: '/admin/settings' },
    { icon: '👤', label: 'My Profile', href: '/admin/profile' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Help Center</h1>
        <p className="text-gray-600">Find answers to common questions and learn how to use the admin panel</p>
      </div>

      {/* Quick Links */}
      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickLinks.map((link, index) => (
            <a
              key={index}
              href={link.href}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center"
            >
              <div className="text-3xl mb-2">{link.icon}</div>
              <div className="text-sm font-medium text-gray-900">{link.label}</div>
            </a>
          ))}
        </div>
      </div>

      {/* FAQs */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Frequently Asked Questions</h2>
        
        {faqs.map((section, index) => (
          <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-4">
              <h3 className="text-xl font-semibold text-white flex items-center gap-2">
                <span className="text-2xl">{section.icon}</span>
                {section.category}
              </h3>
            </div>
            <div className="p-6 space-y-4">
              {section.questions.map((item, qIndex) => (
                <div key={qIndex} className="pb-4 border-b border-gray-200 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-gray-900 mb-2">❓ {item.q}</h4>
                  <p className="text-gray-600 ml-6">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-8 border border-blue-200 text-center">
        <div className="text-5xl mb-4">💬</div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Need More Help?</h3>
        <p className="text-gray-600 mb-4">Can't find what you're looking for? Contact our support team</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="mailto:polyspackenterprise@gmail.com"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold"
          >
            📧 Email Support
          </a>
          <a
            href="https://wa.me/254742312306"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold"
          >
            💬 WhatsApp Support
          </a>
        </div>
      </div>
    </div>
  );
}
