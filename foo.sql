DROP TABLE IF EXISTS students;
CREATE TABLE students(id INT, s_name VARCHAR(100), PRIMARY KEY(id));
INSERT INTO students(id, s_name) VALUE (1, 'George');
INSERT INTO students(id, s_name) VALUE (2, 'John');
INSERT INTO students(id, s_name) VALUE (3, 'Thom');
INSERT INTO students(id, s_name) VALUE (4, 'James');