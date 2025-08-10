const taskInput = document.getElementById("taskInput");
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

function renderTasks() {
  taskList.innerHTML = "";
  const filteredTasks = tasks.filter(task =>
    currentFilter === "all" ||
    (currentFilter === "completed" && task.completed) ||
    (currentFilter === "pending" && !task.completed)
  );

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;
    li.innerHTML = `
      <span>${task.text}</span>
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

  tasks.push({ text, completed: false });
  taskInput.value = "";
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
    xp -= 100;
    level++;
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

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.textContent =
    document.body.classList.contains("dark") ? "☀️" : "🌙";
});

addBtn.addEventListener("click", addTask);

window.onload = () => {
  loadDailyQuote();
  renderTasks();
  xpText.textContent = xp;
  xpMaxText.textContent = "100";
  levelText.textContent = level;
  xpBar.style.width = `${(xp / 100) * 100}%`;
};
