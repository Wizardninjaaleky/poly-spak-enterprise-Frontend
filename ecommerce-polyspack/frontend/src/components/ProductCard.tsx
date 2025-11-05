'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store/store';
import { addToCart } from '@/store/slices/cartSlice';

interface Product {
  id: string;
  title: string;
  slug: string;
  category: string;
  price: number;
  salePrice?: number;
  images: string[];
  sku: string;
  stockQty: number;
  attributes: Record<string, string | number | boolean | undefined>;
  description?: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      salePrice: product.salePrice,
      image: product.images[0] || '/placeholder-product.jpg',
      sku: product.sku,
      quantity: 1
    }));
  };

  const discountPercentage = product.salePrice
    ? Math.round(((product.price - product.salePrice) / product.price) * 100)
    : 0;

  const displayPrice = product.salePrice || product.price;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      {/* Product Image */}
      <div className="relative h-48 bg-gray-100">
        <Link href={`/products/${product.slug}`}>
          <Image
            src={product.images[0] || '/placeholder-product.jpg'}
            alt={product.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>

        {/* Discount Badge */}
        {discountPercentage > 0 && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
            -{discountPercentage}%
          </div>
        )}

        {/* Stock Status */}
        {product.stockQty === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Quick Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQty === 0}
          className="absolute bottom-2 right-2 bg-green-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-green-700 disabled:bg-gray-400"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13l-1.1 5M7 13h10m0 0v8a2 2 0 01-2 2H9a2 2 0 01-2-2v-8z" />
          </svg>
        </button>
      </div>

      {/* Product Info */}
      <div className="p-4">
        {/* Category */}
        <span className="text-xs text-gray-500 uppercase tracking-wide">
          {product.category}
        </span>

        {/* Title */}
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-1 text-lg font-semibold text-gray-900 hover:text-green-600 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Price */}
        <div className="mt-2 flex items-center">
          <span className="text-xl font-bold text-gray-900">
            KSh {displayPrice.toLocaleString()}
          </span>
          {product.salePrice && (
            <span className="ml-2 text-sm text-gray-500 line-through">
              KSh {product.price.toLocaleString()}
            </span>
          )}
        </div>

        {/* Stock Info */}
        <div className="mt-2 flex items-center justify-between">
          <span className={`text-sm ${product.stockQty > 10 ? 'text-green-600' : product.stockQty > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            {product.stockQty > 10 ? 'In Stock' : product.stockQty > 0 ? `Only ${product.stockQty} left` : 'Out of Stock'}
          </span>

          {/* SKU */}
          <span className="text-xs text-gray-400">
            SKU: {product.sku}
          </span>
        </div>

        {/* Key Attributes */}
        {product.attributes && Object.keys(product.attributes).length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {Object.entries(product.attributes).slice(0, 3).map(([key, value]) => (
              <span key={key} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {key}: {String(value)}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stockQty === 0}
          className="mt-4 w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {product.stockQty === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
