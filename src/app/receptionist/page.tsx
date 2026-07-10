"use client";

import React, { useState, useEffect } from "react";
import "../../styles/homedesign.css";
import "../../styles/receptionist.css";
import { Application } from "@/types/user";
import { Notice, Due } from "@/types/portal";
import { userService } from "@/services/user.service";
import { authService } from "@/services/auth.service";

const DB_KEY = "athena_applications_db";
const NOTICES_KEY = "athena_notices_db";
const DUES_KEY = "athena_dues_db";

export default function ReceptionistPage() {
  const [authorized, setAuthorized] = useState(false);
  
  // Data States
  const [applications, setApplications] = useState<Application[]>([]);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [dues, setDues] = useState<Due[]>([]);
  
  // Search State
  const [studentSearch, setStudentSearch] = useState("");

  const fetchStudents = async (): Promise<Application[]> => {
    try {
      const data = await userService.getUsers();
      if (data && (data.results || data.users)) {
        const studentUsers = (data.results || data.users || []).filter(
          (u: any) => u.role === "STUDENT"
        );
        const localAppsRaw = localStorage.getItem(DB_KEY);
        const localApps: any[] = localAppsRaw ? JSON.parse(localAppsRaw) : [];
        
        const mappedStudents: Application[] = studentUsers.map((u: any) => {
          const localMatch = localApps.find(
            (la) => la.email.toLowerCase() === u.email.toLowerCase()
          );
          return {
            id: u.id,
            name: `${u.first_name || ""} ${u.last_name || ""}`.trim() || u.username,
            email: u.email,
            course: localMatch ? localMatch.course : "B.Sc. Computer Science",
            status: u.is_approved ? "Approved" : "Pending",
            phone: u.phone || "",
          };
        });
        setApplications(mappedStudents);
        return mappedStudents;
      }
    } catch {
      // Fallback
    }
    const appsData = localStorage.getItem(DB_KEY);
    const activeApps: Application[] = appsData ? JSON.parse(appsData) : [];
    setApplications(activeApps);
    return activeApps;
  };

  useEffect(() => {
    setAuthorized(true);
    document.body.className = "receptionist-body";

    const noticesData = localStorage.getItem(NOTICES_KEY);
    if (noticesData) setNotices(JSON.parse(noticesData));

    // Fetch students first, then load/seed dues
    fetchStudents().then((activeApps) => {
      const duesData = localStorage.getItem(DUES_KEY);
      let activeDues: Due[] = duesData ? JSON.parse(duesData) : [];

      let changed = false;
      const updatedDuesList = [...activeDues];

      activeApps.forEach((app) => {
        if (app.status === "Approved") {
          const exists = updatedDuesList.some((d) => String(d.studentId) === String(app.id));
          if (!exists) {
            updatedDuesList.push({
              studentId: app.id,
              remaining: 3500.0,
              paid: 0.0,
              phone: app.phone || "+1 (555) 019-" + Math.floor(1000 + Math.random() * 9000),
            });
            changed = true;
          }
        }
      });

      if (changed) {
        localStorage.setItem(DUES_KEY, JSON.stringify(updatedDuesList));
      }
      setDues(updatedDuesList);
    });

    return () => {
      document.body.className = "";
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    sessionStorage.removeItem("receptionist_logged_in");
    window.location.href = "/";
  };

  if (!authorized) return null;

  // Filter approved students
  const activeStudents = applications.filter(app => app.status === "Approved");

  // Calculate fees aggregates
  let totalOutstanding = 0;
  let totalPaid = 0;

  const duesMap = new Map<string | number, Due>();
  dues.forEach(d => duesMap.set(d.studentId, d));

  activeStudents.forEach(student => {
    const studentDues = duesMap.get(student.id);
    if (studentDues) {
      totalOutstanding += studentDues.remaining;
      totalPaid += studentDues.paid;
    }
  });

  // Filter students based on search
  const filteredStudents = activeStudents.filter(student => 
    student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
    student.course.toLowerCase().includes(studentSearch.toLowerCase())
  );

  // Sort notices by ID descending (newest first)
  const sortedNotices = [...notices].sort((a, b) => b.id - a.id);

  return (
    <div className="receptionist-layout">
      {/* SIDEBAR */}
      <aside className="receptionist-sidebar">
        <div>
          <a href="/" className="sidebar-logo">
            <i className="fa-solid fa-graduation-cap"></i> ATHENA<span>DESK</span>
          </a>
          <ul className="sidebar-menu">
            <li>
              <a href="#dashboard" className="sidebar-link active" id="menuDash">
                <i className="fa-solid fa-chart-pie"></i> Desk Dashboard
              </a>
            </li>
            <li>
              <a href="#students" className="sidebar-link" id="menuStudents" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-graduation-cap"></i> Student Records
              </a>
            </li>
            <li>
              <a href="#notices" className="sidebar-link" id="menuNotices" onClick={(e) => e.preventDefault()}>
                <i className="fa-solid fa-bullhorn"></i> Notice Board
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-footer">
          <button className="btn btn-logout" id="receptionistLogoutBtn" onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout Desk
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="receptionist-main">
        {/* Header bar */}
        <div className="receptionist-header">
          <div className="receptionist-title">
            <h1>Receptionist Desk</h1>
            <p>Student search, outstanding tuition fees tracker, and campus notices desk.</p>
          </div>
          <div className="receptionist-profile">
            <div style={{ textAlign: "right" }}>
              <h4 style={{ fontWeight: 700 }}>Front Desk Officer</h4>
              <span style={{ fontSize: "0.8rem", color: "var(--text-secondary-light)" }}>
                <i className="fa-solid fa-user-check"></i> Session: Active
              </span>
            </div>
            <div className="receptionist-avatar">FDO</div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="dashboard-grid">
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Total Outstanding Dues</span>
              <div className="dash-card-icon"><i className="fa-solid fa-dollar-sign"></i></div>
            </div>
            <div className="dash-card-value" id="statOutstandingDues">
              ${totalOutstanding.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="dash-card-change negative">
              <i className="fa-solid fa-circle-exclamation"></i> Awaiting collection
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Total Paid Fees</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(13, 148, 136, 0.1)", color: "var(--primary-light)" }}>
                <i className="fa-solid fa-circle-check"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statPaidFees" style={{ color: "var(--primary-light)" }}>
              ${totalPaid.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="dash-card-change" style={{ color: "var(--primary-light)" }}>
              <i className="fa-solid fa-shield-heart"></i> Secured in account
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Enrolled Students</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(245, 158, 11, 0.1)", color: "var(--accent-light)" }}>
                <i className="fa-solid fa-user-graduate"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statEnrolledStudents" style={{ color: "var(--text-primary-light)" }}>
              {activeStudents.length}
            </div>
            <div className="dash-card-change" style={{ color: "var(--text-secondary-light)" }}>
              <i className="fa-solid fa-arrow-trend-up"></i> Fully approved students
            </div>
          </div>
          <div className="dash-card">
            <div className="dash-card-header">
              <span className="dash-card-title">Active Notices</span>
              <div className="dash-card-icon" style={{ backgroundColor: "rgba(99, 102, 241, 0.1)", color: "#6366f1" }}>
                <i className="fa-solid fa-bullhorn"></i>
              </div>
            </div>
            <div className="dash-card-value" id="statActiveNotices" style={{ color: "#6366f1" }}>
              {notices.length}
            </div>
            <div className="dash-card-change" style={{ color: "#6366f1" }}>
              <i className="fa-solid fa-calendar-day"></i> Campus announcements
            </div>
          </div>
        </div>

        {/* Content Area split */}
        <div className="content-section-grid" id="mainDashboardView">
          {/* Left panel: Dues and Student data (Read-only) */}
          <div className="receptionist-card">
            <div className="card-header-actions">
              <div className="receptionist-card-title">
                <span>Student Tuition Records</span>
              </div>
              <div className="search-bar">
                <i className="fa-solid fa-magnifying-glass"></i>
                <input
                  type="text"
                  placeholder="Search student name or course..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="data-table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Course Program</th>
                    <th>Contact No.</th>
                    <th>Total Fees</th>
                    <th>Paid Amount</th>
                    <th>Remaining Dues</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody id="receptionistStudentsTableBody">
                  {filteredStudents.map(student => {
                    const studentDues = duesMap.get(student.id);
                    if (!studentDues) return null;

                    const hasDues = studentDues.remaining > 0;
                    const remainingStr = hasDues
                      ? `$${studentDues.remaining.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                      : "Cleared";
                    const duesClass = hasDues ? "dues-amount" : "dues-amount cleared";
                    const badgeClass = hasDues ? "badge-dues" : "badge-paid";
                    const badgeText = hasDues ? "Has Dues" : "Fully Paid";

                    return (
                      <tr key={student.id} className="student-row-item">
                        <td style={{ fontWeight: 700, color: "var(--text-primary-light)" }}>{student.name}</td>
                        <td style={{ color: "var(--text-secondary-light)" }}>{student.course}</td>
                        <td style={{ fontFamily: "monospace", fontSize: "0.85rem" }}>{studentDues.phone}</td>
                        <td style={{ fontWeight: 600 }}>
                          ${(studentDues.remaining + studentDues.paid).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td style={{ color: "var(--primary-light)", fontWeight: 600 }}>
                          ${studentDues.paid.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </td>
                        <td className={duesClass}>{remainingStr}</td>
                        <td>
                          <span className={`badge-status ${badgeClass}`}>{badgeText}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right panel: Notices bulletin (Read-only) */}
          <div className="receptionist-card">
            <div className="receptionist-card-title">
              <span>Notice Bulletin</span>
              <span className="badge-status badge-info">
                <i className="fa-solid fa-building-columns"></i> Official
              </span>
            </div>
            <p style={{ color: "var(--text-secondary-light)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Recent administrative announcements broadcasted to the college.
            </p>

            <div className="notices-bulletin-container" id="noticesBulletinList">
              {sortedNotices.length === 0 ? (
                <p style={{ textAlign: "center", color: "var(--text-secondary-light)", padding: "2rem" }}>
                  No notices currently active.
                </p>
              ) : (
                sortedNotices.map(notice => {
                  const priorityClass = `priority-${(notice.priority || "Info").toLowerCase()}`;
                  const badgeClass = (notice.priority || "Info").toLowerCase();

                  return (
                    <div key={notice.id} className={`notice-card ${priorityClass}`}>
                      <div className="notice-card-header">
                        <h4 className="notice-card-title">{notice.title}</h4>
                        <span className={`notice-priority-badge ${badgeClass}`}>{notice.priority || "Info"}</span>
                      </div>
                      <p className="notice-card-content">{notice.content}</p>
                      <div className="notice-card-footer">
                        <span>
                          <i className="fa-regular fa-clock"></i> {notice.date}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
