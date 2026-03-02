"use client";

import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Building2, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState({
    empId: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const authenticate = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post("/api/login/admin", credentials);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        router.push("/admin/dashboard");
      } else {
        setError(response.data.message || "Invalid credentials.");
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data.message || "Login failed.");
      } else if (err.request) {
        setError("Network error. Please check your connection.");
      } else {
        setError("Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden">
      
      {/* Background Grid + Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-blue-100 rounded-full blur-3xl opacity-40" />
      </div>

      {/* Card */}
      <div className="w-full max-w-md px-6">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-10">
          
          {/* Header */}
          <div className="flex flex-col items-center text-center mb-8">
            <div className="mb-4 rounded-xl bg-blue-50 p-3 text-blue-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-semibold text-slate-900">
              Admin Login
            </h1>
            <p className="text-sm text-slate-600 mt-2">
              Access the warden dashboard securely
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={authenticate} className="space-y-5">
            
            {/* Employee ID */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Employee ID
              </label>
              <input
                type="text"
                name="empId"
                value={credentials.empId}
                onChange={handleChange}
                placeholder="Enter your employee ID"
                disabled={loading}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
                required
                className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          © {new Date().getFullYear()} Hostel Management System
        </p>
      </div>
    </div>
  );
}