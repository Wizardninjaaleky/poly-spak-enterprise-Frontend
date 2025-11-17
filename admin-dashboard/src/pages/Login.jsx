import React, { useState } from 'react';
import api from '../api/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/');
    } catch (error) {
      console.error('LOGIN ERR', error);
      setErr(error?.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-96 bg-white p-6 rounded shadow">
        <h2 className="text-2xl mb-4">Admin Login</h2>
        {err && <div className="bg-red-100 text-red-700 p-2 mb-3">{err}</div>}
        <label className="block mb-2">Email</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full p-2 border rounded mb-3" />
        <label className="block mb-2">Password</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full p-2 border rounded mb-3" />
        <button className="w-full bg-blue-600 text-white p-2 rounded">Sign in</button>
      </form>
    </div>
  );
}
