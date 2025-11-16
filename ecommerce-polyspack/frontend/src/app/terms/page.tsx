import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - Polyspack Enterprises',
  description: 'Read our terms of service and conditions for using Polyspack Enterprises website and services.',
};

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
      <div className="prose max-w-none">
        <p className="mb-4">Welcome to Polyspack Enterprises. These terms and conditions outline the rules and regulations for the use of our website and services.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Acceptance of Terms</h2>
        <p className="mb-4">By accessing this website, you accept these terms and conditions in full. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Use License</h2>
        <p className="mb-4">Permission is granted to temporarily download one copy of the materials on Polyspack Enterprises' website for personal, non-commercial transitory viewing only.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">3. Disclaimer</h2>
        <p className="mb-4">The materials on Polyspack Enterprises' website are provided on an 'as is' basis. Polyspack Enterprises makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Limitations</h2>
        <p className="mb-4">In no event shall Polyspack Enterprises or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Polyspack Enterprises' website.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Accuracy of Materials</h2>
        <p className="mb-4">The materials appearing on Polyspack Enterprises' website could include technical, typographical, or photographic errors. Polyspack Enterprises does not warrant that any of the materials on its website are accurate, complete, or current.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Links</h2>
        <p className="mb-4">Polyspack Enterprises has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Modifications</h2>
        <p className="mb-4">Polyspack Enterprises may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>

        <h2 className="text-2xl font-semibold mt-6 mb-3">8. Governing Law</h2>
        <p className="mb-4">These terms and conditions are governed by and construed in accordance with the laws of Kenya and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.</p>
      </div>
    </div>
  );
}
