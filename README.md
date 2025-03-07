# 🚀 Project Setup Guide

Follow these steps to set up and run the project on your local system.

---

## 📌 **Prerequisites**

Before starting, make sure you have the following installed on your system:

- **Docker**
- **[Node.js](https://nodejs.org/)**

---

## 🛠 **Setup Instructions**

### 1️⃣ **Clone the Repository**

sh

CopyEdit

`git clone <repository-url>
cd <repository-folder>`

### 2️⃣ **Set Environment Variables**

- **Frontend**:

  - Navigate to the `frontend` folder:

    sh

    CopyEdit

    `cd frontend`

  - Create a `.env.local` file and add the required environment variables.
  - Example:

    ini

    CopyEdit

    `NEXT_PUBLIC_API_URL=http://localhost:5000`

- **Backend**:

  - Navigate to the `backend` folder:

    sh

    CopyEdit

    `cd backend`

  - Create a `.env` file and add the required environment variables.
  - Example:

    ini

    CopyEdit

    `DATABASE_URL=mongodb://localhost:27017/mydb
JWT_SECRET=your_secret_key`

---

### 3️⃣ **Ensure Docker is Installed**

Check if Docker is installed by running:

sh

CopyEdit

`docker --version`

If Docker is not installed, download it from here.

---

### 4️⃣ **Ensure Node.js is Installed**

Check if Node.js is installed by running:

sh

CopyEdit

`node -v`

If not installed, download it from [here](https://nodejs.org/).

---

### 5️⃣ **Run the Application using Docker Compose**

In the root project folder, run:

sh

CopyEdit

`docker compose up --build -d`

This command:\
✅ Builds the application\
✅ Runs the application in a **detached mode** (`-d` runs it in the background)

---

## 🎯 **Access the Application**

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:5000`

---

## 🛑 **Stopping the Application**

To stop and remove the running containers, run:

sh

CopyEdit

`docker compose down`

---

## 🎉 **You're All Set!**

Now you can start using the application. 🚀

If you encounter any issues, check the logs using:

sh

CopyEdit

`docker compose logs -f`

4o
