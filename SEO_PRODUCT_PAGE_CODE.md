# SEO Product Page - Implementation Code

## Component: src/app/products/[slug]/page.jsx

```javascript
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import ProductGallery from '@/components/ProductGallery';
import ProductCustomizer from '@/components/ProductCustomizer';
import ProductTabs from '@/components/ProductTabs';
import ProductFAQ from '@/components/ProductFAQ';
import RelatedProducts from '@/components/RelatedProducts';
import TrustBadges from '@/components/TrustBadges';
import BreadcrumbsSchema from '@/components/schema/BreadcrumbsSchema';
import ProductSchema from '@/components/schema/ProductSchema';

// Fetch product data
async function getProduct(slug) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products/slug/${slug}`,
      { next: { revalidate: 3600 } } // Revalidate every hour
    );
    
    if (!res.ok) return null;
    const data = await res.json();
    return data.product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

// Get related products
async function getRelatedProducts(category, currentProductId) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/products?category=${category}&limit=4`,
      { next: { revalidate: 3600 } }
    );
    
    if (!res.ok) return [];
    const data = await res.json();
    return data.products.filter(p => p._id !== currentProductId);
  } catch (error) {
    return [];
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    return {
      title: 'Product Not Found - Polyspack Enterprises',
      description: 'The product you are looking for could not be found.'
    };
  }

  const title = `${product.name} - Custom Manufacturing in Kenya | Polyspack Enterprises`;
  const description = product.description 
    ? product.description.substring(0, 160) 
    : `High-quality ${product.name} manufactured in Kenya. KEBS certified, custom options available. Request a quote today.`;

  return {
    title,
    description,
    keywords: [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      'kenya',
      'nairobi',
      'custom manufacturing',
      'kebs certified',
      product.material || 'plastic packaging'
    ].join(', '),
    openGraph: {
      title: product.name,
      description,
      images: [
        {
          url: product.images[0] || '/images/placeholder.jpg',
          width: 1200,
          height: 630,
          alt: product.name
        }
      ],
      type: 'product',
      locale: 'en_KE',
      siteName: 'Polyspack Enterprises'
    },
    twitter: {
      card: 'summary_large_image',
      title: product.name,
      description,
      images: [product.images[0] || '/images/placeholder.jpg']
    },
    alternates: {
      canonical: `https://polyspackenterprises.co.ke/products/${params.slug}`
    },
    robots: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  };
}

