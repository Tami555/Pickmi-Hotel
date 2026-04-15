import {
  getEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  getEmployeeTasks
} from '../api/employees.js';

// ================= OPTIONS =================
const STATUS_OPTIONS = [
  { value: "active", label: "Работает" },
  { value: "on_leave", label: "В отпуске" },
  { value: "probation", label: "Испытательный срок" },
  { value: "fired", label: "Уволен" }
];

const POSITION_OPTIONS = [
  { value: 1, label: "Горничная" },
  { value: 2, label: "Сантехник" },
  { value: 3, label: "Менеджер" },
  { value: 4, label: "Официант" }
];

// ================= PHONE =================
function normalizePhoneForInput(phone) {
  if (!phone) return "";
  return phone.replace(/^tel:/, "").replace(/[^\d+]/g, "");
}

function normalizePhoneForApi(phone) {
  if (!phone) return "";
  phone = phone.replace(/[^\d+]/g, "");

  if (!phone.startsWith("+7")) {
    throw new Error("Телефон должен начинаться с +7");
  }

  return `tel:${phone}`;
}

// ================= VALIDATION =================
function validateField(key, value) {
  value = (value || "").trim();

  switch (key) {
    case "first_name":
    case "last_name":
    case "patronymic":
      if (!value) throw new Error("ФИО обязательно");
      if (!/^[A-Za-zА-Яа-яЁё]+$/.test(value)) {
        throw new Error("ФИО должно содержать только буквы");
      }
      break;

    case "password":
      if (!value) throw new Error("Пароль обязателен");
      if (value.length < 8) {
        throw new Error("Пароль минимум 8 символов");
      }
      break;

    case "phone":
      if (!value) throw new Error("Телефон обязателен");
      const cleaned = value.replace(/^tel:/, "");
      if (!/^\+7\d{10}$/.test(cleaned)) {
        throw new Error("Телефон должен быть в формате +79999999999");
      }
      break;

    case "email":
      if (!value) throw new Error("Email обязателен");
      if (!/^\S+@\S+\.\S+$/.test(value)) {
        throw new Error("Некорректный email");
      }
      break;

    case "bank_account":
      if (!value) throw new Error("Банковский счёт обязателен");
      if (!/^\d{20}$/.test(value)) {
        throw new Error("Банковский счёт — 20 цифр");
      }
      break;

    case "salary":
    case "advance":
      if (!value) throw new Error("Введите число");
      if (!/^\d+$/.test(value)) {
        throw new Error("Должно быть числом");
      }
      break;

    case "passport_series":
      if (value && !/^\d{4}$/.test(value)) {
        throw new Error("Серия паспорта — 4 цифры");
      }
      break;

    case "passport_number":
      if (value && !/^\d{6}$/.test(value)) {
        throw new Error("Номер паспорта — 6 цифр");
      }
      break;
  }
}

function showFieldError(input, message) {
  input.style.border = "1px solid red";
  input.title = message;
}

function clearFieldError(input) {
  input.style.border = "";
  input.title = "";
}

// ================= HELPERS =================
function getStatusLabel(status) {
  return {
    active: "Работает",
    on_leave: "В отпуске",
    probation: "Испытательный срок",
    fired: "Уволен"
  }[status] || status;
}

function formatDate(date) {
  return new Date(date).toLocaleString('ru-RU');
}

