'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { ArrowLeft, UserPlus, Loader2 } from 'lucide-react';

const RegisterPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        empId: '',
        email: '',
        password: '',
        dob: '',
        contact: '',
        address: '',
        role: 'admin',
        hostelBlock: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const {
            name,
            empId,
            email,
            password,
            dob,
            contact,
            address,
            hostelBlock,
        } = formData;

        if (
            !name ||
            !empId ||
            !email ||
            !password ||
            !dob ||
            !contact ||
            !address ||
            !hostelBlock
        ) {
            setError('All fields are required.');
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post('/api/signup/admin', formData);

            if (res.data.success) {
                router.push('/login/admin');
            } else {
                setError(
                    res.data.message || 'Registration failed. Try again.'
                );
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                'An error occurred during registration.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center bg-white overflow-hidden py-12">

            {/* Background */}
            <div className="absolute inset-0 -z-10">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
                <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-3xl opacity-40" />
            </div>

            <div className="w-full max-w-4xl px-6">

                {/* Back Button */}
                <button
                    onClick={() => router.push('/')}
                    className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 transition"
                >
                    <ArrowLeft size={16} />
                    Back to Home
                </button>

                {/* Card */}
                <div className="rounded-2xl border border-slate-200 bg-white shadow-lg p-10">

                    {/* Header */}
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center rounded-xl bg-blue-50 p-3 text-blue-600 mb-4">
                            <UserPlus size={20} />
                        </div>

                        <h1 className="text-2xl font-semibold text-slate-900">
                            Admin Registration
                        </h1>

                        <p className="text-sm text-slate-600 mt-2">
                            Create a new administrator account
                        </p>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">

                        <div className="grid md:grid-cols-2 gap-6">

                            {/* LEFT COLUMN */}
                            <div className="space-y-5">
                                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                                <Input label="Employee ID" name="empId" value={formData.empId} onChange={handleChange} />
                                <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} />
                                <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} />
                            </div>

                            {/* RIGHT COLUMN */}
                            <div className="space-y-5">
                                <Input label="Date of Birth" type="date" name="dob" value={formData.dob} onChange={handleChange} />
                                <Input label="Contact Number" type="tel" name="contact" value={formData.contact} onChange={handleChange} />
                                <Input label="Address" name="address" value={formData.address} onChange={handleChange} />

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Role
                                    </label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
                                    >
                                        <option value="admin">Admin</option>
                                        <option value="warden">Warden</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        Hostel Block
                                    </label>
                                    <select
                                        name="hostelBlock"
                                        value={formData.hostelBlock}
                                        onChange={handleChange}
                                        disabled={loading}
                                        className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100 disabled:opacity-50"
                                    >
                                        <option value="">Select Hostel Block</option>
                                        <option value="A1">A1</option>
                                        <option value="A2">A2</option>
                                        <option value="B1">B1</option>
                                        <option value="B2">B2</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Registering...
                                </>
                            ) : (
                                'Register'
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-slate-500 mt-6">
                    © {new Date().getFullYear()} Hostel Management System
                </p>
            </div>
        </div>
    );
};

/* Reusable Input Component */
const Input = ({
    label,
    type = 'text',
    name,
    value,
    onChange,
}) => (
    <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full rounded-lg border border-slate-300 px-4 py-2.5 text-sm outline-none transition focus:border-blue-600 focus:ring-2 focus:ring-blue-100"
        />
    </div>
);

export default RegisterPage;