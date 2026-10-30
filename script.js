const profileName = "shreyashpanage";
const projectDescriptions = {
  "bitcoin-data-analysis":
    "Explore cryptocurrency market-cap and volatility patterns with a focused analysis of Bitcoin data.",
  "nobel-price-winner":
    "Look at Nobel Prize winners across demographics, categories, and trends over time.",
  "twitter-tweets-analysis":
    "Analyze global and local Twitter trends, including a case study on the We Love The Earth campaign.",
  "covid-19-data-analysis-in-python":
    "Use Python to explore and visualize data trends related to the COVID-19 pandemic.",
  "power-bi-hr-analytics-dashboard-":
    "An HR analytics dashboard exploring workforce metrics and people insights in Power BI.",
};
const featuredProjects = [
  "Twitter-Tweets-Analysis",
  "Bitcoin-Data-Analysis",
  "Nobel-Price-Winner",
  "Covid-19-Data-Analysis-in-Python",
];

function createProjectCard(repository, index) {
  const card = document.createElement("a");
  card.className = "project-card";
  card.href = repository.html_url;
  card.target = "_blank";
  card.rel = "noreferrer";
  card.setAttribute("aria-label", `${repository.name}, view on GitHub`);

  const top = document.createElement("div");
  top.className = "project-card-top";

  const kind = document.createElement("span");
  kind.className = "project-kind";
  kind.textContent = `PROJECT 0${index + 1}`;

  const arrow = document.createElement("span");
  arrow.className = "project-arrow";
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  top.append(kind, arrow);

  const content = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = repository.name.replaceAll("-", " ");
  const description = document.createElement("p");
  description.textContent =
    repository.description ||
    projectDescriptions[repository.name.toLowerCase()] ||
    "A data exploration project from my GitHub portfolio.";
  content.append(title, description);

  const bottom = document.createElement("div");
  bottom.className = "project-card-bottom";
  const language = document.createElement("span");
  language.className = "project-language";
  language.textContent = repository.language || "Data analysis";
  const stars = document.createElement("span");
  stars.className = "project-language";
  stars.textContent = `${repository.stargazers_count} stars`;
  bottom.append(language, stars);

  card.append(top, content, bottom);
  return card;
}

async function loadProjects() {
  const grid = document.querySelector("#project-grid");
  try {
    const response = await fetch(
      `https://api.github.com/users/${profileName}/repos?sort=updated&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const repositories = await response.json();
    const projects = featuredProjects
      .map((name) =>
        repositories.find(
          (repository) => repository.name.toLowerCase() === name.toLowerCase(),
        ),
      )
      .filter(Boolean);

    if (!projects.length) {
      throw new Error("No featured repositories were found on this profile");
    }

    grid.replaceChildren(
      ...projects.map((repository, index) => createProjectCard(repository, index)),
    );
  } catch (error) {
    const status = document.createElement("p");
    status.className = "project-status";
    status.textContent =
      "GitHub projects couldn’t be loaded right now. Browse all repositories on GitHub instead.";
    const link = document.createElement("a");
    link.className = "text-link link-underline";
    link.href = `https://github.com/${profileName}`;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Open GitHub profile ↗";
    grid.replaceChildren(status, link);
    console.error("Could not load GitHub projects.", error);
  }
}

function setupNavigation() {
  const toggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  toggle.addEventListener("click", () => {
    const isOpen = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!isOpen));
    toggle.setAttribute("aria-label", isOpen ? "Open navigation" : "Close navigation");
    navigation.classList.toggle("is-open", !isOpen);
  });

  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      navigation.classList.remove("is-open");
    }
  });
}

function setupPortraitTilt() {
  const card = document.querySelector("[data-tilt]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  if (reducedMotion.matches || !window.matchMedia("(pointer: fine)").matches) {
    return;
  }

  card.addEventListener("pointermove", (event) => {
    const bounds = card.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    card.style.transform = `rotateY(${x * 9}deg) rotateX(${-y * 9}deg) rotate(2deg)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
setupNavigation();
setupPortraitTilt();
loadProjects();
