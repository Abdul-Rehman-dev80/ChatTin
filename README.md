# ChatTin - Real-time Chat Application

A modern real-time chat application built with React and Node.js.

## 📁 Project Structure

```
ChatTin/
├── client/          # React frontend application
├── server/          # Node.js backend API and Socket.io server
└── README.md        # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install client dependencies:**
```bash
cd client
npm install
```

2. **Install server dependencies:**
```bash
cd server
npm install
```

### Running the Application

1. **Start the backend server:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:3000`

2. **Start the frontend (in a new terminal):**
```bash
cd client
npm run dev
```
Frontend runs on `http://localhost:5173` (or your Vite port)

## 🛠️ Tech Stack

**Frontend:**
- React 19
- Vite
- Tailwind CSS
- Socket.io Client
- React Query
- Material-UI Icons

**Backend:**
- Node.js
- Express
- Socket.io
- (Add your database/ORM here)

## 📝 Features

- User authentication (Login/Register)
- Real-time messaging via Socket.io
- Modern, responsive UI
- Dark theme design

## 🔧 Development

- Client code is in `client/src/`
- Server code is in `server/src/` (or `server/` depending on your structure)
- Both have separate `package.json` files for independent dependency management

## 📄 License

MIT
