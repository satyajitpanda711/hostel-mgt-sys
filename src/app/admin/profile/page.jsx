'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Mail,
  Phone,
  Home,
  Calendar,
  Briefcase,
  Key,
  Loader2,
  X,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/* =========================
   Reusable Profile Field
========================= */
const ProfileField = ({ label, value, icon: Icon }) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-base font-semibold text-slate-900 mt-1">
          {value || 'Not available'}
        </p>
      </div>
    </div>
  </div>
);

/* =========================
   Loading
========================= */
const Loading = () => (
  <div className="flex flex-col items-center justify-center min-h-[60vh]">
    <Loader2 className="animate-spin text-blue-600 mb-4" size={36} />
    <p className="text-slate-600 font-medium">
      Loading profile information...
    </p>
  </div>
);

/* =========================
   Date Format
========================= */
const formatDate = (dateString) => {
  if (!dateString) return null;
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/* =========================
   Change Password Modal
========================= */
const ChangePassword = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        '/api/admin',
        {
          password: currentPassword,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Cookie: `token=${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.data.success === false) {
        setError(response.data.message);
        toast.error(response.data.message);
        return;
      }

      toast.success('Password changed successfully!');
      onClose();
    } catch (err) {
      const message =
        err.response?.data?.message || 'Failed to change password.';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-slate-100 transition"
        >
          <X size={18} className="text-slate-600" />
        </button>

        <h2 className="text-xl font-semibold text-slate-900 mb-6">
          Change Password
        </h2>

        <form onSubmit={handleChangePassword} className="space-y-5">
          <Input
            label="Current Password"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            label="New Password"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 disabled:opacity-60"
          >
            {loading ? 'Updating...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

/* =========================
   Reusable Input
========================= */
const Input = ({ label, type = 'text', value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-slate-700 mb-2">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      required
      className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
    />
  </div>
);

/* =========================
   Admin Profile
========================= */
const AdminProfile = () => {
  const [admin, setAdmin] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    const getAdminDetails = async () => {
      try {
        const response = await axios.get('/api/admin');
        setAdmin(response.data.admin);
      } catch (err) {
        setError('Failed to load profile information.');
      } finally {
        setLoading(false);
      }
    };

    getAdminDetails();
  }, []);

  if (loading) return <Loading />;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] px-6">
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-lg bg-slate-900 px-4 py-2 text-white text-sm"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-6">
      <ToastContainer />
      {showChangePassword && (
        <ChangePassword onClose={() => setShowChangePassword(false)} />
      )}

      <div className="max-w-7xl mx-auto space-y-10">
        {/* Header */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-10 text-white shadow-lg text-center">
          <h1 className="text-3xl md:text-4xl font-semibold">
            {admin.name}
          </h1>
          <p className="text-blue-100 mt-3">
            Employee ID: {admin.empId}
          </p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <ProfileField label="Email Address" value={admin.email} icon={Mail} />
          <ProfileField label="Phone Number" value={admin.contact} icon={Phone} />
          <ProfileField label="Residential Address" value={admin.address} icon={Home} />
          <ProfileField label="Date of Birth" value={formatDate(admin.dob)} icon={Calendar} />
          <ProfileField label="Assigned Block" value={admin.hostelBlock} icon={Briefcase} />
          <ProfileField label="Year Joined" value={formatDate(admin.createdAt)} icon={Key} />
        </div>

        {/* Actions */}
        <div className="flex justify-center">
          <button
            onClick={() => setShowChangePassword(true)}
            className="rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;