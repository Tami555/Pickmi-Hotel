import {
  getGuests,
  getGuestById,
  getGuestReservations,
  getGuestTasks,
  cancelReservation,
  updateGuest
} from '../api/guests.js';

// ===== PARAMS =====
const params = new URLSearchParams(window.location.search);
const name = params.get("name");
const guestId = params.get("guestId");

// ===== TOAST =====
function showToast(message, type = "info") {
  const toast = document.createElement("div");

  toast.textContent = message;

  Object.assign(toast.style, {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 18px",
    borderRadius: "12px",
    fontFamily: "SliceMono",
    zIndex: "9999",
    color: "white",
    boxShadow: "0 8px 20px rgba(0,0,0,0.2)",
    transition: "0.3s",
    maxWidth: "340px"
  });

  if (type === "error") toast.style.background = "#D64545";
  else if (type === "success") toast.style.background = "#4CAF50";
  else toast.style.background = "#6A4163";

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => toast.remove(), 300);
  }, 2500);
}

// ===== HELPERS =====
function formatDate(date) {
  return new Date(date).toLocaleString('ru-RU');
}

// ===== PHONE NORMALIZATION =====
function normalizePhone(phone) {
  if (!phone) return "";

  let cleaned = phone
    .replace(/[^\d+]/g, "") // убираем всё кроме цифр и +
    .replace(/^8/, "+7");

  if (cleaned.startsWith("7") && !cleaned.startsWith("+7")) {
    cleaned = "+7" + cleaned.slice(1);
  }

  const match = cleaned.match(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/);

  if (!match) return cleaned;

  return `+7-${match[2]}-${match[3]}-${match[4]}-${match[5]}`;
}

