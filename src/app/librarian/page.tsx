"use client";

import React, { useState, useEffect } from "react";
import "../../styles/homedesign.css";
import "../../styles/librarian.css";

const APPLICATIONS_KEY = "athena_applications_db";
const BOOKS_KEY = "athena_books_db";
const BORROWINGS_KEY = "athena_borrowings_db";
const CURRENT_DATE = new Date("2026-06-19"); // Fixed system current date

interface Application {
  id: number;
  name: string;
  email: string;
  course: string;
  status: string;
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

export default function LibrarianPage() {
  const [authorized, setAuthorized] = useState(false);
  const [activeTab, setActiveTab] = useState<"catalog" | "borrowings">("catalog");
  
  // Data States
  const [books, setBooks] = useState<Book[]>([]);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [students, setStudents] = useState<Application[]>([]);
  
  // Search States
  const [bookSearch, setBookSearch] = useState("");
  const [borrowSearch, setBorrowSearch] = useState("");
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [borrowStudent, setBorrowStudent] = useState("");
  const [borrowBook, setBorrowBook] = useState("");
  const [borrowDueDate, setBorrowDueDate] = useState("");
  
  // Toast State
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("librarian_logged_in");
      if (loggedIn !== "true") {
        alert("Access Denied: Please log in first.");
        window.location.href = "/";
        return;
      }
      setAuthorized(true);
      document.body.className = "librarian-body";

      // Load data
      const booksData = localStorage.getItem(BOOKS_KEY);
      if (booksData) setBooks(JSON.parse(booksData));

      const borrowingsData = localStorage.getItem(BORROWINGS_KEY);
      if (borrowingsData) setBorrowings(JSON.parse(borrowingsData));

      const appsData = localStorage.getItem(APPLICATIONS_KEY);
      if (appsData) setStudents(JSON.parse(appsData));
    }

