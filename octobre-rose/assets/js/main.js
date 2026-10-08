"use strict";

document.documentElement.classList.add("js");

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");

function setMenu(open) {
  menuButton.setAttribute("aria-expanded", String(open));
  navigation.dataset.open = String(open);
  menuButton.querySelector("span").textContent = open ? "Fermer" : "Menu";
}

menuButton.hidden = false;
menuButton.addEventListener("click", () => {
  setMenu(menuButton.getAttribute("aria-expanded") !== "true");
});
navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (
    event.key === "Escape" &&
    menuButton.getAttribute("aria-expanded") === "true"
  ) {
    setMenu(false);
    menuButton.focus();
  }
});
window.addEventListener("resize", () => {
  if (window.innerWidth > 820) setMenu(false);
});

const ageTabs = [...document.querySelectorAll(".age-tabs [role=tab]")];
function selectAgeTab(tab) {
  ageTabs.forEach((item) => {
    const selected = item === tab;
    item.setAttribute("aria-selected", String(selected));
    item.tabIndex = selected ? 0 : -1;
    document.getElementById(item.getAttribute("aria-controls")).hidden =
      !selected;
  });
}
ageTabs.forEach((tab, index) => {
  tab.addEventListener("click", () => selectAgeTab(tab));
  tab.addEventListener("keydown", (event) => {
    let next;
    if (event.key === "ArrowRight") next = (index + 1) % ageTabs.length;
    if (event.key === "ArrowLeft")
      next = (index + ageTabs.length - 1) % ageTabs.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = ageTabs.length - 1;
    if (next === undefined) return;
    event.preventDefault();
    selectAgeTab(ageTabs[next]);
    ageTabs[next].focus();
  });
});

const memo = `OCTOBRE ROSE — MON MÉMO À PARTAGER

S'informer. En parler. Se soutenir.

1. SIGNALER UN CHANGEMENT
Une boule, une modification de la peau, du mamelon ou un écoulement inhabituel mérite un avis médical. Cela ne signifie pas forcément un cancer. À tout âge, n'attendez pas une invitation au dépistage pour consulter en cas de symptôme.

2. FAIRE LE POINT SUR SON SUIVI
En France, le dépistage organisé concerne les femmes de 50 à 74 ans, sans symptôme ni risque particulier, avec une mammographie tous les deux ans. Les antécédents personnels ou familiaux peuvent nécessiter un autre suivi. Avant 50 ans et après 74 ans, parlez de votre situation avec un professionnel.

3. POSER SES QUESTIONS
Demandez comment se déroule l'examen, quels sont ses bénéfices et ses limites, et comment comprendre les résultats.

4. SOUTENIR, SANS IMPOSER
Une écoute, une aide concrète ou une présence : demandez à la personne ce qui lui ferait du bien et respectez son rythme.

SOURCES DE CONFIANCE
Assurance Maladie : https://www.ameli.fr/assure/sante/themes/cancer-sein
Institut national du cancer : https://www.cancer.fr/
Ligue contre le cancer : https://www.ligue-cancer.net/

Ce mémo apporte des informations générales. Il ne remplace pas un avis médical adapté à votre situation.
Projet indépendant : https://nzox973.github.io/octobre-rose/
`;

const memoButton = document.querySelector("#download-memo");
memoButton.hidden = false;
memoButton.addEventListener("click", () => {
  const url = URL.createObjectURL(
    new Blob([memo], { type: "text/plain;charset=utf-8" }),
  );
  const link = document.createElement("a");
  link.href = url;
  link.download = "octobre-rose-memo.txt";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  document.querySelector("#download-status").textContent =
    "Votre mémo a été téléchargé. Un petit geste à partager !";
});

const aboutButton = document.querySelector("#about-button");
const aboutDialog = document.querySelector("#about-dialog");
if (typeof aboutDialog.showModal === "function") {
  aboutButton.hidden = false;
  aboutButton.addEventListener("click", () => {
    aboutDialog.showModal();
    document.body.classList.add("dialog-open");
  });
  aboutDialog
    .querySelector(".dialog-close")
    .addEventListener("click", () => aboutDialog.close());
  aboutDialog.addEventListener("close", () =>
    document.body.classList.remove("dialog-open"),
  );
  aboutDialog.addEventListener("keydown", (event) => {
    if (event.key !== "Tab") return;

    const controls = [
      ...aboutDialog.querySelectorAll("button, a[href], [tabindex]"),
    ].filter(
      (control) =>
        !control.disabled &&
        control.tabIndex >= 0 &&
        control.getClientRects().length > 0,
    );
    const first = controls[0];
    const last = controls[controls.length - 1];
    if (!first || !last) return;

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  aboutDialog.addEventListener("click", (event) => {
    if (event.target !== aboutDialog) return;
    const rect = aboutDialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      aboutDialog.close();
  });
}

document.querySelector("#current-year").textContent = String(
  new Date().getFullYear(),
);
