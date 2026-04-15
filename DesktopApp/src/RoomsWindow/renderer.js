import { RoomsAPI } from "../api/rooms.js";

window.onload = async () => {

  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');

  // ===== USER =====
  const username = document.getElementById('username');
  if (name && username) username.textContent = name;

  function goTo(page) {
    window.location.href = `../${page}/index.html?name=${name || ''}`;
  }

  document.getElementById("goStaff")?.addEventListener("click", () => goTo("StaffWindow"));
  document.getElementById("goRooms")?.addEventListener("click", () => goTo("RoomsWindow"));
  document.getElementById("goReports")?.addEventListener("click", () => goTo("reportsWindow"));
  document.getElementById("goGuests")?.addEventListener("click", () => goTo("GuestsWindow"));

  const avatar = document.querySelector(".avatar");

  function goToProfile() {
    window.location.href = `../profileWindow/index.html?name=${name || ''}`;
  }

  username.onclick = goToProfile;
  avatar.onclick = goToProfile;

  // ===== STATE =====
  let roomTypes = [];
  let currentType = null;
  let currentData = null;

  // ===== LOAD ROOM TYPES =====
  async function loadRoomTypes() {
    try {
      roomTypes = await RoomsAPI.getRoomTypes();

      if (!roomTypes.length) {
        console.warn("Нет типов номеров");
        return;
      }

      currentType = roomTypes[0].slug;

      renderTabs();
      await loadRoomsByType(currentType);

    } catch (err) {
      console.error("ROOM TYPES ERROR:", err);
    }
  }

  // ===== LOAD ROOMS =====
  async function loadRoomsByType(slug) {
    try {
      currentData = await RoomsAPI.getRoomsByType(slug);

      if (!currentData) {
        console.warn("Нет данных по номерам");
        return;
      }

      updateOccupancy();
      renderRooms();

    } catch (err) {
      console.error("ROOMS ERROR:", err);
    }
  }

  // ===== TABS =====
  const tabsContainer = document.getElementById("tabs");

  function renderTabs() {
    tabsContainer.innerHTML = "";

    roomTypes.forEach(type => {
      const tab = document.createElement("div");
      tab.className = "tab";
      tab.textContent = type.title;

      if (type.slug === currentType) {
        tab.classList.add("active");
      }

      tab.onclick = async () => {
        currentType = type.slug;
        updateTabsUI();
        await loadRoomsByType(type.slug);
      };

      tabsContainer.appendChild(tab);
    });
  }

  function updateTabsUI() {
    document.querySelectorAll(".tab").forEach(tab => {
      tab.classList.remove("active");

      const active = roomTypes.find(t => t.slug === currentType);

      if (tab.textContent === active?.title) {
        tab.classList.add("active");
      }
    });
  }

  // ===== OCCUPANCY =====
  function updateOccupancy() {
    if (!currentData) return;

    const percent = currentData.percentage_occupied || 0;

    const circle = document.getElementById("occupancyCircle");
    const text = document.getElementById("occupancyText");

    text.textContent = percent + "%";

    let color = "#4CAF50";
    if (percent > 50) color = "#FFC107";
    if (percent > 80) color = "#F44336";

    circle.style.background = `conic-gradient(${color} ${percent}%, #eee 0%)`;
  }

  // ===== TABLE =====
  function renderRooms() {
    const tbody = document.getElementById("roomsTable");
    tbody.innerHTML = "";

    if (!currentData || !currentData.rooms) return;

    const search = document.getElementById("searchInput")?.value.toLowerCase() || "";
    const occ = document.getElementById("filterOccupancy")?.value;
    const places = document.getElementById("filterPlaces")?.value;

    let rooms = [...currentData.rooms];

    // SEARCH
    rooms = rooms.filter(r =>
      r.room_number.toLowerCase().includes(search) ||
      (r.current_guest &&
        `${r.current_guest.first_name} ${r.current_guest.last_name}`
          .toLowerCase()
          .includes(search))
    );

    // OCCUPANCY
    if (occ === "free") rooms = rooms.filter(r => !r.is_occupied);
    if (occ === "busy") rooms = rooms.filter(r => r.is_occupied);

    // PLACES
    if (places !== "all") {
      if (places === "3") {
        rooms = rooms.filter(r => r.quantity_places >= 3);
      } else {
        rooms = rooms.filter(r => r.quantity_places == places);
      }
    }

    // RENDER
    rooms.forEach(r => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>${r.room_number}</td>
        <td>${r.floor}</td>
        <td>${r.quantity_places}</td>

        <td>
          ${r.is_occupied
            ? `<span class="occupied">Заселен</span>`
            : "Свободен"}
        </td>

        <td>
          ${r.current_guest
            ? `<span class="guest-link" data-id="${r.current_guest.id}">
                ${r.current_guest.first_name}
              </span>`
            : "-"}
        </td>

        <td>${r.days_occupied ?? "-"}</td>
      `;

      tbody.appendChild(tr);
    });

    // CLICK ON GUEST
    document.querySelectorAll(".guest-link").forEach(el => {
      el.onclick = () => {
        window.location.href = `../GuestsWindow/index.html?guestId=${el.dataset.id}`;
      };
    });
  }

  // ===== EVENTS =====
  document.getElementById("searchInput")?.addEventListener("input", renderRooms);
  document.getElementById("filterOccupancy")?.addEventListener("change", renderRooms);
  document.getElementById("filterPlaces")?.addEventListener("change", renderRooms);

  // ===== INIT =====
  await loadRoomTypes();
};