document.addEventListener("DOMContentLoaded", () => {
  console.log("Realtime JS loaded");

  const socket = io();

  // Views
  const lobbyView = document.getElementById("lobby-view");
  const chatView = document.getElementById("chat-view");

  // Lobby elements
  const roomsList = document.getElementById("roomsList");
  const createRoomBtn = document.getElementById("createRoomBtn");
  const searchRooms = document.getElementById("searchRooms");

  // Modals
  const createRoomModal = document.getElementById("createRoomModal");
  const joinRoomModal = document.getElementById("joinRoomModal");
  const closeCreateModal = document.getElementById("closeCreateModal");
  const closeJoinModal = document.getElementById("closeJoinModal");

  // Create room form
  const newRoomName = document.getElementById("newRoomName");
  const maxUsers = document.getElementById("maxUsers");
  const isPrivate = document.getElementById("isPrivate");
  const passwordGroup = document.getElementById("passwordGroup");
  const roomPassword = document.getElementById("roomPassword");
  const confirmCreateRoom = document.getElementById("confirmCreateRoom");

  // Join room form
  const joinUsername = document.getElementById("joinUsername");
  const joinPassword = document.getElementById("joinPassword");
  const joinPasswordGroup = document.getElementById("joinPasswordGroup");
  const confirmJoinRoom = document.getElementById("confirmJoinRoom");

  // Chat elements
  const chat = document.getElementById("chat-box");
  const input = document.getElementById("message-input");
  const sendBtn = document.getElementById("send-btn");
  const roomTitle = document.getElementById("roomTitle");
  const roomSubtitle = document.getElementById("roomSubtitle");
  const leaveRoomBtn = document.getElementById("leaveRoomBtn");
  const clearChatBtn = document.getElementById("clearChatBtn");
  const typingIndicator = document.getElementById("typingIndicator");
  const emojiBtn = document.getElementById("emojiBtn");
  const infoBtn = document.getElementById("infoBtn");
  const infoPanel = document.getElementById("infoPanel");
  const closeInfo = document.getElementById("closeInfo");
  const roomInfo = document.getElementById("roomInfo");

  // State
  let currentRoom = null;
  let currentUsername = "";
  let selectedRoomForJoin = null;
  let allRooms = [];
  let typingTimeout = null;

  // ===== LOBBY & CHAT FUNCTIONS =====

  function displayRooms(rooms) {
    allRooms = rooms;
    const filtered = searchRooms.value 
      ? rooms.filter(r => r.name.toLowerCase().includes(searchRooms.value.toLowerCase()))
      : rooms;

    if (filtered.length === 0) {
      roomsList.innerHTML = '<p style="text-align:center;color:#666;padding:40px;">No rooms available. Create one!</p>';
      return;
    }

    roomsList.innerHTML = filtered.map(room => {
      const isFull = room.users.length >= room.maxUsers;
      return `
        <div class="room-card ${isFull ? 'room-full' : ''}" data-room-id="${room.id}" ${!isFull ? 'onclick="handleRoomClick(\'' + room.id + '\')"' : ''}>
          <div class="room-card-header">
            <div>
              <div class="room-name">${escapeHtml(room.name)}</div>
              <div class="room-owner">Owner: ${escapeHtml(room.owner)}</div>
            </div>
            <div class="room-privacy">${room.isPrivate ? '🔒' : '🔓'}</div>
          </div>
          <div class="room-stats">
            <div class="room-stat">👥 ${room.users.length} / ${room.maxUsers}</div>
            <div class="room-stat">${room.isPrivate ? 'Private' : 'Public'}</div>
            ${isFull ? '<div class="room-stat" style="color:#f44336;">FULL</div>' : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  window.handleRoomClick = function(roomId) {
    const room = allRooms.find(r => r.id === roomId);
    if (!room) return;

    selectedRoomForJoin = room;
    joinPasswordGroup.style.display = room.isPrivate ? 'block' : 'none';
    joinRoomModal.classList.add('active');
    joinUsername.focus();
  };

  // Create & join room
  createRoomBtn.addEventListener("click", () => createRoomModal.classList.add('active'));
  closeCreateModal.addEventListener("click", () => { createRoomModal.classList.remove('active'); resetCreateForm(); });
  closeJoinModal.addEventListener("click", () => { joinRoomModal.classList.remove('active'); resetJoinForm(); });
  isPrivate.addEventListener("change", () => passwordGroup.style.display = isPrivate.checked ? 'block' : 'none');

  confirmCreateRoom.addEventListener("click", () => {
    const name = newRoomName.value.trim();
    const max = parseInt(maxUsers.value);
    const owner = prompt("Enter your username to create this room:");
    const password = isPrivate.checked ? roomPassword.value : "";

    if (!owner || !name || max < 2 || max > 100 || (isPrivate.checked && !password)) return alert("Invalid inputs");

    currentUsername = owner.trim();
    socket.emit("create-room", { roomName: name, password, isPrivate: isPrivate.checked, maxUsers: max, owner });

    createRoomModal.classList.remove('active');
    resetCreateForm();

    socket.once("room-created", (room) => {
      socket.emit("join-room", { roomId: room.id, username: currentUsername, password });
    });
  });

  confirmJoinRoom.addEventListener("click", () => {
    const username = joinUsername.value.trim();
    if (!username || !selectedRoomForJoin) return;

    currentUsername = username;
    socket.emit("join-room", { roomId: selectedRoomForJoin.id, username, password: joinPassword.value });

    joinRoomModal.classList.remove('active');
    resetJoinForm();
  });

  // Leave room
  leaveRoomBtn.addEventListener("click", () => {
    if (!currentRoom) return;
    const isOwner = currentRoom.owner === currentUsername;
    if (confirm(isOwner ? "Do you want to exit and delete this room?" : "Do you want to leave this room?")) {
      leaveRoom();
    }
  });

  function leaveRoom() {
    socket.emit("leave-room");
    currentRoom = null;
    chat.innerHTML = "";
    lobbyView.style.display = "block";
    chatView.style.display = "none";
  }

  // ===== SOCKET EVENTS =====
  socket.on("rooms-list", displayRooms);

  socket.on("joined-room", (room) => {
    currentRoom = room;
    lobbyView.style.display = "none";
    chatView.style.display = "flex";
    roomTitle.textContent = room.name;
    updateRoomSubtitle(room);
    updateRoomInfo(room);
  });

  socket.on("room-updated", (room) => {
    if (currentRoom && currentRoom.id === room.id) {
      currentRoom = room;
      updateRoomSubtitle(room);
      updateRoomInfo(room);
    }
  });

  socket.on("room-message", (msg) => {
    const div = document.createElement("div");
    if (msg.type === "system") {
      div.className = "system";
      const time = new Date(msg.timestamp || Date.now()).toLocaleTimeString();
      div.textContent = `${msg.text} • ${time}`;
    } else {
      const isMine = msg.username === currentUsername;
      div.className = "message " + (isMine ? "my" : "other");
      const time = new Date(msg.timestamp || Date.now()).toLocaleTimeString();
      div.innerHTML = `<div style="font-size:12px;opacity:0.7;margin-bottom:4px;">
        ${isMine ? "You" : escapeHtml(msg.username)} 
        <span style="margin-left:8px;font-size:10px;opacity:0.6;">${time}</span></div>
        <div>${escapeHtml(msg.text)}</div>`;
    }
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  });

  socket.on("room-deleted", (roomId) => {
    if (currentRoom && currentRoom.id === roomId) {
      alert("Room was deleted by the owner");
      leaveRoom();
    }
  });

  // ===== HELPER FUNCTIONS =====
  function updateRoomSubtitle(room) { roomSubtitle.textContent = `👥 ${room.users.length} / ${room.maxUsers} users`; }
  function updateRoomInfo(room) {
    roomInfo.innerHTML = `<p><strong>Room:</strong> ${escapeHtml(room.name)}</p>
      <p><strong>Owner:</strong> 👑 ${escapeHtml(room.owner)}</p>
      <p><strong>Users:</strong> ${room.users.length} / ${room.maxUsers}</p>
      <p><strong>Type:</strong> ${room.isPrivate ? '🔒 Private' : '🔓 Public'}</p>
      <hr style="margin:16px 0;border-color:#333;">
      <p style="font-size:12px;color:#999;">Real-time Socket.IO chat</p>`;
  }

  function resetCreateForm() { newRoomName.value = ""; maxUsers.value = "10"; isPrivate.checked = false; roomPassword.value = ""; passwordGroup.style.display = "none"; }
  function resetJoinForm() { joinUsername.value = ""; joinPassword.value = ""; joinPasswordGroup.style.display = "none"; selectedRoomForJoin = null; }
  function escapeHtml(text) { const div = document.createElement('div'); div.textContent = text; return div.innerHTML; }

  console.log("Realtime chat initialized");
});
