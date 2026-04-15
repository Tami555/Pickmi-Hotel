window.onload = () => {

  const params = new URLSearchParams(window.location.search);
  const name = params.get('name');

  const usernameEl = document.getElementById('username');
  const welcomeEl = document.getElementById('welcomeText');

  if (name && usernameEl && welcomeEl) {
    usernameEl.textContent = name;
    welcomeEl.textContent = `${name} Admin`;
  }

  // ===== НАВИГАЦИЯ =====

  function goTo(page) {
    window.location.href = `../${page}/index.html?name=${name || ''}`;
  }

  function goToStaff() {
    goTo("StaffWindow");
  }

  function goToRooms() {
    console.log("Переход в RoomsWindow"); // для проверки
    goTo("RoomsWindow");
  }

  function goToReports() {
    goTo("reportsWindow");
  }

  function goToProfile(name) {
    window.location.href = `../profileWindow/index.html?name=${name || ''}`;
  }

  // ===== КНОПКИ =====

  document.getElementById("btnStaff")?.addEventListener("click", goToStaff);
  document.getElementById("btnRooms")?.addEventListener("click", goToRooms);
  document.getElementById("btnReports")?.addEventListener("click", goToReports);

  // ===== SIDEBAR =====

  document.getElementById("goStaff")?.addEventListener("click", goToStaff);
  document.getElementById("goRooms")?.addEventListener("click", goToRooms);
  document.getElementById("goReports")?.addEventListener("click", goToReports);

  // ===== ПРОФИЛЬ =====

  const profileName = document.getElementById("username");
  const avatar = document.querySelector(".avatar");

  if (profileName) {
    profileName.onclick = () => goToProfile(profileName.textContent);
  }

  if (avatar) {
    avatar.onclick = () => goToProfile(profileName.textContent);
  }

};
