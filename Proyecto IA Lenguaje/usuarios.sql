CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password VARCHAR(255) NOT NULL,
    fecha_registro DATETIME
);

INSERT INTO usuarios (username, email, password, fecha_registro) VALUES ('asdsa', 'nacho@gmail.com', 'nachaodf', '2026-04-22 23:49:52');
INSERT INTO usuarios (username, email, password, fecha_registro) VALUES ('nacho', 'nachogadsf@gmail.com', 'hadikas', '2026-04-22 23:52:53');
