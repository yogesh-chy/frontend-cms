"use client";

import Link from "next/link";
import "./styles.css";

export default function AuthLogoutIndexPage() {
  return (
    <main className="auth-page login-theme">
      <div className="auth-card">
        <h1>Student Access</h1>
        <p className="muted">Choose login or registration to continue.</p>
        <div className="auth-form" style={{ gap: "1rem" }}>
          <Link href="/auth/logout/login" className="btn">
            Login
          </Link>
          <Link href="/auth/logout/register" className="btn btn-accent">
            Register
          </Link>
        </div>
      </div>
    </main>
  );
}
