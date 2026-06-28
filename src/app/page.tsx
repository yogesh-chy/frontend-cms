"use client";

import React, { useState, useEffect } from "react";
import "../styles/homedesign.css";

// --- DATABASE UTILITY KEYS ---
const DB_KEY = "athena_applications_db";
const NOTICES_KEY = "athena_notices_db";
const BOOKS_KEY = "athena_books_db";
const BORROWINGS_KEY = "athena_borrowings_db";
const DUES_KEY = "athena_dues_db";

interface Application {
  id: number;
  name: string;
  email: string;
  course: string;
  status: string;
  password?: string;
}

interface Notice {
  id: number;
  title: string;
  content: string;
  date: string;
  priority: string;
}

interface Book {
  id: number;
  title: string;
  author: string;
  total: number;
  available: number;
  price: number;
}

interface Borrowing {
  id: number;
  studentName: string;
  bookTitle: string;
  borrowDate: string;
  dueDate: string;
  status: string;
}

interface Due {
  studentId: number;
  remaining: number;
  paid: number;
  phone: string;
}

const defaultApplications: Application[] = [
  { id: 1, name: "Alice Johnson", email: "alice@gmail.com", course: "B.Sc. Computer Science", status: "Approved" },
  { id: 2, name: "Bob Smith", email: "bob@yahoo.com", course: "B.BA. Business Administration", status: "Pending" },
  { id: 3, name: "Charlie Davis", email: "charlie@outlook.com", course: "M.Sc. Data Science", status: "Pending" },
  { id: 4, name: "Diana Prince", email: "diana@amazon.com", course: "B.Sc. Computer Science", status: "Approved" },
  { id: 5, name: "Ethan Hunt", email: "ethan@imf.org", course: "B.Eng. Mechanical Engineering", status: "Rejected" },
  { id: 6, name: "Fiona Gallagher", email: "fiona@gallagher.com", course: "M.Sc. Data Science", status: "Pending" }
];

const defaultNotices: Notice[] = [
  { id: 1, title: "Final Examination Schedule Fall 2026", content: "The exam schedules for all undergraduate programs are now posted. Exams start Dec 5th.", date: "2026-06-15", priority: "High" },
  { id: 2, title: "Library Extended Hours for Finals Week", content: "Athena main library will remain open 24/7 starting from next Monday until the end of exams.", date: "2026-06-12", priority: "Medium" },
  { id: 3, title: "Annual Sports Meet Registration Open", content: "Sign up for track, soccer, and basketball tournaments at the student activity center.", date: "2026-06-10", priority: "Low" }
];

