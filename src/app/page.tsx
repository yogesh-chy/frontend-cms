"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import "../styles/homedesign.css";
import { authService } from "@/services/auth.service";
import { Toast } from "@/components/common/Toast";

export default function HomePage() {
  // Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Unified Form States - Login (staff only)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Toast States
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  // Footer States
  const [footerEmail, setFooterEmail] = useState("");
  const [subscribedEmails, setSubscribedEmails] = useState<string[]>([]);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("cms_newsletter");
      if (saved) {
        try {
          setSubscribedEmails(JSON.parse(saved));
        } catch {
          setSubscribedEmails([]);
        }
      }
    }
  }, []);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    const email = footerEmail.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      triggerToast("Please enter a valid email address", "error");
      return;
    }
    const updated = [...subscribedEmails, email];
    setSubscribedEmails(updated);
    if (typeof window !== "undefined") {
      localStorage.setItem("cms_newsletter", JSON.stringify(updated));
    }
    setFooterEmail("");
    triggerToast("Subscribed to updates — thank you!", "success");
  };



  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      triggerToast("Please enter email and password", "error");
      return;
    }

    try {
      const data = await authService.login({
        email: loginEmail,
        password: loginPassword,
      });

      if (!data.success) {
        triggerToast(data.error || "Wrong email or password", "error");
        return;
      }

      const normalizedRole = String(data.role || "").toUpperCase().replace(/\s+/g, "_");
      const roleLabel = normalizedRole.toLowerCase();

      if (normalizedRole === "SUPER_ADMIN") {
        sessionStorage.setItem("platform_admin_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the platform admin panel...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "http://127.0.0.1:8000/admin/";
        }, 800);
      } else if (normalizedRole === "INSTITUTE_OWNER") {
        sessionStorage.setItem("institute_owner_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the institute owner portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/institute-owner";
        }, 800);
      } else if (normalizedRole === "ADMIN") {
        sessionStorage.setItem("admin_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the admin dashboard...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/admin";
        }, 800);
      } else if (normalizedRole === "RECEPTION") {
        sessionStorage.setItem("receptionist_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the reception portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/receptionist";
        }, 800);
      } else if (normalizedRole === "LIBRARIAN") {
        sessionStorage.setItem("librarian_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the library portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/librarian";
        }, 800);
      } else if (normalizedRole === "FACULTY" || normalizedRole === "TEACHER") {
        sessionStorage.setItem("faculty_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the faculty portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/faculty";
        }, 800);
      } else if (normalizedRole === "ACCOUNTANT") {
        sessionStorage.setItem("accountant_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the accounts portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/accountant";
        }, 800);
      } else if (normalizedRole === "LAB_ASSISTANT") {
        sessionStorage.setItem("lab_logged_in", "true");
        triggerToast(
          "Access granted. Redirecting to the lab portal...",
          "success",
        );
        setTimeout(() => {
          window.location.href = "/lab-assistant";
        }, 800);
      } else {
        sessionStorage.setItem("user_logged_in", "true");
        triggerToast(
          `Welcome. Redirecting to your ${roleLabel} portal...`,
          "success",
        );
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }

      setLoginEmail("");
      setLoginPassword("");
      setIsLoginModalOpen(false);
    } catch {
      triggerToast(
        "Unable to reach the authentication service. Please try again.",
        "error",
      );
    }
  };

  return (
    <>
      {/* HEADER / NAVIGATION */}
      <header>
        <div className="container nav-container">
          <Link href="/" className="logo">
            <i className="fa-solid fa-school"></i> CAMPUS
            <span>CMS</span>
          </Link>

          <ul className={`nav-menu ${isMobileMenuOpen ? "open" : ""}`}>
            <li>
              <a
                href="#about"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </a>
            </li>
            <li>
              <a
                href="#modules"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Modules
              </a>
            </li>
            <li>
              <a
                href="#features"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </a>
            </li>
            <li>
              <a
                href="#testimonials"
                className="nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Testimonials
              </a>
            </li>
            <li className="mobile-menu-actions">
              <button
                className="btn btn-primary"
                onClick={() => {
                  setIsLoginModalOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                Staff Login
              </button>
            </li>
          </ul>

          <div className="nav-actions">
            <button
              className="btn btn-primary"
              id="navLoginBtn"
              onClick={() => setIsLoginModalOpen(true)}
            >
              <i className="fa-solid fa-lock"></i> Staff Login
            </button>
            <button
              className="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle navigation"
            >
              <i
                className={`fa-solid ${isMobileMenuOpen ? "fa-xmark" : "fa-bars"}`}
              ></i>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section-centered grid-dots-bg" id="about">
        {/* Floating Sparkle Decorations */}
        <div className="hero-sparkle-deco" style={{ top: "12%", left: "30%" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path
              d="M14 0L17.5 10.5L28 14L17.5 17.5L14 28L10.5 17.5L0 14L10.5 10.5L14 0Z"
              fill="#0d9488"
              opacity="0.6"
            />
          </svg>
        </div>
        <div className="hero-sparkle-deco" style={{ top: "8%", right: "25%" }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <path
              d="M11 0L13.5 8.5L22 11L13.5 13.5L11 22L8.5 13.5L0 11L8.5 8.5L11 0Z"
              fill="#f59e0b"
              opacity="0.5"
            />
          </svg>
        </div>
        <div
          className="hero-sparkle-deco"
          style={{ bottom: "30%", left: "8%" }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path
              d="M9 0L11 7L18 9L11 11L9 18L7 11L0 9L7 7L9 0Z"
              fill="#0d9488"
              opacity="0.3"
            />
          </svg>
        </div>
        <div
          className="hero-sparkle-deco"
          style={{ bottom: "15%", right: "10%" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 0L12.5 7.5L20 10L12.5 12.5L10 20L7.5 12.5L0 10L7.5 7.5L10 0Z"
              fill="#f59e0b"
              opacity="0.35"
            />
          </svg>
        </div>

        <div className="container">
          <div className="hero-inspiration-layout">
            {/* LEFT — Admin Dashboard Image */}
            <div className="hero-image-frame left-frame">
              <div className="hero-image-circle">
                <img
                  src="/girl_left.png"
                  alt="College administration staff working"
                />
              </div>
              {/* Floating badges around left image */}
              <div
                className="hero-float-badge badge-teal"
                style={{ top: "10%", left: "5%" }}
              >
                <i className="fa-solid fa-shield-halved"></i>
              </div>
              <div
                className="hero-float-badge badge-white"
                style={{ bottom: "20%", left: "0%" }}
              >
                <i className="fa-solid fa-user-gear"></i>
              </div>
              <div
                className="hero-float-badge badge-amber"
                style={{ bottom: "5%", right: "15%", animationDelay: "1s" }}
              >
                <i className="fa-solid fa-chart-pie"></i>
              </div>
              {/* Label badge */}
              <div
                className="hero-frame-label"
                style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                <span className="label-dot teal"></span>
                Admin Portal
              </div>
            </div>

            {/* CENTER — Heading + CTA */}
            <div className="hero-center-text">
              <h1>
                <span className="hero-title-line">
                  Complete College Operations
                </span>
                <span className="hero-highlight">Management System</span>
              </h1>
              <p className="hero-subtitle">
                <i className="fa-solid fa-star hero-subtitle-icon"></i>
                An all-in-one admin and staff platform to manage students,
                faculty, fees, attendance, library, labs, examinations, and
                every institutional workflow — from a single secure dashboard.
              </p>
              <div className="hero-cta-group">
                <button
                  className="btn-watch"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <span className="play-circle">
                    <i className="fa-solid fa-right-to-bracket"></i>
                  </span>
                  Staff Sign In
                </button>
                <a
                  href="#modules"
                  className="btn-portal"
                >
                  Explore Modules{" "}
                  <i className="fa-solid fa-arrow-down"></i>
                </a>
              </div>
            </div>

            {/* RIGHT — Staff Image */}
            <div className="hero-image-frame right-frame">
              <div className="hero-image-circle">
                <img
                  src="/right_boy.png"
                  alt="Faculty member managing college records"
                />
              </div>
              {/* Floating badges around right image */}
              <div
                className="hero-float-badge badge-amber"
                style={{ top: "8%", right: "5%", animationDelay: "0.5s" }}
              >
                <i className="fa-solid fa-clipboard-check"></i>
              </div>
              <div
                className="hero-float-badge badge-teal"
                style={{ top: "45%", right: "0%", animationDelay: "1.5s" }}
              >
                <i className="fa-solid fa-database"></i>
              </div>
              <div
                className="hero-float-badge badge-white"
                style={{ bottom: "15%", left: "5%", animationDelay: "2s" }}
              >
                <i className="fa-solid fa-bell"></i>
              </div>
              {/* Label badge */}
              <div
                className="hero-frame-label"
                style={{ left: "50%", transform: "translateX(-50%)" }}
              >
                <span className="label-dot amber"></span>
                Staff Portal
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CORE MODULES SECTION */}
      <section
        className="info-section grid-dots-bg"
        id="modules"
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container">
          <div className="services-header-container">
            <div className="services-header-left">
              <h2>
                Powerful <span>Institutional Modules</span> Built for Staff
              </h2>
            </div>
            <div className="services-header-right">
              <p>
                Manage every aspect of your college — from student admissions
                and fee collection to attendance tracking, exam results, and
                library operations. Role-based access ensures every staff
                member sees only what they need.
              </p>
            </div>
          </div>

          <div className="services-cards-grid">
            {/* Card 1 — Student Management */}
            <div className="service-card-new">
              <div className="service-card-header">
                <h3>Student Management</h3>
                <div
                  className="service-card-arrow"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="service-card-image-placeholder">
                <div className="service-card-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80"
                    alt="Student records management"
                    className="service-card-img"
                  />
                </div>
              </div>
            </div>

            {/* Card 2 — Fee & Finance */}
            <div className="service-card-new">
              <div className="service-card-header">
                <h3>Fee & Financial Management</h3>
                <div
                  className="service-card-arrow"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="service-card-image-placeholder">
                <div className="service-card-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80"
                    alt="Fee and financial management"
                    className="service-card-img"
                  />
                </div>
              </div>
            </div>

            {/* Card 3 — Library & Lab Management */}
            <div className="service-card-new">
              <div className="service-card-header">
                <h3>Library & Lab Management</h3>
                <div
                  className="service-card-arrow"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="service-card-image-placeholder">
                <div className="service-card-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=600&q=80"
                    alt="Library & Lab Management System"
                    className="service-card-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES / DETAILS SECTION */}
      <section className="solutions-section" id="features">
        <div className="container">
          <div className="solutions-title-centered">
            <h2>
              Explore Our <span>Management Modules</span>
            </h2>
          </div>

          {/* Feature Block 1 — Admissions & Student Records */}
          <div className="solution-block">
            <div className="solution-visual-wrapper teal-frame">
              <div className="solution-image-container-frame">
                <img
                  src="/1st_section.png"
                  alt="Admission & Student Lifecycle Management"
                  className="solution-image"
                />
              </div>
            </div>
            <div className="solution-details-content">
              <span className="solution-details-tag teal">Admission & Records</span>
              <h3>Complete Student Lifecycle Management</h3>
              <p>
                Staff handle every student operation — from new admissions and
                document verification to profile updates, status tracking, and
                graduation records. Students cannot log in; all data is managed
                by authorized staff only.
              </p>
              <div className="solution-points-list">
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Admission workflow
                  & approval
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Bulk import via
                  CSV/Excel
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Document upload &
                  verification
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Status tracking
                  (Active / Graduated)
                </div>
              </div>
            </div>
          </div>

          {/* Feature Block 2 — Fee & Financial Management */}
          <div className="solution-block" style={{ direction: "rtl" }}>
            <div
              className="solution-visual-wrapper amber-frame"
              style={{ direction: "ltr" }}
            >
              <div className="solution-image-container-frame">
                <img
                  src="/2nd_section.png"
                  alt="Fee Collection & Accounting"
                  className="solution-image"
                />
              </div>
            </div>
            <div
              className="solution-details-content"
              style={{ direction: "ltr" }}
            >
              <span className="solution-details-tag amber">
                Finance & Accounting
              </span>
              <h3>Fee Collection, Scholarships & Financial Reports</h3>
              <p>
                The accounting module enables semester-wise fee structures,
                payment tracking (paid, due, partial), late fee calculation,
                scholarship/discount management, and instant receipt
                generation. Daily collection and due reports keep finances
                transparent.
              </p>
              <div className="solution-points-list">
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Semester-wise fee
                  setup
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Payment receipt
                  generation
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Late fine &
                  discount management
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Financial summary
                  reports
                </div>
              </div>
            </div>
          </div>

          {/* Feature Block 3 — Library & Lab Management */}
          <div className="solution-block">
            <div className="solution-visual-wrapper teal-frame">
              <div className="solution-image-container-frame">
                <img
                  src="/3rd_section.png"
                  alt="Library & Lab Inventory"
                  className="solution-image"
                />
              </div>
            </div>
            <div className="solution-details-content">
              <span className="solution-details-tag teal">
                Library & Lab
              </span>
              <h3>Integrated Library Catalog & Lab Inventory System</h3>
              <p>
                Librarians manage the complete book catalog — issue, return,
                overdue fines, and stock tracking. Lab assistants track
                equipment allocation, usage logs, and maintenance schedules.
                Everything stays organized under one roof.
              </p>
              <div className="solution-points-list">
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Book issue &
                  return tracking
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Fine for late
                  returns
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Lab equipment
                  allocation
                </div>
                <div className="solution-point-item">
                  <i className="fa-solid fa-circle-check"></i> Maintenance &
                  usage logs
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ROLE-BASED ACCESS / STATS SECTION */}
      <section
        className="info-section grid-dots-bg"
        style={{
          backgroundColor: "#ffffff",
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container">
          <div className="services-header-container">
            <div className="services-header-left">
              <h2>
                Role-Based <span>Access Control</span> for Every Staff
              </h2>
            </div>
            <div className="services-header-right">
              <p>
                Seven distinct staff roles — Institute Owner, Admin, Faculty,
                Accountant, Librarian, Lab Assistant, and Reception — each
                with multi-level permissions (view, edit, delete, approve).
                Activity logs track who did what, and session management
                keeps the system secure.
              </p>
            </div>
          </div>

          <div className="services-cards-grid">
            {/* Role Card 1 */}
            <div className="service-card-new">
              <div className="service-card-header">
                <h3>Examination & Results</h3>
                <div
                  className="service-card-arrow"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="service-card-image-placeholder">
                <div className="service-card-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80"
                    alt="Examination and result management"
                    className="service-card-img"
                  />
                </div>
              </div>
            </div>

            {/* Role Card 2 */}
            <div className="service-card-new">
              <div className="service-card-header">
                <h3>Department & Course Setup</h3>
                <div
                  className="service-card-arrow"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="service-card-image-placeholder">
                <div className="service-card-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80"
                    alt="Department and course management"
                    className="service-card-img"
                  />
                </div>
              </div>
            </div>

            {/* Role Card 3 */}
            <div className="service-card-new">
              <div className="service-card-header">
                <h3>Reports & Analytics Dashboard</h3>
                <div
                  className="service-card-arrow"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <i className="fa-solid fa-arrow-right"></i>
                </div>
              </div>
              <div className="service-card-image-placeholder">
                <div className="service-card-img-frame">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=600&q=80"
                    alt="Analytics and reports dashboard"
                    className="service-card-img"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section
        className="testimonials-section-new grid-dots-bg"
        id="testimonials"
        style={{
          borderTop: "1px solid var(--border-light)",
          borderBottom: "1px solid var(--border-light)",
        }}
      >
        <div className="container">
          <div
            className="solutions-title-centered"
            style={{ marginBottom: "2rem" }}
          >
            <h2>
              Trusted by <span>College Staff & Administrators</span>
            </h2>
          </div>

          <div className="testimonials-grid-new">
            {/* Testimonial 1 */}
            <div className="testimonial-card-new">
              <div>
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="testimonial-quote">
                  &quot;Managing admissions, student records, and document
                  verification has never been this smooth. The bulk import
                  feature alone saves us hours every enrollment cycle.&quot;
                </p>
              </div>
              <div className="testimonial-profile">
                <div className="testimonial-avatar-placeholder">
                  <i className="fa-solid fa-user-tie"></i>
                </div>
                <div className="testimonial-profile-info">
                  <h4>Anita Gurung</h4>
                  <p>Head of Admissions</p>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="testimonial-card-new">
              <div>
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="testimonial-quote">
                  &quot;Fee tracking, scholarship management, and daily
                  collection reports are now completely digitized. The
                  late-fine calculation runs automatically — no more manual
                  errors.&quot;
                </p>
              </div>
              <div className="testimonial-profile">
                <div className="testimonial-avatar-placeholder">
                  <i className="fa-solid fa-calculator"></i>
                </div>
                <div className="testimonial-profile-info">
                  <h4>Bikash Shrestha</h4>
                  <p>Senior Accountant</p>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="testimonial-card-new">
              <div>
                <div className="testimonial-stars">
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                  <i className="fa-solid fa-star"></i>
                </div>
                <p className="testimonial-quote">
                  &quot;The library module tracks every issue, return, and
                  overdue fine automatically. Stock management and member
                  tracking have become effortless with this system.&quot;
                </p>
              </div>
              <div className="testimonial-profile">
                <div className="testimonial-avatar-placeholder">
                  <i className="fa-solid fa-book-open-reader"></i>
                </div>
                <div className="testimonial-profile-info">
                  <h4>Priya Adhikari</h4>
                  <p>Chief Librarian</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="container" style={{ marginTop: "5rem" }}>
        <div className="cta-banner-container-new">
          <div className="cta-banner-text" style={{ flex: 1 }}>
            <h2>Ready to Digitize Your College Operations?</h2>
            <p>
              Access your role-based dashboard — manage students, fees,
              attendance, exams, library, and more from one secure platform.
            </p>
            <button
              className="btn btn-accent"
              style={{
                backgroundColor: "#fff",
                color: "var(--accent-light)",
                padding: "0.85rem 2.25rem",
                borderRadius: "50px",
              }}
              onClick={() => setIsLoginModalOpen(true)}
            >
              Staff Sign In <i className="fa-solid fa-right-to-bracket"></i>
            </button>
          </div>
          <div className="cta-banner-image-wrapper">
            <img
              src="/above_footer.png"
              alt="Happy student with books"
              className="cta-banner-student-img"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="site-footer">
        <div className="container footer-grid">
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <i className="fa-solid fa-graduation-cap"></i> Campus<span>CMS</span>
            </div>
            <p>
              A comprehensive college management system built for admin and
              staff. Modular, scalable, and secure by design.
            </p>
            <div className="socials">
              <a href="#" aria-label="Twitter">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="#" aria-label="Facebook">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="LinkedIn">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <a href="#about">About</a>
              </li>
              <li>
                <a href="#modules">Modules</a>
              </li>
              <li>
                <a href="#features">Features</a>
              </li>
              <li>
                <a href="#testimonials">Testimonials</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>System Modules</h4>
            <ul>
              <li>
                <a href="#modules">Student Management</a>
              </li>
              <li>
                <a href="#modules">Fee & Finance</a>
              </li>
              <li>
                <a href="#features">Library & Lab</a>
              </li>
              <li>
                <a href="#features">Exams & Results</a>
              </li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Stay Updated</h4>
            <p className="newsletter-desc">
              Subscribe to our newsletter to receive the latest updates, releases, and news.
            </p>
            <form onSubmit={handleSubscribe} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                value={footerEmail}
                onChange={(e) => setFooterEmail(e.target.value)}
                required
              />
              <button type="submit">
                Subscribe
              </button>
            </form>
            <div className="newsletter-status">
              <span className="newsletter-status-dot"></span>
              <span>{subscribedEmails.length} active subscribers</span>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="footer-bottom-divider">
            <div className="footer-bottom-info">
              © {new Date().getFullYear()} CampusCMS. All rights reserved.
            </div>
            <div className="footer-bottom-links">
              <a href="/privacy">Privacy Policy</a>
              <a href="/terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      {/* STAFF LOGIN MODAL */}
      {isLoginModalOpen && (
        <div
          className="modal-backdrop active"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLoginModalOpen(false);
            }
          }}
        >
          <div className="modal-content" style={{ maxWidth: "440px" }}>
            <div className="modal-body">
              <button
                className="modal-close"
                onClick={() => setIsLoginModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="auth-pane active">
                <h2 className="form-title">
                  <i className="fa-solid fa-shield-halved" style={{ marginRight: "0.4rem", color: "var(--primary-light)" }}></i>
                  Staff Sign In
                </h2>
                <p style={{ color: "var(--text-secondary-light)", marginBottom: "1rem", fontSize: "0.85rem" }}>
                  Sign in with your staff credentials to access your dashboard.
                </p>
                <form
                  onSubmit={handleLogin}
                  style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
                >
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="staffLoginEmail">Email / Username</label>
                    <input
                      type="email"
                      id="staffLoginEmail"
                      className="form-input"
                      placeholder="staff@college.edu"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label htmlFor="staffLoginPassword">Password</label>
                    <div style={{ position: "relative" }}>
                      <input
                        type={showPassword ? "text" : "password"}
                        id="staffLoginPassword"
                        className="form-input"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                        style={{ paddingRight: "2.5rem" }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{
                          position: "absolute",
                          right: "0.75rem",
                          top: "50%",
                          transform: "translateY(-50%)",
                          background: "none",
                          border: "none",
                          color: "var(--text-secondary-light)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <i className={showPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                      </button>
                    </div>
                    <div style={{ textAlign: "right", marginTop: "0.3rem" }}>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          triggerToast("Please contact your system administrator for password reset.", "error");
                        }}
                        style={{ fontSize: "0.8rem", color: "var(--primary-light)", fontWeight: 600 }}
                      >
                        Forgot Password?
                      </a>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    style={{ width: "100%", justifyContent: "center", marginTop: "0.25rem" }}
                  >
                    Sign In <i className="fa-solid fa-right-to-bracket"></i>
                  </button>
                </form>

                <div
                  style={{
                    marginTop: "0.65rem",
                    padding: "0.5rem 0.75rem",
                    background: "var(--bg-light)",
                    borderRadius: "8px",
                    fontSize: "0.7rem",
                    color: "var(--text-secondary-light)",
                    textAlign: "center",
                  }}
                >
                  <i className="fa-solid fa-lock" style={{ marginRight: "0.25rem" }}></i>
                  Admin · Faculty · Accountant · Librarian · Lab Assistant · Reception
                </div>
              </div>
            </div>
          </div>
        </div>
      )}



      {/* TOAST SYSTEM */}
      <Toast toast={toast} />
    </>
  );
}
