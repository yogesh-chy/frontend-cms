"use client";

import React, { useState, useEffect } from "react";
import "../../styles/homedesign.css";

const DB_KEY = "athena_applications_db";

interface Application {
  id: number | string;
  name: string;
  email: string;
  course: string;
  status: string;
}

export default function AdminPage() {
  const [authorized, setAuthorized] = useState(false);
  const [applications, setApplications] = useState<Application[]>([]);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      if (response.ok && data.success) {
        const localAppsRaw = localStorage.getItem(DB_KEY);
        const localApps: any[] = localAppsRaw ? JSON.parse(localAppsRaw) : [];
        
        const studentUsers = (data.results || data.users || []).filter(
          (u: any) => u.role === "STUDENT"
        );
        
        const mappedApps = studentUsers.map((u: any) => {
          const localMatch = localApps.find(
            (la) => la.email.toLowerCase() === u.email.toLowerCase()
          );
          return {
            id: u.id,
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username,
            email: u.email,
            course: localMatch ? localMatch.course : "B.Sc. Computer Science",
            status: u.is_approved ? "Approved" : "Pending",
          };
        });
        
        setApplications(mappedApps);
      } else {
        triggerToast(data.error || "Failed to load students from backend.", "error");
      }
    } catch {
      triggerToast("Error loading students from server.", "error");
    }
  };

  // Protection, Body Class and Initialization
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = sessionStorage.getItem("admin_logged_in");
      if (loggedIn !== "true") {
        alert("Access Denied: Please log in first.");
        window.location.href = "/";
        return;
      }
      setAuthorized(true);

      // Add admin body class
      document.body.className = "admin-body";

      // Load applications
      fetchUsers();
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
    sessionStorage.removeItem("admin_logged_in");
    window.location.href = "/";
  };

  const updateAppStatus = async (id: number | string, newStatus: string) => {
    if (newStatus === "Approved") {
      try {
        const response = await fetch(`/api/users/${id}/approve`, {
          method: "POST",
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          triggerToast(data.error || "Failed to approve student on backend.", "error");
          return;
        }
      } catch {
        triggerToast("Failed to connect to backend for approval.", "error");
        return;
      }
    } else if (newStatus === "Rejected") {
      try {
        const response = await fetch(`/api/users/${id}`, {
          method: "DELETE",
        });
        const data = await response.json();
        if (!response.ok || !data.success) {
          triggerToast(data.error || "Failed to delete student on backend.", "error");
          return;
        }
      } catch {
        triggerToast("Failed to connect to backend for rejection.", "error");
        return;
      }
    }

    const updatedApps = applications.map(app => {
      if (app.id === id) {
        return { ...app, status: newStatus };
      }
      return app;
    });

    setApplications(updatedApps);
    
    // Also sync the status back to localStorage for consistency
    const localAppsRaw = localStorage.getItem(DB_KEY);
    if (localAppsRaw) {
      const localApps: any[] = JSON.parse(localAppsRaw);
      const targetApp = applications.find(a => a.id === id);
      if (targetApp) {
        const updatedLocal = localApps.map(la => {
          if (la.email.toLowerCase() === targetApp.email.toLowerCase()) {
            return { ...la, status: newStatus };
          }
          return la;
        });
        localStorage.setItem(DB_KEY, JSON.stringify(updatedLocal));
      }
    }
    
    triggerToast(`Application successfully ${newStatus.toLowerCase()}!`, "success");
  };

  if (!authorized) {
    return null; // Prevents flashing content before redirect
  }

  // Calculate Metrics
  const totalCount = applications.length;
  const pendingCount = applications.filter(app => app.status === "Pending").length;
  const approvedCount = applications.filter(app => app.status === "Approved").length;

  const courseCounts = {
    "B.Sc. Computer Science": applications.filter(app => app.course === "B.Sc. Computer Science").length,
    "B.BA. Business Administration": applications.filter(app => app.course === "B.BA. Business Administration").length,
    "B.Eng. Mechanical Engineering": applications.filter(app => app.course === "B.Eng. Mechanical Engineering").length,
    "M.Sc. Data Science": applications.filter(app => app.course === "M.Sc. Data Science").length
  };

  // Helper to calculate height percentage safely
  const getChartHeight = (count: number) => {
    if (totalCount === 0) return "5%";
    const pct = (count / totalCount) * 100;
    return `${pct || 5}%`;
  };

  return (
    <div className="admin-layout">
      {/* SIDEBAR */}
      <aside className="admin-sidebar">
        <div>
          <a href="/" className="sidebar-logo">
            <i className="fa-solid fa-graduation-cap"></i> ATHENA<span>MGMT</span>
          </a>
          <ul className="sidebar-menu">
            <li>
              <a href="#" className="sidebar-link active">
                <i className="fa-solid fa-chart-line"></i> Dashboard
              </a>
            </li>
            <li>
              <a href="#" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-users"></i> Students
              </a>
            </li>
            <li>
              <a href="#" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-chalkboard-user"></i> Faculty
              </a>
            </li>
            <li>
              <a href="#" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-book-open"></i> Courses
              </a>
            </li>
            <li>
              <a href="#" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-wallet"></i> Finance
              </a>
            </li>
            <li>
              <a href="#" className="sidebar-link" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-sliders"></i> Settings
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="btn btn-logout" id="adminLogoutBtn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* MAIN DASHBOARD CONTENT */}
      <main className="admin-main">
        {/* Header bar */}
        <div className="admin-header">
          <div className="admin-title">
            <h1>Administrative Dashboard</h1>
            <p>Overview of system metrics, student applications, and enrollment statuses.</p>
          </div>
          <div className="admin-profile">
            <div style={{ textAlign: "right" }}>
              <h4 style={{ fontWeight: 700 }}>System Administrator</h4>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary-dark)" }}>
                <i className="fa-solid fa-shield"></i> Level 1 Security
              </span>
            </div>
            <div className="admin-avatar">AD</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Total Applications</span>
              <div className="dash-card-icon"><i className="fa-solid fa-users"></i></div>
            </div>
            <div className="dash-card-value" id="statTotalApps">{totalCount}</div>
            <div className="dash-card-change"><i className="fa-solid fa-arrow-trend-up"></i> +12% this week</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Pending Review</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.15)", color: "#f59e0b" }}>
                <i className="fa-solid fa-clock-rotate-left"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statPendingApps" style={{ color: "#f59e0b" }}>{pendingCount}</div>
            <div className="dash-card-change" style={{ color: "#f59e0b" }}>
              <i className="fa-solid fa-hourglass-half"></i> Awaiting decisions
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Approved Enrollment</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(16, 185, 129, 0.15)", color: "#10b981" }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statApprovedApps" style={{ color: "#10b981" }}>{approvedCount}</div>
            <div className="dash-card-change"><i className="fa-solid fa-arrow-trend-up"></i> +8% approved rate</div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Average GPA Trend</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "var(--primary-dark)" }}>
                <i className="fa-solid fa-chart-column"></i>
              </div>
            </div>
            <div className="dash-card-value">3.64</div>
            <div className="dash-card-change"><i className="fa-solid fa-circle-arrow-up"></i> Stable class index</div>
          </div>
        </div>

        {/* Content Area: List & Chart */}
        <div className="content-section-grid">
          {/* Students Application Management */}
          <div className="admin-card">
            <div className="admin-card-title">
              <span>Admissions Applications</span>
              <span style={{ fontSize: "0.85rem", padding: "0.25rem 0.75rem", backgroundColor: "var(--border-dark)", borderRadius: "var(--radius-sm)", color: "var(--text-secondary-dark)" }}>Live Update</span>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Applicant</th>
                    <th>Email</th>
                    <th>Program Chosen</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody id="adminStudentsTableBody">
                  {applications.map((app) => {
                    let statusBadgeClass = "badge-pending";
                    if (app.status === "Approved") statusBadgeClass = "badge-approved";
                    else if (app.status === "Rejected") statusBadgeClass = "badge-rejected";

                    return (
                      <tr key={app.id}>
                        <td style={{ fontWeight: 700 }}>{app.name}</td>
                        <td>{app.email}</td>
                        <td>{app.course}</td>
                        <td>
                          <span className={`badge-status ${statusBadgeClass}`}>{app.status}</span>
                        </td>
                        <td className="actions-cell">
                          {app.status === "Pending" ? (
                            <>
                              <button
                                className="btn btn-table-action btn-approve"
                                onClick={() => updateAppStatus(app.id, "Approved")}
                              >
                                <i className="fa-solid fa-check"></i> Approve
                              </button>
                              <button
                                className="btn btn-table-action btn-reject"
                                onClick={() => updateAppStatus(app.id, "Rejected")}
                              >
                                <i className="fa-solid fa-xmark"></i> Reject
                              </button>
                            </>
                          ) : (
                            <span style={{ color: "var(--text-secondary-dark)", fontSize: "0.8rem" }}>No actions</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Programs Enrollment Chart */}
          <div className="admin-card">
            <div className="admin-card-title">Enrollment by Course</div>
            <p style={{ color: "var(--text-secondary-dark)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>Registered applications split by academic department.</p>

            <div className="chart-simulator">
              <div className="chart-bar-container">
                <div className="chart-bar" id="chartCS" style={{ height: getChartHeight(courseCounts["B.Sc. Computer Science"]) }}></div>
                <span className="chart-label">CS</span>
              </div>
              <div className="chart-bar-container">
                <div className="chart-bar" id="chartBA" style={{ height: getChartHeight(courseCounts["B.BA. Business Administration"]) }}></div>
                <span className="chart-label">BA</span>
              </div>
              <div className="chart-bar-container">
                <div className="chart-bar" id="chartME" style={{ height: getChartHeight(courseCounts["B.Eng. Mechanical Engineering"]) }}></div>
                <span className="chart-label">ME</span>
              </div>
              <div className="chart-bar-container">
                <div className="chart-bar" id="chartDS" style={{ height: getChartHeight(courseCounts["M.Sc. Data Science"]) }}></div>
                <span className="chart-label">DS</span>
              </div>
            </div>

            <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-dark)", paddingBottom: "0.5rem" }}>
                <span>Computer Science (CS)</span>
                <strong id="labelCS">
                  {courseCounts["B.Sc. Computer Science"]} Applicant{courseCounts["B.Sc. Computer Science"] !== 1 ? "s" : ""}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-dark)", paddingBottom: "0.5rem" }}>
                <span>Business Admin (BA)</span>
                <strong id="labelBA">
                  {courseCounts["B.BA. Business Administration"]} Applicant{courseCounts["B.BA. Business Administration"] !== 1 ? "s" : ""}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border-dark)", paddingBottom: "0.5rem" }}>
                <span>Mechanical Eng (ME)</span>
                <strong id="labelME">
                  {courseCounts["B.Eng. Mechanical Engineering"]} Applicant{courseCounts["B.Eng. Mechanical Engineering"] !== 1 ? "s" : ""}
                </strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingBottom: "0.25rem" }}>
                <span>Data Science (DS)</span>
                <strong id="labelDS">
                  {courseCounts["M.Sc. Data Science"]} Applicant{courseCounts["M.Sc. Data Science"] !== 1 ? "s" : ""}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </main>

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
