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

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [course, setCourse] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const getApplicationsData = (): Application[] => {
    if (typeof window === "undefined") return [];
    const db = localStorage.getItem(DB_KEY);
    return db ? JSON.parse(db) : [];
  };

  const saveApplicationsData = (apps: Application[]) => {
    if (typeof window !== "undefined") localStorage.setItem(DB_KEY, JSON.stringify(apps));
  };

  const getDuesData = () => {
    if (typeof window === "undefined") return [];
    const db = localStorage.getItem(DUES_KEY);
    return db ? JSON.parse(db) : [];
  };

  const saveDuesData = (d: any) => {
    if (typeof window !== "undefined") localStorage.setItem(DUES_KEY, JSON.stringify(d));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !course || !password) {
      setMessage("Please fill all fields");
      return;
    }
    const db = getApplicationsData();
    if (db.some((a) => a.email.toLowerCase() === email.toLowerCase())) {
      setMessage("An account with this email already exists");
      return;
    }
    const id = Date.now();
    const newApp: Application = { id, name, email, course, status: "Pending", password };
    db.push(newApp);
    saveApplicationsData(db);
    const dues = getDuesData();
    dues.push({ studentId: id, remaining: 3500, paid: 0, phone: "+1 (555) 01" + Math.floor(1000 + Math.random() * 9000) });
    saveDuesData(dues);
    router.push("/login");
  };

  return (
    <main className="auth-page register-theme">
      <div className="auth-card">
        <h1>Create Account & Apply</h1>
        <p className="muted">Start your application to Athena University</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>Full name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required />
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <label>Desired program</label>
          <select value={course} onChange={(e) => setCourse(e.target.value)} required>
            <option value="">Select a program</option>
            <option>B.Sc. Computer Science</option>
            <option>B.BA. Business Administration</option>
            <option>B.Eng. Mechanical Engineering</option>
            <option>M.Sc. Data Science</option>
          </select>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
          <button className="btn">Register & Apply</button>
        </form>
        {message && <div className="form-message">{message}</div>}
        <div className="auth-footer">
          <a href="/login" className="link">Already have an account? Sign in</a>
        </div>
      </div>
    </main>
  );
}
