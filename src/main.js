import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

// --- Simple user/session state ---
function getCurrentUser() {
  return localStorage.getItem('userId');
}
function setCurrentUser(id) {
  localStorage.setItem('userId', id);
  const nick = getCurrentNickname();
  if (nick) {
    localStorage.setItem('nickname-' + id, nick);
  }
}

// --- Nickname management ---
function getCurrentNickname() {
  return localStorage.getItem('nickname');
}
function setCurrentNickname(nick) {
  localStorage.setItem('nickname', nick);
}

// Prompt for nickname if not set
function promptForNickname() {
  let nick = '';
  while (!nick) {
    nick = prompt('Enter your nickname for the app (will be shown on the leaderboard):');
    if (nick) setCurrentNickname(nick.trim());
  }
}

// --- Demo: show main app after login ---
function showMainApp() {
  document.querySelector('#app').innerHTML = `
    <div class="mdl-grid">
      <div class="mdl-cell">
        <div class="mdl-card mdl-shadow--2dp" style="padding:2em;">
          <h2 class="mdl-card__title-text">Create a Task</h2>
          <span id="task-title-spacer"></span>
          <button id="show-task-form" class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Create Task</button>
          <form id="task-form" class="mdl-grid" style="display:none; margin-top:1em;">
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="title" required placeholder="Title">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="people" type="number" min="1" required placeholder="How many people?">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="where" required placeholder="Where?">
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-cell mdl-cell--12-col">
              <input class="mdl-textfield__input" name="when" type="datetime-local" required>
            </div>
            <div class="mdl-cell mdl-cell--12-col">
              <button type="submit" class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent">Submit Task</button>
            </div>
          </form>
          <div id="task-status" style="margin-top:1em;"></div>
        </div>
      </div>
      <div class="mdl-cell">
        <div class="mdl-card mdl-shadow--2dp" style="padding:2em;">
          <h2 class="mdl-card__title-text">Tasks for You</h2>
          <div id="inbox-list"></div>
        </div>
      </div>
      <div class="mdl-cell">
        <div class="mdl-card mdl-shadow--2dp" style="padding:2em;">
          <h2 class="mdl-card__title-text">Leaderboard</h2>
          <ol id="leaderboard-list" class="mdl-list"></ol>
        </div>
      </div>
    </div>
  `;
  if (window.componentHandler) window.componentHandler.upgradeDom();
  setupTaskSection();
  setupInboxSection();
  setupLeaderboardSection();
}

// --- Task creation and assignment logic ---
function setupTaskSection() {
  const showBtn = document.getElementById('show-task-form');
  const form = document.getElementById('task-form');
  const status = document.getElementById('task-status');
  showBtn.onclick = () => { form.style.display = 'block'; };
  form.onsubmit = e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.people = parseInt(data.people);
    data.id = 'task-' + Date.now();
    data.requester = getCurrentUser();
    data.accepted = [];
    data.pending = [];
    saveTask(data);
    status.textContent = 'Task created! Sending to users...';
    form.reset();
    form.style.display = 'none';
    staggerSendTask(data);
  };
}

function saveTask(task) {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks() {
  return JSON.parse(localStorage.getItem('tasks') || '[]');
}

// --- Simulate users ---
function getAllUsers() {
  // For demo, 5 fake users + current user always included
  const baseUsers = ['user1','user2','user3','user4','user5'];
  const current = getCurrentUser();
  return baseUsers.includes(current) ? baseUsers : [current, ...baseUsers];
}

function getRandomUsers(n, exclude) {
  // For testing, do NOT exclude requester
  const users = getAllUsers();
  for (let i = users.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [users[i], users[j]] = [users[j], users[i]];
  }
  return users.slice(0, n);
}

function staggerSendTask(task) {
  const needed = task.people;
  const candidates = getRandomUsers(needed * 2, task.requester); // extra in case of declines
  let idx = 0;
  function sendNext() {
    if (task.accepted.length >= needed || idx >= candidates.length) return;
    const user = candidates[idx++];
    addTaskToInbox(user, task.id);
    // Immediately send to all candidates for demo/testing
    sendNext();
  }
  sendNext();
}

function addTaskToInbox(userId, taskId) {
  const inbox = JSON.parse(localStorage.getItem('inbox-' + userId) || '[]');
  if (!inbox.includes(taskId)) {
    inbox.push(taskId);
    localStorage.setItem('inbox-' + userId, JSON.stringify(inbox));
    // Notify if this is the current user
    if (userId === getCurrentUser()) {
      const tasks = getTasks();
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        notifyUser('New Task Assigned', `${task.title} at ${task.where} on ${task.when}`);
      }
    }
  }
}

