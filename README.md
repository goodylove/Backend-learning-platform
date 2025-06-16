---



````markdown
# 🧠 Online Learning Platform API

A backend API for an online learning platform built with **Node.js**, **Express**, **PostgreSQL**, and **Prisma**. Includes JWT authentication, course/user management, Swagger API documentation, and CI/CD support.

---

## 🚀 Features

- 🔐 User authentication (JWT)
- 📚 Course & lesson management
- 🧑‍🎓 Student & instructor roles
- 🧪 Unit testing with Jest + Supertest
- 📝 API docs with Swagger
- 📦 Dockerized development
- ☁️ Ready for deployment (AWS, Nginx, CI/CD)
- 🧰 Clean, modular folder structure

---

## 🧱 Tech Stack

- **Node.js** + **Express**
- **PostgreSQL** with **Prisma ORM**
- **Jest** & **Supertest** for testing
- **Swagger** for API docs
- **Docker** for containerization
- **GitHub Actions** (CI/CD)
- **Nginx** as reverse proxy (for deployment)

---

## 🛠️ Getting Started

### Clone and Install

```bash
https://github.com/goodylove/Backend-learning-platform.git
cd Backend-learning-platform
npm install
```

### Set Up Environment

Create a `.env` file:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@localhost:5432/Backend-learning-platform
JWT_SECRET=supersecretkey
```

### Start Dev Server

```bash
npm run dev
```

---

## 🧪 Run Tests

```bash
npm test
```

---

## 📚 API Docs

Start the server, then visit:

```
http://localhost:3000/api-docs
```

Uses Swagger UI for interactive RESTful API documentation.

---

## 🚀 Deployment

This project is ready to be deployed using:

- Docker & Docker Compose
- Nginx (as a reverse proxy)
- AWS EC2 / ECS / Lightsail
- GitHub Actions (CI/CD)

---

## 📂 Project Structure

```
src/
├── controllers/
├── routes/
├── middlewares/
├── services/
├── models/
├── tests/
├── app.js
prisma/
.env
README.md
```
