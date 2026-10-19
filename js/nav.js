const burger = document.getElementById("burger");
const nav = document.getElementById("nav");
const links = document.querySelectorAll("nav a");
const overlay = document.getElementById("overlay");

burger.addEventListener("click", () => {
  burger.classList.toggle("active");
  nav.classList.toggle("active");
  overlay.classList.toggle("active");
});

function closeMenu() {
  burger.classList.remove("active");
  nav.classList.remove("active");
  overlay.classList.remove("active");
}

// закриття при кліку на пункт
document.querySelectorAll("nav a").forEach((link) => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// 🔥 закриття при зміні розміру екрану
window.addEventListener("resize", () => {
  closeMenu();
});

// 🔥 закриття по кліку за межами меню
overlay.addEventListener("click", closeMenu);

// 🔥 закриття Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    closeMenu();
  }
});
