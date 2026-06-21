// ========================================================
// RECEPTIONIST PORTAL CONTROLLER
// ========================================================
const DB_KEY = "athena_applications_db";
const NOTICES_KEY = "athena_notices_db";
const DUES_KEY = "athena_dues_db";
// Route Protection
if (sessionStorage.getItem("receptionist_logged_in") !== "true") {
    alert("Access Denied: Please log in first.");
    window.location.href = "home.html";
}
// Logout handler
document.getElementById("receptionistLogoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("receptionist_logged_in");
    window.location.href = "home.html";
});
// Load DB files
function getLocalStorageData(key, defaultData) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
}
function saveLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// Synchronise database state and render UI
function renderReceptionistDashboard() {
    const applications = getLocalStorageData(DB_KEY, []);
    const notices = getLocalStorageData(NOTICES_KEY, []);
    let dues = getLocalStorageData(DUES_KEY, []);
    
    const tbody = document.getElementById("receptionistStudentsTableBody");
    tbody.innerHTML = "";
    
    // Filter out only approved students (active enrolled students)
    const activeStudents = applications.filter(app => app.status === "Approved");
    
    let totalOutstanding = 0;
    let totalPaid = 0;
    
    // Ensure all active students have a dues record
    let updatedDuesList = [...dues];
    let duesMap = new Map();
    dues.forEach(d => duesMap.set(Number(d.studentId), d));
    
    activeStudents.forEach(student => {
        let studentDues = duesMap.get(Number(student.id));
        
        // If no dues profile exists, seed one dynamically
        if (!studentDues) {
            studentDues = {
                studentId: student.id,
                remaining: parseFloat((1000 + Math.random() * 2000).toFixed(2)),
                paid: parseFloat((1500 + Math.random() * 1500).toFixed(2)),
                phone: student.phone || `+1 (555) 01${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}`
            };
            updatedDuesList.push(studentDues);
            duesMap.set(student.id, studentDues);
        }
        
        totalOutstanding += studentDues.remaining;
        totalPaid += studentDues.paid;
        
        // Render Row
        const tr = document.createElement("tr");
        tr.className = "student-row-item";
        
        const hasDues = studentDues.remaining > 0;
        const remainingStr = hasDues ? `$${studentDues.remaining.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}` : "Cleared";
        const duesClass = hasDues ? "dues-amount" : "dues-amount cleared";
        const badgeClass = hasDues ? "badge-dues" : "badge-paid";
        const badgeText = hasDues ? "Has Dues" : "Fully Paid";
        
        tr.innerHTML = `
            <td style="font-weight: 700; color: var(--text-primary-light);">${student.name}</td>
            <td style="color: var(--text-secondary-light);">${student.course}</td>
            <td style="font-family: monospace; font-size: 0.85rem;">${studentDues.phone}</td>
            <td style="font-weight: 600;">$${(studentDues.remaining + studentDues.paid).toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td style="color: var(--primary-light); font-weight: 600;">$${studentDues.paid.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
            <td class="${duesClass}">${remainingStr}</td>
            <td><span class="badge-status ${badgeClass}">${badgeText}</span></td>
        `;
        
        tbody.appendChild(tr);
    });
    
    // Save dues back in case they were updated with new records
    if (updatedDuesList.length !== dues.length) {
        saveLocalStorageData(DUES_KEY, updatedDuesList);
    }
    
    // Update Stats Card elements
    document.getElementById("statOutstandingDues").textContent = `$${totalOutstanding.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById("statPaidFees").textContent = `$${totalPaid.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
    document.getElementById("statEnrolledStudents").textContent = activeStudents.length;
    document.getElementById("statActiveNotices").textContent = notices.length;
    
    // Render notices board
    const noticesList = document.getElementById("noticesBulletinList");
    noticesList.innerHTML = "";
    
    if (notices.length === 0) {
        noticesList.innerHTML = `<p style="text-align: center; color: var(--text-secondary-light); padding: 2rem;">No notices currently active.</p>`;
    } else {
        // Sort notices by ID descending (newest first)
        const sortedNotices = [...notices].sort((a, b) => b.id - a.id);
        sortedNotices.forEach(notice => {
            const card = document.createElement("div");
            const priorityClass = `priority-${(notice.priority || "Info").toLowerCase()}`;
            const badgeClass = (notice.priority || "Info").toLowerCase();
            
            card.className = `notice-card ${priorityClass}`;
            card.innerHTML = `
                <div class="notice-card-header">
                    <h4 class="notice-card-title">${notice.title}</h4>
                    <span class="notice-priority-badge ${badgeClass}">${notice.priority || "Info"}</span>
                </div>
                <p class="notice-card-content">${notice.content}</p>
                <div class="notice-card-footer">
                    <span><i class="fa-regular fa-clock"></i> ${notice.date}</span>
                </div>
            `;
            noticesList.appendChild(card);
        });
    }
}
// Student Live Search Filter
document.getElementById("studentSearchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#receptionistStudentsTableBody tr");
    
    rows.forEach(row => {
        const studentName = row.children[0].textContent.toLowerCase();
        const studentCourse = row.children[1].textContent.toLowerCase();
        
        if (studentName.includes(term) || studentCourse.includes(term)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
// Run rendering initial loop
renderReceptionistDashboard();