// ================= MAIN =================
window.onload = () => {

  // ===== USER =====
  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');

  const usernameEl = document.getElementById('username');
  const welcomeEl = document.getElementById('welcomeText');

  if (name && usernameEl && welcomeEl) {
    usernameEl.textContent = name;
    welcomeEl.textContent = `${name} Admin`;
  }

  // ===== NAVIGATION =====
  function goTo(page) {
    window.location.href = `../${page}/index.html?name=${name || ''}`;
  }

  const goToStaff = () => goTo("StaffWindow");
  const goToRooms = () => goTo("RoomsWindow");
  const goToReports = () => goTo("reportsWindow");

  function goToProfile(name) {
    window.location.href = `../profileWindow/index.html?name=${name || ''}`;
  }

  document.getElementById("btnStaff")?.addEventListener("click", goToStaff);
  document.getElementById("btnRooms")?.addEventListener("click", goToRooms);
  document.getElementById("btnReports")?.addEventListener("click", goToReports);

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

  // ===== STAFF LOGIC =====
  let isEditMode = false;

  async function loadStaff() {
    const staff = await getEmployees();
    renderStaff(staff);
  }

  function renderStaff(staff) {
    const container = document.getElementById("staffList");
    container.innerHTML = "";

    staff.forEach(emp => {
      const div = document.createElement("div");
      div.className = "staff-card";

      div.innerHTML = `
        <div class="staff-left">
          <div class="staff-name">
            ${emp.user.first_name} ${emp.user.last_name}
          </div>
          <div class="staff-id">ID: ${emp.id}</div>
        </div>

        <div class="staff-salary">${emp.salary}$</div>
        <div class="staff-role">${emp.position.title}</div>

        <div class="staff-status ${emp.status}">
          ${getStatusLabel(emp.status)}
        </div>
      `;

      div.onclick = async () => {
        const [full, tasks] = await Promise.all([
          getEmployeeById(emp.id),
          getEmployeeTasks(emp.id)
        ]);

        full.id = emp.id;
        isEditMode = false;

        renderStaffDetails(full, tasks);
      };

      container.appendChild(div);
    });
  }

  function renderStaffDetails(emp, tasks = []) {
    const container = document.getElementById("staffList");

    container.innerHTML = `
      <div class="detail-card">
        <button id="backBtn">← Назад</button>

        <h2>${emp.user.first_name} ${emp.user.last_name}</h2>

        <div class="detail-grid">
          ${field("Email", "email", emp.user.email)}
          ${field("Телефон", "phone", normalizePhoneForInput(emp.user.phone))}
          ${field("Отчество", "patronymic", emp.user.patronymic)}
          ${field("Паспорт серия", "passport_series", emp.user.passport_series)}
          ${field("Паспорт номер", "passport_number", emp.user.passport_number)}

          ${selectField("Должность", "position_id", emp.position.id, POSITION_OPTIONS)}
          ${field("Зарплата", "salary", emp.salary)}
          ${field("Аванс", "advance", emp.advance)}
          ${selectField("Статус", "status", emp.status, STATUS_OPTIONS)}
          ${field("Банк счет", "bank_account", emp.bank_account)}
        </div>

        <button id="editBtn">${isEditMode ? "Сохранить" : "Редактировать"}</button>
      </div>
    `;

    document.getElementById("backBtn").onclick = loadStaff;

    document.getElementById("editBtn").onclick = async () => {

      if (isEditMode) {
        const inputs = document.querySelectorAll("input, select");

        const user_data = {};
        const employee_data = {};

        try {
          for (let el of inputs) {
            const key = el.dataset.key;
            let value = el.value;

            validateField(key, value);
            clearFieldError(el);

            if (key === "phone") {
              value = normalizePhoneForApi(value);
            }

            if (["position_id", "salary", "advance"].includes(key)) {
              value = Number(value);
            }

            if ([
              "first_name","last_name","patronymic","phone","email",
              "passport_series","passport_number"
            ].includes(key)) {
              user_data[key] = value;
            } else {
              employee_data[key] = value;
            }
          }

          if (
            employee_data.salary !== undefined &&
            employee_data.advance !== undefined &&
            employee_data.advance > employee_data.salary
          ) {
            throw new Error("Аванс не может быть больше зарплаты");
          }

          await updateEmployee(emp.id, { user_data, employee_data });

          isEditMode = false;
          await loadStaff();

        } catch (e) {
          console.error(e);
          alert(e.message || "Ошибка обновления");
        }

        return;
      }

      isEditMode = true;
      renderStaffDetails(emp, tasks);
    };
  }

  function renderAddEmployee() {
    const container = document.getElementById("staffList");

    container.innerHTML = `
      <div class="detail-card">
        <h2>Добавление сотрудника</h2>

        <div class="detail-grid">
          ${field("Email", "email", "")}
          ${field("Пароль", "password", "")}
          ${field("Имя", "first_name", "")}
          ${field("Фамилия", "last_name", "")}
          ${field("Отчество", "patronymic", "")}
          ${field("Телефон", "phone", "")}
          ${field("Серия паспорта", "passport_series", "")}
          ${field("Номер паспорта", "passport_number", "")}

          ${selectField("Должность", "position_id", "", POSITION_OPTIONS)}
          ${field("Зарплата", "salary", "")}
          ${field("Аванс", "advance", "")}
          ${field("Банк счет", "bank_account", "")}
          ${field("Выходные", "weekends", "")}
        </div>

        <button id="createBtn">Создать</button>
      </div>
    `;

    document.getElementById("createBtn").onclick = async () => {
      const inputs = document.querySelectorAll("input, select");

      const user = {};
      const employee = {};

      try {
        for (let el of inputs) {
          const key = el.dataset.key;
          let value = el.value.trim();

          validateField(key, value);

          if (key === "phone") {
            value = normalizePhoneForApi(value);
          }

          if ([
            "email","password","first_name","last_name",
            "patronymic","phone","passport_series","passport_number"
          ].includes(key)) {
            user[key] = value;
          } else {
            if (["position_id","salary","advance"].includes(key)) {
              employee[key] = Number(value);
            } else if (key === "weekends") {
              employee[key] = value
                ? value.split(',').map(v => Number(v.trim())).filter(v => !isNaN(v))
                : [];
            } else {
              employee[key] = value;
            }
          }
        }

        if (
          employee.salary !== undefined &&
          employee.advance !== undefined &&
          employee.advance > employee.salary
        ) {
          throw new Error("Аванс не может быть больше зарплаты");
        }

        await createEmployee({ user, employee });

        alert("Создано 🎉");
        loadStaff();

      } catch (e) {
        console.error(e);
        alert(e.message || "Ошибка создания");
      }
    };
  }

  function field(label, key, value) {
    return `
      <div class="detail-field">
        <label>${label}</label>
        <input data-key="${key}" value="${value ?? ""}" />
      </div>
    `;
  }

  function selectField(label, key, value, options) {
    return `
      <div class="detail-field">
        <label>${label}</label>
        <div class="select-wrapper">
          <select data-key="${key}" class="custom-select">
            ${options.map(opt => `
              <option value="${opt.value}" ${opt.value == value ? "selected" : ""}>
                ${opt.label}
              </option>
            `).join("")}
          </select>
        </div>
      </div>
    `;
  }

  loadStaff();
  document.querySelector(".add-staff")?.addEventListener("click", renderAddEmployee);
};