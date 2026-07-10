"use client";

import React, { useState, useEffect } from "react";
import "../../styles/homedesign.css";
import { authService } from "@/services/auth.service";

export default function AccountantDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.className = "admin-body";

    const fetchProfile = async () => {
      try {
        const res = await authService.getProfile();
        if (res && res.success && res.data) {
          setProfile(res.data);
        } else if (res && res.id) {
          setProfile(res);
        }
      } catch (err) {
        console.error("Failed to load user profile", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();

    return () => {
      document.body.className = "";
    };
  }, []);

  const handleLogout = async () => {
    await authService.logout();
    sessionStorage.clear();
    window.location.href = "/";
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#0b0f19", color: "#fff" }}>
        <h3>Loading your dashboard...</h3>
      </div>
    );
  }

  const displayName = profile?.full_name || profile?.username || "Accountant";
  const userRole = profile?.role || "Accountant";
  const institutionName = profile?.institution_name || "Platform Level";
  const branchName = profile?.branch_name || "Main Campus";

  return (
    <div className="admin-layout" style={{ backgroundColor: "#0b0f19", color: "#f8fafc", minHeight: "100vh" }}>
      {/* SIDEBAR */}
      <aside className="admin-sidebar" style={{ backgroundColor: "rgba(20, 27, 45, 0.95)", borderRight: "1px solid rgba(255,255,255,0.08)" }}>
        <div>
          <a href="/" className="sidebar-logo" style={{ color: "#6366f1" }}>
            <i className="fa-solid fa-graduation-cap"></i> ATHENA<span>MGMT</span>
          </a>
          <ul className="sidebar-menu">
            <li>
              <a href="#" className="sidebar-link active" style={{ backgroundColor: "rgba(99, 102, 241, 0.15)", color: "#6366f1" }}>
                <i className="fa-solid fa-chart-line"></i> Dashboard
              </a>
            </li>
          </ul>
        </div>
        <div className="sidebar-footer">
          <button className="btn btn-logout" style={{ background: "rgba(239, 68, 68, 0.1)", color: "#ef4444", border: "1px solid rgba(239,68,68,0.2)" }} onClick={handleLogout}>
            <i className="fa-solid fa-right-from-bracket"></i> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="admin-main" style={{ padding: "40px" }}>
        {/* Header */}
        <div className="admin-header" style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "20px", marginBottom: "30px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ fontSize: "2rem", fontWeight: 800 }}>{userRole} Portal</h1>
            <p style={{ color: "#94a3b8" }}>Welcome back to the college management system.</p>
          </div>
          <div className="admin-profile" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ textAlign: "right" }}>
              <h4 style={{ fontWeight: 700, margin: 0 }}>{displayName}</h4>
              <span style={{ fontSize: "0.8rem", color: "#10b981" }}>
                <i className="fa-solid fa-shield"></i> {userRole}
              </span>
            </div>
            <div className="admin-avatar" style={{ backgroundColor: "#6366f1", width: "40px", height: "40px", borderRadius: "50%", display: "flex", justifyContent: "center", alignItems: "center", fontWeight: 700, color: "#fff" }}>
              {displayName.slice(0, 2).toUpperCase()}
            </div>
          </div>
        </div>

        {/* Info Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}>
          <div style={{ background: "rgba(20, 27, 45, 0.7)", border: "1px solid rgba(255,255,255,0.08)", padding: "30px", borderRadius: "12px" }}>
            <h2 style={{ marginBottom: "20px", color: "#6366f1", fontSize: "1.5rem" }}>Profile Information</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Full Name</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{displayName}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Username</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{profile?.username}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Email Address</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{profile?.email}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Assigned Role</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600, color: "#10b981" }}>{userRole}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Institution</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{institutionName}</p>
              </div>
              <div>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.5px" }}>Campus / Branch</p>
                <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>{branchName}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
