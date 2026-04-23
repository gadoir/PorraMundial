import json
import re

with open('parsed_matches.json', 'r', encoding='utf8') as f:
    parsed_matches = json.load(f)

with open('script.js', 'r', encoding='utf8') as f:
    js_code = f.read()

# Replace Rep. Checa with República Checa
js_code = js_code.replace("'Rep. Checa'", "'República Checa'")
# Replace Bosnia y Herz. with Bosnia Herzegovina
js_code = js_code.replace("'Bosnia y Herz.'", "'Bosnia Herzegovina'")

match_schedule_str = 'const matchSchedule = ' + json.dumps(parsed_matches, ensure_ascii=False, indent=4) + ';\n'

start_marker = '// Generar partidos'
end_marker = 'function changeJornada(jornada) {'

if start_marker in js_code and end_marker in js_code:
    start_idx = js_code.find(start_marker)
    end_idx = js_code.find(end_marker)
    
    new_logic = match_schedule_str + '''
const teamLookup = {};
for (const [groupName, teams] of Object.entries(groups)) {
    teams.forEach(team => {
        teamLookup[team.name] = { ...team, group: groupName };
    });
}

function renderMatches(jornada) {
    const container = document.getElementById('matches-container');
    if (!container) return;
    
    container.innerHTML = '';
    const matches = matchSchedule[jornada] || [];
    
    matches.forEach((match, index) => {
        const team1 = teamLookup[match.t1] || { code: match.t1.substring(0,3).toUpperCase(), name: match.t1, flag: 'un', group: '?' };
        const team2 = teamLookup[match.t2] || { code: match.t2.substring(0,3).toUpperCase(), name: match.t2, flag: 'un', group: '?' };
        
        // Asignar una sede basada en el índice para que sea consistente
        const venue = venues[index % venues.length];
        
        const card = document.createElement('div');
        card.className = 'bg-brand-card rounded-2xl border border-slate-700 overflow-hidden hover-lift flex flex-col';
        card.innerHTML = `
            <div class="bg-slate-900 py-3 px-5 border-b border-slate-700 flex justify-between items-center">
                <span class="text-xs font-bold text-brand-green uppercase tracking-wider">Grupo ${team1.group}</span>
                <span class="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">${match.date} • ${match.time}</span>
            </div>
            <div class="p-6 flex-grow flex flex-col justify-center">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3 w-2/5">
                        <img src="https://flagcdn.com/w40/${team1.flag}.png" class="w-8 h-auto rounded-sm shadow-sm" alt="${team1.name}">
                        <span class="font-bold text-white text-lg">${team1.code}</span>
                    </div>
                    <div class="w-1/5 text-center">
                        <span class="bg-slate-900 border border-slate-700 text-white font-black px-3 py-1 rounded-lg">- : -</span>
                    </div>
                    <div class="flex items-center justify-end space-x-3 w-2/5">
                        <span class="font-bold text-white text-lg">${team2.code}</span>
                        <img src="https://flagcdn.com/w40/${team2.flag}.png" class="w-8 h-auto rounded-sm shadow-sm" alt="${team2.name}">
                    </div>
                </div>
                <div class="text-center text-xs text-slate-500 mt-2 flex justify-center items-center">
                    <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    ${venue}
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

'''
    js_code = js_code[:start_idx] + new_logic + js_code[end_idx:]
    
    with open('script.js', 'w', encoding='utf8') as f:
        f.write(js_code)
    print('Updated script.js successfully')
else:
    print('Failed to find markers')