    return () => {
      if (typeof window !== "undefined") {
        document.body.className = "";
      }
    };
  }, []);

  const triggerToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("librarian_logged_in");
    window.location.href = "/";
  };

  // Helper: Date & Overdue logic
  const calculateOverdueInfo = (dueDateStr: string, status: string) => {
    if (status === "Returned") {
      return { isOverdue: false, fine: 0, daysText: "Returned", daysClass: "" };
    }

    const dueDate = new Date(dueDateStr);
    // Difference in ms
    const diffTime = CURRENT_DATE.getTime() - dueDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0) {
      const fine = diffDays * 1.00; // $1.00 per day
      return {
        isOverdue: true,
        fine,
        daysText: `${diffDays} Day${diffDays !== 1 ? "s" : ""} Overdue`,
        daysClass: "remaining-days alert"
      };
    } else {
      const remainingDays = Math.abs(diffDays);
      return {
        isOverdue: false,
        fine: 0,
        daysText: `${remainingDays} Day${remainingDays !== 1 ? "s" : ""} left`,
        daysClass: "remaining-days"
      };
    }
  };

  // Handlers
  const handleCheckIn = (borrowId: number) => {
    const updatedBorrowings = borrowings.map(log => {
      if (log.id === borrowId) {
        // Increment books stock
        const targetBookTitle = log.bookTitle;
        const updatedBooks = books.map(book => {
          if (book.title === targetBookTitle) {
            return { ...book, available: Math.min(book.total, book.available + 1) };
          }
          return book;
        });
        setBooks(updatedBooks);
        localStorage.setItem(BOOKS_KEY, JSON.stringify(updatedBooks));

        return { ...log, status: "Returned" };
      }
      return log;
    });

    setBorrowings(updatedBorrowings);
    localStorage.setItem(BORROWINGS_KEY, JSON.stringify(updatedBorrowings));
    triggerToast("Book returned successfully! Inventory updated.", "success");
  };

  const handleOpenLendingModal = () => {
    setIsModalOpen(true);
    // Default due date: 14 days from current date
    const defaultDue = new Date(CURRENT_DATE);
    defaultDue.setDate(defaultDue.getDate() + 14);
    setBorrowDueDate(defaultDue.toISOString().split("T")[0]);
  };

  const handleLendingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!borrowStudent || !borrowBook || !borrowDueDate) {
      triggerToast("Please fill in all inputs!", "error");
      return;
    }

    // Check availability
    const targetBookIndex = books.findIndex(b => b.title === borrowBook);
    if (targetBookIndex === -1) {
      triggerToast("Selected book not found in database!", "error");
      return;
    }

    const targetBook = books[targetBookIndex];
    if (targetBook.available <= 0) {
      triggerToast("Book is out of stock!", "error");
      return;
    }

    // Decrement availability
    const updatedBooks = books.map((book, index) => {
      if (index === targetBookIndex) {
        return { ...book, available: book.available - 1 };
      }
      return book;
    });
    setBooks(updatedBooks);
    localStorage.setItem(BOOKS_KEY, JSON.stringify(updatedBooks));

    // Add borrowing
    const newLog: Borrowing = {
      id: Date.now(),
      studentName: borrowStudent,
      bookTitle: borrowBook,
      borrowDate: CURRENT_DATE.toISOString().split("T")[0],
      dueDate: borrowDueDate,
      status: "Active"
    };

    const updatedBorrowings = [...borrowings, newLog];
    setBorrowings(updatedBorrowings);
    localStorage.setItem(BORROWINGS_KEY, JSON.stringify(updatedBorrowings));

    triggerToast("Book checked out successfully!", "success");
    setIsModalOpen(false);
    setBorrowStudent("");
    setBorrowBook("");
  };

  if (!authorized) return null;

  // Render variables & metrics
  let totalCheckedOut = 0;
  let totalOverdue = 0;
  let totalFines = 0;

  borrowings.forEach(log => {
    const overdueInfo = calculateOverdueInfo(log.dueDate, log.status);
    if (log.status !== "Returned") {
      totalCheckedOut++;
      if (overdueInfo.isOverdue) {
        totalOverdue++;
        totalFines += overdueInfo.fine;
      }
    }
  });

  // Filter lists
  const filteredBooks = books.filter(b => 
    b.title.toLowerCase().includes(bookSearch.toLowerCase()) ||
    b.author.toLowerCase().includes(bookSearch.toLowerCase())
  );

  const filteredBorrowings = borrowings.filter(log => 
    log.studentName.toLowerCase().includes(borrowSearch.toLowerCase()) ||
    log.bookTitle.toLowerCase().includes(borrowSearch.toLowerCase())
  );

  // Available lists for Modal Dropdowns
  const approvedStudents = students.filter(s => s.status === "Approved");
  const availableBooks = books.filter(b => b.available > 0);

  return (
    <div className="librarian-layout">
      {/* SIDEBAR */}
      <aside className="librarian-sidebar">
        <div>
          <a href="/" className="sidebar-logo">
            <i className="fa-solid fa-graduation-cap"></i> ATHENA<span>BIBLIO</span>
          </a>
          <ul className="sidebar-menu">
            <li>
              <a
                href="#"
                className={`sidebar-link ${activeTab === "catalog" ? "active" : ""}`}
                id="tabMenuCatalog"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("catalog");
                }}
              >
                <i className="fa-solid fa-book"></i> Book Catalog
              </a>
            </li>
            <li>
              <a
                href="#"
                className={`sidebar-link ${activeTab === "borrowings" ? "active" : ""}`}
                id="tabMenuBorrowings"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("borrowings");
                }}
              >
                <i className="fa-solid fa-receipt"></i> Borrowing Logs
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="btn btn-logout" id="librarianLogoutBtn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout Library
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="librarian-main">
        {/* Header bar */}
        <div className="librarian-header">
          <div className="librarian-title">
            <h1>Librarian Desk</h1>
            <p>Manage college book inventories, check outstanding returns, and record book lending logs.</p>
          </div>
          <div className="librarian-profile">
            <div style={{ textAlign: "right" }}>
              <h4 style={{ fontWeight: 700 }}>Head Librarian</h4>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary-dark)" }}>
                <i className="fa-solid fa-key"></i> Library Terminal 01
              </span>
            </div>
            <div className="librarian-avatar">HL</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Total Catalog Titles</span>
              <div className="dash-card-icon"><i className="fa-solid fa-book-open"></i></div>
            </div>
            <div className="dash-card-value" id="statTotalBooks">{books.length}</div>
            <div className="dash-card-change"><i className="fa-solid fa-circle-info"></i> Unique editions</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Active Checked Out</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "var(--primary-dark)" }}>
                <i className="fa-solid fa-hand-holding-hand"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statCheckedOut" style={{ color: "var(--primary-dark)" }}>{totalCheckedOut}</div>
            <div className="dash-card-change" style={{ color: "var(--primary-dark)" }}>
              <i className="fa-solid fa-arrow-right-arrow-left"></i> Books in circulation
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Overdue Items</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(239, 68, 68, 0.15)", color: "#ef4444" }}>
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statOverdue" style={{ color: "#ef4444" }}>{totalOverdue}</div>
            <div className="dash-card-change negative" style={{ color: "#ef4444" }}>
              <i className="fa-solid fa-triangle-exclamation"></i> Require return recall
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Accumulated Fines</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                <i className="fa-solid fa-sack-dollar"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statFines" style={{ color: "#10b981" }}>${totalFines.toFixed(2)}</div>
            <div className="dash-card-change" style={{ color: "#10b981" }}>
              <i className="fa-solid fa-coins"></i> Pending collection
            </div>
          </div>
        </div>

        {/* TAB PANES */}

        {/* Pane 1: Book Inventory Catalog */}
        {activeTab === "catalog" && (
          <div className="librarian-card active-pane" id="paneCatalog">
            <div className="card-header-actions">
              <div className="librarian-card-title">
                <span>Book Collection Inventory</span>
              </div>
              <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search book title or author..."
                  value={bookSearch}
                  onChange={(e) => setBookSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Book Title</th>
                    <th>Author Name</th>
                    <th>Total Copies</th>
                    <th>Available Copies</th>
                    <th>Unit replacement value</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="booksCatalogTableBody">
                  {filteredBooks.map((book) => {
                    const isAvailable = book.available > 0;
                    return (
                      <tr key={book.id}>
                        <td style={{ fontWeight: 700, color: "var(--text-primary-dark)" }}>{book.title}</td>
                        <td>{book.author}</td>
                        <td style={{ fontWeight: 600 }}>{book.total}</td>
                        <td style={{ fontWeight: 700, color: isAvailable ? "#10b981" : "#ef4444" }}>
                          {book.available}
                        </td>
                        <td>${book.price.toFixed(2)}</td>
                        <td>
                          <span className={`badge-status ${isAvailable ? "badge-in-stock" : "badge-out-of-stock"}`}>
                            {isAvailable ? "Available" : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pane 2: Borrowing Logs */}
        {activeTab === "borrowings" && (
          <div className="librarian-card active-pane" id="paneBorrowings">
            <div className="card-header-actions">
              <div className="librarian-card-title">
                <span>Borrower & Check-out Registry</span>
              </div>
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <button className="btn btn-primary" id="btnOpenBorrowModal" onClick={handleOpenLendingModal}>
                  <i className="fa-solid fa-plus"></i> Record Lending Log
                </button>
                <div className="search-bar">
                  <i className="fa-solid fa-magnifying-glass"></i>
                  <input
                    type="text"
                    placeholder="Search student or book title..."
                    value={borrowSearch}
                    onChange={(e) => setBorrowSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Borrower (Student)</th>
                    <th>Book Lent</th>
                    <th>Borrow Date</th>
                    <th>Due Date</th>
                    <th>Remaining/Overdue</th>
                    <th>Calculated Fine</th>
                    <th>Lending Status</th>
                    <th style={{ textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody id="borrowingsTableBody">
                  {filteredBorrowings.map((log) => {
                    const overdueInfo = calculateOverdueInfo(log.dueDate, log.status);

                    let statusLabelClass = "active";
                    let displayStatus = log.status;
                    if (log.status === "Returned") {
                      statusLabelClass = "returned";
                    } else if (overdueInfo.isOverdue) {
                      statusLabelClass = "overdue";
                      displayStatus = "Overdue";
                    }

                    const fineText = overdueInfo.fine > 0 ? `$${overdueInfo.fine.toFixed(2)}` : "-";
                    const fineClass = overdueInfo.fine > 0 ? "fine-overdue" : "fine-none";

                    return (
                      <tr key={log.id}>
                        <td style={{ fontWeight: 700, color: "var(--text-primary-dark)" }}>{log.studentName}</td>
                        <td>{log.bookTitle}</td>
                        <td>{log.borrowDate}</td>
                        <td>{log.dueDate}</td>
                        <td>
                          <span className={overdueInfo.daysClass}>{overdueInfo.daysText}</span>
                        </td>
                        <td className={fineClass}>{fineText}</td>
                        <td>
                          <span className={`borrow-status-badge ${statusLabelClass}`}>{displayStatus}</span>
                        </td>
                        <td style={{ textAlign: "right" }}>
                          {log.status !== "Returned" ? (
                            <button className="btn-checkin" onClick={() => handleCheckIn(log.id)}>
                              <i className="fa-solid fa-square-check"></i> Check In
                            </button>
                          ) : (
                            <span style={{ color: "var(--text-secondary-dark)", fontSize: "0.8rem" }}>
                              <i className="fa-solid fa-circle-check"></i> Complete
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* NEW BORROWING MODAL */}
      {isModalOpen && (
        <div
          className="modal-backdrop active"
          id="lendingLogModal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setIsModalOpen(false);
            }
          }}
        >
          <div className="modal-content" style={{ maxWidth: "460px", backgroundColor: "#141b2d", border: "1px solid var(--border-dark)" }}>
            <div className="modal-body" style={{ color: "var(--text-primary-dark)" }}>
              <button
                className="modal-close"
                id="closeLendingModal"
                style={{ background: "rgba(255,255,255,0.05)", color: "var(--text-secondary-dark)" }}
                onClick={() => setIsModalOpen(false)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>

              <div style={{ textAlign: "center", marginBottom: "2rem", color: "var(--primary-dark)" }}>
                <i className="fa-solid fa-book-medical" style={{ fontSize: "2.5rem" }}></i>
                <h2 className="form-title" style={{ marginTop: "0.5rem", marginBottom: 0, color: "var(--text-primary-dark)" }}>
                  New Book Issue Log
                </h2>
                <p style={{ color: "var(--text-secondary-dark)", fontSize: "0.9rem" }}>Record a new book checkout to a student</p>
              </div>
              <form id="lendingLogForm" onSubmit={handleLendingSubmit}>
                <div className="form-group">
                  <label htmlFor="borrowerStudentSelect" style={{ color: "var(--text-secondary-dark)" }}>
                    Select Student Borrower
                  </label>
                  <select
                    id="borrowerStudentSelect"
                    className="form-input"
                    style={{ backgroundColor: "#0b0f19", borderColor: "var(--border-dark)", color: "white" }}
                    value={borrowStudent}
                    onChange={(e) => setBorrowStudent(e.target.value)}
                    required
                  >
                    <option value="" disabled>Choose approved student</option>
                    {approvedStudents.map(student => (
                      <option key={student.id} value={student.name}>
                        {student.name} ({student.course})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="borrowBookSelect" style={{ color: "var(--text-secondary-dark)" }}>
                    Select Book Title
                  </label>
                  <select
                    id="borrowBookSelect"
                    className="form-input"
                    style={{ backgroundColor: "#0b0f19", borderColor: "var(--border-dark)", color: "white" }}
                    value={borrowBook}
                    onChange={(e) => setBorrowBook(e.target.value)}
                    required
                  >
                    <option value="" disabled>Choose catalog book</option>
                    {availableBooks.map(book => (
                      <option key={book.id} value={book.title}>
                        {book.title} ({book.available} left)
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="borrowDueDate" style={{ color: "var(--text-secondary-dark)" }}>
                    Lending Return Due Date
                  </label>
                  <input
                    type="date"
                    id="borrowDueDate"
                    className="form-input"
                    style={{ backgroundColor: "#0b0f19", borderColor: "var(--border-dark)", color: "white" }}
                    value={borrowDueDate}
                    onChange={(e) => setBorrowDueDate(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: "100%", justifyContent: "center", marginTop: "1.5rem", backgroundColor: "var(--primary-dark)" }}
                >
                  Confirm Book Issue <i className="fa-solid fa-stamp"></i>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TOAST NOTIFICATION */}
      {toast && (
        <div className={`toast-msg ${toast.type} show`} id="toast" style={{ borderLeft: toast.type === "success" ? "4px solid #10b981" : "4px solid #ef4444" }}>
          <i className={toast.type === "success" ? "fa-solid fa-circle-check" : "fa-solid fa-circle-exclamation"} id="toastIcon"></i>
          <span id="toastText">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
