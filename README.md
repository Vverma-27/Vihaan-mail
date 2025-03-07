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

`git clone <repository-url>
cd <repository-folder>`

### 2️⃣ **Set Environment Variables**

- **Frontend**:

  - Navigate to the `frontend` folder:

    `cd frontend`

  - Create a `.env.local` file and add the required environment variables.
  - Use the .env.example to see what all variables you have to use
  - Example:

    `NEXT_PUBLIC_API_URL=http://localhost:5000`

- **Backend**:

  - Navigate to the `backend` folder:

    `cd backend`

  - Create a `.env` file and add the required environment variables.
  - Use the .env.example to see what all variables you have to use
  - Example:

    `DATABASE_URL=mongodb://localhost:27017/mydb`

---

### 3️⃣ **Ensure Docker is Installed**

Check if Docker is installed by running:

`docker --version`

If Docker is not installed, please install it first

### 4️⃣ **Ensure Node.js is Installed**

Check if Node.js is installed by running:

`node -v`

If not installed, please download it first

---

### 5️⃣ **Modify Docker Compose File (if necessary)**

Open the `docker-compose.yml` file in the root directory and make sure the Caddy service is commented out:

```yaml
# Comment out or remove the following section since you don't need Caddy for local development
#caddy:
#  image: caddy:2
#  container_name: caddy
#  ports:
#    - "80:80"
#    - "443:443"
#  volumes:
#    - ./Caddyfile:/etc/caddy/Caddyfile
#    - caddy_data:/data
#    - caddy_config:/config
#  networks:
#    - app-network
#  restart: unless-stopped
```

---

### 6️⃣ **Run the Application using Docker Compose**

In the root project folder, run:

`docker compose up --build -d`

This command:\
✅ Builds the application\
✅ Runs the application in a **detached mode** (`-d` runs it in the background)

---

### 7️⃣ **Run Database Migrations**

After the Docker containers are up and running, you need to run the database migrations:

1.  Navigate to the backend directory:

    cd backend

2.  Run the migration command:

    pnpm db:migrate

    or if using npm:

    npm run db:migrate

This step ensures your database schema is properly set up with all the required tables and relationships.

## 🎯 **Access the Application**

- **Frontend**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000`

---

## 🛑 **Stopping the Application**

To stop and remove the running containers, run:

`docker compose down`

---

## 🎉 **You're All Set!**

Now you can start using the application. 🚀

If you encounter any issues, check the logs using:

`docker compose logs -f`