// Generate static paths for popular products
export async function generateStaticParams() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products?limit=50`);
    const data = await res.json();
    
    return data.products.map((product) => ({
      slug: product.slug || product._id
    }));
  } catch (error) {
    return [];
  }
}

export default async function ProductDetailPage({ params }) {
  const product = await getProduct(params.slug);
  
  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product._id);

  // Prepare structured data
  const breadcrumbItems = [
    { name: 'Home', url: 'https://polyspackenterprises.co.ke' },
    { name: 'Products', url: 'https://polyspackenterprises.co.ke/products' },
    { name: product.category, url: `https://polyspackenterprises.co.ke/products?category=${product.category}` },
    { name: product.name, url: `https://polyspackenterprises.co.ke/products/${params.slug}` }
  ];

  return (
    <>
      {/* Schema Markup */}
      <BreadcrumbsSchema items={breadcrumbItems} />
      <ProductSchema product={product} />

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <nav className="mb-6 text-sm" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-2">
            <li><Link href="/" className="text-gray-600 hover:text-green-600">Home</Link></li>
            <li className="text-gray-400">/</li>
            <li><Link href="/products" className="text-gray-600 hover:text-green-600">Products</Link></li>
            <li className="text-gray-400">/</li>
            <li>
              <Link 
                href={`/products?category=${product.category}`}
                className="text-gray-600 hover:text-green-600"
              >
                {product.category}
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-semibold">{product.name}</li>
          </ol>
        </nav>

        {/* Main Product Section */}
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left Column: Images */}
          <div>
            <ProductGallery images={product.images} productName={product.name} />
            
            {/* Trust Indicators */}
            <TrustBadges />
          </div>

          {/* Right Column: Product Info */}
          <div>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            
            {/* Rating & Reviews */}
            {product.rating && (
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating.average) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">
                  ({product.rating.average}) | {product.rating.count} reviews
                </span>
                {product.industry && (
                  <span className="ml-4 text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded">
                    {product.industry} Rated
                  </span>
                )}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              <div className="flex items-baseline space-x-2">
                <span className="text-sm text-gray-600">Starting from</span>
                <span className="text-3xl font-bold text-green-700">
                  KSh {product.price.toLocaleString()}
                </span>
                <span className="text-gray-600">per {product.unit || 'unit'}</span>
              </div>
              {product.bulkDiscount && (
                <p className="text-sm text-green-600 mt-1">
                  Volume discounts available for orders 1,000+
                </p>
              )}
            </div>

            {/* Key Features */}
            <div className="mb-6 space-y-2">
              {product.features?.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            {/* Customization Options */}
            <ProductCustomizer product={product} />

            {/* Action Buttons */}
            <div className="space-y-3 mb-6">
              <button className="w-full bg-green-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition">
                Request Detailed Quote
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button className="border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition">
                  Order Free Sample
                </button>
                <button className="border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                  Add to Cart
                </button>
              </div>
            </div>

            {/* Delivery Info */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-2 mb-6">
              <div className="flex items-center">
                <span className="text-2xl mr-3">📦</span>
                <div>
                  <strong>Delivery:</strong> Nairobi (2-3 days) | Kenya-wide (5-7 days)
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">🏭</span>
                <div>
                  <strong>Lead Time:</strong> Standard stock (3 days) | Custom (2-3 weeks)
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-2xl mr-3">✓</span>
                <div>
                  <strong>Quality:</strong> KEBS certified with quality guarantee
                </div>
              </div>
            </div>

            {/* Certifications */}
            <div className="flex items-center space-x-4 pt-4 border-t">
              <Image src="/images/kebs-badge.png" alt="KEBS Certified" width={60} height={60} />
              <Image src="/images/iso-badge.png" alt="ISO 9001" width={60} height={60} />
              <Image src="/images/made-in-kenya.png" alt="Made in Kenya" width={60} height={60} />
            </div>
          </div>
        </div>

        {/* Tabbed Content Section */}
        <ProductTabs product={product} />

        {/* Customer Reviews Section */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">Customer Reviews</h2>
          {/* Reviews component */}
        </section>

        {/* FAQ Section */}
        <ProductFAQ product={product} category={product.category} />

        {/* Related Products */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-6">You May Also Need</h2>
          <RelatedProducts products={relatedProducts} />
        </section>

        {/* Final CTA */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Order Custom {product.category}?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Get a detailed quote within 24 hours
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
              Request Custom Quote
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-700 transition">
              Order Free Sample
            </button>
          </div>
          <p className="mt-6 text-sm opacity-75">
            Or call us directly: <strong>+254 700 000 000</strong>
          </p>
        </section>
      </div>
    </>
  );
}
```

---

## Component: src/components/schema/ProductSchema.jsx

```javascript
export default function ProductSchema({ product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description || `High-quality ${product.name} manufactured in Kenya by Polyspack Enterprises`,
    "image": product.images || [],
    "sku": product.sku || product._id,
    "mpn": product.mpn || product._id,
    "brand": {
      "@type": "Brand",
      "name": "Polyspack Enterprises"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "Polyspack Enterprises",
      "url": "https://polyspackenterprises.co.ke",
      "logo": "https://polyspackenterprises.co.ke/images/logo.png",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "Kenya",
        "addressLocality": "Nairobi"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": "+254-700-000-000",
        "contactType": "Sales",
        "areaServed": "KE",
        "availableLanguage": ["English", "Swahili"]
      }
    },
    "offers": {
      "@type": "Offer",
      "url": `https://polyspackenterprises.co.ke/products/${product.slug || product._id}`,
      "priceCurrency": "KES",
      "price": product.price,
      "priceValidUntil": new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "itemCondition": "https://schema.org/NewCondition",
      "seller": {
        "@type": "Organization",
        "name": "Polyspack Enterprises"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "KES"
        },
        "shippingDestination": {
          "@type": "DefinedRegion",
          "addressCountry": "Kenya"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 2,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue",
            "minValue": 3,
            "maxValue": 7,
            "unitCode": "DAY"
          }
        }
      }
    },
    ...(product.rating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.rating.average,
        "reviewCount": product.rating.count,
        "bestRating": 5,
        "worstRating": 1
      }
    }),
    "additionalProperty": [
      {
        "@type": "PropertyValue",
        "name": "Material",
        "value": product.material || "High-quality plastic"
      },
      {
        "@type": "PropertyValue",
        "name": "Category",
        "value": product.category
      },
      {
        "@type": "PropertyValue",
        "name": "Certifications",
        "value": "KEBS Certified, ISO 9001:2015"
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## Component: src/components/ProductFAQ.jsx

```javascript
'use client';

import { useState } from 'react';

export default function ProductFAQ({ product, category }) {
  // Category-specific FAQs
  const categoryFAQs = {
    'Seedling Bags': [
      {
        q: "What size seedling bags do I need for my crops?",
        a: "Tree seedlings require 8\"x12\" minimum, vegetable seedlings work well with 4\"x6\", and commercial forestry benefits from 10\"x15\" bags. Our team can help you select the optimal size for your specific crops."
      },
      {
        q: "Do your seedling bags have drainage holes?",
        a: "Yes, all our standard seedling bags include pre-punched drainage holes for proper water management. We can also customize hole patterns for specific crop requirements."
      },
      {
        q: "Are these bags UV-stabilized?",
        a: `Our premium seedling bags include UV stabilization for extended outdoor lifespan. Standard bags are suitable for 6-9 months, while UV-stabilized options last 12-18 months.`
      }
    ],
    'Electronics': [
      {
        q: "What certifications do your electronics components have?",
        a: "All our electronic components are KEBS certified and comply with international safety standards. Specific product certifications are listed in the technical specifications."
      }
    ],
    'Services': [
      {
        q: "What is your turnaround time for custom services?",
        a: "Standard services are completed within 5-7 business days. Rush services are available for urgent requirements at an additional cost."
      }
    ]
  };

  const faqs = [
    // Product-specific FAQs
    {
      q: `What is the minimum order quantity for ${product.name}?`,
      a: product.moq 
        ? `The minimum order quantity is ${product.moq} units. For custom specifications, MOQs may vary. Contact our sales team for details.`
        : "Minimum order quantities vary by product specification. Please contact our sales team for specific MOQ information."
    },
    {
      q: "Can I customize this product?",
      a: "Yes! We offer extensive customization including size, color, material grade, logo printing, and special features. Custom orders require higher minimum quantities. Request a quote to discuss your specific requirements."
    },
    {
      q: "How long does delivery take?",
      a: "Standard products ship within 3-5 business days. Nairobi delivery takes 2-3 days, Kenya-wide delivery takes 5-7 days. Custom products require 2-3 weeks lead time plus shipping."
    },
    {
      q: "What quality guarantees do you offer?",
      a: "All products are KEBS certified and undergo rigorous quality control. We offer a defect replacement guarantee and stand behind the performance of every product. Specific warranty terms are provided with your order."
    },
    {
      q: "Do you provide samples before large orders?",
      a: "Yes! We offer free samples of standard products. For custom specifications, there is a nominal sample fee which is refunded with your production order."
    },
    // Add category-specific FAQs
    ...(categoryFAQs[category] || [])
  ];

  return (
    <section className="mb-16">
      <h2 className="text-3xl font-bold mb-6">Frequently Asked Questions</h2>
      
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <FAQItem key={index} question={faq.q} answer={faq.a} />
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-lg">
        <h3 className="text-xl font-semibold mb-2">Still have questions?</h3>
        <p className="text-gray-700 mb-4">
          Our packaging specialists are here to help you find the perfect solution for your business.
        </p>
        <div className="flex space-x-4">
          <button className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700">
            Schedule Consultation
          </button>
          <button className="border-2 border-green-600 text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-green-50">
            Call +254 700 000 000
          </button>
        </div>
      </div>

      {/* FAQ Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.a
              }
            }))
          })
        }}
      />
    </section>
  );
}

function FAQItem({ question, answer }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-4 text-left font-semibold flex justify-between items-center hover:bg-gray-50 transition"
      >
        <span>{question}</span>
        <svg
          className={`w-5 h-5 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
          <p className="text-gray-700 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  );
}
```

---

## Quick Implementation Checklist

### Backend API Requirements:

```javascript
// Add to backend/src/routes/productRoutes.js
router.get('/slug/:slug', getProductBySlug);

// Add to backend/src/controllers/productController.js
export const getProductBySlug = async (req, res) => {
  try {
    const { slug } = req.params;
    const product = await Product.findOne({ slug });
    
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add slug field to Product model if not exists
const productSchema = new mongoose.Schema({
  // ... existing fields
  slug: {
    type: String,
    unique: true,
    index: true
  }
});

// Auto-generate slug from name
productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});
```

### SEO Enhancements:

1. **Add to next.config.js:**
```javascript
const nextConfig = {
  // ... existing config
  experimental: {
    optimizeCss: true,
  },
  async headers() {
    return [
      {
        source: '/products/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400'
          }
        ]
      }
    ];
  }
};
```

2. **Create robots.txt:**
```
# public/robots.txt
User-agent: *
Allow: /
Allow: /products/
Disallow: /admin/
Disallow: /api/
Disallow: /profile/

Sitemap: https://polyspackenterprises.co.ke/sitemap.xml
```

3. **Add to src/app/sitemap.js:**
```javascript
export default async function sitemap() {
  const baseUrl = 'https://polyspackenterprises.co.ke';
  
  // Fetch all products for sitemap
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/products`);
  const { products } = await res.json();
  
  const productUrls = products.map(product => ({
    url: `${baseUrl}/products/${product.slug || product._id}`,
    lastModified: new Date(product.updatedAt),
    changeFrequency: 'weekly',
    priority: 0.8
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9
    },
    ...productUrls
  ];
}
```

---

**Implementation Priority:**
1. ✅ Add slug field to Product model
2. ✅ Create product detail page with SEO metadata
3. ✅ Implement schema markup (ProductSchema, FAQPage)
4. ✅ Add breadcrumbs with schema
5. ✅ Create sitemap with product URLs
6. ✅ Optimize images with Next/Image
7. ✅ Add related products section
8. ✅ Implement product FAQ component

**Expected Results:**
- Rich snippets in Google search results
- Featured FAQ snippets
- Improved click-through rates (CTR)
- Better search engine rankings
- Enhanced user experience

---

**File Version:** 1.0  
**Created:** November 29, 2025  
**Next Review:** After first implementation
