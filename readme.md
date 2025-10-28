# 🧠 Precep-Tech Backend

Percep-Tech project — built with **Node.js**, **Express**, **TypeScript**, **MongoDB** and **React JS**. 
This service handles user authentication, chat interactions, and message storage with a React-made interface.

---

## 🚀 Features

- User registration and login using secure authentication  
- AI chat endpoint with contextual conversation history  
- MongoDB integration using Mongoose  
- TypeScript for type safety and maintainability  
- Cookie and CORS support for frontend integration  

---

## 🛠️ Tech Stack

- **Runtime:** Node.js  
- **Framework:** Express, React JS 
- **Language:** TypeScript  
- **Database:** MongoDB (via Mongoose)  
- **Environment Management:** dotenv  

---

## 📦 Installation

### To clone the repo
```bash
git clone https://github.com/samik009b/perceptech.git
```

### Setup environment variables
Create a `.env` file in the root directory and configure according to the .env.example file

---

### To run the application
```bash
cd backend 
npm install
npm run dev

```
And in another terminal
```bash
cd frontend 
npm install
npm run dev

```

## 🧩 Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Runs the server in development mode using `nodemon` |
| `npm run build` | Compiles TypeScript to JavaScript |
| `npm start` | Runs the compiled server from the `dist/` folder |

---

## 📚 API Endpoints

### Auth Routes
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/user/register` | Register a new user |
| `POST` | `/user/login` | Log in an existing user |

### Chat Routes
| Method | Endpoint | Description |
|---------|-----------|-------------|
| `POST` | `/api/chat` | Send a message to the chat model |
| `GET` | `/api/chat/history` | Get recent chat history |
