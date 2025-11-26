import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Login = () => {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // TODO: call auth API and set token in cookie/localStorage
      router.push('/admin');
    } catch (err) {
      setError('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Sign in to Admin Dashboard</h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">Email address</label>
              <input id="email" name="email" type="email" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300" placeholder="Email address" value={credentials.email} onChange={handleChange} />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input id="password" name="password" type="password" required className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300" placeholder="Password" value={credentials.password} onChange={handleChange} />
            </div>
          </div>

          {error && <div className="text-red-600 text-sm text-center">{error}</div>}

          <div>
            <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600">{loading ? 'Signing in...' : 'Sign in'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
