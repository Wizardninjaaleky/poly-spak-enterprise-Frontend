'use client';

import { API_BASE_URL, API_ENDPOINTS } from '@/config/api';

export default function ApiTestPage() {
  return (
    <div style={{ padding: '40px', fontFamily: 'monospace', background: '#f5f5f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '20px' }}>API Configuration Test</h1>
      
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>API Base URL:</h2>
        <pre style={{ 
          background: API_BASE_URL.includes('localhost') ? '#fee' : '#efe', 
          padding: '10px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {API_BASE_URL}
        </pre>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2 style={{ marginBottom: '10px' }}>Login Endpoint:</h2>
        <pre style={{ 
          background: '#f0f0f0', 
          padding: '10px',
          borderRadius: '4px',
          fontSize: '14px'
        }}>
          {API_ENDPOINTS.LOGIN}
        </pre>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px' }}>
        <h2 style={{ marginBottom: '10px' }}>Status:</h2>
        <p style={{ fontSize: '16px' }}>
          {API_BASE_URL.includes('localhost') 
            ? '❌ ERROR: Still using localhost!' 
            : '✅ SUCCESS: Using production backend'}
        </p>
      </div>
    </div>
  );
}
