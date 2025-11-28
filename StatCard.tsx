'use client';

import Link from 'next/link';
import React from 'react';

interface StatCardProps {
  href: string;
  value: number;
  label: string;
}

const cardStyle: React.CSSProperties = {
  border: '1px solid #ccc',
  borderRadius: '8px',
  padding: '2rem',
  textAlign: 'center',
  minWidth: '150px',
  textDecoration: 'none',
  color: 'inherit',
};

export default function StatCard({ href, value, label }: StatCardProps) {
  return (
    <Link href={href} style={cardStyle}><h2>{value}</h2><p>{label}</p></Link>
  );
}