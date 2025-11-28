"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import Image from "next/image";

// Import merged admin components
import Dashboard from "./vite_pages/Dashboard";
import Products from "./vite_pages/Products";
import Orders from "./vite_pages/Orders";
import Payments from "./vite_pages/Payments";
import Users from "./vite_pages/Users";
import Settings from "./vite_pages/Settings";
import AddEditProduct from "./vite_pages/AddEditProduct";
import Unauthorized from "./vite_pages/Unauthorized";

const AdminDashboardPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth || { user: null });
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);

  const isAdmin = user?.role === "admin" || user?.role === "super_admin";

  useEffect(() => {
    // Check if user has uploaded profile image
    const savedImage = localStorage.getItem('adminProfileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setProfileImage(result);
        localStorage.setItem('adminProfileImage', result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8">Admin privileges required to access this area.</p>
          <Link
            href="/login"
            className="inline-block bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all transform hover:scale-105 font-semibold shadow-lg"
          >
            Log In as Admin
          </Link>
        </div>
      </div>
    );
  }

  const adminTabs = [
    { id: "overview", label: "Dashboard", icon: "📊" },
    { id: "products", label: "Products", icon: "📦" },
    { id: "orders", label: "Orders", icon: "📋" },
    { id: "payments", label: "Payments", icon: "💰" },
    { id: "users", label: "Users", icon: "👥" },
    { id: "settings", label: "Settings", icon: "⚙️" },
  ];

  const renderActive = () => {
    switch (activeTab) {
      case "overview":
        return <Dashboard />;
      case "products":
        return <Products />;
      case "orders":
        return <Orders />;
      case "payments":
        return <Payments />;
      case "users":
        return <Users />;
      case "settings":
        return <Settings />;
      case "add-edit-product":
        return <AddEditProduct />;
      default:
        return <Unauthorized />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md sticky top-0 z-50">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-xl font-bold text-gray-900">Polyspack Admin</h1>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar - Desktop */}
        <aside className={`fixed lg:sticky top-0 left-0 h-screen bg-white shadow-xl transition-transform duration-300 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } w-72 lg:w-80 overflow-y-auto`}>
          <div className="p-6">
            {/* Profile Section */}
            <div className="text-center mb-8">
              <div className="relative w-24 h-24 mx-auto mb-4 group">
                <div className="w-24 h-24 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-full flex items-center justify-center overflow-hidden shadow-lg ring-4 ring-green-100">
                  {profileImage ? (
                    <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl text-white font-bold">{user?.name?.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg cursor-pointer hover:bg-gray-50 transition-colors">
                  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-1">{user?.name}</h2>
              <p className="text-sm text-gray-500 mb-1">{user?.email}</p>
              <span className="inline-block px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 rounded-full text-xs font-semibold">
                {user?.role?.toUpperCase()}
              </span>
            </div>

            {/* Navigation */}
            <nav className="space-y-2">
              {adminTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-xl transition-all transform hover:scale-105 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span className="mr-3 text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
              <button
                onClick={() => {
                  setActiveTab('add-edit-product');
                  setSidebarOpen(false);
                }}
                className="w-full text-left px-4 py-3 rounded-xl mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all transform hover:scale-105"
              >
                <span className="mr-3 text-xl">➕</span>
                <span className="font-semibold">Add New Product</span>
              </button>
            </nav>

            {/* Quick Stats */}
            <div className="mt-8 p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Quick Stats</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Today's Sales</span>
                  <span className="font-bold text-green-700">KSh 45.2K</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Pending Orders</span>
                  <span className="font-bold text-orange-600">12</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Low Stock</span>
                  <span className="font-bold text-red-600">5</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8 w-full overflow-x-hidden">
          <div className="bg-white rounded-2xl shadow-xl p-6 lg:p-8">
            {renderActive()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
