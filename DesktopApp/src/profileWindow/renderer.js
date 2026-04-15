import { ProfileAPI } from "../api/profile.js";

window.onload = async () => {

  const usernameEl = document.getElementById("username");

  let user = null;
  let isEditMode = false;

  // ===== PHONE NORMALIZER =====
  function normalizePhone(phone) {
    if (!phone) return "";

    let cleaned = phone
      .replace(/[^\d+]/g, "")
      .replace(/^8/, "+7");

    if (cleaned.startsWith("7") && !cleaned.startsWith("+7")) {
      cleaned = "+7" + cleaned.slice(1);
    }

    const match = cleaned.match(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/);

    if (!match) return cleaned;

    return `+7-${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
  }

  // ===== VALIDATION =====
  function validateProfile(data) {
    const errors = [];

    if (!data.first_name || data.first_name.trim().length < 2) {
      errors.push("Имя должно быть минимум 2 символа");
    }

    if (!data.last_name || data.last_name.trim().length < 2) {
      errors.push("Фамилия должна быть минимум 2 символа");
    }

    if (data.email && !/^\S+@\S+\.\S+$/.test(data.email)) {
      errors.push("Некорректный email");
    }

    if (data.phone) {
      const digits = data.phone.replace(/[^\d]/g, "");

      if (digits.length !== 11 || !digits.startsWith("7")) {
        errors.push("Телефон должен быть в формате +7-XXX-XXX-XX-XX");
      }
    }

    if (data.passport_series && data.passport_series.length > 4) {
      errors.push("Серия паспорта максимум 4 символа");
    }

    if (data.passport_number && data.passport_number.length > 6) {
      errors.push("Номер паспорта максимум 6 символов");
    }

    return errors;
  }

  // ===== LOGOUT MODAL =====
  function showLogoutModal() {
    const modal = document.createElement("div");

    modal.innerHTML = `
      <div class="logout-backdrop">
        <div class="logout-box">
          <h3>Выйти из системы?</h3>

          <button id="logoutAccount">Выйти из аккаунта</button>
          <button id="logoutApp">Выйти из приложения</button>
          <button id="cancelLogout">Отмена</button>
        </div>
      </div>
    `;

    Object.assign(modal.style, {
      position: "fixed",
      inset: "0",
      zIndex: "9999"
    });

    document.body.appendChild(modal);

    document.getElementById("cancelLogout").onclick = () => modal.remove();

    document.getElementById("logoutAccount").onclick = () => {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      window.location.href = "../loginWindow/index.html";
    };

    document.getElementById("logoutApp").onclick = () => {
      modal.remove();

      if (window?.electronAPI?.quitApp) {
        window.electronAPI.quitApp();
      } else {
        window.close();
      }
    };
  }

  // ===== LOAD PROFILE =====
  async function loadProfile() {
    try {
      user = await ProfileAPI.getProfile();

      if (usernameEl) {
        usernameEl.textContent =
          `${user.first_name || ""} ${user.last_name || ""}`;
      }

      renderProfile();

    } catch (err) {
      console.error("PROFILE LOAD ERROR:", err);
      document.getElementById("profileContainer").innerHTML =
        `<p style="color:red;">Ошибка загрузки профиля</p>`;
    }
  }

  // ===== NAV =====
  function goTo(page) {
    window.location.href = `../${page}/index.html`;
  }

  document.getElementById("goStaff")?.addEventListener("click", () => goTo("StaffWindow"));
  document.getElementById("goRooms")?.addEventListener("click", () => goTo("RoomsWindow"));
  document.getElementById("goReports")?.addEventListener("click", () => goTo("reportsWindow"));

  // ===== FIELD =====
  function field(label, key, value) {
    return `
      <div class="detail-field">
        <label>${label}</label>
        <input
          data-key="${key}"
          value="${value || ""}"
          ${isEditMode ? "" : "disabled"}
        />
      </div>
    `;
  }

  // ===== RENDER =====
  function renderProfile() {
    const container = document.getElementById("profileContainer");

    container.innerHTML = `
      <div class="detail-card">

        <div class="detail-header">
          <div class="breadcrumbs">
            <span id="backBtn">← Назад</span>
            <span class="divider">/</span>
            <span>Профиль</span>
          </div>
        </div>

        <h2>${user.first_name || ""} ${user.last_name || ""}</h2>

        <div class="employee-subtitle">
          ${user.email || ""} · ID ${user.id}
        </div>

        <div class="detail-grid">
          ${field("Имя", "first_name", user.first_name)}
          ${field("Фамилия", "last_name", user.last_name)}
          ${field("Отчество", "patronymic", user.patronymic)}
          ${field("Email", "email", user.email)}
          ${field("Телефон", "phone", user.phone)}
          ${field("Паспорт серия", "passport_series", user.passport_series)}
          ${field("Паспорт номер", "passport_number", user.passport_number)}
        </div>

        <button id="editBtn">
          ${isEditMode ? "Сохранить" : "Редактировать"}
        </button>

        <button id="logoutBtn">
  Выйти
</button>


      </div>
    `;

    // back
    document.getElementById("backBtn").onclick = () => window.history.back();

    // logout
    document.getElementById("logoutBtn").onclick = showLogoutModal;

    // ===== EDIT / SAVE =====
    document.getElementById("editBtn").onclick = async () => {

      const inputs = document.querySelectorAll("input");

      // ENTER EDIT MODE
      if (!isEditMode) {
        isEditMode = true;

        inputs.forEach(i => i.disabled = false);
        document.getElementById("editBtn").textContent = "Сохранить";
        return;
      }

      // BUILD PAYLOAD
      const updated = {};

      inputs.forEach(input => {
        if (!input.dataset.key) return;
        updated[input.dataset.key] = input.value.trim();
      });

      Object.keys(user).forEach(key => {
        if (updated[key] === undefined) {
          updated[key] = user[key];
        }
      });

      updated.phone = normalizePhone(updated.phone);

      const errors = validateProfile(updated);

      if (errors.length) {
        showError(errors[0]);
        return;
      }

      try {
        await ProfileAPI.updateProfile(updated);

        // FIX: always refetch full profile
        user = await ProfileAPI.getProfile();

        isEditMode = false;
        renderProfile();

      } catch (err) {
        console.error(err);
        showError(parseApiError(err));
      }
    };
  }

  // ===== ERROR PARSER =====
  function parseApiError(err) {
    let msg = "Ошибка сохранения профиля";

    try {
      const parsed = JSON.parse(err.message);

      if (Array.isArray(parsed.detail)) {
        msg = parsed.detail.map(d => {
          if (d.loc?.includes("phone")) {
            return "Телефон должен быть в формате +7-XXX-XXX-XX-XX";
          }
          return d.msg;
        }).join(", ");
      } else if (parsed.detail) {
        msg = parsed.detail;
      }

    } catch {}

    return msg;
  }

  // ===== ERROR UI =====
  function showError(message) {
    const container = document.getElementById("profileContainer");

    const el = document.createElement("div");
    el.style.color = "red";
    el.style.marginTop = "10px";
    el.textContent = `❌ ${message}`;

    container.prepend(el);

    setTimeout(() => el.remove(), 3000);
  }

  // ===== INIT =====
  await loadProfile();
};
