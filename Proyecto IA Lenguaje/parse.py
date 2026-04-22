import json

data = """Jornada 1
Equipo local
Resultado
Equipo visitante
México
México
11/06
21:00
Sudáfrica
Sudáfrica
Corea del Sur
Corea del Sur
12/06
04:00
República Checa
República Checa
Canadá
Canadá
12/06
21:00
Bosnia Herzegovina
Bosnia Herzegovina
Estados Unidos
Estados Unidos
13/06
03:00
Paraguay
Paraguay
Qatar
Qatar
13/06
21:00
Suiza
Suiza
Brasil
Brasil
14/06
00:00
Marruecos
Marruecos
Haití
Haití
14/06
03:00
Escocia
Escocia
Australia
Australia
14/06
06:00
Turquía
Turquía
Alemania
Alemania
14/06
19:00
Curaçao
Curaçao
Países Bajos
Países Bajos
14/06
22:00
Japón
Japón
Costa de Marfil
Costa de Marfil
15/06
01:00
Ecuador
Ecuador
Suecia
Suecia
15/06
04:00
Túnez
Túnez
España
España
15/06
18:00
Cabo Verde
Cabo Verde
Bélgica
Bélgica
15/06
21:00
Egipto
Egipto
Arabia Saudí
Arabia Saudí
16/06
00:00
Uruguay
Uruguay
Irán
Irán
16/06
03:00
Nueva Zelanda
Nueva Zelanda
Francia
Francia
16/06
21:00
Senegal
Senegal
Iraq
Iraq
17/06
00:00
Noruega
Noruega
Argentina
Argentina
17/06
03:00
Argelia
Argelia
Austria
Austria
17/06
06:00
Jordania
Jordania
Portugal
Portugal
17/06
19:00
Congo
Congo
Inglaterra
Inglaterra
17/06
22:00
Croacia
Croacia
Ghana
Ghana
18/06
01:00
Panamá
Panamá
Uzbekistán
Uzbekistán
18/06
04:00
Colombia
Colombia
Ir arriba
Jornada 2
Equipo local
Resultado
Equipo visitante
República Checa
República Checa
18/06
18:00
Sudáfrica
Sudáfrica
Suiza
Suiza
18/06
21:00
Bosnia Herzegovina
Bosnia Herzegovina
Canadá
Canadá
19/06
00:00
Qatar
Qatar
México
México
19/06
03:00
Corea del Sur
Corea del Sur
Estados Unidos
Estados Unidos
19/06
21:00
Australia
Australia
Escocia
Escocia
20/06
00:00
Marruecos
Marruecos
Brasil
Brasil
20/06
02:30
Haití
Haití
Turquía
Turquía
20/06
05:00
Paraguay
Paraguay
Países Bajos
Países Bajos
20/06
19:00
Suecia
Suecia
Alemania
Alemania
20/06
22:00
Costa de Marfil
Costa de Marfil
Ecuador
Ecuador
21/06
02:00
Curaçao
Curaçao
Túnez
Túnez
21/06
06:00
Japón
Japón
España
España
21/06
18:00
Arabia Saudí
Arabia Saudí
Bélgica
Bélgica
21/06
21:00
Irán
Irán
Uruguay
Uruguay
22/06
00:00
Cabo Verde
Cabo Verde
Nueva Zelanda
Nueva Zelanda
22/06
03:00
Egipto
Egipto
Argentina
Argentina
22/06
19:00
Austria
Austria
Francia
Francia
22/06
23:00
Iraq
Iraq
Noruega
Noruega
23/06
02:00
Senegal
Senegal
Jordania
Jordania
23/06
05:00
Argelia
Argelia
Portugal
Portugal
23/06
19:00
Uzbekistán
Uzbekistán
Inglaterra
Inglaterra
23/06
22:00
Ghana
Ghana
Panamá
Panamá
24/06
01:00
Croacia
Croacia
Colombia
Colombia
24/06
04:00
Congo
Congo
Ir arriba
Jornada 3
Equipo local
Resultado
Equipo visitante
Bosnia Herzegovina
Bosnia Herzegovina
24/06
21:00
Qatar
Qatar
Suiza
Suiza
24/06
21:00
Canadá
Canadá
Marruecos
Marruecos
25/06
00:00
Haití
Haití
Escocia
Escocia
25/06
00:00
Brasil
Brasil
República Checa
República Checa
25/06
03:00
México
México
Sudáfrica
Sudáfrica
25/06
03:00
Corea del Sur
Corea del Sur
Curaçao
Curaçao
25/06
22:00
Costa de Marfil
Costa de Marfil
Ecuador
Ecuador
25/06
22:00
Alemania
Alemania
Japón
Japón
26/06
01:00
Suecia
Suecia
Túnez
Túnez
26/06
01:00
Países Bajos
Países Bajos
Paraguay
Paraguay
26/06
04:00
Australia
Australia
Turquía
Turquía
26/06
04:00
Estados Unidos
Estados Unidos
Noruega
Noruega
26/06
21:00
Francia
Francia
Senegal
Senegal
26/06
21:00
Iraq
Iraq
Cabo Verde
Cabo Verde
27/06
02:00
Arabia Saudí
Arabia Saudí
Uruguay
Uruguay
27/06
02:00
España
España
Egipto
Egipto
27/06
05:00
Irán
Irán
Nueva Zelanda
Nueva Zelanda
27/06
05:00
Bélgica
Bélgica
Croacia
Croacia
27/06
23:00
Ghana
Ghana
Panamá
Panamá
27/06
23:00
Inglaterra
Inglaterra
Colombia
Colombia
28/06
01:30
Portugal
Portugal
Congo
Congo
28/06
01:30
Uzbekistán
Uzbekistán
Argelia
Argelia
28/06
04:00
Austria
Austria
Jordania
Jordania
28/06
04:00
Argentina
Argentina"""

lines = data.split('\n')
jornada = 0
matches = {1: [], 2: [], 3: []}
i = 0
while i < len(lines):
    line = lines[i].strip()
    if not line:
        i += 1
        continue
    if line.startswith('Jornada '):
        jornada = int(line.split(' ')[1])
        i += 1
        continue
    if line in ('Equipo local', 'Resultado', 'Equipo visitante', 'Ir arriba'):
        i += 1
        continue
        
    if i + 5 < len(lines):
        t1 = lines[i].strip()
        t1_dup = lines[i+1].strip()
        date = lines[i+2].strip()
        time = lines[i+3].strip()
        t2 = lines[i+4].strip()
        t2_dup = lines[i+5].strip()
        
        matches[jornada].append({
            't1': t1,
            't2': t2,
            'date': date,
            'time': time
        })
        i += 6
    else:
        i += 1

with open('c:\\Users\\NachoPc\\Desktop\\Proyecto IA Lenguaje\\parsed_matches.json', 'w', encoding='utf8') as f:
    json.dump(matches, f, ensure_ascii=False, indent=2)
