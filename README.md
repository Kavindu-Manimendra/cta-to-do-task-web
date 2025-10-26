## 🧩 Full-Stack To-Do Task Web Application

This repository contains a full-stack To-Do Task web application built with:
- **Frontend:** React, TypeScript, Vite
- **Backend:** Spring Boot (Java)
- **Database:** MySQL
- **Containerization:** Docker & Docker Compose

## 🚀 Features
- Create, mark, and view tasks
- RESTful APIs built using Spring Boot
- Responsive frontend UI built with React + TypeScript
- Containerized environment using Docker Compose
- Easy setup for local or production deployment

## 🧱 Build & Run with Docker Compose
1. Clone the Repository
- git clone [Kavindu-Manimendra/cta-to-do-task-web](https://github.com/Kavindu-Manimendra/cta-to-do-task-web)
2. Navigate into the Project Directory
- cd your-project
3. Create a .env File in the Root Directory
- Create a new file named .env (in the same directory as your docker-compose.yml) and add the following environment variables:
  ```
  #Database settings
  MYSQL_ROOT_PASSWORD=root
  MYSQL_DATABASE=myappdb

  # Backend settings
  SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/myappdb
  SPRING_DATASOURCE_USERNAME=root
  SPRING_DATASOURCE_PASSWORD=root
  ```
- These variables configure MySQL and connect your Spring Boot backend to the database automatically.
4. Build and Run with Docker Compose
- `docker-compose up --build`

## Access the Application
| Service      | URL                                            |
| ------------ | ---------------------------------------------- |
| 🖥️ Frontend | [http://localhost:3000](http://localhost:3000) |
| ⚙️ Backend   | [http://localhost:9091](http://localhost:9091) |
| 🗄️ Database | localhost:3307     |











