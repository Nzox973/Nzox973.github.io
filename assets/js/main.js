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

const githubElements = {
  grid: document.querySelector(".telemetry-grid"),
  repos: document.querySelector("[data-github-repos]"),
  followers: document.querySelector("[data-github-followers]"),
  following: document.querySelector("[data-github-following]"),
  events: document.querySelector("[data-github-events]"),
  fallback: document.querySelector("[data-github-fallback]"),
};

const githubEventLabels = {
  PushEvent: "Push",
  CreateEvent: "Création",
  PullRequestEvent: "Pull request",
  IssuesEvent: "Issue",
  WatchEvent: "Étoile",
  ForkEvent: "Fork",
  DeleteEvent: "Suppression",
  ReleaseEvent: "Version",
};

function relativeTime(dateValue) {
  const date = new Date(dateValue);
  const seconds = Math.round((date.getTime() - Date.now()) / 1000);
  const formatter = new Intl.RelativeTimeFormat("fr", { numeric: "auto" });

  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
  const minutes = Math.round(seconds / 60);
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  return formatter.format(Math.round(hours / 24), "day");
}

function renderGithubEvents(events) {
  if (!githubElements.events) return;

  githubElements.events.replaceChildren();
  const publicEvents = events
    .filter((event) => /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(event?.repo?.name || ""))
    .slice(0, 6);

  if (publicEvents.length === 0) {
    const empty = document.createElement("li");
    empty.className = "activity-loading";
    empty.textContent = "Aucun événement public récent.";
    githubElements.events.append(empty);
    return;
  }

  publicEvents.forEach((event) => {
    const item = document.createElement("li");

    const type = document.createElement("span");
    type.className = "activity-type";
    type.textContent = githubEventLabels[event.type] || event.type.replace("Event", "");

    const repository = document.createElement("a");
    repository.className = "activity-repo";
    repository.href = `https://github.com/${event.repo.name}`;
    repository.target = "_blank";
    repository.rel = "noreferrer";
    repository.textContent = event.repo.name;

    const time = document.createElement("time");
    time.className = "activity-time";
    time.dateTime = event.created_at;
    time.textContent = relativeTime(event.created_at);

    item.append(type, repository, time);
    githubElements.events.append(item);
  });
}

function renderGithubTelemetry(user, events) {
  if (githubElements.repos) githubElements.repos.textContent = String(user.public_repos);
  if (githubElements.followers) githubElements.followers.textContent = String(user.followers);
  if (githubElements.following) githubElements.following.textContent = String(user.following);
  if (githubElements.grid) githubElements.grid.dataset.githubStatus = "ok";
  if (githubElements.fallback) githubElements.fallback.hidden = true;
  renderGithubEvents(events);
}

function renderGithubError() {
  [githubElements.repos, githubElements.followers, githubElements.following].forEach((element) => {
    if (element) element.textContent = "—";
  });

  if (githubElements.grid) githubElements.grid.dataset.githubStatus = "error";
  if (githubElements.events) githubElements.events.replaceChildren();
  if (githubElements.fallback) githubElements.fallback.hidden = false;
}

async function requestGithubJson(url, signal) {
  const response = await fetch(url, {
    signal,
    headers: { Accept: "application/vnd.github+json" },
  });

  if (!response.ok) {
    throw new Error(`GitHub API: ${response.status}`);
  }

  return response.json();
}

async function hydrateGithubTelemetry() {
  if (!githubElements.grid) return;

  const cacheKey = "nzox-github-telemetry-v1";

  try {
    const cached = JSON.parse(sessionStorage.getItem(cacheKey) || "null");
    if (cached && Date.now() - cached.savedAt < 5 * 60 * 1000) {
      renderGithubTelemetry(cached.user, cached.events);
      return;
    }
  } catch {
    sessionStorage.removeItem(cacheKey);
  }

  const controller = new AbortController();
  const timeout = window.setTimeout(() => controller.abort(), 8000);

  try {
    const [user, events] = await Promise.all([
      requestGithubJson("https://api.github.com/users/Nzox973", controller.signal),
      requestGithubJson("https://api.github.com/users/Nzox973/events/public?per_page=10", controller.signal),
    ]);

    renderGithubTelemetry(user, events);

    try {
      sessionStorage.setItem(
        cacheKey,
        JSON.stringify({ savedAt: Date.now(), user, events }),
      );
    } catch {
      // Le rendu reste fonctionnel si le stockage de session est désactivé.
    }
  } catch {
    renderGithubError();
  } finally {
    window.clearTimeout(timeout);
  }
}

hydrateGithubTelemetry();
