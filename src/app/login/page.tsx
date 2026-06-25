"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import "./styles.css";

const DB_KEY = "athena_applications_db";
const DUES_KEY = "athena_dues_db";

interface Application {
  id: number;
  name: string;
  email: string;
  course: string;
  status: string;
  password?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const getApplicationsData = (): Application[] => {
    if (typeof window === "undefined") return [];
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : [];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const db = getApplicationsData();
    const user = db.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      setMessage("No account found. Please register first.");
      return;
    }
    if (user.password && user.password !== password) {
      setMessage("Incorrect password. Try again.");
      return;
    }
    // Simple session marker
    if (typeof window !== "undefined") {
      sessionStorage.setItem("student_logged_in", String(user.id));
    }
    router.push("/");
  };

  return (
    <main className="auth-page login-theme">
      <div className="auth-card">
        <h1>Student Login</h1>
        <p className="muted">Access your application dashboard</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          <button className="btn">Sign in</button>
        </form>
        {message && <div className="form-message">{message}</div>}
        <div className="auth-footer">
          <a href="/register" className="link">Create an account</a>
        </div>
      </div>
    </main>
  );
}
