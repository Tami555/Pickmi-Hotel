import { login } from '../api/auth.js';

const loginBtn = document.getElementById('loginBtn');
const loginModal = document.getElementById('loginModal');
const successModal = document.getElementById('successModal');
const submitLogin = document.getElementById('submitLogin');

const errorText = document.getElementById('errorText');

const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

// ===== EMAIL VALIDATION =====
function isValidEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email);
}

// ===== OPEN MODAL =====
loginBtn.addEventListener('click', () => {
  successModal.classList.add('hidden');
  loginModal.classList.remove('hidden');

  errorText.style.display = 'none';

  emailInput.value = "";
  passwordInput.value = "";
  submitLogin.disabled = true;

  emailInput.focus();
});

// ===== FORM VALIDATION =====
function validateForm() {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  let isValid = true;
  let message = "";

  // EMAIL CHECK
  if (!email) {
    isValid = false;
    message = "Введите email";
  } else if (!isValidEmail(email)) {
    isValid = false;
    message = "Некорректный email";
  }

  // PASSWORD CHECK
  else if (!password) {
    isValid = false;
    message = "Введите пароль";
  } else if (password.length < 4) {
    isValid = false;
    message = "Пароль слишком короткий";
  }

  errorText.textContent = message;
  errorText.style.display = isValid ? "none" : "block";

  submitLogin.disabled = !isValid;

  return isValid;
}

// ===== LIVE VALIDATION =====
emailInput.addEventListener('input', validateForm);
passwordInput.addEventListener('input', validateForm);

// ===== LOGIN =====
submitLogin.addEventListener('click', async () => {
  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  errorText.style.display = 'none';

  // FINAL CHECK (не доверяем UI)
  if (!validateForm()) {
    if (!email) emailInput.focus();
    else passwordInput.focus();
    return;
  }

  try {
    const data = await login(email, password);

    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('refresh_token', data.refresh_token);

    loginModal.classList.add('hidden');
    successModal.classList.remove('hidden');

    setTimeout(() => {
      window.location = `../mainWindow/index.html`;
    }, 1500);

  } catch (e) {
    console.error(e);

    errorText.textContent = "Неверный email или пароль";
    errorText.style.display = 'block';

    passwordInput.value = "";
    passwordInput.focus();

    submitLogin.disabled = true;
  }
});
