Mini Plant Store

A full-stack web application for browsing and managing a plant catalog.  
Built as part of the Urvann Software Development Intern Assignment.

---

Features

Customer (Home Page `/`)
- Browse plants in a clean responsive grid
- Search by plant name or category
- Filter plants by category
- View plant details:
  - Price
  - Categories
  - Availability
  - Image

Admin (Dashboard `/admin`)
- Add new plants with:
  - Name, Price, Categories, Availability
  - Upload image from PC with preview
- Edit plant details
- Delete plants
- Dashboard summary (statistics):
  - Total Plants
  - Available vs Unavailable
  - Category counts

Backend (Node.js + Express + MongoDB)
- REST API for CRUD operations
- Multer setup for image uploads
- MongoDB schema with validation
- Search & filtering in queries

---

Tech Stack

- Frontend: Next.js (React), TailwindCSS, Axios
- Backend: Node.js, Express.js, Multer, Mongoose
- Database: MongoDB (local or Atlas)
- Deployment: Vercel (frontend) + Render (backend)

---

Installation & Setup

Prerequisites
- Node.js (v16 or later)
- npm (comes with Node.js)
- MongoDB (local instance or Atlas cluster)
- Git

---

Backend Setup

cd backend
npm install

Create a .env file inside backend/:

MONGO_URI=your_mongodb_connection_string
PORT=5000

Start the server:

node index.js

---

Frontend Setup

cd frontend
npm install
npm run dev

---

Submission

- GitHub Repo: https://github.com/prasannaedu/urvann-assignment
- Deployed Link:
  - Frontend (Live): https://urvann-assignment-brcv1gvth-prasannaedus-projects.vercel.app/
  - Backend API (Live): https://urvann-assignment-ui8k.onrender.com/plants
