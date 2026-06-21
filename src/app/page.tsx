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
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [studentTab, setStudentTab] = useState<"login" | "register">("login");

  // Form States - Student Register
  const [studentRegName, setStudentRegName] = useState("");
  const [studentRegEmail, setStudentRegEmail] = useState("");
  const [studentRegCourse, setStudentRegCourse] = useState("");
  const [studentRegPassword, setStudentRegPassword] = useState("");

  // Form States - Student Login
  const [studentLoginEmail, setStudentLoginEmail] = useState("");
  const [studentLoginPassword, setStudentLoginPassword] = useState("");

  // Form States - Admin/Staff Login
  const [adminUsername, setAdminUsername] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

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
  const handleStudentRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentRegName || !studentRegEmail || !studentRegCourse || !studentRegPassword) {
      triggerToast("Please fill in all fields", "error");
      return;
    }

    const db = getApplicationsData();
    if (db.some(app => app.email.toLowerCase() === studentRegEmail.toLowerCase())) {
      triggerToast("An application with this email already exists!", "error");
      return;
    }

    const newId = Date.now();
    const newApp: Application = {
      id: newId,
      name: studentRegName,
      email: studentRegEmail,
      course: studentRegCourse,
      status: "Pending",
      password: studentRegPassword
    };

    db.push(newApp);
    saveApplicationsData(db);

    // Seed dues
    const duesDb = getDuesData();
    duesDb.push({
      studentId: newId,
      remaining: 3500.00,
      paid: 0.00,
      phone: "+1 (555) 019-" + Math.floor(1000 + Math.random() * 9000)
    });
    saveDuesData(duesDb);

    triggerToast("Application submitted successfully! Please login.", "success");
    
    // Switch to login tab and prefill email
    setTimeout(() => {
      setStudentTab("login");
      setStudentLoginEmail(studentRegEmail);
      // Clear registration form
      setStudentRegName("");
      setStudentRegEmail("");
      setStudentRegCourse("");
      setStudentRegPassword("");
    }, 800);
  };

  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentLoginEmail || !studentLoginPassword) {
      triggerToast("Please enter email and password", "error");
      return;
    }

    const db = getApplicationsData();
    const student = db.find(app => app.email.toLowerCase() === studentLoginEmail.toLowerCase());

    if (!student) {
      triggerToast("No account found with this email. Please register.", "error");
      return;
    }

    if (student.password && student.password !== studentLoginPassword) {
      triggerToast("Incorrect password. Please try again.", "error");
      return;
    }

    setIsStudentModalOpen(false);
    setStudentLoginEmail("");
    setStudentLoginPassword("");

    setTimeout(() => {
      alert(`Welcome back, ${student.name}!\n\nProgram: ${student.course}\nApplication Status: ${student.status.toUpperCase()}`);
    }, 400);
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === "admin" && adminPassword === "admin123") {
      sessionStorage.setItem("admin_logged_in", "true");
      triggerToast("Access granted. Redirecting to Administrator portal...", "success");
      setAdminUsername("");
      setAdminPassword("");
      setIsAdminModalOpen(false);
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1000);
    } else if (adminUsername === "receptionist" && adminPassword === "receptionist123") {
      sessionStorage.setItem("receptionist_logged_in", "true");
      triggerToast("Access granted. Redirecting to Receptionist portal...", "success");
      setAdminUsername("");
      setAdminPassword("");
      setIsAdminModalOpen(false);
      setTimeout(() => {
        window.location.href = "/receptionist";
      }, 1000);
    } else if (adminUsername === "librarian" && adminPassword === "librarian123") {
      sessionStorage.setItem("librarian_logged_in", "true");
      triggerToast("Access granted. Redirecting to Librarian portal...", "success");
      setAdminUsername("");
      setAdminPassword("");
      setIsAdminModalOpen(false);
      setTimeout(() => {
        window.location.href = "/librarian";
      }, 1000);
    } else {
      triggerToast("Invalid credentials! Please try again.", "error");
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
            <li>
              <a
                href="#"
                className="nav-link"
                id="navAdminLoginBtn"
                onClick={(e) => {
                  e.preventDefault();
                  setIsAdminModalOpen(true);
                }}
              >
                <i className="fa-solid fa-user-shield"></i> Admin/Staff Portal
              </a>
            </li>
          </ul>
          <div className="nav-actions">
            <button
              className="btn btn-outline"
              id="navLoginBtn"
              onClick={() => {
                setStudentTab("login");
                setIsStudentModalOpen(true);
              }}
            >
              Login
            </button>
            <button
              className="btn btn-primary"
              id="navRegisterBtn"
              onClick={() => {
                setStudentTab("register");
                setIsStudentModalOpen(true);
              }}
            >
              Register to Apply
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

      {/* STUDENT AUTHENTICATION MODAL */}
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
          <div className="modal-content">
            <div className="modal-header-tabs">
              <button
                className={`tab-btn ${studentTab === "login" ? "active" : ""}`}
                id="tabLoginBtn"
                onClick={() => setStudentTab("login")}
              >
                Student Login
              </button>
              <button
                className={`tab-btn ${studentTab === "register" ? "active" : ""}`}
                id="tabRegisterBtn"
                onClick={() => setStudentTab("register")}
              >
                Student Register
              </button>
            </div>

            <div className="modal-body">
              <button
                className="modal-close"
                id="closeStudentAuthModal"
                onClick={() => setIsStudentModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              {/* LOGIN PANE */}
              {studentTab === "login" && (
                <div className="auth-pane active" id="loginPane">
                  <h2 className="form-title">Welcome Back</h2>
                  <form id="studentLoginForm" onSubmit={handleStudentLogin}>
                    <div className="form-group">
                      <label htmlFor="studentLoginEmail">Email Address</label>
                      <input
                        type="email"
                        id="studentLoginEmail"
                        className="form-input"
                        placeholder="name@domain.com"
                        value={studentLoginEmail}
                        onChange={(e) => setStudentLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentLoginPassword">Password</label>
                      <input
                        type="password"
                        id="studentLoginPassword"
                        className="form-input"
                        placeholder="••••••••"
                        value={studentLoginPassword}
                        onChange={(e) => setStudentLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
                      Login to Portal <i className="fa-solid fa-right-to-bracket"></i>
                    </button>
                  </form>
                  <div className="modal-footer-msg">
                    New applicant?{" "}
                    <a
                      href="#"
                      id="switchToRegister"
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentTab("register");
                      }}
                    >
                      Register here
                    </a>
                  </div>
                </div>
              )}

              {/* REGISTER PANE */}
              {studentTab === "register" && (
                <div className="auth-pane active" id="registerPane">
                  <h2 className="form-title">Start Application</h2>
                  <form id="studentRegisterForm" onSubmit={handleStudentRegister}>
                    <div className="form-group">
                      <label htmlFor="studentRegName">Full Name</label>
                      <input
                        type="text"
                        id="studentRegName"
                        className="form-input"
                        placeholder="John Doe"
                        value={studentRegName}
                        onChange={(e) => setStudentRegName(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentRegEmail">Email Address</label>
                      <input
                        type="email"
                        id="studentRegEmail"
                        className="form-input"
                        placeholder="name@domain.com"
                        value={studentRegEmail}
                        onChange={(e) => setStudentRegEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentRegCourse">Desired Program</label>
                      <select
                        id="studentRegCourse"
                        className="form-input"
                        value={studentRegCourse}
                        onChange={(e) => setStudentRegCourse(e.target.value)}
                        required
                      >
                        <option value="" disabled>Select a program</option>
                        <option value="B.Sc. Computer Science">B.Sc. Computer Science</option>
                        <option value="B.BA. Business Administration">B.BA. Business Administration</option>
                        <option value="B.Eng. Mechanical Engineering">B.Eng. Mechanical Engineering</option>
                        <option value="M.Sc. Data Science">M.Sc. Data Science</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label htmlFor="studentRegPassword">Create Password</label>
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
                    </div>
                    <button type="submit" className="btn btn-accent" style={{ width: "100%", justifyContent: "center", marginTop: "1rem" }}>
                      Create Account & Apply <i className="fa-solid fa-user-plus"></i>
                    </button>
                  </form>
                  <div className="modal-footer-msg">
                    Already have an account?{" "}
                    <a
                      href="#"
                      id="switchToLogin"
                      onClick={(e) => {
                        e.preventDefault();
                        setStudentTab("login");
                      }}
                    >
                      Login here
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ADMIN / STAFF LOGIN MODAL */}
      {isAdminModalOpen && (
        <div
          className="modal-backdrop active"
          id="adminLoginModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsAdminModalOpen(false);
            }
          }}
        >
          <div className="modal-content" style={{ maxWidth: "420px" }}>
            <div className="modal-body">
              <button
                className="modal-close"
                id="closeAdminLoginModal"
                onClick={() => setIsAdminModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div style={{ textAlign: "center", marginBottom: "1.5rem", color: "var(--primary-light)" }}>
                <i className="fa-solid fa-user-shield" style={{ fontSize: "2.5rem" }}></i>
                <h2 className="form-title" style={{ marginTop: "0.5rem", marginBottom: 0 }}>Portal Login</h2>
                <p style={{ color: "var(--text-secondary-light)", fontSize: "0.9rem" }}>Access administrative & staff portals</p>
              </div>
              <form id="adminLoginForm" onSubmit={handleAdminLogin}>
                <div className="form-group">
                  <label htmlFor="adminUsername">Username</label>
                  <input
                    type="text"
                    id="adminUsername"
                    className="form-input"
                    placeholder="Enter username"
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="adminPassword">Password</label>
                  <input
                    type="password"
                    id="adminPassword"
                    className="form-input"
                    placeholder="••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-primary" style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem" }}>
                  Secure Staff Login <i className="fa-solid fa-lock"></i>
                </button>
              </form>
              <div style={{ marginTop: "1.25rem", fontSize: "0.8rem", color: "var(--text-secondary-light)", background: "var(--bg-light)", padding: "0.75rem", borderRadius: "var(--radius-sm)", border: "1px solid var(--border-light)" }}>
                <div style={{ fontWeight: 700, marginBottom: "0.25rem", textAlign: "center", color: "var(--text-primary-light)" }}>
                  <i className="fa-solid fa-circle-info"></i> Demo Credentials
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.2rem" }}>
                  <span>• <strong>Admin</strong>: admin / admin123</span>
                  <span>• <strong>Receptionist</strong>: receptionist / receptionist123</span>
                  <span>• <strong>Librarian</strong>: librarian / librarian123</span>
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
