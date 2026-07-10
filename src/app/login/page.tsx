"use client";

import React, { useState } from "react";
import Link from "next/link";
import "@/styles/homedesign.css";
import "@/styles/auth.css";
import { authService } from "@/services/auth.service";
import { Toast } from "@/components/common/Toast";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      triggerToast("Please enter email and password", "error");
      return;
    }

    setLoading(true);
    try {
      const data = await authService.login({ email, password });

      if (!data.success) {
        triggerToast(data.error || "Wrong email or password", "error");
        setLoading(false);
        return;
      }

      const normalizedRole = String(data.role || "").toUpperCase().replace(/\s+/g, "_");
      const roleLabel = normalizedRole.toLowerCase();

      if (normalizedRole === "STUDENT") {
        sessionStorage.setItem("student_logged_in", "true");
        triggerToast("Welcome back! Your student portal is ready.", "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      } else if (normalizedRole === "SUPER_ADMIN") {
        sessionStorage.setItem("platform_admin_logged_in", "true");
        triggerToast("Access granted. Redirecting to the platform admin panel...", "success");
        setTimeout(() => {
          window.location.href = "http://127.0.0.1:8000/admin/";
        }, 800);
      } else if (normalizedRole === "INSTITUTE_OWNER") {
        sessionStorage.setItem("institute_owner_logged_in", "true");
        triggerToast("Access granted. Redirecting to the institute owner portal...", "success");
        setTimeout(() => {
          window.location.href = "/institute-owner";
        }, 800);
      } else if (normalizedRole === "ADMIN") {
        sessionStorage.setItem("admin_logged_in", "true");
        triggerToast("Access granted. Redirecting to the admin portal...", "success");
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else if (normalizedRole === "RECEPTION") {
        sessionStorage.setItem("receptionist_logged_in", "true");
        triggerToast("Access granted. Redirecting to the receptionist portal...", "success");
        setTimeout(() => {
          window.location.href = "/receptionist";
        }, 800);
      } else if (normalizedRole === "LIBRARIAN") {
        sessionStorage.setItem("librarian_logged_in", "true");
        triggerToast("Access granted. Redirecting to the librarian portal...", "success");
        setTimeout(() => {
          window.location.href = "/librarian";
        }, 800);
      } else if (normalizedRole === "FACULTY") {
        sessionStorage.setItem("faculty_logged_in", "true");
        triggerToast("Access granted. Redirecting to the faculty portal...", "success");
        setTimeout(() => {
          window.location.href = "/faculty";
        }, 800);
      } else if (normalizedRole === "ACCOUNTANT") {
        sessionStorage.setItem("accountant_logged_in", "true");
        triggerToast("Access granted. Redirecting to the accountant portal...", "success");
        setTimeout(() => {
          window.location.href = "/accountant";
        }, 800);
      } else if (normalizedRole === "LAB_ASSISTANT") {
        sessionStorage.setItem("lab_logged_in", "true");
        triggerToast("Access granted. Redirecting to the lab portal...", "success");
        setTimeout(() => {
          window.location.href = "/lab-assistant";
        }, 800);
      } else {
        sessionStorage.setItem("user_logged_in", "true");
        triggerToast(`Welcome back. Redirecting to your ${roleLabel} portal...`, "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }
    } catch {
      triggerToast("Unable to reach the authentication service. Please try again.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      {/* HEADER LOGO AT TOP LEFT */}
      <div className="auth-logo-header">
        <Link href="/" className="logo">
          <i className="fa-solid fa-graduation-cap"></i> Campus<span>CMS</span>
        </Link>
      </div>

      {/* LEFT SIDE GRAPHICS PANEL */}
      <div className="auth-graphic-side">
        <div className="graphic-bubble bubble-1"></div>
        <div className="graphic-bubble bubble-2"></div>
        <div className="auth-graphic-content">
          <h1 className="auth-graphic-title">Athena University Management Portal</h1>
          <p className="auth-graphic-text">
            A comprehensive, modular, secure, and scalable digital hub designed for students, faculty members, librarians, and administration.
          </p>

          <div className="auth-stats-card">
            <div className="stats-card-header">
              <span className="stats-card-title">Live Registration Status</span>
              <span className="stats-card-badge">
                <span className="newsletter-status-dot" style={{ display: "inline-block", width: "6px", height: "6px", background: "#10b981", borderRadius: "50%", marginRight: "0.35rem", boxShadow: "0 0 8px #10b981" }}></span>
                System Online
              </span>
            </div>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, marginBottom: "0.5rem" }}>Registration and Application Processing Speed</p>
            <div className="mock-bar-chart" style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: "80px", marginTop: "1rem" }}>
              <div className="mock-bar-item" style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "var(--primary-light)", opacity: 0.85, height: "40%" }}></div>
              <div className="mock-bar-item" style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "var(--accent-light)", opacity: 0.85, height: "70%" }}></div>
              <div className="mock-bar-item" style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "var(--primary-light)", opacity: 0.85, height: "55%" }}></div>
              <div className="mock-bar-item" style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "var(--accent-light)", opacity: 0.85, height: "90%" }}></div>
              <div className="mock-bar-item" style={{ flex: 1, borderRadius: "4px 4px 0 0", background: "var(--primary-light)", opacity: 0.85, height: "75%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE FORM PANEL */}
      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Unified Sign In</h2>
          <p className="auth-subtitle">Use one portal to sign in as a student, staff member, or administrator.</p>

          <form onSubmit={handleLoginSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="loginEmail">Email Address</label>
              <input
                type="email"
                id="loginEmail"
                className="form-input"
                placeholder="name@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label htmlFor="loginPassword">Password</label>
              <div className="auth-password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  id="loginPassword"
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </button>
              </div>
              <a
                href="#"
                className="auth-forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  triggerToast("Please contact your system administrator for password reset.", "error");
                }}
              >
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: "100%", justifyContent: "center", marginTop: "0.5rem" }}
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"} <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          </form>

          <div className="auth-roles-badge">
            <i className="fa-solid fa-lock" style={{ marginRight: "0.25rem" }}></i>
            Admin · Faculty · Accountant · Librarian · Lab Assistant · Reception
          </div>
        </div>
      </div>

      <Toast toast={toast} />
    </div>
  );
}