const defaultBooks: Book[] = [
  { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", total: 10, available: 8, price: 120.00 },
  { id: 2, title: "The C++ Programming Language", author: "Bjarne Stroustrup", total: 5, available: 3, price: 89.99 },
  { id: 3, title: "Data Science from Scratch", author: "Joel Grus", total: 8, available: 8, price: 59.99 },
  { id: 4, title: "Design Patterns", author: "Erich Gamma", total: 12, available: 9, price: 79.50 },
  { id: 5, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", total: 6, available: 4, price: 139.99 }
];

const defaultBorrowings: Borrowing[] = [
  { id: 1, studentName: "Alice Johnson", bookTitle: "Introduction to Algorithms", borrowDate: "2026-06-10", dueDate: "2026-06-24", status: "Active" },
  { id: 2, studentName: "Bob Smith", bookTitle: "Design Patterns", borrowDate: "2026-06-01", dueDate: "2026-06-15", status: "Overdue" },
  { id: 3, studentName: "Diana Prince", bookTitle: "The C++ Programming Language", borrowDate: "2026-06-12", dueDate: "2026-06-26", status: "Active" },
  { id: 4, studentName: "Ethan Hunt", bookTitle: "Artificial Intelligence: A Modern Approach", borrowDate: "2026-05-25", dueDate: "2026-06-08", status: "Overdue" }
];

const defaultDues: Due[] = [
  { studentId: 1, remaining: 1500.00, paid: 3500.00, phone: "+1 (555) 019-2834" },
  { studentId: 2, remaining: 4200.00, paid: 800.00, phone: "+1 (555) 014-9988" },
  { studentId: 3, remaining: 0.00, paid: 5000.00, phone: "+1 (555) 012-7489" },
  { studentId: 4, remaining: 950.00, paid: 4050.00, phone: "+1 (555) 018-3627" },
  { studentId: 5, remaining: 0.00, paid: 0.00, phone: "+1 (555) 017-8822" },
  { studentId: 6, remaining: 2800.00, paid: 2200.00, phone: "+1 (555) 011-3746" }
];

export default function HomePage() {
  // Modal & Tab States
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [studentTab, setStudentTab] = useState<"login" | "register">("login");

  // Form States - Student Register
  const [studentRegName, setStudentRegName] = useState("");
  const [studentRegEmail, setStudentRegEmail] = useState("");
  const [studentRegPhone, setStudentRegPhone] = useState("");
  const [studentRegCourse, setStudentRegCourse] = useState("");
  const [studentRegPassword, setStudentRegPassword] = useState("");

  // Unified Form States - Login (student or staff)
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Toast States
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // Initialize System Data on Mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem(DB_KEY)) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultApplications));
      }
      if (!localStorage.getItem(NOTICES_KEY)) {
        localStorage.setItem(NOTICES_KEY, JSON.stringify(defaultNotices));
      }
      if (!localStorage.getItem(BOOKS_KEY)) {
        localStorage.setItem(BOOKS_KEY, JSON.stringify(defaultBooks));
      }
      if (!localStorage.getItem(BORROWINGS_KEY)) {
        localStorage.setItem(BORROWINGS_KEY, JSON.stringify(defaultBorrowings));
      }
      if (!localStorage.getItem(DUES_KEY)) {
        localStorage.setItem(DUES_KEY, JSON.stringify(defaultDues));
      }
    }
  }, []);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const getApplicationsData = (): Application[] => {
    if (typeof window === "undefined") return defaultApplications;
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : defaultApplications;
  };

  const saveApplicationsData = (apps: Application[]) => {
    localStorage.setItem(DB_KEY, JSON.stringify(apps));
  };

  const getDuesData = (): Due[] => {
    if (typeof window === "undefined") return defaultDues;
    const db = localStorage.getItem(DUES_KEY);
    return db ? JSON.parse(db) : defaultDues;
  };

  const saveDuesData = (dues: Due[]) => {
    localStorage.setItem(DUES_KEY, JSON.stringify(dues));
  };

  // Handlers
  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentRegName || !studentRegEmail || !studentRegPhone || !studentRegPassword) {
      triggerToast("Please fill in all fields", "error");
      return;
    }

    const nameParts = studentRegName.trim().split(/\s+/);
    const firstName = nameParts[0] || studentRegName.trim();
    const lastName = nameParts.slice(1).join(" ");
    const username = `${(studentRegEmail.trim().split("@")[0] || "student").replace(/[^a-zA-Z0-9_.-]/g, "_")}_${Date.now().toString().slice(-4)}`;

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          email: studentRegEmail.trim(),
          password: studentRegPassword,
          first_name: firstName,
          last_name: lastName,
          phone: studentRegPhone.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        const backendError = data?.errors?.email?.[0] || data?.errors?.username?.[0] || data?.error || "Registration failed";
        triggerToast(backendError, "error");
        return;
      }

      const db = getApplicationsData();
      if (!db.some(app => app.email.toLowerCase() === studentRegEmail.trim().toLowerCase())) {
        const newId = Date.now();
        const newApp: Application = {
          id: newId,
          name: studentRegName.trim(),
          email: studentRegEmail.trim(),
          status: "Pending",
          password: studentRegPassword,
        };

        db.push(newApp);
        saveApplicationsData(db);

        const duesDb = getDuesData();
        duesDb.push({
          studentId: newId,
          remaining: 3500.00,
          paid: 0.00,
          phone: studentRegPhone.trim() || ("+1 (555) 019-" + Math.floor(1000 + Math.random() * 9000)),
        });
        saveDuesData(duesDb);
      }

      triggerToast("Account created. Please verify your email and wait for super admin approval before signing in.", "success");

      setTimeout(() => {
        setLoginEmail(studentRegEmail.trim());
        setIsStudentModalOpen(false);
        setIsLoginModalOpen(true);
        setStudentRegName("");
        setStudentRegEmail("");
        setStudentRegPhone("");
        setStudentRegPassword("");
      }, 800);
    } catch {
      triggerToast("Unable to reach the authentication service. Please try again.", "error");
    }
  };
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      triggerToast("Please enter email and password", "error");
      return;
    }

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        triggerToast(data.error || "Wrong email or password", "error");
        return;
      }

      const normalizedRole = String(data.role || "").toUpperCase();
      const roleLabel = normalizedRole.toLowerCase();

      if (normalizedRole === "STUDENT") {
        sessionStorage.setItem("student_logged_in", "true");
        triggerToast("Welcome back! Your student portal is ready.", "success");
      } else if (normalizedRole === "ADMIN" || normalizedRole === "SUPER_ADMIN") {
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
      } else {
        sessionStorage.setItem("user_logged_in", "true");
        triggerToast(`Welcome back. Redirecting to your ${roleLabel} portal...`, "success");
        setTimeout(() => {
          window.location.href = "/";
        }, 800);
      }

      setLoginEmail("");
      setLoginPassword("");
      setIsLoginModalOpen(false);
    } catch {
      triggerToast("Unable to reach the authentication service. Please try again.", "error");
    }
  };

  return (
    <>
      {/* HEADER / NAVIGATION */}
      <header>
        <div className="container nav-container">
          <a href="#" className="logo">
            <i className="fa-solid fa-graduation-cap"></i> ATHENA<span>UNI</span>
          </a>

          <ul className="nav-menu">
            <li><a href="#about" className="nav-link">About Us</a></li>
            <li><a href="#academics" className="nav-link">Academics</a></li>
            <li><a href="#admissions" className="nav-link">Admissions</a></li>

          </ul>
          <div className="nav-actions">
            <button
              className="btn btn-outline"
              id="navLoginBtn"
              onClick={() => {
                setIsLoginModalOpen(true);
              }}
            >
              Sign up
            </button>
            <button
              className="btn btn-primary"
              id="navRegisterBtn"
              onClick={() => {
                setStudentTab("register");
                setIsStudentModalOpen(true);
              }}
            >
              Get started
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" id="about">
        <div className="container hero-grid">
          <div className="hero-content">
            <h1>Shaping Futures, <span>Inspiring Leaders</span></h1>
            <p>Empowering minds with world-class education, cutting-edge research facilities, and a global network of professionals. Start your academic journey at Athena University today.</p>

            <div className="hero-cta">
              <button
                className="btn btn-accent"
                id="heroRegisterBtn"
                onClick={() => {
                  setStudentTab("register");
                  setIsStudentModalOpen(true);
                }}
              >
                <i className="fa-solid fa-pen-to-square"></i> Register & Apply Now
              </button>
              <button
                className="btn btn-outline"
                id="heroExploreBtn"
                onClick={() => {
                  const section = document.getElementById("admissions");
                  if (section) section.scrollIntoView({ behavior: "smooth" });
                }}
              >
                Explore Programs <i className="fa-solid fa-arrow-right"></i>
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <h3>98%</h3>
                <p>Placement Rate</p>
              </div>
              <div className="stat-item">
                <h3>15K+</h3>
                <p>Active Alumni</p>
              </div>
              <div className="stat-item">
                <h3>Top 50</h3>
                <p>Global Ranking</p>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="visual-card">
              <div className="visual-badge"><i className="fa-solid fa-star"></i> Admissions Open 2026</div>
              <div className="visual-image-placeholder">
                <i className="fa-solid fa-building-columns"></i>
              </div>
              <h3 style={{ marginBottom: "0.5rem", fontFamily: "var(--font-heading)" }}>Athena Innovation Campus</h3>
              <p style={{ color: "var(--text-secondary-light)", fontSize: "0.9rem", marginBottom: "1rem" }}>Experience our state-of-the-art laboratory buildings, libraries, and collaborative research hubs.</p>
              <div style={{ display: "flex", gap: "0.5rem", fontSize: "0.85rem", fontWeight: 700, color: "var(--primary-light)" }}>
                <span><i className="fa-solid fa-location-dot"></i> Boston, MA</span>
                <span>•</span>
                <span><i className="fa-solid fa-seedling"></i> Green Campus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ADMISSIONS DETAILS SECTION */}
      <section className="info-section" id="admissions">
        <div className="container">
          <div className="section-header">
            <h2>Simple Application Process</h2>
            <p>Follow these three easy steps to register, apply, and enroll in your dream program at Athena.</p>
          </div>
          <div className="info-grid">
            <div className="info-card">
              <div className="info-card-icon">
                <i className="fa-solid fa-user-plus"></i>
              </div>
              <h3>1. Register Account</h3>
              <p>Create your prospective student account to access the admissions application forms and dashboard.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon">
                <i className="fa-solid fa-file-invoice"></i>
              </div>
              <h3>2. Submit Application</h3>
              <p>Fill in your academic profile, choose your desired course program, and submit required transcripts.</p>
            </div>
            <div className="info-card">
              <div className="info-card-icon">
                <i className="fa-solid fa-envelope-open-text"></i>
              </div>
              <h3>3. Receive Decision</h3>
              <p>Track your application status. Once reviewed by college admin, get approved and complete enrollment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* STUDENT REGISTRATION MODAL */}
      {isStudentModalOpen && (
        <div
          className="modal-backdrop active"
          id="studentAuthModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsStudentModalOpen(false);
            }
          }}
        >
          <div className="modal-content" style={{ maxWidth: "600px" }}>
            <div className="modal-body">
              <button
                className="modal-close"
                id="closeStudentAuthModal"
                onClick={() => setIsStudentModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <h2 className="form-title">Start Application</h2>
              <p style={{ color: "var(--text-secondary-light)", marginBottom: "1.5rem" }}>
                Create your applicant account to apply for admission and track your status.
              </p>
              <form id="studentRegisterForm" onSubmit={handleStudentRegister}>
                <div className="form-grid">
                  <div className="form-group form-grid-full">
                    <label htmlFor="studentRegName">Full Name</label>
                    <div className="input-icon-wrapper">
                      <input
                        type="text"
                        id="studentRegName"
                        className="form-input"
                        placeholder="John Doe"
                        value={studentRegName}
                        onChange={(e) => setStudentRegName(e.target.value)}
                        required
                      />
                      <i className="fa-solid fa-user"></i>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentRegEmail">Email Address</label>
                    <div className="input-icon-wrapper">
                      <input
                        type="email"
                        id="studentRegEmail"
                        className="form-input"
                        placeholder="name@domain.com"
                        value={studentRegEmail}
                        onChange={(e) => setStudentRegEmail(e.target.value)}
                        required
                      />
                      <i className="fa-solid fa-envelope"></i>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentRegPhone">Phone Number</label>
                    <div className="input-icon-wrapper">
                      <input
                        type="tel"
                        id="studentRegPhone"
                        className="form-input"
                        placeholder="+1 (555) 000-0000"
                        value={studentRegPhone}
                        onChange={(e) => setStudentRegPhone(e.target.value)}
                        required
                      />
                      <i className="fa-solid fa-phone"></i>
                    </div>
                  </div>
                  <div className="form-group">
                    <label htmlFor="studentRegPassword">Create Password</label>
                    <div className="input-icon-wrapper">
                      <input
                        type="password"
                        id="studentRegPassword"
                        className="form-input"
                        placeholder="Min. 6 characters"
                        value={studentRegPassword}
                        onChange={(e) => setStudentRegPassword(e.target.value)}
                        required
                        minLength={6}
                      />
                      <i className="fa-solid fa-lock"></i>
                    </div>
                  </div>
                  <button type="submit" className="btn btn-accent form-grid-full" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
                    Create Account & Apply <i className="fa-solid fa-user-plus"></i>
                  </button>
                </div>
              </form>
              <div className="modal-footer-msg" style={{ marginTop: "1rem" }}>
                Already have an account? Use the main Login button to access the staff/admin portal or contact admissions support.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN PORTAL MODAL */}
      {isLoginModalOpen && (
        <div
          className="modal-backdrop active"
          id="authLoginModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsLoginModalOpen(false);
            }
          }}
        >
          <div className="modal-content" style={{ maxWidth: "480px" }}>
            <div className="modal-body">
              <button
                className="modal-close"
                onClick={() => setIsLoginModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div className="auth-pane active" id="unifiedLoginPane">
                <h2 className="form-title">Unified Sign In</h2>
                <p style={{ color: "var(--text-secondary-light)", marginBottom: "1rem" }}>
                  Use one portal to sign in as a student, staff member, or administrator.
                </p>
                <form id="unifiedLoginForm" onSubmit={handleLogin}>
                  <div className="form-group">
                    <label htmlFor="unifiedLoginEmail">Email Address</label>
                    <input
                      type="email"
                      id="unifiedLoginEmail"
                      className="form-input"
                      placeholder="name@domain.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="unifiedLoginPassword">Password</label>
                    <input
                      type="password"
                      id="unifiedLoginPassword"
                      className="form-input"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
                    Sign In <i className="fa-solid fa-right-to-bracket"></i>
                  </button>
                </form>
                <div className="modal-footer-msg" style={{ marginTop: "1rem" }}>
                  New applicant? <a href="#" onClick={(e) => { e.preventDefault(); setIsLoginModalOpen(false); setIsStudentModalOpen(true); }}>
                    Create an application account
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`toast-msg ${toast.type} show`} id="toast" style={{ borderLeft: toast.type === "success" ? "4px solid #0d9488" : "4px solid #ef4444" }}>
          <i className={toast.type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation"} id="toastIcon"></i>
          <span id="toastText">{toast.message}</span>
        </div>
      )}
    </>
  );
}
