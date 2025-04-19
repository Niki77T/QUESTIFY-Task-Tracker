const taskInput = document.getElementById("taskInput");
const taskDate = document.getElementById("taskDate");
const taskTime = document.getElementById("taskTime");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const xpBar = document.getElementById("xpBar");
const xpText = document.getElementById("xp");
const xpMaxText = document.getElementById("xpMax");
const levelText = document.getElementById("level");
const badgeContainer = document.getElementById("badgeContainer");
const themeToggle = document.getElementById("themeToggle");
const dailyQuote = document.getElementById("dailyQuote");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let xp = parseInt(localStorage.getItem("xp")) || 0;
let level = parseInt(localStorage.getItem("level")) || 1;
let currentFilter = "all";

// Daily quote generator
const quotes = [
  "Stay focused and never give up!",
  "Small steps every day!",
  "Discipline beats motivation.",
  "Believe in yourself!",
  "Consistency is key.",
  "Today is a fresh start!",
];

function loadDailyQuote() {
  const index = new Date().getDate() % quotes.length;
  dailyQuote.textContent = quotes[index];
}

// Task rendering
function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter(task =>
    currentFilter === "all" ||
    (currentFilter === "completed" && task.completed) ||
    (currentFilter === "pending" && !task.completed)
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (task.completed) li.classList.add("completed");

    li.innerHTML = `
      <span>${task.text} 
        ${task.date ? `📅 ${task.date}` : ""} 
        ${task.time ? `⏰ ${task.time}` : ""}</span>
      <div>
        <button onclick="toggleComplete(${index})">✅</button>
        <button onclick="deleteTask(${index})">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    text,
    completed: false,
    date: taskDate.value,
    time: taskTime.value,
  });
  taskInput.value = "";
  taskDate.value = "";
  taskTime.value = "";
  updateXP(10);
  renderTasks();
}

function toggleComplete(index) {
  tasks[index].completed = !tasks[index].completed;
  if (tasks[index].completed) updateXP(20);
  renderTasks();
}

function deleteTask(index) {
  if (tasks[index].completed) updateXP(-20);
  else updateXP(-10);
  tasks.splice(index, 1);
  renderTasks();
}

function updateXP(amount) {
  xp += amount;
  if (xp >= 100) {
    xp = xp - 100;
    level += 1;
    unlockBadge(level);
  }
  if (xp < 0) xp = 0;
  xpText.textContent = xp;
  levelText.textContent = level;
  xpBar.style.width = `${(xp / 100) * 100}%`;
  localStorage.setItem("xp", xp);
  localStorage.setItem("level", level);
}

function unlockBadge(lvl) {
  const badge = document.createElement("span");
  badge.textContent = `🏆 Level ${lvl}`;
  badge.classList.add("badge");
  badgeContainer.appendChild(badge);
}

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-btn.active").classList.remove("active");
    btn.classList.add("active");
    currentFilter = btn.dataset.filter;
    renderTasks();
  });
});

// Theme Toggle
themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Task reminder notifications
function setupReminders() {
  if (!("Notification" in window)) return;
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }

  setInterval(() => {
    const now = new Date();
    tasks.forEach(task => {
      if (!task.time || !task.date || task.completed) return;
      const taskDateTime = new Date(`${task.date}T${task.time}`);
      const diff = taskDateTime - now;

      // Send reminder 1 min before
      if (diff > 0 && diff < 60000 && !task.notified) {
        new Notification("Task Reminder", {
          body: `${task.text} is coming up soon!`,
        });
        task.notified = true;
      }
    });const taskDate = document.getElementById("taskDate");
    const taskTime = document.getElementById("taskTime");
    const addBtn = document.getElementById("addBtn");
    const taskList = document.getElementById("taskList");
    const filterButtons = document.querySelectorAll(".filter-btn");
    const themeToggle = document.getElementById("themeToggle");
    const quoteDisplay = document.getElementById("dailyQuote");
    
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let xp = parseInt(localStorage.getItem("xp")) || 0;
    let level = parseInt(localStorage.getItem("level")) || 1;
    
    const quotes = [
      "Believe you can and you're halfway there.",
      "One task at a time, one step at a time.",
      "Keep going, you're doing great!",
      "Small progress is still progress.",
      "Every day is a fresh start.",
      "Stay focused and never give up!",
      "Discipline is doing it even when you don’t feel like it."
    ];
    
    function setDailyQuote() {
      const today = new Date().getDate(); // use day as index reference
      quoteDisplay.textContent = quotes[today % quotes.length];
    }
    
    // Add Task
    addBtn.addEventListener("click", () => {
      const taskText = taskInput.value.trim();
      const taskDueDate = taskDate.value;
      const time = taskTime.value;
      if (!taskText) return;
    
      const task = {
        id: Date.now(),
        text: taskText,
        completed: false,
        date: taskDueDate,
        time,
      };
    
      tasks.push(task);
      taskInput.value = "";
      taskDate.value = "";
      saveAndRender();
    });
    
    // Toggle Theme
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
    });
    
    // Filter Tasks
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelector(".filter-btn.active").classList.remove("active");
        btn.classList.add("active");
        renderTasks();
      });
    });
    
    // Save to LocalStorage and Render
    function saveAndRender() {
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateXPDisplay();
    }
    
    // Render Task List
    function renderTasks() {
      taskList.innerHTML = "";
      const filter = document.querySelector(".filter-btn.active").dataset.filter;
    
      tasks.forEach((task) => {
        if (filter === "completed" && !task.completed) return;
        if (filter === "pending" && task.completed) return;
    
        const li = document.createElement("li");
        li.className = `task-item ${task.completed ? "completed" : ""}`;
        li.innerHTML = `
          <span>${task.text}</span>
          <div>
            ${task.date ? `<small>Due: ${task.date}</small>` : ""}
            <button onclick="toggleComplete(${task.id})">✅</button>
            <button onclick="deleteTask(${task.id})">🗑️</button>
          </div>
        `;
        taskList.appendChild(li);
      });
    }
    
    // Toggle Complete
    window.toggleComplete = function (id) {
      const task = tasks.find((t) => t.id === id);
      task.completed = !task.completed;
      if (task.completed) {
        gainXP(20);
      } else {
        xp = Math.max(0, xp - 20);
        localStorage.setItem("xp", xp);
      }
      saveAndRender();
    };
    
    // Delete Task
    window.deleteTask = function (id) {
      tasks = tasks.filter((t) => t.id !== id);
      saveAndRender();
    };
    
    // Gamification Logic
    function gainXP(amount) {
      xp += amount;
      while (xp >= 100) {
        xp -= 100;
        level++;
        alert(`🎉 Congrats! You reached Level ${level}!`);
      }
      localStorage.setItem("xp", xp);
      localStorage.setItem("level", level);
    }
    
    function updateXPDisplay() {
      const xpBar = document.getElementById("xpBar");
      const xpSpan = document.getElementById("xp");
      const xpMax = document.getElementById("xpMax");
      const levelSpan = document.getElementById("level");
      const badgeContainer = document.getElementById("badgeContainer");
    
      xpSpan.textContent = xp;
      xpMax.textContent = 100;
      levelSpan.textContent = level;
      xpBar.style.width = `${(xp / 100) * 100}%`;
    
      const badges = ["🌱", "🔥", "🚀", "🌟", "🏆"];
      const badge = badges[Math.floor(level / 2) % badges.length];
      badgeContainer.textContent = `Badge: ${badge}`;
    }
    
    function checkReminders() {
      const now = new Date();
      const nowDate = now.toISOString().split("T")[0];
      const nowTime = now.toTimeString().slice(0, 5); // HH:MM format
    
      tasks.forEach(task => {
        if (!task.completed && task.date === nowDate && task.time === nowTime) {
          alert(`🔔 Reminder: ${task.text}`);
        }
      });
    }
    
    setInterval(checkReminders, 60000); // Check every 1 minute
    
    setDailyQuote();
    saveAndRender();
    
  }, 30000); // check every 30 seconds
}

addBtn.addEventListener("click", addTask);
window.onload = () => {
  loadDailyQuote();
  renderTasks();
  setupReminders();
  xpText.textContent = xp;
  xpMaxText.textContent = "100";
  levelText.textContent = level;
  xpBar.style.width = `${(xp / 100) * 100}%`;
};
