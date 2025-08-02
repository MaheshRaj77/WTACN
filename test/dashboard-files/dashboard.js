const experiments = [
  // Web Technology Experiments
  {
    id: 1,
    title: "HTML Tags Showcase",
    desc: "Create a comprehensive webpage using HTML that includes all essential tags and semantic elements.",
    category: "Web Technology",
    difficulty: "Beginner",
    estimatedTime: "2-3 hours",
    path: "exp-1/index.html"
  },
  {
    id: 2,
    title: "Styling with CSS",
    desc: "Apply advanced styles to an HTML page using CSS, including animations and responsive design.",
    category: "Web Technology",
    difficulty: "Intermediate",
    estimatedTime: "3-4 hours",
    path: "exp-2/index.html"
  },
  {
    id: 3,
    title: "Client-Side Programming",
    desc: "JavaScript for dates, form validation, and interactive elements (text, radio, checkbox, etc.).",
    category: "Web Technology",
    difficulty: "Intermediate",
    estimatedTime: "4-5 hours",
    path: "exp-3/index.html"
  },
  {
    id: 4,
    title: "Online Applications using PHP",
    desc: "Create dynamic online applications with PHP backend functionality and server-side processing.",
    category: "Web Technology",
    difficulty: "Advanced",
    estimatedTime: "5-6 hours",
    path: "exp-4/index.html"
  },
  {
    id: 5,
    title: "Online Application with Data Access",
    desc: "Develop comprehensive online applications with database integration and data management.",
    category: "Web Technology",
    difficulty: "Advanced",
    estimatedTime: "6-8 hours",
    path: "exp-5/index.html"
  },
  // Computer Networks Experiments
  {
    id: 6,
    title: "LAN Setup and Topology",
    desc: "Establish a Local Area Network and connect multiple LANs using static routing protocols.",
    category: "Computer Networks",
    difficulty: "Intermediate",
    estimatedTime: "3-4 hours",
    path: "exp-6/index.html"
  },
  {
    id: 7,
    title: "RIP and OSPF Redistribution",
    desc: "Analyze network performance when redistributing routes between RIP and OSPF protocols.",
    category: "Computer Networks",
    difficulty: "Advanced",
    estimatedTime: "4-5 hours",
    path: "exp-7/index.html"
  },
  {
    id: 8,
    title: "Network Security Analysis",
    desc: "Assess vulnerabilities and implement comprehensive network security techniques.",
    category: "Computer Networks",
    difficulty: "Advanced",
    estimatedTime: "5-6 hours",
    path: "exp-8/index.html"
  },
  {
    id: 9,
    title: "Traffic Control",
    desc: "Implement traffic flow control mechanisms for network performance optimization.",
    category: "Computer Networks",
    difficulty: "Advanced",
    estimatedTime: "4-5 hours",
    path: "exp-9/index.html"
  },
  {
    id: 10,
    title: "Firewall Configuration",
    desc: "Configure, deploy, and analyze firewall rules in a complex network environment.",
    category: "Computer Networks",
    difficulty: "Expert",
    estimatedTime: "6-7 hours",
    path: "exp-10/index.html"
  },
];

// DOM Elements
const webExpContainer = document.getElementById("web-experiments");
const networkExpContainer = document.getElementById("network-experiments");
const filterSelect = document.getElementById("filter-status");

// Get category-specific icons
function getCategoryIcon(category) {
  switch (category) {
    case "Web Technology":
      return "fas fa-code";
    case "Computer Networks":
      return "fas fa-network-wired";
    default:
      return "fas fa-book";
  }
}

