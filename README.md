# Student Complaint Management System

A full-stack web application for managing student complaints and suggestions.
The system allows students to submit complaints or suggestions, while administrators can review, reply, and manage submitted requests.

## Features

* Student registration and login
* Admin login
* Submit complaints
* Submit suggestions
* Upload attachments
* Track complaint/suggestion status
* Admin dashboard for reviewing requests
* Reply system for admins
* Dockerized development setup

## Tech Stack

### Frontend

* Next.js
* TypeScript
* JavaScript
* Tailwind CSS

### Backend

* Python
* Flask
* JWT Authentication
* SQLAlchemy

### Database

* PostgreSQL

### DevOps

* Docker
* Docker Compose

## Project Structure

```text
Complaint_project/
├── backend/
├── frontend/
├── database/
├── docker-compose.yml
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/ShahdAhmed609/Complaint_project.git
cd Complaint_project
```

### 2. Create environment file

Create a `.env` file and add your local environment variables.

Example:

```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_password
POSTGRES_DB=complaint_db
POSTGRES_HOST=db
POSTGRES_PORT=5432

FLASK_SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret_key
```

### 3. Run using Docker

```bash
docker-compose up --build
```

## Main Roles

### Student

Students can create an account, log in, submit complaints or suggestions, upload files, and track request status.

### Admin

Admins can view submitted complaints and suggestions, update their status, and reply to students.

## Future Improvements

* Add email notifications
* Improve dashboard analytics
* Add advanced search and filters
* Add role-based permissions
* Add unit and integration tests

## Team Members

This is a team project.

* Add team member name here
* Add team member name here
* Add team member name here

## License

This project is for educational purposes.