// --- Inbox section ---
function setupInboxSection() {
  const userId = getCurrentUser();
  const inboxList = document.getElementById('inbox-list');
  // Replace inboxList with a table
  const parent = inboxList.parentElement;
  const tableId = 'inbox-table';
  let table = document.getElementById(tableId);
  if (!table) {
    table = document.createElement('table');
    table.id = tableId;
    parent.replaceChild(table, inboxList);
  }
  function renderInbox() {
    const inbox = JSON.parse(localStorage.getItem('inbox-' + userId) || '[]');
    const tasks = getTasks();
    table.innerHTML = `<thead><tr><th>Task</th><th>Date</th><th>Status/Action</th></tr></thead><tbody></tbody>`;
    const tbody = table.querySelector('tbody');
    // Show accepted tasks as FYI with status
    const acceptedTasks = tasks.filter(t => t.accepted && t.accepted.includes(userId));
    acceptedTasks.forEach(task => {
      const status = getTaskStatus(task);
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td><b>${task.title}</b> at ${task.where}</td>
        <td>${formatTaskTime(task.when)}</td>
        <td class="status-cell"><span class="mdl-chip"><span class="mdl-chip__text">${status}</span></span></td>
      `;
      tbody.appendChild(tr);
    });
    // Show pending tasks (not yet accepted/declined)
    inbox.forEach(taskId => {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;
      if (task.accepted && task.accepted.includes(userId)) return; // already shown above
      const tr = document.createElement('tr');
      const actionCell = document.createElement('td');
      actionCell.className = 'status-cell';
      actionCell.innerHTML = `
        <button data-accept class="mdl-button mdl-js-button mdl-button--raised mdl-button--colored">Accept</button>
        <button data-decline class="mdl-button mdl-js-button mdl-button--raised">Decline</button>
      `;
      tr.innerHTML = `
        <td><b>${task.title}</b> at ${task.where}</td>
        <td>${formatTaskTime(task.when)}</td>
      `;
      tr.appendChild(actionCell);
      tbody.appendChild(tr);
      actionCell.querySelector('[data-accept]').onclick = () => handleAccept(task, userId);
      actionCell.querySelector('[data-decline]').onclick = () => handleDecline(task, userId);
    });
    if (window.componentHandler) window.componentHandler.upgradeDom();
  }
  renderInbox();
  setInterval(renderInbox, 5000); // refresh every 5s
}

function formatTaskTime(isoString) {
  const d = new Date(isoString);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  let hours = d.getHours();
  const mins = String(d.getMinutes()).padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12;
  if (hours === 0) hours = 12;
  return `${mm}/${dd} ${hours}:${mins} ${ampm}`;
}

function getTaskStatus(task) {
  const now = new Date();
  const taskTime = new Date(task.when);
  if (now < taskTime) return 'In Progress';
  if (now < new Date(taskTime.getTime() + 60 * 60 * 1000)) return 'In Progress';
  return 'Complete';
}

function handleAccept(task, userId) {
  if (!task.accepted.includes(userId)) {
    if (task.accepted.length < task.people) {
      task.accepted.push(userId);
      removeFromInbox(userId, task.id);
      updateTask(task);
      addPoints(userId, 5); // Add 5 points for accepting
      notifyUser('Task Accepted', 'You have been accepted for this task!');
    } else {
      removeFromInbox(userId, task.id);
      notifyUser('Task Full', 'Sorry, enough people have already accepted this task. Thank you!');
    }
  }
}
function handleDecline(task, userId) {
  removeFromInbox(userId, task.id);
  // send to next user
  staggerSendTask(task);
}
function removeFromInbox(userId, taskId) {
  let inbox = JSON.parse(localStorage.getItem('inbox-' + userId) || '[]');
  inbox = inbox.filter(id => id !== taskId);
  localStorage.setItem('inbox-' + userId, JSON.stringify(inbox));
}
function updateTask(task) {
  const tasks = getTasks();
  const idx = tasks.findIndex(t => t.id === task.id);
  if (idx !== -1) {
    tasks[idx] = task;
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }
}

// --- Leaderboard logic ---
function getLeaderboard() {
  return JSON.parse(localStorage.getItem('leaderboard') || '{}');
}
function setLeaderboard(lb) {
  localStorage.setItem('leaderboard', JSON.stringify(lb));
}
function addPoints(userId, points) {
  const lb = getLeaderboard();
  lb[userId] = (lb[userId] || 0) + points;
  setLeaderboard(lb);
}
function setupLeaderboardSection() {
  const leaderboardList = document.getElementById('leaderboard-list');
  function renderLeaderboard() {
    const lb = getLeaderboard();
    const sorted = Object.entries(lb).sort((a, b) => b[1] - a[1]);
    leaderboardList.innerHTML = '';
    sorted.forEach(([user, pts], i) => {
      let nick = localStorage.getItem('nickname-' + user);
      if (!nick && user === getCurrentUser()) nick = getCurrentNickname();
      if (!nick) nick = user;
      const li = document.createElement('li');
      li.className = 'mdl-list__item';
      li.innerHTML = `<span class="mdl-list__item-primary-content">${i+1}. <b>${nick}</b> — ${pts} pts</span>`;
      leaderboardList.appendChild(li);
    });
    if (window.componentHandler) window.componentHandler.upgradeDom();
  }
  renderLeaderboard();
  setInterval(renderLeaderboard, 5000);
}

// --- Notification helpers ---
function notifyUser(title, body) {
  if (Notification.permission === 'granted') {
    new Notification(title, { body });
  }
}

// Request notification permission on load
if (Notification && Notification.permission !== 'granted') {
  Notification.requestPermission();
}

// --- DEV: Bypass login for local testing ---
if (!getCurrentUser() && window.location.hostname === 'localhost') {
  setCurrentUser('devuser');
}

// --- Show login or main app ---
if (getCurrentUser()) {
  if (!getCurrentNickname()) {
    promptForNickname();
  }
  showMainApp();
} else {
  document.querySelector('#app').innerHTML = `<a href="login.html">Login via QR Code</a>`;
}