// Get difficulty badge styling
function getDifficultyBadge(difficulty) {
  const badges = {
    "Beginner": { color: "text-green-400", bg: "bg-green-500/20", border: "border-green-500/30" },
    "Intermediate": { color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" },
    "Advanced": { color: "text-purple-400", bg: "bg-purple-500/20", border: "border-purple-500/30" },
    "Expert": { color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" }
  };
  return badges[difficulty] || badges["Beginner"];
}

// Update progress statistics
function updateProgress() {
  const completedCount = experiments.filter(
    (exp) => localStorage.getItem(`exp-${exp.id}`) === "true"
  ).length;

  const percentage = Math.round((completedCount / experiments.length) * 100);

  // Update DOM elements
  document.getElementById("complete-count").textContent = completedCount;
  document.getElementById("incomplete-count").textContent = experiments.length - completedCount;
  document.getElementById("progress-percentage").textContent = `${percentage}%`;
  
  const progressBar = document.getElementById("progress-bar");
  progressBar.style.width = `${percentage}%`;
  
  // Add pulse animation when progress changes
  progressBar.classList.add("animate-pulse-slow");
  setTimeout(() => progressBar.classList.remove("animate-pulse-slow"), 1000);
}

// Create experiment card with completely original design
function createExperimentCard(exp, index) {
  const isDone = localStorage.getItem(`exp-${exp.id}`) === "true";
  const difficultyBadge = getDifficultyBadge(exp.difficulty);
  const categoryColor = exp.category === "Web Technology" ? "cyan" : "purple";

  const card = document.createElement("div");
  card.className = `lab-card ${isDone ? 'completed' : 'pending'} fade-in`;
  card.style.animationDelay = `${index * 0.15}s`;

  card.innerHTML = `
    <!-- Card Border Animation -->
    <div class="card-border ${isDone ? 'completed-border' : 'pending-border'}"></div>
    
    <!-- Main Card Content -->
    <div class="card-content">
      <!-- Lab Number Badge -->
      <div class="lab-number-section">
        <div class="lab-number ${isDone ? 'completed-number' : 'pending-number'}">
          <span class="number-text">${exp.id}</span>
          <div class="number-glow"></div>
        </div>
        <div class="lab-status">
          <div class="status-dot ${isDone ? 'completed-dot' : 'pending-dot'}"></div>
          <span class="status-text">${isDone ? 'DONE' : 'TODO'}</span>
        </div>
      </div>

      <!-- Lab Information -->
      <div class="lab-info">
        <div class="lab-header">
          <h3 class="lab-title">${exp.title}</h3>
          <div class="lab-meta">
            <span class="category-tag ${categoryColor}-category">
              <i class="${getCategoryIcon(exp.category)}"></i>
              ${exp.category}
            </span>
          </div>
        </div>
        
        <p class="lab-description">${exp.desc}</p>
        
        <!-- Lab Details Row -->
        <div class="lab-details">
          <div class="detail-item">
            <i class="fas fa-signal"></i>
            <span class="difficulty-badge ${difficultyBadge.color.replace('text-', '')}">
              ${exp.difficulty}
            </span>
          </div>
          <div class="detail-item">
            <i class="fas fa-stopwatch"></i>
            <span>${exp.estimatedTime}</span>
          </div>
        </div>
      </div>

      <!-- Action Section -->
      <div class="lab-actions">
        <div class="checkbox-wrapper">
          <input type="checkbox" ${isDone ? "checked" : ""} 
                 class="lab-checkbox" id="checkbox-${exp.id}">
          <label for="checkbox-${exp.id}" class="checkbox-label">
            <div class="checkbox-custom">
              <i class="fas fa-check"></i>
            </div>
            <span>Mark Complete</span>
          </label>
        </div>
        
        <a href="${isDone ? exp.path : "#"}" 
           class="lab-button ${isDone ? 'launch-button' : 'locked-button'}" 
           target="_blank">
          <div class="button-content">
            <i class="fas ${isDone ? 'fa-rocket' : 'fa-lock'}"></i>
            <span>${isDone ? "Launch Lab" : "Locked"}</span>
          </div>
          <div class="button-glow"></div>
        </a>
      </div>
    </div>
  `;

  // Add checkbox event listener
  const checkbox = card.querySelector(`#checkbox-${exp.id}`);
  checkbox.addEventListener("change", () => {
    localStorage.setItem(`exp-${exp.id}`, checkbox.checked.toString());
    
    // Add visual feedback
    card.style.transform = "scale(0.95)";
    setTimeout(() => {
      card.style.transform = "";
      loadDashboard();
      updateProgress();
    }, 150);
  });

  return card;
}

// Load and render dashboard
function loadDashboard() {
  console.log("loadDashboard called");
  const filterValue = filterSelect.value;
  console.log("Filter value:", filterValue);
  
  webExpContainer.innerHTML = "";
  networkExpContainer.innerHTML = "";

  // Separate experiments by category
  const webExperiments = experiments.filter(exp => exp.category === "Web Technology");
  const networkExperiments = experiments.filter(exp => exp.category === "Computer Networks");
  
  console.log("Web experiments:", webExperiments.length);
  console.log("Network experiments:", networkExperiments.length);

  // Apply filters
  let filteredWebExps = webExperiments;
  let filteredNetworkExps = networkExperiments;

  if (filterValue === "completed") {
    filteredWebExps = webExperiments.filter(exp => localStorage.getItem(`exp-${exp.id}`) === "true");
    filteredNetworkExps = networkExperiments.filter(exp => localStorage.getItem(`exp-${exp.id}`) === "true");
  } else if (filterValue === "incomplete") {
    filteredWebExps = webExperiments.filter(exp => localStorage.getItem(`exp-${exp.id}`) !== "true");
    filteredNetworkExps = networkExperiments.filter(exp => localStorage.getItem(`exp-${exp.id}`) !== "true");
  }

  // Render experiments with staggered animation
  let cardIndex = 0;
  
  filteredWebExps.forEach((exp) => {
    const card = createExperimentCard(exp, cardIndex++);
    webExpContainer.appendChild(card);
  });

  filteredNetworkExps.forEach((exp) => {
    const card = createExperimentCard(exp, cardIndex++);
    networkExpContainer.appendChild(card);
  });

  updateProgress();
}

// Event listeners
filterSelect.addEventListener("change", loadDashboard);

// Add refresh button functionality
const refreshButton = document.querySelector('button[class*="bg-gradient-to-r from-cyan-500"]');
if (refreshButton) {
  refreshButton.addEventListener("click", () => {
    loadDashboard();
  });
}

// Theme toggle functionality (if implemented)
const themeToggle = document.getElementById("theme-toggle");
if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    // Add theme switching logic here if needed
    console.log("Theme toggle clicked");
  });
}

// Initialize dashboard
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded");
  console.log("Web container:", document.getElementById("web-experiments"));
  console.log("Network container:", document.getElementById("network-experiments"));
  
  // Add loading animation
  setTimeout(() => {
    console.log("Loading dashboard...");
    loadDashboard();
    
    // Add entrance animations
    document.querySelectorAll('.fade-in').forEach((el, index) => {
      el.style.animationDelay = `${index * 0.1}s`;
    });
  }, 300);
});

// Add some interactive features
window.addEventListener("load", () => {
  // Add parallax effect to floating shapes
  window.addEventListener("mousemove", (e) => {
    const shapes = document.querySelector(".floating-shapes");
    if (shapes) {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      
      shapes.style.transform = `translate(${x * 20}px, ${y * 20}px)`;
    }
  });
});