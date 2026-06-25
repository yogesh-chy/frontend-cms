const loginUsername = document.getElementById("loginUsername");
const loginPassword = document.getElementById("loginPassword");

const regName = document.getElementById("regName");
const regUsername = document.getElementById("regUsername");
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");

const loginBtn = document.getElementById("loginBtn");
const registerBtn = document.getElementById("registerBtn");

function register() {
  const validName = validateInput(regName);
  const validUsername = validateInput(regUsername);
  const validEmail = validateInput(regEmail);
  const validPassword = validateInput(regPassword);

  if (!validName || !validUsername || !validEmail || !validPassword) {
    return;
  }

  localStorage.setItem("studentName", regName.value);
  localStorage.setItem("studentUsername", regUsername.value);
  localStorage.setItem("studentEmail", regEmail.value);
  localStorage.setItem("studentPassword", regPassword.value);

  alert("Registration Successful!");
  window.location.href = "/login1.html";
}

function login() {
  const validUsername = validateInput(loginUsername);
  const validPassword = validateInput(loginPassword);

  if (!validUsername || !validPassword) {
    return;
  }

  const username = loginUsername.value;
  const password = loginPassword.value;

  const savedUsername = localStorage.getItem("studentUsername");
  const savedPassword = localStorage.getItem("studentPassword");

  if (
    (username === "student123" && password === "student123") ||
    (username === savedUsername && password === savedPassword)
  ) {
    alert("Login Successful!");
  } else {
    alert("Invalid Username or Password");
  }
}

function validateInput(input) {
  if (!input || !input.value.trim()) {
    input?.classList.add("error");
    return false;
  }

  input.classList.remove("error");
  return true;
}

[loginUsername, loginPassword, regName, regUsername, regEmail, regPassword].forEach(
  (input) => {
    if (input) {
      input.addEventListener("input", () => {
        input.classList.remove("error");
      });
    }
  }
);

if (loginBtn) {
  loginBtn.addEventListener("click", login);
}

if (registerBtn) {
  registerBtn.addEventListener("click", register);
}
