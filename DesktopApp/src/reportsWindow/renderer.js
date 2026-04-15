window.onload = () => {

  const params = new URLSearchParams(window.location.search);
  const name = params.get("name");

  // ===== USER =====
  const usernameEl = document.getElementById("username");
  if (name && usernameEl) usernameEl.textContent = name;

  // ===== NAV =====
  function goTo(page) {
    window.location.href = `../${page}/index.html?name=${name || ""}`;
  }

  document.getElementById("goStaff")?.addEventListener("click", () => goTo("StaffWindow"));
  document.getElementById("goRooms")?.addEventListener("click", () => goTo("RoomsWindow"));
  document.getElementById("goReports")?.addEventListener("click", () => goTo("reportsWindow"));

  function goToProfile() {
    window.location.href = `../profileWindow/index.html?name=${name || ""}`;
  }

  document.querySelector(".avatar")?.addEventListener("click", goToProfile);
  usernameEl?.addEventListener("click", goToProfile);

  // ===== FILTERS =====
  function getFilters() {
    const start = document.getElementById("startDate")?.value || "";
    const end = document.getElementById("endDate")?.value || "";

    return { start_date: start, end_date: end };
  }

  // ===== VALIDATION (КАК У ГОСТЕЙ) =====
  function validateDates(start, end) {
    const errors = [];

    if (!start) {
      errors.push("Выберите дату начала");
    }

    if (!end) {
      errors.push("Выберите дату конца");
    }

    if (start && end && new Date(start) > new Date(end)) {
      errors.push("Дата начала не может быть больше даты конца");
    }

    return errors;
  }

  // ===== UI =====
  function showResult(title, data) {
    const el = document.getElementById("reportResult");

    el.style.display = "block";
    el.innerHTML = `
      <h3>📊 ${title}</h3>
      <pre style="white-space: pre-wrap;">${JSON.stringify(data, null, 2)}</pre>
    `;
  }

  function showError(message) {
    const el = document.getElementById("reportResult");

    el.style.display = "block";
    el.innerHTML = `
      <h3 style="color:red;">❌ Ошибка</h3>
      <pre>${message}</pre>
    `;
  }

  // ===== BUTTON STATE CONTROL =====
  function isDatesValid() {
    const { start_date, end_date } = getFilters();
    return validateDates(start_date, end_date).length === 0;
  }

  function updateButtonsState() {
    const btns = document.querySelectorAll(".btn.small, .generate-all");
    const valid = isDatesValid();

    btns.forEach(btn => {
      btn.disabled = !valid;
      btn.style.opacity = valid ? "1" : "0.5";
      btn.style.cursor = valid ? "pointer" : "not-allowed";
    });
  }

  document.getElementById("startDate")?.addEventListener("change", updateButtonsState);
  document.getElementById("endDate")?.addEventListener("change", updateButtonsState);

  updateButtonsState();

  // ===== DOWNLOAD PDF =====
  function downloadPDF(blob, filename) {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    a.remove();
    window.URL.revokeObjectURL(url);
  }

  // ===== MAIN API CALL =====
  async function callReport(type, filters) {
    const query = new URLSearchParams(filters).toString();
    const endpoint = `/reports/${type}${query ? `?${query}` : ""}`;

    return await window.electronAPI.apiRequest(endpoint, "GET", null, null, "blob");
  }

  // ===== GENERATE REPORT =====
  async function generateReport(type) {
    try {
      const { start_date, end_date } = getFilters();

      const errors = validateDates(start_date, end_date);

      if (errors.length) {
        showError(errors[0]);
        return;
      }

      const blob = await callReport(type, { start_date, end_date });

      downloadPDF(blob, `report-${type}.pdf`);

      showResult(`Отчёт`, `PDF скачан`);

    } catch (err) {
      console.error(err);
      showError(err.message || "Ошибка генерации отчета");
    }
  }

  window.generateReport = generateReport;

  // ===== GENERATE ALL =====
  document.querySelector(".generate-all")?.addEventListener("click", async () => {
    try {
      const { start_date, end_date } = getFilters();

      const errors = validateDates(start_date, end_date);

      if (errors.length) {
        showError(errors[0]);
        return;
      }

      const [rooms, employees, services] = await Promise.all([
        callReport("rooms", { start_date, end_date }),
        callReport("employees", { start_date, end_date }),
        callReport("services", { start_date, end_date })
      ]);

      downloadPDF(rooms, "report-rooms.pdf");
      downloadPDF(employees, "report-employees.pdf");
      downloadPDF(services, "report-services.pdf");

      showResult("Все отчеты", {
        status: "PDF файлы скачаны"
      });

    } catch (err) {
      console.error(err);
      showError(err.message || "Ошибка генерации отчетов");
    }
  });

};
