'use client';

import React, { useEffect, useState } from 'react';
import {
  HomeIcon,
  GraduationCapIcon,
  MailWarningIcon,
  Database,
  CalendarFoldIcon,
  LucideLogOut,
} from 'lucide-react';
import Link from 'next/link';
import axios from 'axios';
import Loading from '@/app/components/Loading';

/* =========================
   Stat Card
========================= */
const StatCard = ({ title, count, icon: Icon }) => {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
          {Icon && <Icon size={20} />}
        </div>
      </div>

      <h3 className="text-sm font-medium text-slate-600">{title}</h3>
      <p className="text-2xl font-semibold text-slate-900 mt-1">
        {count}
      </p>
    </div>
  );
};

/* =========================
   Quick Action Card
========================= */
const ActionCard = ({ title, icon: Icon, href }) => {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
    >
      <div className="flex flex-col items-center text-center">
        <div className="rounded-lg bg-blue-50 p-3 text-blue-600 mb-4">
          <Icon size={22} />
        </div>
        <h4 className="text-sm font-medium text-slate-800">
          {title}
        </h4>
      </div>
    </Link>
  );
};

/* =========================
   Dashboard
========================= */
const Dashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [studentNumber, setStudentNumber] = useState(0);
  const [complaintNumber, setComplaintNumber] = useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard');
        setUser(response.data.admin);
        setStudentNumber(response.data.numberOfStudents);
        setComplaintNumber(response.data.complaints);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Welcome Banner */}
        <Link href="/admin/profile">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 p-8 text-white shadow-lg transition hover:shadow-xl">
            <h1 className="text-2xl md:text-3xl font-semibold">
              Welcome back, {user.name}
            </h1>

            <p className="mt-3 text-sm md:text-base text-blue-100">
              ID: {user.empId} • Email: {user.email} • Phone: {user.contact}
            </p>
          </div>
        </Link>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            title="Hostel Block"
            count={user.hostelBlock}
            icon={HomeIcon}
          />
          <StatCard
            title="Total Students"
            count={studentNumber}
            icon={GraduationCapIcon}
          />
          <StatCard
            title="Complaints"
            count={complaintNumber}
            icon={MailWarningIcon}
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <ActionCard
              title="Student Database"
              icon={Database}
              href="/admin/student_database"
            />
            <ActionCard
              title="Feedback"
              icon={CalendarFoldIcon}
              href="/admin/feedbacks"
            />
            <ActionCard
              title="Leave Applications"
              icon={LucideLogOut}
              href="/admin/leave_applications"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;