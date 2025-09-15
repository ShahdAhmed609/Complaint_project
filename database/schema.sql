CREATE TABLE students (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);
CREATE TABLE complaints (
    id SERIAL PRIMARY KEY,
    student_id INT REFERENCES students(id),
    title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    suggestion TEXT,
    file_path VARCHAR(255),
    status VARCHAR(20) DEFAULT 'pending'
);
CREATE TABLE admins (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL
);
