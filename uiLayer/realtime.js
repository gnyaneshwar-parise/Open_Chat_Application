document.addEventListener("DOMContentLoaded", () => {
  console.log("Realtime JS loaded");

  const socket = io();

  // DOM
  const chat = document.getElementById("chat-box");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const clearBtn = document.getElementById("clearChat");
  const emojiBtn = document.getElementById("emojiBtn");
  const micBtn = document.getElementById("micBtn");
  const infoBtn = document.getElementById("infoBtn");
  const infoPanel = document.getElementById("infoPanel");
  const closeInfoBtn = document.getElementById("closeInfo");

  if (!chat || !input || !sendBtn) {
    console.error("Required DOM elements missing");
    return;
  }

  // Username (FORCE PROMPT)
  let username = "";
  while (!username) {
    username = prompt("Enter your name");
  }
  socket.emit("new-user", username);

  // SEND MESSAGE
  function sendMessage() {
    const text = input.value.trim();
    if (!text) return;
    socket.emit("chat-message", text);
    input.value = "";
  }

  sendBtn.addEventListener("click", sendMessage);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  // RECEIVE MESSAGE
  socket.on("message", (msg) => {
    const div = document.createElement("div");

    if (msg.includes("joined") || msg.includes("left")) {
      div.className = "system";
      div.textContent = msg;
    } else {
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

  // EMOJI
  if (emojiBtn) {
    emojiBtn.addEventListener("click", () => {
      input.value += "😀";
      input.focus();
    });
  }

  // MIC (UI ONLY)
  if (micBtn) {
    let micOn = false;
    micBtn.addEventListener("click", () => {
      micOn = !micOn;
      micBtn.textContent = micOn ? "🎙️" : "🎤";
    });
  }

  // INFO PANEL
  if (infoBtn && infoPanel) {
    infoBtn.addEventListener("click", () => {
      infoPanel.classList.add("open");
      history.pushState({ info: true }, "");
    });
  }

  if (closeInfoBtn) {
    closeInfoBtn.addEventListener("click", () => {
      infoPanel.classList.remove("open");
      history.back();
    });
  }

  window.addEventListener("popstate", () => {
    infoPanel.classList.remove("open");
  });

  // CLEAR CHAT
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      chat.innerHTML = "";
    });
  }

  console.log("Realtime chat initialized");
});
