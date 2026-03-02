"use client";

import Link from "next/link";
import {
  Building2,
  GraduationCap,
  Home,
  BarChart3,
  ShieldCheck,
} from "lucide-react";



const PRIMARY =
  "bg-blue-600 hover:bg-blue-500 text-white focus:ring-blue-200";

const SECONDARY =
  "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50";

const CARD =
  "rounded-2xl border border-slate-200 bg-white shadow-sm";


function Button({
  href,
  children,
  variant = "primary",
  className = "",
}) {
  const base =
    "inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const styles = variant === "primary" ? PRIMARY : SECONDARY;

  return (
    <Link href={href} className={`${base} ${styles} ${className}`}>
      {children}
    </Link>
  );
}


function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 font-semibold text-slate-900">
          <Building2 className="h-5 w-5 text-blue-600" />
          HostelMS
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm text-slate-600">
          <Link href="#" className="hover:text-blue-600">
            Home
          </Link>
          <Link href="#features" className="hover:text-blue-600">
            Features
          </Link>
          <Link href="#login" className="hover:text-blue-600">
            Login
          </Link>
        </nav>

        <Button href="#login" className="hidden md:flex">
          Get Started
        </Button>
      </div>
    </header>
  );
}

/* ===============================
   Feature Card
================================ */

function FeatureCard({ icon, title, desc }) {
  return (
    <div
      className={`${CARD} p-8 transition hover:shadow-md hover:-translate-y-1`}
    >
      <div className="mb-4 inline-flex rounded-lg bg-blue-50 p-3 text-blue-600">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>

      <p className="text-sm text-slate-600 leading-relaxed">
        {desc}
      </p>
    </div>
  );
}

/* ===============================
   Portal Card
================================ */

function PortalCard({
  icon,
  title,
  desc,
  href,
  buttonText,
}) {
  return (
    <div
      className={`${CARD} p-10 text-center transition hover:shadow-lg hover:-translate-y-1`}
    >
      <div className="flex justify-center mb-6 text-blue-600">
        {icon}
      </div>

      <h3 className="text-2xl font-semibold mb-4 text-slate-900">
        {title}
      </h3>

      <p className="text-slate-600 mb-8 text-sm leading-relaxed">
        {desc}
      </p>

      <Button href={href}>{buttonText}</Button>
    </div>
  );
}

/* ===============================
   Page
================================ */

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      <main>
        {/* ================= HERO ================= */}

        <section className="relative overflow-hidden py-28">
          {/* Soft Grid Background */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)] bg-[size:40px_40px] opacity-40" />
            <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-100 rounded-full blur-3xl opacity-40" />
          </div>

          <div className="mx-auto max-w-4xl px-6 text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Hostel
              <span className="text-blue-600"> Management System</span>
            </h1>

            <p className="text-lg text-slate-600 max-w-2xl mx-auto mb-10">
              A centralized platform for room allocation, student records,
              payments, and reporting — built for clarity and efficiency.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button href="#login">Get Started</Button>
              <Button href="#features" variant="secondary">
                Learn More
              </Button>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}

        <section id="features" className="py-24 bg-slate-50 border-y border-slate-200">
          <div className="mx-auto max-w-6xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Powerful Features
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Everything needed to manage hostel operations efficiently.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              <FeatureCard
                icon={<Home size={22} />}
                title="Room Management"
                desc="Allocate rooms, manage transfers, and track occupancy with structured workflows."
              />
              <FeatureCard
                icon={<BarChart3 size={22} />}
                title="Reports & Tracking"
                desc="Generate attendance, payment, and performance reports in seconds."
              />
              <FeatureCard
                icon={<ShieldCheck size={22} />}
                title="Secure & Reliable"
                desc="Protected student data with modern authentication and role-based access."
              />
            </div>
          </div>
        </section>

        {/* ================= LOGIN ================= */}

        <section id="login" className="py-24">
          <div className="mx-auto max-w-5xl px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4">
                Access Your Portal
              </h2>
              <p className="text-slate-600 max-w-2xl mx-auto">
                Separate dashboards for administrators and students.
              </p>
            </div>

            <div className="grid gap-10 md:grid-cols-2">
              <PortalCard
                icon={<Building2 size={56} />}
                title="Warden Portal"
                desc="Oversee hostel operations, manage records, track payments, and monitor student activity from a centralized dashboard."
                href="/login/admin"
                buttonText="Admin Login"
              />

              <PortalCard
                icon={<GraduationCap size={56} />}
                title="Student Portal"
                desc="View room allocation, submit requests, check fee status, and stay updated with hostel announcements."
                href="/login/student"
                buttonText="Student Login"
              />
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}

      <footer className="border-t border-slate-200 py-10 bg-slate-50">
        <div className="mx-auto max-w-6xl px-6 text-sm text-slate-500 flex flex-col md:flex-row justify-between gap-6">
          <p>© {new Date().getFullYear()} Hostel Management System</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-blue-600">
              Home
            </Link>
            <Link href="#features" className="hover:text-blue-600">
              Features
            </Link>
            <Link href="#login" className="hover:text-blue-600">
              Login
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}