// ===== VALIDATION =====
function validateGuestPayload(data) {
  const errors = [];

  if (!data.first_name || data.first_name.trim().length < 2) {
    errors.push("Имя должно быть минимум 2 символа");
  }

  if (!data.last_name || data.last_name.trim().length < 2) {
    errors.push("Фамилия должна быть минимум 2 символа");
  }

  if (!data.email || !/^\S+@\S+\.\S+$/.test(data.email)) {
    errors.push("Некорректный email");
  }

  // PHONE STRICT VALIDATION
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

// ===== LOAD LIST =====
async function loadGuests() {
  try {
    const guests = await getGuests();
    renderGuestsList(guests);
  } catch (e) {
    console.error(e);
    showToast("❌ Не удалось загрузить гостей", "error");
  }
}

// ===== RENDER LIST =====
function renderGuestsList(guests) {
  const container = document.getElementById("guestContainer");

  container.innerHTML = `
    <div class="staff-header-row">
      <div>ФИО</div>
      <div>Email</div>
      <div>Телефон</div>
      <div>ID</div>
    </div>
  `;

  guests.forEach(g => {
    const div = document.createElement("div");
    div.className = "staff-card";

    div.innerHTML = `
      <div class="staff-left">
        <div class="staff-name">${g.first_name} ${g.last_name}</div>
      </div>

      <div class="staff-salary">${g.email}</div>
      <div class="staff-role">${g.phone || "-"}</div>

      <div class="staff-actions">
        <div class="staff-id">#${g.id}</div>
      </div>
    `;

    div.onclick = () => renderGuestDetailsById(g.id);

    container.appendChild(div);
  });
}

// ===== LOAD DETAILS =====
async function renderGuestDetailsById(id) {
  try {
    const [guest, reservations, tasks] = await Promise.all([
      getGuestById(id),
      getGuestReservations(id),
      getGuestTasks(id)
    ]);

    renderGuestDetails(guest, reservations, tasks);

  } catch (e) {
    console.error(e);
    showToast("❌ Ошибка загрузки данных гостя", "error");
  }
}

// ===== FIELD =====
function field(label, value) {
  return `
    <div class="detail-field">
      <label>${label}</label>
      <input value="${value || ""}" disabled />
    </div>
  `;
}

// ===== RENDER DETAILS =====
function renderGuestDetails(g, reservations, tasks) {
  const container = document.getElementById("guestContainer");

  container.innerHTML = `
    <div class="detail-card">

      <div class="detail-header">
        <div class="breadcrumbs">
          <span id="breadcrumbBack">Гости</span>
          <span class="divider">/</span>
          <span>#${g.id}</span>
        </div>

        <button id="backBtn">← Назад</button>
      </div>

      <h2>${g.first_name} ${g.last_name}</h2>

      <button id="editBtn">Редактировать</button>

      <div class="detail-grid">
        ${field("Имя", g.first_name)}
        ${field("Фамилия", g.last_name)}
        ${field("Email", g.email)}
        ${field("Телефон", g.phone || "")}
        ${field("Паспорт", `${g.passport_series || ""} ${g.passport_number || ""}`)}
      </div>

      <h3 style="margin-top:20px;">Брони</h3>

      <div class="staff-list">
        ${reservations.map(r => `
          <div class="staff-card">
            <div>Номер ${r.room.room_number}</div>
            <div>${formatDate(r.check_in_date)}</div>
            <div>${formatDate(r.check_out_date)}</div>
            <div>${r.total_price}₽</div>
            <div class="res-status">${r.status}</div>

            ${r.status !== 'completed' && r.status !== 'canceled'
              ? `<button class="delete-btn" data-res-id="${r.id}">✖</button>`
              : ''
            }
          </div>
        `).join("")}
      </div>

      <h3 style="margin-top:20px;">Услуги</h3>

      <div class="staff-list">
        ${tasks.map(t => `
          <div class="staff-card">
            <div>${t.service.title}</div>
            <div>${formatDate(t.scheduled_time)}</div>
            <div>${t.service.price}₽</div>
            <div class="task-status">${t.status}</div>
          </div>
        `).join("")}
      </div>

    </div>
  `;

  // ===== BACK =====
  document.getElementById("backBtn").onclick = loadGuests;
  document.getElementById("breadcrumbBack").onclick = loadGuests;

  // ===== CANCEL RESERVATION =====
  document.querySelectorAll('[data-res-id]').forEach(btn => {
    btn.onclick = async (e) => {
      e.stopPropagation();

      const resId = Number(btn.dataset.resId);

      const status = btn.closest(".staff-card")
        .querySelector(".res-status")?.textContent;

      if (status === "completed" || status === "canceled") {
        showToast("❌ Нельзя отменить завершённую бронь", "error");
        return;
      }

      try {
        await cancelReservation(resId);
        showToast("✅ Бронь отменена", "success");
        renderGuestDetailsById(g.id);

      } catch (err) {
        console.error(err);

        let msg = "Ошибка при отмене брони";

        try {
          const parsed = JSON.parse(err.message);

          if (parsed.status === 401) {
            msg = "Нет доступа. Авторизуйтесь заново";
          }

          if (parsed.detail) msg = parsed.detail;
        } catch {}

        showToast(`❌ ${msg}`, "error");
      }
    };
  });

  // ===== EDIT =====
  const editBtn = document.getElementById("editBtn");
  let editMode = false;

  editBtn.onclick = async () => {
    const inputs = document.querySelectorAll(".detail-field input");

    if (!editMode) {
      inputs.forEach(i => {
        i.disabled = false;

        const label = i.previousElementSibling?.textContent;
        if (label === "Телефон") {
          i.placeholder = "+7-XXX-XXX-XX-XX";
        }
      });

      editBtn.textContent = "Сохранить";
      editMode = true;
      return;
    }

    const [first_name, last_name, email, phone, passport] =
      Array.from(inputs).map(i => i.value.trim());

    const parts = (passport || "").split(" ").filter(Boolean);

    const payload = {
      first_name,
      last_name,
      email,
      phone: normalizePhone(phone),
      passport_series: (parts[0] || "").slice(0, 4),
      passport_number: (parts[1] || "").slice(0, 6)
    };

    // ===== FRONT VALIDATION =====
    const errors = validateGuestPayload(payload);

    if (errors.length) {
      showToast(errors[0], "error");
      return;
    }

    try {
      await updateGuest(g.id, payload);
      showToast("✅ Данные сохранены", "success");
      renderGuestDetailsById(g.id);

    } catch (e) {
      console.error(e);

      let msg = "Ошибка при сохранении";

      try {
        const parsed = JSON.parse(e.message);

        if (Array.isArray(parsed.detail)) {
          msg = parsed.detail.map(d => {
            if (d.loc?.includes("phone")) {
              return "Телефон должен быть в формате +7-XXX-XXX-XX-XX";
            }
            return d.msg;
          }).join(", ");
        }
      } catch {}

      showToast(`❌ ${msg}`, "error");
    }
  };
}

// ===== NAVIGATION =====
function goTo(page) {
  window.location.href = `../${page}/index.html?name=${name || ''}`;
}

function goToStaff() { goTo("StaffWindow"); }
function goToRooms() { goTo("RoomsWindow"); }
function goToReports() { goTo("reportsWindow"); }

function goToProfile(name) {
  window.location.href = `../profileWindow/index.html?name=${name || ''}`;
}

// ===== INIT =====
document.addEventListener("DOMContentLoaded", () => {

  const username = document.getElementById("username");
  if (username && name) username.textContent = name;

  document.getElementById("goStaff")?.addEventListener("click", goToStaff);
  document.getElementById("goRooms")?.addEventListener("click", goToRooms);
  document.getElementById("goReports")?.addEventListener("click", goToReports);

  const profileName = document.getElementById("username");
  const avatar = document.querySelector(".avatar");

  if (profileName) {
    profileName.onclick = () => goToProfile(profileName.textContent);
  }

  if (avatar) {
    avatar.onclick = () => goToProfile(profileName.textContent);
  }

  if (guestId) {
    renderGuestDetailsById(guestId);
  } else {
    loadGuests();
  }
});
