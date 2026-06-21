// ========================================================
// LIBRARIAN PORTAL CONTROLLER
// ========================================================
const APPLICATIONS_KEY = "athena_applications_db";
const BOOKS_KEY = "athena_books_db";
const BORROWINGS_KEY = "athena_borrowings_db";
const CURRENT_DATE = new Date("2026-06-19"); // Fixed system current date based on metadata
// Route Protection
if (sessionStorage.getItem("librarian_logged_in") !== "true") {
    alert("Access Denied: Please log in first.");
    window.location.href = "home.html";
}
// Logout handler
document.getElementById("librarianLogoutBtn").addEventListener("click", () => {
    sessionStorage.removeItem("librarian_logged_in");
    window.location.href = "home.html";
});
// Tab Switching Logic
const tabMenuCatalog = document.getElementById("tabMenuCatalog");
const tabMenuBorrowings = document.getElementById("tabMenuBorrowings");
const paneCatalog = document.getElementById("paneCatalog");
const paneBorrowings = document.getElementById("paneBorrowings");
tabMenuCatalog.addEventListener("click", (e) => {
    e.preventDefault();
    tabMenuCatalog.classList.add("active");
    tabMenuBorrowings.classList.remove("active");
    paneCatalog.style.display = "block";
    paneBorrowings.style.display = "none";
});
tabMenuBorrowings.addEventListener("click", (e) => {
    e.preventDefault();
    tabMenuBorrowings.classList.add("active");
    tabMenuCatalog.classList.remove("active");
    paneBorrowings.style.display = "block";
    paneCatalog.style.display = "none";
    populateLendingDropdowns(); // refresh lists for the form dropdowns
});
// Load DB Files helper
function getLocalStorageData(key, defaultData) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultData;
}
function saveLocalStorageData(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}
// Dynamic calculations helper
function calculateOverdueInfo(borrowDateStr, dueDateStr, status) {
    if (status === "Returned") {
        return { isOverdue: false, fine: 0, daysText: "Returned", daysClass: "" };
    }
    
    const dueDate = new Date(dueDateStr);
    const diffTime = CURRENT_DATE - dueDate; // time difference in ms
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); // difference in days
    
    if (diffDays > 0) {
        // Overdue! Fine is $1.00 per day
        const fine = diffDays * 1.00;
        return {
            isOverdue: true,
            fine: fine,
            daysText: `${diffDays} Day${diffDays !== 1 ? 's' : ''} Overdue`,
            daysClass: "remaining-days alert"
        };
    } else {
        // Active, not overdue yet
        const remainingDays = Math.abs(diffDays);
        return {
            isOverdue: false,
            fine: 0,
            daysText: `${remainingDays} Day${remainingDays !== 1 ? 's' : ''} left`,
            daysClass: "remaining-days"
        };
    }
}
// Render Dashboard function
function renderLibrarianDashboard() {
    const books = getLocalStorageData(BOOKS_KEY, []);
    const borrowings = getLocalStorageData(BORROWINGS_KEY, []);
    
    // 1. Render Book Catalog Table
    const catalogTbody = document.getElementById("booksCatalogTableBody");
    catalogTbody.innerHTML = "";
    
    books.forEach(book => {
        const tr = document.createElement("tr");
        const isAvailable = book.available > 0;
        const statusBadgeClass = isAvailable ? "badge-in-stock" : "badge-out-of-stock";
        const statusText = isAvailable ? "Available" : "Out of Stock";
        
        tr.innerHTML = `
            <td style="font-weight: 700; color: var(--text-primary-dark);">${book.title}</td>
            <td>${book.author}</td>
            <td style="font-weight: 600;">${book.total}</td>
            <td style="font-weight: 700; color: ${isAvailable ? '#10b981' : '#ef4444'};">${book.available}</td>
            <td>$${book.price.toFixed(2)}</td>
            <td><span class="badge-status ${statusBadgeClass}">${statusText}</span></td>
        `;
        catalogTbody.appendChild(tr);
    });
    
    // 2. Render Borrowing Logs Table
    const borrowingsTbody = document.getElementById("borrowingsTableBody");
    borrowingsTbody.innerHTML = "";
    
    let totalCheckedOut = 0;
    let totalOverdue = 0;
    let totalFines = 0;
    
    borrowings.forEach(log => {
        const overdueInfo = calculateOverdueInfo(log.borrowDate, log.dueDate, log.status);
        
        if (log.status !== "Returned") {
            totalCheckedOut++;
            if (overdueInfo.isOverdue) {
                totalOverdue++;
                totalFines += overdueInfo.fine;
            }
        }
        
        const tr = document.createElement("tr");
        
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
        
        const actionButton = log.status !== "Returned" 
            ? `<button class="btn-checkin" onclick="checkInBook(${log.id})"><i class="fa-solid fa-square-check"></i> Check In</button>`
            : `<span style="color: var(--text-secondary-dark); font-size: 0.8rem;"><i class="fa-solid fa-circle-check"></i> Complete</span>`;
            
        tr.innerHTML = `
            <td style="font-weight: 700; color: var(--text-primary-dark);">${log.studentName}</td>
            <td>${log.bookTitle}</td>
            <td>${log.borrowDate}</td>
            <td>${log.dueDate}</td>
            <td><span class="${overdueInfo.daysClass}">${overdueInfo.daysText}</span></td>
            <td class="${fineClass}">${fineText}</td>
            <td><span class="borrow-status-badge ${statusLabelClass}">${displayStatus}</span></td>
            <td style="text-align: right;">${actionButton}</td>
        `;
        borrowingsTbody.appendChild(tr);
    });
    
    // Update Stats Card elements
    document.getElementById("statTotalBooks").textContent = books.length;
    document.getElementById("statCheckedOut").textContent = totalCheckedOut;
    document.getElementById("statOverdue").textContent = totalOverdue;
    document.getElementById("statFines").textContent = `$${totalFines.toFixed(2)}`;
}
// Book Check In Handler (Globally accessible for table action)
window.checkInBook = function(borrowId) {
    let borrowings = getLocalStorageData(BORROWINGS_KEY, []);
    let books = getLocalStorageData(BOOKS_KEY, []);
    
    const logIndex = borrowings.findIndex(b => b.id === borrowId);
    if (logIndex !== -1) {
        const log = borrowings[logIndex];
        
        // 1. Mark borrowing as returned
        log.status = "Returned";
        
        // 2. Increment book available count
        const bookIndex = books.findIndex(b => b.title === log.bookTitle);
        if (bookIndex !== -1) {
            books[bookIndex].available = Math.min(books[bookIndex].total, books[bookIndex].available + 1);
        }
        
        // 3. Save to localStorage
        saveLocalStorageData(BORROWINGS_KEY, borrowings);
        saveLocalStorageData(BOOKS_KEY, books);
        
        // 4. Toast and Re-render
        showToast("Book returned successfully! Inventory updated.", "success");
        renderLibrarianDashboard();
    }
};
// Modal Control for Logging New Borrowing
const modal = document.getElementById("lendingLogModal");
const openBtn = document.getElementById("btnOpenBorrowModal");
const closeBtn = document.getElementById("closeLendingModal");
const form = document.getElementById("lendingLogForm");
openBtn.addEventListener("click", () => {
    modal.classList.add("active");
    // Default the due date input to 14 days from now
    const defaultDue = new Date(CURRENT_DATE);
    defaultDue.setDate(defaultDue.getDate() + 14);
    document.getElementById("borrowDueDate").value = defaultDue.toISOString().split('T')[0];
});
closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
});
window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.remove("active");
});
// Populate dropdown selectors dynamically
function populateLendingDropdowns() {
    const students = getLocalStorageData(APPLICATIONS_KEY, []).filter(app => app.status === "Approved");
    const books = getLocalStorageData(BOOKS_KEY, []).filter(b => b.available > 0);
    
    const studentSelect = document.getElementById("borrowerStudentSelect");
    const bookSelect = document.getElementById("borrowBookSelect");
    
    // Clear and add placeholder
    studentSelect.innerHTML = `<option value="" disabled selected>Choose approved student</option>`;
    bookSelect.innerHTML = `<option value="" disabled selected>Choose catalog book</option>`;
    
    students.forEach(s => {
        const opt = document.createElement("option");
        opt.value = s.name;
        opt.textContent = `${s.name} (${s.course})`;
        studentSelect.appendChild(opt);
    });
    
    books.forEach(b => {
        const opt = document.createElement("option");
        opt.value = b.title;
        opt.textContent = `${b.title} (${b.available} left)`;
        bookSelect.appendChild(opt);
    });
}
// Form checkout submission
form.addEventListener("submit", (e) => {
    e.preventDefault();
    const studentName = document.getElementById("borrowerStudentSelect").value;
    const bookTitle = document.getElementById("borrowBookSelect").value;
    const dueDate = document.getElementById("borrowDueDate").value;
    
    let borrowings = getLocalStorageData(BORROWINGS_KEY, []);
    let books = getLocalStorageData(BOOKS_KEY, []);
    
    // Decrement available count
    const bookIndex = books.findIndex(b => b.title === bookTitle);
    if (bookIndex !== -1) {
        if (books[bookIndex].available <= 0) {
            showToast("Book is out of stock!", "error");
            return;
        }
        books[bookIndex].available--;
    } else {
        showToast("Selected book not found in database!", "error");
        return;
    }
    
    // Insert new borrowing log
    const newLog = {
        id: Date.now(),
        studentName: studentName,
        bookTitle: bookTitle,
        borrowDate: CURRENT_DATE.toISOString().split('T')[0],
        dueDate: dueDate,
        status: "Active"
    };
    
    borrowings.push(newLog);
    
    // Save databases
    saveLocalStorageData(BORROWINGS_KEY, borrowings);
    saveLocalStorageData(BOOKS_KEY, books);
    
    // Clean UI
    showToast("Book checked out successfully!", "success");
    form.reset();
    modal.classList.remove("active");
    
    // Re-render
    renderLibrarianDashboard();
});
// Toast notification helper
function showToast(message, type = "success") {
    const toast = document.getElementById("toast");
    const toastText = document.getElementById("toastText");
    const toastIcon = document.getElementById("toastIcon");
    if (!toast) return;
    
    toastText.textContent = message;
    toast.className = `toast-msg ${type} show`;
    
    if (type === "success") {
        toastIcon.className = "fa-solid fa-circle-check";
        toast.style.borderLeft = "4px solid #10b981";
    } else {
        toastIcon.className = "fa-solid fa-circle-exclamation";
        toast.style.borderLeft = "4px solid #ef4444";
    }
    
    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}
// Live search filters
document.getElementById("bookSearchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#booksCatalogTableBody tr");
    rows.forEach(row => {
        const title = row.children[0].textContent.toLowerCase();
        const author = row.children[1].textContent.toLowerCase();
        if (title.includes(term) || author.includes(term)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
document.getElementById("borrowSearchInput").addEventListener("input", (e) => {
    const term = e.target.value.toLowerCase().trim();
    const rows = document.querySelectorAll("#borrowingsTableBody tr");
    rows.forEach(row => {
        const name = row.children[0].textContent.toLowerCase();
        const title = row.children[1].textContent.toLowerCase();
        if (name.includes(term) || title.includes(term)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});
// Initial Render
renderLibrarianDashboard();
populateLendingDropdowns();
