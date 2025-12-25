const socket = io();

// DOM elements
const chat = document.getElementById("chat-box");
const input = document.getElementById("message-input");
const sendBtn = document.getElementById("send-btn");
const clearBtn = document.getElementById("clearChat");

const emojiBtn = document.getElementById("emojiBtn");
const attachBtn = document.getElementById("attachBtn");
const micBtn = document.getElementById("micBtn");
const infoBtn = document.getElementById("infoBtn");
const infoPanel = document.getElementById("infoPanel");

// Username (robust)
let username = "";
while (!username) {
  username = prompt("Enter your name");
}
socket.emit("new-user", username);

// ================= SEND MESSAGE =================
sendBtn.addEventListener("click", sendMessage);

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendMessage();
});

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  socket.emit("chat-message", text);
  input.value = "";
}

// ================= RECEIVE MESSAGE =================
socket.on("message", (msg) => {
  const div = document.createElement("div");

  // System messages
  if (msg.includes("joined") || msg.includes("left")) {
    div.className = "system";
    div.textContent = msg;
  } 
  // Normal messages
  else {
    const isMine = msg.startsWith(username + ":");
    div.className = "message " + (isMine ? "my" : "other");

    const sender = isMine ? "You" : msg.split(":")[0];
    const text = msg.substring(msg.indexOf(":") + 1).trim();

    div.innerHTML = `
      <div class="msg-user">${sender}</div>
      <div class="msg-text">${text}</div>
    `;
  }

  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
});

// ================= BUTTON INTERACTIONS =================

// Emoji button
emojiBtn.addEventListener("click", () => {
  input.value += "😀";
  input.focus();
});

// Attach button (demo)
attachBtn.addEventListener("click", () => {
  alert("Attachment feature – demo UI only");
});

// Mic toggle
let micOn = false;
micBtn.addEventListener("click", () => {
  micOn = !micOn;
  micBtn.textContent = micOn ? "🎙️" : "🎤";
});

// Info panel toggle
infoBtn.addEventListener("click", () => {
  infoPanel.classList.toggle("open");
  history.pushState(null, "");
});

// Clear chat
clearBtn.addEventListener("click", () => {
  chat.innerHTML = "";
});
// STEP 3A: Close info panel when mobile back is pressed
window.addEventListener("popstate", () => {
  if (infoPanel.classList.contains("open")) {
    infoPanel.classList.remove("open");
  }
});
const closeInfoBtn = document.getElementById("closeInfo");

if (closeInfoBtn) {
  closeInfoBtn.addEventListener("click", () => {
    infoPanel.classList.remove("open");
    history.back(); // remove fake history entry
  });
}

