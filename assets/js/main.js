const menuButton = document.querySelector("[data-menu-button]");
const navigation = document.querySelector("[data-navigation]");
const navigationLinks = [...document.querySelectorAll(".navigation a")];
const sections = [...document.querySelectorAll("main section[id]")];

function setMenu(open) {
  if (!menuButton || !navigation) return;

  menuButton.setAttribute("aria-expanded", String(open));
  navigation.dataset.open = String(open);

  const label = menuButton.querySelector(".sr-only");
  if (label) {
    label.textContent = open ? "Fermer le menu" : "Ouvrir le menu";
  }
}

menuButton?.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") !== "true";
  setMenu(open);
});

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 680) setMenu(false);
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;

      navigationLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${visible.target.id}`;
        if (isCurrent) {
          link.setAttribute("aria-current", "true");
        } else {
          link.removeAttribute("aria-current");
        }
      });
    },
    {
      rootMargin: "-20% 0px -65%",
      threshold: [0.05, 0.2, 0.5],
    },
  );

  sections.forEach((section) => observer.observe(section));
}
