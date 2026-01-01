# Open Chat Application (RTRP) 🚀

A real-time, multi-user chat application built using **Node.js**, **Express**, and **Socket.IO**, featuring instant messaging, join/leave notifications, and a responsive dark-themed UI for both desktop and mobile devices.

---

## 🔹 Features
- Real-time multi-user messaging
- Instant join/leave notifications
- Responsive dark UI (Desktop & Mobile)
- WebSocket-based communication using Socket.IO
- Deployed on Render (free tier) for public access
- Demonstrates real-time client–server communication
- Displays real-time online users count using server-side WebSocket state tracking

---

## 🛠️ Tech Stack
- **Frontend**: HTML, CSS, JavaScript  
- **Backend**: Node.js, Express  
- **Real-time Communication**: Socket.IO  
- **Deployment**: Render (Cloud Platform)

---

## 📂 Project Structure
```
Open_Chat_Application/
│
├── uiLayer/ # Frontend files
│   ├── homeView.html
│   ├── design.css
│   └── realtime.js
│
├── rtrpServer.js
├── package.json
├── package-lock.json
└── README.md
```
---

## 🧠 System Architecture
- Client browsers communicate with the Node.js server via HTTP for initial page load.
- Socket.IO establishes a persistent WebSocket connection for real-time messaging.
- The server maintains active connections and broadcasts messages and user count updates instantly.

---

## ▶️ How to Run Locally
1. Clone the repository:
   ```bash
   git clone https://github.com/Harshith1702/Open_Chat_Application.git
   ```
2. Navigate to the project folder:
   ```bash
   cd Open_Chat_Application
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open browser and visit:
   ```bash
   http://localhost:4000
   ```
   
---

## 🌐 Live Demo
🔗 https://open-chat-application-ubti.onrender.com

> Note: The application is deployed on a free cloud tier and may take a few seconds to wake up after inactivity.

---

## 📸 Screenshots

### Desktop View
![Desktop Chat UI](screenshots/desktop-view.png)

### Mobile View
<p align="center">
  <img src="screenshots/mobile-view.jpeg" alt="Mobile Chat UI" width="300"/>
</p>

### WebSocket Connection Proof
![WebSocket 101 Status](screenshots/websocket-101.png)

### Cloud Deployment (Render)
![Render Deployment](screenshots/render-deploy.png)

---

## 🎥 Demo Video
https://youtu.be/jEdyRr2BL08

---

## 🎯 Learning Outcomes
- Understanding of WebSockets and real-time communication
- Client–server architecture
- Responsive UI design
- Cloud deployment workflow
- Git & GitHub version control

---

## Academic Note
This project is shared publicly for learning and demonstration purposes.
Cloning the repository is permitted, but reuse or submission should comply
with institutional academic integrity policies.

---

## 👤 Author
**Padakanti Harshith**  
B.Tech Computer Science and Engineering Undergraduate

---

## 📜 License
This project is licensed under the MIT License.  
See the [LICENSE](LICENSE) file for details.

