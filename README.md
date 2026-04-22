⚽ PorraMundial 2026
Aplicación web para gestionar una porra del Mundial de Fútbol 2026 entre amigos. Los participantes hacen predicciones por fases, acumulan puntos y compiten en un ranking.

El proyecto tiene dos versiones:

---

🐍 Versión Python + HTML/JS
Versión ligera para ejecutar localmente. El servidor está hecho en Python y los usuarios se guardan en un fichero SQL.

index.html — Frontend completo de la aplicación
script.js — Lógica del cliente: partidos, jornadas y navegación
style.css — Estilos visuales
server.py — Servidor HTTP con una API para registrar usuarios
parse.py — Genera el calendario de partidos a partir de datos externos
apply.py — Inyecta el calendario generado dentro de script.js
update_bracket.py — Actualiza el bracket de eliminatorias
parsed_matches.json — Calendario de partidos en formato JSON
usuarios.sql — Base de datos con los usuarios registrados

---

⚛️ Versión React + Firebase
Versión completa con autenticación, base de datos en la nube y panel de administración. Construida con React, TypeScript y Firebase.

Login.tsx — Pantalla de inicio de sesión y registro
GroupPhase.tsx — Predicción del top 3 de cada grupo
DailyPhase.tsx — Predicción del marcador del partido del día
BracketPhase.tsx — Predicción de la fase de eliminatorias
FinalPhase.tsx — Predicción del partido final
Ranking.tsx — Clasificación general de participantes
AdminPanel.tsx — Gestión de usuarios y resultados (solo admin)
scoring.ts — Lógica de puntuación por fase
worldcup.ts — Grupos, equipos, plazos y reglas de puntuación
firebase.ts — Configuración de la conexión con Firebase
firestore.rules — Reglas de seguridad de la base de datos
