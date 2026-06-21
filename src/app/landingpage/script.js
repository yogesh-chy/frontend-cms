// --- DATABASE UTILITY (LOCAL STORAGE) ---
const DB_KEY = "athena_applications_db";
const NOTICES_KEY = "athena_notices_db";
const BOOKS_KEY = "athena_books_db";
const BORROWINGS_KEY = "athena_borrowings_db";
const DUES_KEY = "athena_dues_db";
const defaultApplications = [
    { id: 1, name: "Alice Johnson", email: "alice@gmail.com", course: "B.Sc. Computer Science", status: "Approved" },
    { id: 2, name: "Bob Smith", email: "bob@yahoo.com", course: "B.BA. Business Administration", status: "Pending" },
    { id: 3, name: "Charlie Davis", email: "charlie@outlook.com", course: "M.Sc. Data Science", status: "Pending" },
    { id: 4, name: "Diana Prince", email: "diana@amazon.com", course: "B.Sc. Computer Science", status: "Approved" },
    { id: 5, name: "Ethan Hunt", email: "ethan@imf.org", course: "B.Eng. Mechanical Engineering", status: "Rejected" },
    { id: 6, name: "Fiona Gallagher", email: "fiona@gallagher.com", course: "M.Sc. Data Science", status: "Pending" }
];
const defaultNotices = [
    { id: 1, title: "Final Examination Schedule Fall 2026", content: "The exam schedules for all undergraduate programs are now posted. Exams start Dec 5th.", date: "2026-06-15", priority: "High" },
    { id: 2, title: "Library Extended Hours for Finals Week", content: "Athena main library will remain open 24/7 starting from next Monday until the end of exams.", date: "2026-06-12", priority: "Medium" },
    { id: 3, title: "Annual Sports Meet Registration Open", content: "Sign up for track, soccer, and basketball tournaments at the student activity center.", date: "2026-06-10", priority: "Low" }
];
const defaultBooks = [
    { id: 1, title: "Introduction to Algorithms", author: "Thomas H. Cormen", total: 10, available: 8, price: 120.00 },
    { id: 2, title: "The C++ Programming Language", author: "Bjarne Stroustrup", total: 5, available: 3, price: 89.99 },
    { id: 3, title: "Data Science from Scratch", author: "Joel Grus", total: 8, available: 8, price: 59.99 },
    { id: 4, title: "Design Patterns", author: "Erich Gamma", total: 12, available: 9, price: 79.50 },
    { id: 5, title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", total: 6, available: 4, price: 139.99 }
];
const defaultBorrowings = [
    { id: 1, studentName: "Alice Johnson", bookTitle: "Introduction to Algorithms", borrowDate: "2026-06-10", dueDate: "2026-06-24", status: "Active" },
    { id: 2, studentName: "Bob Smith", bookTitle: "Design Patterns", borrowDate: "2026-06-01", dueDate: "2026-06-15", status: "Overdue" },
    { id: 3, studentName: "Diana Prince", bookTitle: "The C++ Programming Language", borrowDate: "2026-06-12", dueDate: "2026-06-26", status: "Active" },
    { id: 4, studentName: "Ethan Hunt", bookTitle: "Artificial Intelligence: A Modern Approach", borrowDate: "2026-05-25", dueDate: "2026-06-08", status: "Overdue" }
];
// In a real app, dues are dynamic. We will initialize static dues for mock data,
// and dynamically assign dues to new approved students.
const defaultDues = [
    { studentId: 1, remaining: 1500.00, paid: 3500.00, phone: "+1 (555) 019-2834" },
    { studentId: 2, remaining: 4200.00, paid: 800.00, phone: "+1 (555) 014-9988" },
    { studentId: 3, remaining: 0.00, paid: 5000.00, phone: "+1 (555) 012-7489" },
    { studentId: 4, remaining: 950.00, paid: 4050.00, phone: "+1 (555) 018-3627" },
    { studentId: 5, remaining: 0.00, paid: 0.00, phone: "+1 (555) 017-8822" },
    { studentId: 6, remaining: 2800.00, paid: 2200.00, phone: "+1 (555) 011-3746" }
];
function getApplications() {
    let db = localStorage.getItem(DB_KEY);
    if (!db) {
        localStorage.setItem(DB_KEY, JSON.stringify(defaultApplications));
        return defaultApplications;
    }
    return JSON.parse(db);
}
function saveApplications(apps) {
    localStorage.setItem(DB_KEY, JSON.stringify(apps));
}
// Initialise notices, books, dues, and borrowings database
function initializeSystemData() {
    getApplications(); // ensure applications are setup
    
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
// Run initial seeding
initializeSystemData();
// Helper to get and save helper functions
function getSystemData(key, defaultData) {
    let db = localStorage.getItem(key);
    return db ? JSON.parse(db) : defaultData;
}
function saveSystemData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// --- UTILITY: TOAST NOTIFICATIONS ---
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");
    const toastIcon = document.getElementById("toastIcon");
    if (!toast) return;
    toastText.textContent = message;
    toast.className = `toast-msg ${type} show`;
    if (type === "success") {
        toastIcon.className = "fa-solid fa-circle-check";
        toast.style.borderLeft = "4px solid #0d9488";
    } else {
        toastIcon.className = "fa-solid fa-circle-exclamation";
        toast.style.borderLeft = "4px solid #ef4444";
    }
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
// ==========================================
// LANDING PAGE CONTROLLER (home.html)
// ==========================================
if (document.getElementById("studentAuthModal")) {
    
    // Modal Selectors
    const studentModal = document.getElementById("studentAuthModal");
    const adminModal = document.getElementById("adminLoginModal");
    
    // Triggers
    const navLoginBtn = document.getElementById("navLoginBtn");
    const navRegisterBtn = document.getElementById("navRegisterBtn");
    const heroRegisterBtn = document.getElementById("heroRegisterBtn");
    const navAdminLoginBtn = document.getElementById("navAdminLoginBtn");
    
    // Closers
    const closeStudentBtn = document.getElementById("closeStudentAuthModal");
    const closeAdminBtn = document.getElementById("closeAdminLoginModal");
    
    // Tabs & Panes
    const tabLoginBtn = document.getElementById("tabLoginBtn");
    const tabRegisterBtn = document.getElementById("tabRegisterBtn");
    const loginPane = document.getElementById("loginPane");
    const registerPane = document.getElementById("registerPane");
    
    // Switchers
    const switchToRegister = document.getElementById("switchToRegister");
    const switchToLogin = document.getElementById("switchToLogin");
    // Modal Control Functions
    function openStudentModal(tabName = "login") {
        studentModal.classList.add("active");
        switchTab(tabName);
    }
    function switchTab(tabName) {
        if (tabName === "login") {
            tabLoginBtn.classList.add("active");
            tabRegisterBtn.classList.remove("active");
            loginPane.classList.add("active");
            registerPane.classList.remove("active");
        } else {
            tabRegisterBtn.classList.add("active");
            tabLoginBtn.classList.remove("active");
            registerPane.classList.add("active");
            loginPane.classList.remove("active");
        }
    }
    // Event Listeners
    navLoginBtn.addEventListener("click", () => openStudentModal("login"));
    navRegisterBtn.addEventListener("click", () => openStudentModal("register"));
    heroRegisterBtn.addEventListener("click", () => openStudentModal("register"));
    
    navAdminLoginBtn.addEventListener("click", () => {
        adminModal.classList.add("active");
    });
    closeStudentBtn.addEventListener("click", () => {
        studentModal.classList.remove("active");
    });
    closeAdminBtn.addEventListener("click", () => {
        adminModal.classList.remove("active");
    });
    tabLoginBtn.addEventListener("click", () => switchTab("login"));
    tabRegisterBtn.addEventListener("click", () => switchTab("register"));
    switchToRegister.addEventListener("click", (e) => { e.preventDefault(); switchTab("register"); });
    switchToLogin.addEventListener("click", (e) => { e.preventDefault(); switchTab("login"); });
    // Close on background click
    window.addEventListener("click", (e) => {
        if (e.target === studentModal) studentModal.classList.remove("active");
        if (e.target === adminModal) adminModal.classList.remove("active");
    });
    // Forms Handle: Registration
    const registerForm = document.getElementById("studentRegisterForm");
    registerForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("studentRegName").value.trim();
        const email = document.getElementById("studentRegEmail").value.trim();
        const course = document.getElementById("studentRegCourse").value;
        const password = document.getElementById("studentRegPassword").value;
        let db = getApplications();
        if (db.some(app => app.email.toLowerCase() === email.toLowerCase())) {
            showToast("An application with this email already exists!", "error");
            return;
        }
        const newId = Date.now();
        const newApp = {
            id: newId,
            name: name,
            email: email,
            course: course,
            status: "Pending",
            password: password // simplified mock storage
        };
        db.push(newApp);
        saveApplications(db);
        // Seed some random dues for this applicant in receptionist dues database
        let duesDb = getSystemData(DUES_KEY, defaultDues);
        duesDb.push({
            studentId: newId,
            remaining: 3500.00, // standard tuition fee
            paid: 0.00,
            phone: "+1 (555) 019-" + Math.floor(1000 + Math.random() * 9000)
        });
        saveSystemData(DUES_KEY, duesDb);
        showToast("Application submitted successfully! Please login.", "success");
        registerForm.reset();
        
        // Auto switch to login
        setTimeout(() => {
            switchTab("login");
            document.getElementById("studentLoginEmail").value = email;
        }, 800);
    });
    // Forms Handle: Student Login
    const loginForm = document.getElementById("studentLoginForm");
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const email = document.getElementById("studentLoginEmail").value.trim();
        const password = document.getElementById("studentLoginPassword").value;
        let db = getApplications();
        const student = db.find(app => app.email.toLowerCase() === email.toLowerCase());
        if (!student) {
            showToast("No account found with this email. Please register.", "error");
            return;
        }
        // Mock verification
        if (student.password && student.password !== password) {
            showToast("Incorrect password. Please try again.", "error");
            return;
        }
        // Success
        studentModal.classList.remove("active");
        loginForm.reset();
        
        // Show status feedback
        setTimeout(() => {
            alert(`Welcome back, ${student.name}!\n\nProgram: ${student.course}\nApplication Status: ${student.status.toUpperCase()}`);
        }, 400);
    });
    // Forms Handle: Admin/Staff Login
    const adminLoginForm = document.getElementById("adminLoginForm");
    adminLoginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = document.getElementById("adminUsername").value.trim();
        const password = document.getElementById("adminPassword").value;
        if (username === "admin" && password === "admin123") {
            sessionStorage.setItem("admin_logged_in", "true");
            showToast("Access granted. Redirecting to Administrator portal...", "success");
            adminLoginForm.reset();
            adminModal.classList.remove("active");
            
            setTimeout(() => {
                window.location.href = "admin.html";
            }, 1000);
        } else if (username === "receptionist" && password === "receptionist123") {
            sessionStorage.setItem("receptionist_logged_in", "true");
            showToast("Access granted. Redirecting to Receptionist portal...", "success");
            adminLoginForm.reset();
            adminModal.classList.remove("active");
            
            setTimeout(() => {
                window.location.href = "receptionist.html";
            }, 1000);
        } else if (username === "librarian" && password === "librarian123") {
            sessionStorage.setItem("librarian_logged_in", "true");
            showToast("Access granted. Redirecting to Librarian portal...", "success");
            adminLoginForm.reset();
            adminModal.classList.remove("active");
            
            setTimeout(() => {
                window.location.href = "librarian.html";
            }, 1000);
        } else {
            showToast("Invalid credentials! Please try again.", "error");
        }
    });
}
// ==========================================
// ADMIN DASHBOARD CONTROLLER (admin.html)
// ==========================================
if (document.getElementById("adminStudentsTableBody")) {
    // Simple Route Protection
    if (sessionStorage.getItem("admin_logged_in") !== "true") {
        alert("Access Denied: Please log in first.");
        window.location.href = "home.html";
    }
    // Logout
    const adminLogoutBtn = document.getElementById("adminLogoutBtn");
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener("click", () => {
            sessionStorage.removeItem("admin_logged_in");
            window.location.href = "home.html";
        });
    }
    // Main render & update dashboard data
    function renderDashboard() {
        const db = getApplications();
        const tbody = document.getElementById("adminStudentsTableBody");
        tbody.innerHTML = "";
        // Calculated stats
        let totalCount = db.length;
        let pendingCount = 0;
        let approvedCount = 0;
        // Course metrics
        let courseCounts = {
            "B.Sc. Computer Science": 0,
            "B.BA. Business Administration": 0,
            "B.Eng. Mechanical Engineering": 0,
            "M.Sc. Data Science": 0
        };
        db.forEach(app => {
            // Count states
            if (app.status === "Pending") pendingCount++;
            else if (app.status === "Approved") approvedCount++;
            // Count courses
            if (courseCounts.hasOwnProperty(app.course)) {
                courseCounts[app.course]++;
            }
            // Create row
            const tr = document.createElement("tr");
            
            let statusBadgeClass = "badge-pending";
            if (app.status === "Approved") statusBadgeClass = "badge-approved";
            else if (app.status === "Rejected") statusBadgeClass = "badge-rejected";
            let actionButtons = "";
            if (app.status === "Pending") {
                actionButtons = `
                    <button class="btn btn-table-action btn-approve" onclick="updateAppStatus(${app.id}, 'Approved')"><i class="fa-solid fa-check"></i> Approve</button>
                    <button class="btn btn-table-action btn-reject" onclick="updateAppStatus(${app.id}, 'Rejected')"><i class="fa-solid fa-xmark"></i> Reject</button>
                `;
            } else {
                actionButtons = `<span style="color: var(--text-secondary-dark); font-size: 0.8rem;">No actions</span>`;
            }
            tr.innerHTML = `
                <td style="font-weight: 700;">${app.name}</td>
                <td>${app.email}</td>
                <td>${app.course}</td>
                <td><span class="badge-status ${statusBadgeClass}">${app.status}</span></td>
                <td class="actions-cell">${actionButtons}</td>
            `;
            tbody.appendChild(tr);
        });
        // Set Metric values
        document.getElementById("statTotalApps").textContent = totalCount;
        document.getElementById("statPendingApps").textContent = pendingCount;
        document.getElementById("statApprovedApps").textContent = approvedCount;
        // Draw Dynamic Chart
        // CS
        const csCount = courseCounts["B.Sc. Computer Science"];
        document.getElementById("chartCS").style.height = `${(csCount / totalCount) * 100 || 5}%`;
        document.getElementById("labelCS").textContent = `${csCount} Applicant${csCount !== 1 ? 's' : ''}`;
        
        // BA
        const baCount = courseCounts["B.BA. Business Administration"];
        document.getElementById("chartBA").style.height = `${(baCount / totalCount) * 100 || 5}%`;
        document.getElementById("labelBA").textContent = `${baCount} Applicant${baCount !== 1 ? 's' : ''}`;
        // ME
        const meCount = courseCounts["B.Eng. Mechanical Engineering"];
        document.getElementById("chartME").style.height = `${(meCount / totalCount) * 100 || 5}%`;
        document.getElementById("labelME").textContent = `${meCount} Applicant${meCount !== 1 ? 's' : ''}`;
        // DS
        const dsCount = courseCounts["M.Sc. Data Science"];
        document.getElementById("chartDS").style.height = `${(dsCount / totalCount) * 100 || 5}%`;
        document.getElementById("labelDS").textContent = `${dsCount} Applicant${dsCount !== 1 ? 's' : ''}`;
    }
    // Global action dispatcher (accessible from inline onclick handlers)
    window.updateAppStatus = function(id, newStatus) {
        let db = getApplications();
        const appIndex = db.findIndex(app => app.id === id);
        if (appIndex !== -1) {
            db[appIndex].status = newStatus;
            saveApplications(db);
            showToast(`Application successfully ${newStatus.toLowerCase()}!`, "success");
            renderDashboard();
        }
    };
    // Initial render call
    renderDashboard();
}
