CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id),
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    suggestion TEXT,
    file_path VARCHAR(255),
    status VARCHAR(20),
    reply TEXT,
    created_at TIMESTAMP
);

CREATE TABLE suggestions (
    id SERIAL PRIMARY KEY,
    student_id INT NOT NULL REFERENCES students(id),
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    file_path VARCHAR(255),
    status VARCHAR(50),
    admin_reply TEXT,
    created_at TIMESTAMP
);

