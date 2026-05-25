let users = JSON.parse(localStorage.getItem("users")) || {};
let chats = JSON.parse(localStorage.getItem("chats")) || {};
let currentUser = localStorage.getItem("currentUser");
let currentChatUser = localStorage.getItem("chatUser");

// AUTH
function register() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!email || !pass) return alert("Boş bırakma");

  users[email] = { password: pass };
  localStorage.setItem("users", JSON.stringify(users));

  alert("Kayıt başarılı");
}

function login() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;

  if (!users[email] || users[email].password !== pass) {
    return alert("Hatalı giriş");
  }

  localStorage.setItem("currentUser", email);
  location.href = "home.html";
}

function logout() {
  localStorage.removeItem("currentUser");
  location.href = "auth.html";
}

// NAV
window.goHome = () => location.href = "home.html";
window.goProfile = () => location.href = "profile.html";

// USERS
function loadUsers() {
  const list = document.getElementById("userList");
  if (!list) return;

  list.innerHTML = "";

  Object.keys(users).forEach(email => {
    if (email === currentUser) return;

    list.innerHTML += `
      <div class="user glass" onclick="openChat('${email}')">
        ${email}
      </div>
    `;
  });
}

// CHAT
function openChat(email) {
  localStorage.setItem("chatUser", email);
  location.href = "chat.html";
}

function getChatId(a, b) {
  return a < b ? a + "_" + b : b + "_" + a;
}

function sendMessage() {
  const input = document.getElementById("msgInput");
  const text = input.value;

  if (!text) return;

  const chatId = getChatId(currentUser, currentChatUser);

  if (!chats[chatId]) chats[chatId] = [];

  chats[chatId].push({
    sender: currentUser,
    text
  });

  localStorage.setItem("chats", JSON.stringify(chats));

  input.value = "";
  loadMessages();
}

function loadMessages() {
  const box = document.getElementById("chatBox");
  const title = document.getElementById("chatWith");

  if (!box || !currentChatUser) return;

  title.innerText = currentChatUser;

  const chatId = getChatId(currentUser, currentChatUser);
  const messages = chats[chatId] || [];

  box.innerHTML = "";

  messages.forEach(msg => {
    const cls = msg.sender === currentUser ? "me" : "other";
    box.innerHTML += `<div class="${cls}">${msg.text}</div>`;
  });

  box.scrollTop = box.scrollHeight;
}

// PROFILE
function loadProfile() {
  const el = document.getElementById("userEmail");
  if (el) el.innerText = currentUser;
}

// AUTO
window.onload = () => {
  if (!currentUser && !location.pathname.includes("auth")) {
    location.href = "auth.html";
  }

  loadUsers();
  loadMessages();
  loadProfile();
};
