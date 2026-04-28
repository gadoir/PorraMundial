import http.server
import socketserver
import json
import os
import datetime

PORT = 8000
SQL_FILE = 'usuarios.sql'

class PorraHandler(http.server.SimpleHTTPRequestHandler):
    def _send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self._send_cors_headers()
        self.end_headers()

    def do_POST(self):
        if self.path == '/api/register':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                username = data.get('username', '').replace("'", "''")
                email = data.get('email', '').replace("'", "''")
                password = data.get('password', '').replace("'", "''")
                
                if not username or not email or not password:
                    self.send_response(400)
                    self._send_cors_headers()
                    self.end_headers()
                    self.wfile.write(b'{"error": "Faltan campos obligatorios"}')
                    return
                
                # Crear la sentencia SQL
                fecha = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                sql_statement = f"INSERT INTO usuarios (username, email, password, fecha_registro) VALUES ('{username}', '{email}', '{password}', '{fecha}');\n"
                
                # Si el archivo no existe, añadir la creación de la tabla
                file_exists = os.path.exists(SQL_FILE)
                with open(SQL_FILE, 'a', encoding='utf-8') as f:
                    if not file_exists:
                        f.write("/*\n")
                        f.write("  ==========================================================================\n")
                        f.write("  PORRA DEL MUNDIAL 2026 - BASE DE DATOS DE USUARIOS\n")
                        f.write("  ==========================================================================\n")
                        f.write("*/\n\n")
                        f.write("CREATE TABLE IF NOT EXISTS usuarios (\n")
                        f.write("    id INTEGER PRIMARY KEY AUTOINCREMENT,\n")
                        f.write("    username VARCHAR(100) NOT NULL,\n")
                        f.write("    email VARCHAR(150) NOT NULL,\n")
                        f.write("    password VARCHAR(255) NOT NULL,\n")
                        f.write("    fecha_registro DATETIME\n")
                        f.write(");\n\n")
                    
                    f.write(sql_statement)
                
                # Responder con éxito
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write('{"success": true, "message": "Usuario registrado y SQL guardado"}'.encode('utf-8'))
            
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(f'{{"error": "{str(e)}" }}'.encode())

        elif self.path == '/api/save_motd':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                # Guardar en un archivo JSON para persistencia simple
                with open('motd.json', 'w', encoding='utf-8') as f:
                    json.dump(data, f, ensure_ascii=False, indent=4)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write('{"success": true, "message": "Partido del día guardado"}'.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(f'{{"error": "{str(e)}" }}'.encode())

        elif self.path == '/api/save_prediction':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                username = data.get('username', '').replace("'", "''")
                match_id = data.get('matchId', '').replace("'", "''")
                sign = data.get('sign', '').replace("'", "''")
                timestamp = data.get('timestamp', '')
                
                # Crear la sentencia SQL
                sql_file = 'pronostico_diario.sql'
                file_exists = os.path.exists(sql_file)
                
                sql_statement = f"INSERT INTO pronosticos_diarios (username, match_id, sign, fecha_pronostico) VALUES ('{username}', '{match_id}', '{sign}', '{timestamp}');\n"
                
                with open(sql_file, 'a', encoding='utf-8') as f:
                    if not file_exists:
                        f.write("/*\n")
                        f.write("  ==========================================================================\n")
                        f.write("  PORRA DEL MUNDIAL 2026 - PRONÓSTICOS DIARIOS\n")
                        f.write("  ==========================================================================\n")
                        f.write("*/\n\n")
                        f.write("CREATE TABLE IF NOT EXISTS pronosticos_diarios (\n")
                        f.write("    id INTEGER PRIMARY KEY AUTOINCREMENT,\n")
                        f.write("    username VARCHAR(100) NOT NULL,\n")
                        f.write("    match_id VARCHAR(255) NOT NULL,\n")
                        f.write("    sign VARCHAR(2) NOT NULL,\n")
                        f.write("    fecha_pronostico DATETIME\n")
                        f.write(");\n\n")
                    f.write(sql_statement)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write('{"success": true, "message": "Pronóstico guardado en SQL"}'.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(f'{{"error": "{str(e)}" }}'.encode())
        
        elif self.path == '/api/save_porra':
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            
            try:
                data = json.loads(post_data.decode('utf-8'))
                username = data.get('username', '').replace("'", "''")
                predictions = data.get('predictions', [])
                
                sql_file = 'porras.sql'
                file_exists = os.path.exists(sql_file)
                
                with open(sql_file, 'a', encoding='utf-8') as f:
                    if not file_exists:
                        f.write("/*\n")
                        f.write("  ==========================================================================\n")
                        f.write("  PORRA DEL MUNDIAL 2026 - EXPORTACIÓN DE GRUPOS (SERVER-SIDE)\n")
                        f.write("  ==========================================================================\n")
                        f.write("*/\n\n")
                        f.write("CREATE TABLE IF NOT EXISTS porras (\n")
                        f.write("    id INTEGER PRIMARY KEY AUTOINCREMENT,\n")
                        f.write("    username VARCHAR(100) NOT NULL,\n")
                        f.write("    grupo VARCHAR(5) NOT NULL,\n")
                        f.write("    p1 VARCHAR(100),\n")
                        f.write("    p2 VARCHAR(100),\n")
                        f.write("    p3 VARCHAR(100),\n")
                        f.write("    detalle_texto TEXT,\n")
                        f.write("    fecha_creacion DATETIME\n")
                        f.write(");\n\n")
                    
                    fecha = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    f.write(f"-- Entrada de {username} ({fecha})\n")
                    for p in predictions:
                        group = p.get('group', '').replace("'", "''")
                        p1 = p.get('p1', '').replace("'", "''")
                        p2 = p.get('p2', '').replace("'", "''")
                        p3 = p.get('p3', '').replace("'", "''")
                        # Formato solicitado por el usuario: grupo A puesto 1 /* nombre del pais 2/*nombre del pais 3
                        detalle = f"Grupo {group} puesto 1: {p1} /* {p2} /* {p3}"
                        
                        sql_statement = f"INSERT INTO porras (username, grupo, p1, p2, p3, detalle_texto, fecha_creacion) VALUES ('{username}', '{group}', '{p1}', '{p2}', '{p3}', '{detalle}', '{fecha}');\n"
                        f.write(sql_statement)
                
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write('{"success": true, "message": "Porra guardada en SQL"}'.encode('utf-8'))
            except Exception as e:
                self.send_response(500)
                self._send_cors_headers()
                self.end_headers()
                self.wfile.write(f'{{"error": "{str(e)}" }}'.encode())
        else:
            self.send_response(404)
            self._send_cors_headers()
            self.end_headers()

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), PorraHandler) as httpd:
        print(f"Servidor backend iniciado en http://localhost:{PORT}")
        print("Presiona Ctrl+C para detenerlo.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            pass
        print("Servidor detenido.")
