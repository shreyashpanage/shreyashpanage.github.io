const profileName = "shreyashpanage";
const featuredProjects = [
  {
    repository: "Power-BI-HR-Analytics-Dashboard-",
    title: "HR Analytics Dashboard",
    category: "Business intelligence",
    description:
      "A Power BI dashboard for workforce metrics, employee trends, and HR planning.",
  },
  {
    repository: "PowerBI-Customer-risk-Analysis-",
    title: "Customer Risk Analysis",
    category: "Customer analytics",
    description:
      "Explore customer churn patterns and service insights in an ISP analytics dashboard.",
  },
  {
    repository: "Customer-Churn",
    title: "Customer Churn Analysis",
    category: "Business analytics",
    description:
      "Review subscriber behaviour and customer churn indicators for Phone Now.",
  },
  {
    repository: "Power-BI-Call-Centre-",
    title: "Call Centre Dashboard",
    category: "Business intelligence",
    description:
      "Visualize call-centre activity, including monthly calls and average call duration.",
  },
  {
    repository: "Twitter-Tweets-Analysis",
    title: "Twitter Trends Analysis",
    category: "Data analysis",
    description:
      "Analyze global and local Twitter trends, including a We Love The Earth campaign case study.",
  },
  {
    repository: "Bitcoin-Data-Analysis",
    title: "Bitcoin Market Analysis",
    category: "Data analysis",
    description:
      "Explore Bitcoin market capitalization and volatility with cryptocurrency data.",
  },
  {
    repository: "Nobel-Price-Winner",
    title: "Nobel Prize Winners",
    category: "Data analysis",
    description:
      "Explore Nobel laureate demographics, prize categories, and patterns over time.",
  },
  {
    repository: "Covid-19-Data-Analysis-in-Python",
    title: "COVID-19 Data Analysis",
    category: "Python · Data analysis",
    description:
      "Process and visualize pandemic data using Python, pandas, and Plotly.",
  },
  {
    repository: "AWS-Resource-Tracker",
    title: "AWS Resource Tracker",
    category: "AWS · Automation",
    description:
      "A shell-based utility for quickly checking deployed resources in an AWS account.",
  },
  {
    repository: "Final-Year-Project",
    title: "YCCE Placement Portal",
    category: "Full-stack application",
    description:
      "A YCCE training and placement portal for student registration and recruitment updates.",
  },
];

function createProjectCard(project, repository) {
  const card = document.createElement("article");
  card.className = "project-card";

  const top = document.createElement("div");
  top.className = "project-card-top";

  const kind = document.createElement("span");
  kind.className = "project-kind";
  kind.textContent = project.category;

  const number = document.createElement("span");
  number.className = "project-number";
  number.setAttribute("aria-hidden", "true");
  number.textContent = String(featuredProjects.indexOf(project) + 1).padStart(2, "0");
  top.append(kind, number);

  const content = document.createElement("div");
  const title = document.createElement("h3");
  title.textContent = project.title;
  const description = document.createElement("p");
  description.textContent = project.description;
  content.append(title, description);

  const bottom = document.createElement("div");
  bottom.className = "project-card-bottom";
  const repositoryName = document.createElement("span");
  repositoryName.className = "project-language";
  repositoryName.textContent = repository?.language || project.repository;

  const link = document.createElement("a");
  link.className = "project-button";
  link.href = `https://github.com/${profileName}/${project.repository}`;
  link.target = "_blank";
  link.rel = "noopener noreferrer";
  link.setAttribute("aria-label", `View ${project.title} repository on GitHub`);
  link.append(document.createTextNode("View project "));
  const arrow = document.createElement("span");
  arrow.setAttribute("aria-hidden", "true");
  arrow.textContent = "↗";
  link.append(arrow);

  bottom.append(repositoryName, link);
  card.append(top, content, bottom);
  return card;
}

function isProfileRepository(repository, expectedName) {
  if (
    !repository ||
    repository.name.toLowerCase() !== expectedName.toLowerCase() ||
    repository.owner?.login?.toLowerCase() !== profileName
  ) {
    return false;
  }

  try {
    const url = new URL(repository.html_url);
    return (
      url.protocol === "https:" &&
      url.hostname === "github.com" &&
      url.pathname.toLowerCase() === `/${profileName}/${expectedName.toLowerCase()}`
    );
  } catch {
    return false;
  }
}

async function loadProjects() {
  const grid = document.querySelector("#project-grid");
  const projects = new Map(
    featuredProjects.map((project) => [project.repository.toLowerCase(), project]),
  );
  grid.replaceChildren(...featuredProjects.map((project) => createProjectCard(project)));

  try {
    const response = await fetch(
      `https://api.github.com/users/${profileName}/repos?sort=updated&per_page=100`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!response.ok) {
      throw new Error(`GitHub returned ${response.status}`);
    }

    const repositories = await response.json();
    if (!Array.isArray(repositories)) {
      throw new Error("GitHub returned an unexpected repository list");
    }

    for (const repository of repositories) {
      const project = projects.get(repository?.name?.toLowerCase());
      if (!project || !isProfileRepository(repository, project.repository)) {
        continue;
      }

      const cardIndex = featuredProjects.indexOf(project);
      const oldCard = grid.children[cardIndex];
      grid.replaceChild(createProjectCard(project, repository), oldCard);
    }
  } catch (error) {
    const status = document.createElement("p");
    status.className = "project-status";
    status.textContent =
      "Live repository details are unavailable right now. Project links remain available.";
    grid.prepend(status);
    console.error("Could not load GitHub repository details.", error);
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
