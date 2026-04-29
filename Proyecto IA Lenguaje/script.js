// Inicialización de EmailJS
(function() {
    if (typeof emailjs !== 'undefined') {
        emailjs.init("6klM2ow43hZubJzPt");
    } else {
        console.warn("EmailJS SDK no cargado. Las notificaciones por correo no funcionarán.");
    }
})();

// Variables Globales
let teamsStats = {};

const groups = {
    'A': [
        { code: 'MEX', name: 'México', flag: 'mx' },
        { code: 'RSA', name: 'Sudáfrica', flag: 'za' },
        { code: 'KOR', name: 'Corea del Sur', flag: 'kr' },
        { code: 'CZE', name: 'República Checa', flag: 'cz' }
    ],
    'B': [
        { code: 'CAN', name: 'Canadá', flag: 'ca' },
        { code: 'BIH', name: 'Bosnia Herzegovina', flag: 'ba' },
        { code: 'QAT', name: 'Qatar', flag: 'qa' },
        { code: 'SUI', name: 'Suiza', flag: 'ch' }
    ],
    'C': [
        { code: 'USA', name: 'Estados Unidos', flag: 'us' },
        { code: 'PAR', name: 'Paraguay', flag: 'py' },
        { code: 'AUS', name: 'Australia', flag: 'au' },
        { code: 'TUR', name: 'Turquía', flag: 'tr' }
    ],
    'D': [
        { code: 'BRA', name: 'Brasil', flag: 'br' },
        { code: 'MAR', name: 'Marruecos', flag: 'ma' },
        { code: 'HAI', name: 'Haití', flag: 'ht' },
        { code: 'SCO', name: 'Escocia', flag: 'gb-sct' }
    ],
    'E': [
        { code: 'GER', name: 'Alemania', flag: 'de' },
        { code: 'CUW', name: 'Curaçao', flag: 'cw' },
        { code: 'CIV', name: 'Costa de Marfil', flag: 'ci' },
        { code: 'ECU', name: 'Ecuador', flag: 'ec' }
    ],
    'F': [
        { code: 'NED', name: 'Países Bajos', flag: 'nl' },
        { code: 'JPN', name: 'Japón', flag: 'jp' },
        { code: 'SWE', name: 'Suecia', flag: 'se' },
        { code: 'TUN', name: 'Túnez', flag: 'tn' }
    ],
    'G': [
        { code: 'ESP', name: 'España', flag: 'es' },
        { code: 'CPV', name: 'Cabo Verde', flag: 'cv' },
        { code: 'KSA', name: 'Arabia Saudí', flag: 'sa' },
        { code: 'URU', name: 'Uruguay', flag: 'uy' }
    ],
    'H': [
        { code: 'BEL', name: 'Bélgica', flag: 'be' },
        { code: 'EGY', name: 'Egipto', flag: 'eg' },
        { code: 'IRN', name: 'Irán', flag: 'ir' },
        { code: 'NZL', name: 'Nueva Zelanda', flag: 'nz' }
    ],
    'I': [
        { code: 'FRA', name: 'Francia', flag: 'fr' },
        { code: 'SEN', name: 'Senegal', flag: 'sn' },
        { code: 'IRQ', name: 'Iraq', flag: 'iq' },
        { code: 'NOR', name: 'Noruega', flag: 'no' }
    ],
    'J': [
        { code: 'ARG', name: 'Argentina', flag: 'ar' },
        { code: 'ALG', name: 'Argelia', flag: 'dz' },
        { code: 'AUT', name: 'Austria', flag: 'at' },
        { code: 'JOR', name: 'Jordania', flag: 'jo' }
    ],
    'K': [
        { code: 'POR', name: 'Portugal', flag: 'pt' },
        { code: 'COD', name: 'Congo', flag: 'cd' },
        { code: 'UZB', name: 'Uzbekistán', flag: 'uz' },
        { code: 'COL', name: 'Colombia', flag: 'co' }
    ],
    'L': [
        { code: 'ENG', name: 'Inglaterra', flag: 'gb-eng' },
        { code: 'CRO', name: 'Croacia', flag: 'hr' },
        { code: 'GHA', name: 'Ghana', flag: 'gh' },
        { code: 'PAN', name: 'Panamá', flag: 'pa' }
    ]
};

const teamLookup = {};
for (const [groupName, teams] of Object.entries(groups)) {
    teams.forEach(team => {
        teamLookup[team.name] = { ...team, group: groupName };
    });
}


// --- Constantes del Cuadro Eliminatorio ---
const BRACKET_TEMPLATE = {
    dieciseisavos_L: [
        { id: 1, home: "2A", away: "2B", date: "28/06", time: "21:00" },
        { id: 2, home: "1C", away: "2F", date: "29/06", time: "19:00" },
        { id: 3, home: "1E", away: "3rd A/B/C/D/F", date: "29/06", time: "22:30" },
        { id: 4, home: "1F", away: "2C", date: "30/06", time: "03:00" },
        { id: 5, home: "2E", away: "2I", date: "30/06", time: "19:00" },
        { id: 6, home: "1I", away: "3rd C/D/F/G/H", date: "30/06", time: "23:00" },
        { id: 7, home: "1A", away: "3rd C/E/F/H/I", date: "01/07", time: "03:00" },
        { id: 8, home: "1L", away: "3rd E/H/I/J/K", date: "01/07", time: "18:00" }
    ],
    dieciseisavos_R: [
        { id: 1, home: "1G", away: "3rd A/E/H/I/J", date: "01/07", time: "22:00" },
        { id: 2, home: "1D", away: "3rd B/E/F/I/J", date: "02/07", time: "02:00" },
        { id: 3, home: "1H", away: "2J", date: "02/07", time: "21:00" },
        { id: 4, home: "2K", away: "2L", date: "03/07", time: "01:00" },
        { id: 5, home: "1B", away: "3rd E/F/G/I/J", date: "03/07", time: "05:00" },
        { id: 6, home: "2D", away: "2G", date: "03/07", time: "20:00" },
        { id: 7, home: "1J", away: "2H", date: "04/07", time: "00:00" },
        { id: 8, home: "1K", away: "3rd D/E/I/J/L", date: "04/07", time: "03:30" }
    ],
    roundSchedule: {
        "L-2": ["04/07, 19:00", "04/07, 23:00", "05/07, 22:00", "06/07, 02:00"],
        "R-2": ["06/07, 21:00", "07/07, 02:00", "07/07, 18:00", "07/07, 22:00"],
        "L-3": ["09/07, 22:00", "10/07, 21:00"],
        "R-3": ["11/07, 23:00", "12/07, 03:00"],
        "L-4": ["14/07, 21:00"],
        "R-4": ["15/07, 21:00"]
    },
    version: 1.8,
    final: [{ id: 1, home: "Por definir", away: "Por definir", date: "19/07", time: "21:00" }],
    third: [{ id: 1, home: "Por definir", away: "Por definir", date: "18/07", time: "23:00" }]
};

const STORAGE_KEY_BRACKET = 'world_cup_2026_bracket_v8';
let structureBracket = JSON.parse(localStorage.getItem(STORAGE_KEY_BRACKET)) || JSON.parse(JSON.stringify(BRACKET_TEMPLATE));

function saveBracket() {
    localStorage.setItem(STORAGE_KEY_BRACKET, JSON.stringify(structureBracket));
}

const configBracket = {
    L: {
        1: { next: "L-2", count: 8, startId: 1 },
        2: { next: "L-3", count: 4, startId: 1 },
        3: { next: "L-4", count: 2, startId: 1 },
        4: { next: "final", count: 1, startId: 1 }
    },
    R: {
        1: { next: "R-2", count: 8, startId: 9 },
        2: { next: "R-3", count: 4, startId: 5 },
        3: { next: "R-4", count: 2, startId: 3 },
        4: { next: "final", count: 1, startId: 2 }
    }
};

function getTeamInfo(name) {
    const cleanName = name ? name.trim() : "";
    if (typeof teamLookup !== 'undefined' && teamLookup[cleanName]) return teamLookup[cleanName];
    // Intentar buscar en groups si teamLookup no está listo o el nombre es exacto
    for (const groupTeams of Object.values(groups)) {
        const team = groupTeams.find(t => t.name === cleanName);
        if (team) return team;
    }
    return { flag: 'un', code: cleanName.substring(0, 3).toUpperCase(), name: cleanName, group: '?' };
}

function renderSide(side) {
    for (let round = 1; round <= 4; round++) {
        const col = document.getElementById(`col-${side}-${round}`);
        if (!col) continue;

        // Limpiar contenido previo
        const matches = col.querySelectorAll('.match-container, .match-spacer');
        matches.forEach(m => m.remove());

        const count = configBracket[side][round].count;
        const startId = configBracket[side][round].startId;

        for (let i = 0; i < count; i++) {
            const matchId = startId + i;
            const key = `${side}-${round}`;
            const schedule = structureBracket.roundSchedule[key] ? structureBracket.roundSchedule[key][i] : "TBD, TBD";

            let matchData;
            if (round === 1) {
                matchData = structureBracket[`dieciseisavos_${side}`][matchId - startId];
            } else {
                if (!structureBracket[key]) structureBracket[key] = [];
                while (structureBracket[key].length < matchId) {
                    structureBracket[key].push({ home: "Por definir", away: "Por definir", date: schedule.split(', ')[0], time: schedule.split(', ')[1] });
                }
                matchData = structureBracket[key][matchId - 1];
            }

            const homeInfo = getTeamInfo(matchData.home);
            const awayInfo = getTeamInfo(matchData.away);

            const container = document.createElement('div');
            container.className = `match-container ${i % 2 === 0 ? 'top-of-pair' : 'bottom-of-pair'} ${round > 1 ? 'is-entry' : ''}`;
            const spacerTop = document.createElement('div');
            spacerTop.className = "match-spacer";
            col.appendChild(spacerTop);
            const isHomeWinner = matchData.score1 !== undefined && matchData.score2 !== undefined && (matchData.score1 > matchData.score2 || (matchData.penalties && matchData.penalties.p1 > matchData.penalties.p2));
            const isAwayWinner = matchData.score1 !== undefined && matchData.score2 !== undefined && (matchData.score2 > matchData.score1 || (matchData.penalties && matchData.penalties.p2 > matchData.penalties.p1));

            container.innerHTML = `
                <div class="connector-in connector"></div>
                <div class="match-box">
                    <div class="match-header flex justify-between items-center">
                        <span>${matchData.date}, ${matchData.time}</span>
                    </div>
                    <div class="team-row group/row ${isHomeWinner ? 'bg-brand-green/10' : ''}" onclick="pick('${side}-${round}', ${matchId}, 'home')" id="${side}-${round}-${matchId}-home">
                        <div class="flex items-center flex-grow">
                            ${matchData.home !== "Por definir" ? `<img src="https://flagcdn.com/w20/${homeInfo.flag}.png" class="w-4 h-3 mr-2 rounded-sm shadow-sm ${isHomeWinner ? 'ring-1 ring-brand-green' : ''}">` : '<svg class="team-shield" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path></svg>'}
                            <span class="team-name ${isHomeWinner ? 'font-bold text-white' : ''}">${matchData.home === 'Por definir' ? t('tbd') : matchData.home}</span>
                        </div>
                        ${matchData.score1 !== undefined ? `<span class="match-score font-black ${isHomeWinner ? 'text-brand-green' : 'text-slate-400'} ml-2">${matchData.score1}${matchData.penalties ? `<span class="text-[8px] opacity-60 ml-0.5">(${matchData.penalties.p1})</span>` : ''}</span>` : ''}
                    </div>
                    <div class="team-row group/row ${isAwayWinner ? 'bg-brand-green/10' : ''}" onclick="pick('${side}-${round}', ${matchId}, 'away')" id="${side}-${round}-${matchId}-away">
                        <div class="flex items-center flex-grow">
                            ${matchData.away !== "Por definir" ? `<img src="https://flagcdn.com/w20/${awayInfo.flag}.png" class="w-4 h-3 mr-2 rounded-sm shadow-sm ${isAwayWinner ? 'ring-1 ring-brand-green' : ''}">` : '<svg class="team-shield" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path></svg>'}
                            <span class="team-name ${isAwayWinner ? 'font-bold text-white' : ''}">${matchData.away === 'Por definir' ? t('tbd') : matchData.away}</span>
                        </div>
                        ${matchData.score2 !== undefined ? `<span class="match-score font-black ${isAwayWinner ? 'text-brand-green' : 'text-slate-400'} ml-2">${matchData.score2}${matchData.penalties ? `<span class="text-[8px] opacity-60 ml-0.5">(${matchData.penalties.p2})</span>` : ''}</span>` : ''}
                    </div>
                    ${matchData.score1 !== undefined ? `
                    <div class="mt-2 pt-2 border-t border-slate-700/50 flex justify-center">
                        <button type="button" onclick="event.stopPropagation(); showMatchSummary('${side}-${round}-${matchId}')" class="flex items-center justify-center gap-1.5 w-full bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-slate-950 border border-brand-gold/30 text-[7px] font-black uppercase tracking-widest py-1.5 rounded transition-all shadow-lg hover:shadow-brand-gold/20">
                            <svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                            ${t('btn_summary')}
                        </button>
                    </div>
                    ` : ''}
                </div>
                ${round < 4 ? '<div class="connector-out connector"></div><div class="connector-vertical connector"></div>' : ''}
                ${round === 4 ? '<div class="connector-out connector"></div>' : ''}
            `;
            col.appendChild(container);
            if (i === count - 1) {
                const spacerBottom = document.createElement('div');
                spacerBottom.className = "match-spacer";
                col.appendChild(spacerBottom);
            }
        }
    }
}

function pick(key, matchId, pos) {
    const homeEl = document.getElementById(`${key}-${matchId}-home`);
    const awayEl = document.getElementById(`${key}-${matchId}-away`);
    if (!homeEl || !awayEl) return;

    const homeName = homeEl.querySelector('.team-name').innerText;
    const awayName = awayEl.querySelector('.team-name').innerText;

    if (homeName === "Por definir" || awayName === "Por definir") return;

    const winner = pos === 'home' ? homeName : awayName;
    const loser = pos === 'home' ? awayName : homeName;

    [homeEl, awayEl].forEach(el => el.classList.remove('selected'));
    const selected = pos === 'home' ? homeEl : awayEl;
    selected.classList.add('selected');

    if (key === 'final' || key === 'third') return;
    const [side, roundStr] = key.split('-');
    const round = parseInt(roundStr);
    const nextKey = configBracket[side][round].next;

    if (nextKey === 'final') {
        const finalPos = side === 'L' ? 'home' : 'away';
        updateBracketMatch('final', 1, finalPos, winner);
        updateBracketMatch('third', 1, finalPos, loser);
    } else {
        const nextMatchId = Math.ceil(matchId / 2);
        const nextPos = matchId % 2 === 0 ? 'away' : 'home';
        updateBracketMatch(nextKey, nextMatchId, nextPos, winner);
    }
}

function updateBracketMatch(key, id, pos, name) {
    console.log(`Advancing to ${key} Match ${id} ${pos}: ${name}`);

    // 1. Actualizar Datos
    if (!structureBracket[key]) structureBracket[key] = [];
    while (structureBracket[key].length < id) {
        structureBracket[key].push({ home: "Por definir", away: "Por definir" });
    }

    // Si el equipo cambia, reseteamos el marcador de este partido
    if (structureBracket[key][id - 1][pos] !== name) {
        delete structureBracket[key][id - 1].score1;
        delete structureBracket[key][id - 1].score2;
        delete structureBracket[key][id - 1].penalties;
    }

    structureBracket[key][id - 1][pos] = name;

    // Guardar en LocalStorage
    localStorage.setItem(STORAGE_KEY_BRACKET, JSON.stringify(structureBracket));

    // 2. Actualizar DOM si existe
    const elId = `${key}-${id}-${pos}`;
    const el = document.getElementById(elId);

    if (el) {
        const nameEl = el.querySelector('.team-name');
        if (nameEl) {
            nameEl.innerText = name;
            nameEl.style.color = name === "Por definir" ? '#94a3b8' : 'white';
        }
        el.classList.remove('selected');

        // Reemplazar escudo por bandera
        const teamInfo = getTeamInfo(name);
        const existingImg = el.querySelector('img');
        const existingSvg = el.querySelector('svg');
        const existingShield = el.querySelector('.team-shield');

        if (name !== "Por definir") {
            if (existingSvg) existingSvg.remove();
            if (existingShield) existingShield.remove();
            if (!existingImg) {
                const img = document.createElement('img');
                img.src = `https://flagcdn.com/w20/${teamInfo.flag}.png`;
                img.className = "w-4 h-3 mr-2 rounded-sm";
                el.prepend(img);
            } else {
                existingImg.src = `https://flagcdn.com/w20/${teamInfo.flag}.png`;
            }
        }

        clearDownstreamBracket(key, id);
    }
}

function clearDownstreamBracket(key, id) {
    if (key === 'final' || key === 'third') return;
    const [side, roundStr] = key.split('-');
    const round = parseInt(roundStr);
    const nextKey = configBracket[side][round].next;
    if (nextKey === 'final') {
        const finalPos = side === 'L' ? 'home' : 'away';
        resetBracketMatch('final', 1, finalPos);
        resetBracketMatch('third', 1, finalPos);
    } else {
        const nextMatchId = Math.ceil(id / 2);
        const nextPos = id % 2 === 0 ? 'away' : 'home';
        resetBracketMatch(nextKey, nextMatchId, nextPos);
    }
}

function resetBracketMatch(key, id, pos) {
    // Actualizar Datos
    if (structureBracket[key] && structureBracket[key][id - 1]) {
        structureBracket[key][id - 1][pos] = "Por definir";
        // Limpiar marcador al resetear equipo
        delete structureBracket[key][id - 1].score1;
        delete structureBracket[key][id - 1].score2;
        delete structureBracket[key][id - 1].penalties;

        localStorage.setItem(STORAGE_KEY_BRACKET, JSON.stringify(structureBracket));
    }

    const el = document.getElementById(`${key}-${id}-${pos}`);
    if (el) {
        el.querySelector('.team-name').innerText = "Por definir";
        el.querySelector('.team-name').style.color = '#94a3b8';
        el.classList.remove('selected');

        const img = el.querySelector('img');
        if (img) img.remove();
        if (!el.querySelector('svg')) {
            el.insertAdjacentHTML('afterbegin', '<svg class="team-shield" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path></svg>');
        }

        clearDownstreamBracket(key, id);
    }
}


// Lógica de la calculadora dinámica
function calcularPuntos() {
    const top3Input = document.getElementById('calc-top3');
    const exactInput = document.getElementById('calc-exact');
    const resultElement = document.getElementById('calc-resultado');

    let top3 = parseInt(top3Input.value) || 0;
    let exact = parseInt(exactInput.value) || 0;

    // Validaciones
    if (top3 > 3) { top3 = 3; top3Input.value = 3; }
    if (top3 < 0) { top3 = 0; top3Input.value = 0; }

    if (exact > 3) { exact = 3; exactInput.value = 3; }
    if (exact < 0) { exact = 0; exactInput.value = 0; }

    // No puedes tener más aciertos exactos que aciertos en el top 3
    if (exact > top3) {
        exact = top3;
        exactInput.value = exact;
        // Pequeño feedback visual
        exactInput.classList.add('border-red-500');
        setTimeout(() => exactInput.classList.remove('border-red-500'), 500);
    }

    // Cálculo: 1 punto por Top 3 + 2 puntos extra por posición exacta
    const total = (top3 * 1) + (exact * 2);

    // Animación del resultado si cambia
    if (resultElement.textContent !== total.toString()) {
        resultElement.style.transform = 'scale(1.3) translateY(-2px)';
        resultElement.style.color = '#10b981'; // brand-green

        setTimeout(() => {
            resultElement.textContent = total;
        }, 50);

        setTimeout(() => {
            resultElement.style.transform = 'scale(1) translateY(0)';
            resultElement.style.color = '#ffffff';
        }, 300);
    } else {
        resultElement.textContent = total;
    }
}

// Efecto Sticky Navbar
window.addEventListener('scroll', () => {
    const nav = document.getElementById('navbar');
    if (window.scrollY > 50) {
        nav.classList.add('shadow-xl', 'bg-slate-900/95');
        nav.classList.remove('glass-nav', 'border-transparent');
        nav.classList.add('border-slate-800');
    } else {
        nav.classList.remove('shadow-xl', 'bg-slate-900/95');
        nav.classList.add('glass-nav');
    }
});

// Lógica de Menú Móvil
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        const isHidden = mobileMenu.classList.contains('hidden');
        if (isHidden) {
            mobileMenu.classList.remove('hidden');
            menuIconOpen.classList.add('hidden');
            menuIconClose.classList.remove('hidden');
        } else {
            mobileMenu.classList.add('hidden');
            menuIconOpen.classList.remove('hidden');
            menuIconClose.classList.add('hidden');
        }
    });
}

// Cerrar menú móvil al hacer click en un enlace
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
    });
});

// Smooth scroll para anclas (Safari fallback)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const navHeight = document.getElementById('navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Lógica de Registro y Administración (Serverless con localStorage)
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const adminPanel = document.getElementById('admin-panel');
const showLoginBtn = document.getElementById('show-login-btn');
const downloadSqlBtn = document.getElementById('download-sql-btn');
const logoutBtn = document.getElementById('logout-btn');

// --- Lógica del Modal de Autenticación ---
const authModal = document.getElementById('auth-modal');
const authModalBtn = document.getElementById('auth-modal-btn');
const tabLogin = document.getElementById('tab-login');
const tabRegister = document.getElementById('tab-register');
const modalLoginForm = document.getElementById('modal-login-form');
const modalRegisterForm = document.getElementById('modal-register-form');

function openAuthModal(tab = 'login') {
    authModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Prevenir scroll
    switchTab(tab);
}

function closeAuthModal() {
    authModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function switchTab(tab) {
    if (tab === 'login') {
        tabLogin.classList.add('text-brand-green', 'border-brand-green');
        tabLogin.classList.remove('text-slate-500');
        tabRegister.classList.remove('text-brand-green', 'border-brand-green');
        tabRegister.classList.add('text-slate-500');
        modalLoginForm.classList.remove('hidden');
        modalRegisterForm.classList.add('hidden');
    } else {
        tabRegister.classList.add('text-brand-green', 'border-brand-green');
        tabRegister.classList.remove('text-slate-500');
        tabLogin.classList.remove('text-brand-green', 'border-brand-green');
        tabLogin.classList.add('text-slate-500');
        modalRegisterForm.classList.remove('hidden');
        modalLoginForm.classList.add('hidden');
    }
}

if (authModalBtn) authModalBtn.addEventListener('click', () => openAuthModal('login'));
if (tabLogin) tabLogin.addEventListener('click', () => switchTab('login'));
if (tabRegister) tabRegister.addEventListener('click', () => switchTab('register'));

// Sincronizar con el botón de "Ya tienes cuenta" del formulario original si existe
if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
        // Si el usuario usa el formulario de la página, también actualizamos el estado
        loginForm.classList.toggle('hidden');
        showLoginBtn.innerText = loginForm.classList.contains('hidden')
            ? '¿Ya tienes cuenta? Inicia sesión aquí'
            : 'Volver al registro';
    });
}

// Registro desde el Modal
if (modalRegisterForm) {
    modalRegisterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('modal-reg-username').value;
        const email = document.getElementById('modal-reg-email').value;
        const password = document.getElementById('modal-reg-password').value;
        const messageEl = document.getElementById('modal-reg-message');

        registerUser(username, email, password, messageEl, modalRegisterForm);
    });
}

// Registro desde la página (Mantener compatibilidad)
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const messageEl = document.getElementById('reg-message');

        registerUser(username, email, password, messageEl, registerForm);
    });
}

// Funcin para enviar correo de bienvenida/notificacin
async function sendRegistrationEmail(username, userEmail) {
    if (!userEmail) {
        console.error('EmailJS: No se puede enviar el correo porque la dirección está vacía.');
        return;
    }

    const serviceId = 'service_2g33bv8';
    const templateId = 'template_np5zizj';

    const templateParams = {
        to_name: username,
        to_email: userEmail,
        user_email: userEmail,
        email: userEmail,
        recipient: userEmail,
        message: `¡Bienvenido a la Porra del Mundial 2026, ${username}! Tu registro ha sido completado con éxito.`,
        reply_to: 'nachoperezgonzalez@gmail.com'
    };

    console.log('EmailJS: Intentando enviar correo a:', userEmail, 'con parámetros:', templateParams);

    try {
        const response = await emailjs.send(serviceId, templateId, templateParams);
        console.log('EmailJS: ¡Correo enviado con éxito!', response.status, response.text);
    } catch (error) {
        console.error('EmailJS ERROR:', error);
    }
}

// Nueva función para enviar recordatorios masivos
async function sendMatchReminders() {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    if (users.length === 0) {
        alert('No hay usuarios registrados a los que enviar el recordatorio.');
        return;
    }

    if (!confirm(`¿Estás seguro de que quieres enviar un recordatorio a los ${users.length} usuarios registrados?`)) {
        return;
    }

    const serviceId = 'service_zegoxxw';
    const templateId = 'template_9u9d0xo';
    const publicKey = '8GBUmaYPZUXNK39vF';

    let successCount = 0;
    let errorCount = 0;

    // Usamos un loop para enviar uno a uno (EmailJS no suele soportar envíos masivos directos en un solo llamado API desde el front)
    for (const user of users) {
        const templateParams = {
            to_name: user.username,
            to_email: user.email,
            message: '¡El partido del día empieza en 1 hora! No olvides revisar tus pronósticos.'
        };

        try {
            // Pasamos la publicKey como cuarto argumento para usar esta cuenta específica
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            successCount++;
            console.log(`Recordatorio enviado a ${user.email}`);
        } catch (error) {
            errorCount++;
            console.error(`Error enviando a ${user.email}:`, error);
        }
    }

    alert(`Proceso finalizado.\nEnviados con éxito: ${successCount}\nErrores: ${errorCount}`);
}

// Helper para esperar X milisegundos
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para enviar notificación de inicio de Fase 2
async function sendPhase2Notification() {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    if (users.length === 0) return;

    const serviceId = 'service_h3z0u3t';
    const templateId = 'template_j7sb8ut';
    const publicKey = 'cfjzgYVVUIlPLllfM';

    console.log('Enviando notificaciones de inicio de Fase 2...');

    for (const user of users) {
        const templateParams = {
            to_name: user.username,
            to_email: user.email,
            message: '¡La Fase 2 (Cuadro Eliminatorio) ha comenzado! Ya puedes entrar a completar tu cuadro.'
        };

        try {
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log(`Fase 2 enviada a: ${user.email}`);
            await sleep(1000); // Esperar 1 segundo entre correos
        } catch (error) {
            console.error(`Error enviando notificación Fase 2 a ${user.email}:`, error);
        }
    }
}

// Función para enviar notificación de inicio de Fase 3
async function sendPhase3Notification() {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    if (users.length === 0) return;

    const serviceId = 'service_h3z0u3t';
    const templateId = 'template_mipv87l';
    const publicKey = 'cfjzgYVVUIlPLllfM';

    console.log('Enviando notificaciones de inicio de Fase 3...');

    for (const user of users) {
        const templateParams = {
            to_name: user.username,
            to_email: user.email,
            message: '¡La Fase 3 (Gran Final) ha comenzado! Entra ya para poner tu marcador definitivo.'
        };

        try {
            await emailjs.send(serviceId, templateId, templateParams, publicKey);
            console.log(`Fase 3 enviada a: ${user.email}`);
            await sleep(1000); // Esperar 1 segundo entre correos
        } catch (error) {
            console.error(`Error enviando notificación Fase 3 a ${user.email}:`, error);
        }
    }
}

function registerUser(username, email, password, messageEl, form) {
    try {
        // Validar espacios en el nombre de usuario
        if (username.includes(' ')) {
            messageEl.classList.remove('hidden', 'bg-green-500/20', 'text-green-400');
            messageEl.classList.add('bg-red-500/20', 'text-red-400');
            messageEl.innerText = 'El nombre de usuario no puede contener espacios.';
            return;
        }

        let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
        if (users.some(u => u.username === username)) {
            messageEl.classList.remove('hidden', 'bg-green-500/20', 'text-green-400');
            messageEl.classList.add('bg-red-500/20', 'text-red-400');
            messageEl.innerText = 'El nombre de usuario ya existe.';
            return;
        }

        const newUser = {
            username,
            email,
            password,
            fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        users.push(newUser);
        localStorage.setItem('porra_users', JSON.stringify(users));

        messageEl.classList.remove('hidden', 'bg-red-500/20', 'text-red-400');
        messageEl.classList.add('bg-green-500/20', 'text-green-400');
        messageEl.innerText = '¡Registro exitoso! Ya puedes iniciar sesión.';

        // Mostrar botón de WhatsApp tras registro
        const whatsappBtn = document.getElementById('whatsapp-float');
        if (whatsappBtn) whatsappBtn.classList.add('show');

        form.reset();

        // Enviar correo automtico
        sendRegistrationEmail(username, email);

        // Si es del modal, pasamos a login tras 1.5s
        if (form.id === 'modal-register-form') {
            setTimeout(() => {
                switchTab('login');
                messageEl.classList.add('hidden');
            }, 1500);
        }
    } catch (error) {
        messageEl.classList.remove('hidden');
        messageEl.classList.add('bg-red-500/20', 'text-red-400');
        messageEl.innerText = 'Error al procesar el registro.';
    }
}

// Login desde el Modal
if (modalLoginForm) {
    modalLoginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('modal-login-username').value;
        const pass = document.getElementById('modal-login-password').value;
        const messageEl = document.getElementById('modal-login-message');
        handleLogin(user, pass, messageEl);
    });
}

// Login desde la página (Mantener compatibilidad)
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');
        handleLogin(user, pass, messageEl);
    });
}

function handleLogin(user, pass, messageEl) {
    const userPanel = document.getElementById('user-panel');
    const admins = { 'Nacho': '2005', 'Irene': '2007', 'Leandro': '2006' };

    // 1. Admin Login
    if (admins[user] && admins[user] === pass) {
        processLoginSuccess(user, true);
        return;
    }

    // 2. User Login
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    const foundUser = users.find(u => u.username === user && u.password === pass);

    if (foundUser) {
        processLoginSuccess(foundUser.username, false, foundUser.paid);
    } else {
        messageEl.classList.remove('hidden');
        messageEl.classList.add('bg-red-500/20', 'text-red-400');
        messageEl.innerText = 'Usuario o contraseña incorrectos.';
    }
}

function processLoginSuccess(username, isAdmin, isPaid = false) {
    localStorage.setItem('logged_user', username);
    if (isAdmin) localStorage.setItem('is_admin', 'true');
    else localStorage.removeItem('is_admin');

    // Actualizar UI
    closeAuthModal();
    updateNavbarUI(username);

    // Mostrar sección de usuario
    const userSection = document.getElementById('user-section');
    if (userSection) userSection.classList.remove('hidden');


    // Paneles de Administración vs Usuario
    const userPanel = document.getElementById('user-panel');
    if (isAdmin) {
        if (adminPanel) adminPanel.classList.remove('hidden');
        if (userPanel) userPanel.classList.add('hidden'); // No mostrar panel de usuario a admins
    } else {
        if (adminPanel) adminPanel.classList.add('hidden');
        if (userPanel) {
            userPanel.classList.remove('hidden');
            const welcomeName = document.getElementById('user-welcome-name');
            if (welcomeName) welcomeName.innerText = username;
            updatePaymentStatusUI(isPaid);
        }
    }

    // Actualizar clasificación para resaltar al usuario actual
    renderStandings();

    // Desplazar al panel
    const target = isAdmin ? adminPanel : userPanel;
    if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
}

// Función para actualizar la UI del estado de pago
function updatePaymentStatusUI(isPaid) {
    const statusUnpaid = document.getElementById('status-unpaid');
    const statusPaid = document.getElementById('status-paid');
    const ctaContainer = document.getElementById('user-cta-container');

    if (isPaid) {
        if (statusUnpaid) statusUnpaid.classList.add('hidden');
        if (statusPaid) statusPaid.classList.remove('hidden');
        if (ctaContainer) ctaContainer.classList.remove('hidden');
    } else {
        if (statusUnpaid) statusUnpaid.classList.remove('hidden');
        if (statusPaid) statusPaid.classList.add('hidden');
        if (ctaContainer) ctaContainer.classList.add('hidden');
    }
}

// Lógica de Pago (Simulación Bizum)
function initPaymentLogic() {
    const payNowBtn = document.getElementById('pay-now-btn');
    const bizumModal = document.getElementById('bizum-modal');
    const confirmBizumBtn = document.getElementById('confirm-bizum-btn');

    const bizumDecorativeBtn = document.getElementById('decorative-bizum-btn');
    if (bizumDecorativeBtn) {
        bizumDecorativeBtn.addEventListener('click', () => {
            const loggedUser = localStorage.getItem('logged_user');
            if (!loggedUser) {
                openAuthModal('login');
                return;
            }
            const payNowBtn = document.getElementById('pay-now-btn');
            if (payNowBtn) payNowBtn.click();
        });
    }

    if (payNowBtn) {
        payNowBtn.addEventListener('click', () => {
            const username = localStorage.getItem('logged_user');
            if (document.getElementById('bizum-user-name')) {
                document.getElementById('bizum-user-name').innerText = username;
            }
            if (bizumModal) bizumModal.classList.remove('hidden');
        });
    }

    if (confirmBizumBtn) {
        confirmBizumBtn.addEventListener('click', () => {
            const username = localStorage.getItem('logged_user');

            confirmBizumBtn.innerHTML = `<span class="animate-spin mr-2">⚙️</span> Procesando...`;
            confirmBizumBtn.disabled = true;

            setTimeout(() => {
                let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
                const userIndex = users.findIndex(u => u.username === username);

                if (userIndex !== -1) {
                    users[userIndex].paid = true;
                    localStorage.setItem('porra_users', JSON.stringify(users));

                    // Mostrar pantalla de éxito
                    const mainContent = document.getElementById('bizum-main-content');
                    const successScreen = document.getElementById('bizum-success-screen');
                    if (mainContent) mainContent.classList.add('hidden');
                    if (successScreen) successScreen.classList.remove('hidden');

                    // Actualizar la web de fondo
                    updatePaymentStatusUI(true);

                    // Intentar actualizar contador de inscripciones si existe
                    if (typeof updateInscriptionCounter === 'function') {
                        updateInscriptionCounter();
                    }

                    // Cerrar modal automáticamente tras 2 segundos
                    setTimeout(() => {
                        closeBizumModal();
                    }, 2500);
                }

                // Resetear botón
                confirmBizumBtn.innerText = 'Aceptar y Pagar';
                confirmBizumBtn.disabled = false;
            }, 1500);
        });
    }
}

function closeBizumModal() {
    const bizumModal = document.getElementById('bizum-modal');
    if (bizumModal) bizumModal.classList.add('hidden');
    const successScreen = document.getElementById('bizum-success-screen');
    const mainContent = document.getElementById('bizum-main-content');
    if (successScreen) successScreen.classList.add('hidden');
    if (mainContent) mainContent.classList.remove('hidden');
}

// Inicializar lógica de pago al cargar
document.addEventListener('DOMContentLoaded', initPaymentLogic);

function updateNavbarUI(username) {
    const authBtn = document.getElementById('auth-modal-btn');
    const registerBtn = document.getElementById('nav-register-btn');
    const userProfile = document.getElementById('user-nav-profile');
    const navUsername = document.getElementById('nav-username');
    const whatsappBtn = document.getElementById('whatsapp-float');

    // Elementos Menú Móvil
    const mobileAuthGuest = document.getElementById('mobile-auth-guest');
    const mobileAuthUser = document.getElementById('mobile-auth-user');
    const mobileNavUsername = document.getElementById('mobile-nav-username');

    if (username) {
        if (authBtn) authBtn.classList.add('hidden');
        if (registerBtn) registerBtn.classList.add('hidden');
        if (userProfile) userProfile.classList.remove('hidden');
        if (navUsername) navUsername.innerText = username;
        if (whatsappBtn) whatsappBtn.classList.add('show');

        if (mobileAuthGuest) mobileAuthGuest.classList.add('hidden');
        if (mobileAuthUser) mobileAuthUser.classList.remove('hidden');
        if (mobileNavUsername) mobileNavUsername.innerText = username;
    } else {
        if (authBtn) authBtn.classList.remove('hidden');
        if (registerBtn) registerBtn.classList.remove('hidden');
        if (userProfile) userProfile.classList.add('hidden');
        if (whatsappBtn) whatsappBtn.classList.remove('show');

        if (mobileAuthGuest) mobileAuthGuest.classList.remove('hidden');
        if (mobileAuthUser) mobileAuthUser.classList.add('hidden');
    }
}

// Al cargar la página, verificar sesión y actualizar contador
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar mock users si es necesario (para mostrar que hay gente inscrita)
    initMockUsers();

    // Actualizar contador inicial
    updateInscriptionCounter();

    const loggedUser = localStorage.getItem('logged_user');
    if (loggedUser) {
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
        const userObj = users.find(u => u.username === loggedUser);
        processLoginSuccess(loggedUser, isAdmin, userObj ? userObj.paid : false);
    }
});

function initMockUsers() {
    let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    // Solo añadimos mock users si no hay nadie registrado para no pisar datos reales
    if (users.length === 0) {
        const mockUsers = [
            { username: 'Carlos_88', email: 'carlos@example.com', password: '123', paid: true, fecha: '2026-04-10 10:00:00' },
            { username: 'Marta_G', email: 'marta@example.com', password: '123', paid: true, fecha: '2026-04-11 11:30:00' },
            { username: 'Juanito', email: 'juanito@example.com', password: '123', paid: true, fecha: '2026-04-12 14:20:00' },
            { username: 'Elena_WC', email: 'elena@example.com', password: '123', paid: true, fecha: '2026-04-13 09:15:00' },
            { username: 'Rafa_99', email: 'rafa@example.com', password: '123', paid: true, fecha: '2026-04-14 18:45:00' }
        ];
        localStorage.setItem('porra_users', JSON.stringify(mockUsers));
    }
}

function updateInscriptionCounter() {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    const paidUsers = users.filter(u => u.paid).length;
    const totalPlazas = 25;

    const countEl = document.getElementById('inscription-count');
    const leftEl = document.getElementById('inscription-left');

    if (countEl) {
        countEl.innerText = `${paidUsers}/${totalPlazas}`;
    }

    if (leftEl) {
        const remaining = totalPlazas - paidUsers;
        if (remaining <= 0) {
            leftEl.innerText = '¡Plazas agotadas!';
            leftEl.classList.remove('text-blue-400');
            leftEl.classList.add('text-red-400');
        } else {
            leftEl.innerText = `¡Quedan ${remaining} plazas!`;
            leftEl.classList.add('text-blue-400');
            leftEl.classList.remove('text-red-400');
        }
    }
}

// Cerrar Sesión
const logoutButtons = document.querySelectorAll('#logout-btn, #user-logout-btn, #nav-logout-btn');
logoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('logged_user');
        localStorage.removeItem('is_admin');
        if (adminPanel) adminPanel.classList.add('hidden');
        const userPanel = document.getElementById('user-panel');
        if (userPanel) userPanel.classList.add('hidden');
        const userSection = document.getElementById('user-section');
        if (userSection) userSection.classList.add('hidden');


        updateNavbarUI(null);

        // Ocultar sección de partido del día
        const motdUserSection = document.getElementById('motd-user-section');
        if (motdUserSection) motdUserSection.classList.add('hidden');

        // Cerrar menú móvil si está abierto
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenuBtn.click();
        }
    });
});

// --- Lógica del Partido del Día ---

// 1. Cargar Partido del Día al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (!isAdmin) {
        loadActiveMOTD();
    }
});

function loadActiveMOTD() {
    const motd = JSON.parse(localStorage.getItem('active_motd'));
    if (!motd) return;

    // Si hay un partido, y el usuario está logueado, lo mostramos
    const loggedUser = localStorage.getItem('logged_user');
    if (loggedUser) {
        showMOTDToUser(motd);
    }
}

function showMOTDToUser(motd) {
    const section = document.getElementById('motd-user-section');
    if (!section) return;

    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (isAdmin) {
        section.classList.add('hidden');
        return;
    }

    section.classList.remove('hidden');
    document.getElementById('user-motd-t1').innerText = motd.t1;
    document.getElementById('user-motd-t2').innerText = motd.t2;
    document.getElementById('motd-user-datetime').innerText = `${motd.date} - ${motd.time}`;

    // Inyectar botón de IA
    injectAIButton();

    // Verificar si el usuario ya ha pronosticado este partido
    const predictions = JSON.parse(localStorage.getItem('user_predictions') || '{}');
    const loggedUser = localStorage.getItem('logged_user');
    const matchId = `${motd.t1}_vs_${motd.t2}_${motd.date}`;

    if (predictions[loggedUser] && predictions[loggedUser][matchId]) {
        const pred = predictions[loggedUser][matchId];
        const signRadio = document.querySelector(`input[name="sign"][value="${pred.sign}"]`);
        if (signRadio) signRadio.checked = true;

        // Deshabilitar botón para evitar duplicados
        document.getElementById('submit-prediction-btn').innerText = 'Pronóstico Enviado';
        document.getElementById('submit-prediction-btn').disabled = true;
        document.getElementById('submit-prediction-btn').classList.add('opacity-50');
    }
}

// 2. Lógica del Panel de Admin (Selección Dinámica)
const motdDateInput = document.getElementById('motd-select-date');
const motdDropdown = document.getElementById('motd-match-dropdown');
const publishBtn = document.getElementById('publish-motd-btn');

if (motdDateInput) {
    motdDateInput.addEventListener('change', () => {
        const selectedDate = motdDateInput.value; // Formato YYYY-MM-DD
        if (!selectedDate) return;

        // Convertir YYYY-MM-DD a DD/MM
        const [year, month, day] = selectedDate.split('-');
        const formattedDate = `${day}/${month}`;

        // Buscar partidos en matchSchedule
        let matchesFound = [];
        Object.keys(matchSchedule).forEach(jornada => {
            const matches = matchSchedule[jornada].filter(m => m.date === formattedDate);
            matchesFound = matchesFound.concat(matches);
        });

        // Limpiar dropdown
        motdDropdown.innerHTML = '<option value="">Selecciona un partido...</option>';

        if (matchesFound.length > 0) {
            motdDropdown.disabled = false;
            matchesFound.forEach((m, index) => {
                const option = document.createElement('option');
                option.value = JSON.stringify(m);
                option.textContent = `${m.time}h: ${m.t1} vs ${m.t2}`;
                motdDropdown.appendChild(option);
            });
        } else {
            motdDropdown.disabled = true;
            motdDropdown.innerHTML = '<option value="">No hay partidos para esta fecha</option>';
            publishBtn.disabled = true;
        }
    });
}

if (motdDropdown) {
    motdDropdown.addEventListener('change', () => {
        publishBtn.disabled = !motdDropdown.value;
    });
}

const createMotdForm = document.getElementById('create-motd-form');
if (createMotdForm) {
    createMotdForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const selectedMatch = JSON.parse(motdDropdown.value);
        const motd = {
            t1: selectedMatch.t1,
            t2: selectedMatch.t2,
            date: selectedMatch.date,
            time: selectedMatch.time,
            id: Date.now()
        };

        // Guardar en LocalStorage
        localStorage.setItem('active_motd', JSON.stringify(motd));

        // Intentar guardar en el servidor
        try {
            await fetch('http://localhost:8000/api/save_motd', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(motd)
            });
        } catch (err) {
            console.warn('Servidor no disponible.');
        }

        alert('¡Partido del Día publicado con éxito!');

        // --- ENVÍO AUTOMÁTICO A WHATSAPP ---
        const now = new Date();
        const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const whatsappMsg = {
            sender: 'Administrador',
            color: 'text-brand-green',
            text: `📢 ¡NUEVO PARTIDO DEL DÍA PUBLICADO!\n\n⚽ ${motd.t1} vs ${motd.t2}\n📅 Fecha: ${motd.date}\n⏰ Hora: ${motd.time}\n\n¡Entra ya y deja tu pronóstico para sumar puntos extra! 🏆`,
            time: timeStr
        };

        const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
        messages.push(whatsappMsg);
        localStorage.setItem('whatsapp_messages', JSON.stringify(messages));

        // Si el chat está abierto, refrescarlo
        if (typeof renderWhatsAppMessages === 'function') {
            renderWhatsAppMessages();
        }

        createMotdForm.reset();
        motdDropdown.disabled = true;
        publishBtn.disabled = true;
    });
}

// 3. Formulario de Pronóstico (Usuario)
const predictionForm = document.getElementById('prediction-form');
if (predictionForm) {
    predictionForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const loggedUser = localStorage.getItem('logged_user');
        const motd = JSON.parse(localStorage.getItem('active_motd'));

        if (!loggedUser || !motd) return;

        const prediction = {
            username: loggedUser,
            matchId: `${motd.t1}_vs_${motd.t2}_${motd.date}`,
            sign: document.querySelector('input[name="sign"]:checked').value,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };

        // Guardar en LocalStorage
        let allPredictions = JSON.parse(localStorage.getItem('user_predictions') || '{}');
        if (!allPredictions[loggedUser]) allPredictions[loggedUser] = {};
        allPredictions[loggedUser][prediction.matchId] = prediction;
        localStorage.setItem('user_predictions', JSON.stringify(allPredictions));

        // Intentar guardar en el servidor (SQL)
        try {
            await fetch('http://localhost:8000/api/save_prediction', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(prediction)
            });
        } catch (err) {
            console.warn('Servidor no disponible.');
        }

        // Mostrar éxito
        predictionForm.classList.add('hidden');
        document.getElementById('prediction-success').classList.remove('hidden');

        setTimeout(() => {
            location.reload();
        }, 1500);
    });
}

// --- Gestión de Exportación SQL (Admin) ---
function initSqlExport() {
    // Descargar SQL Usuarios
    const downloadSqlBtn_el = document.getElementById('download-sql-btn');
    if (downloadSqlBtn_el) {
        downloadSqlBtn_el.addEventListener('click', () => {
            const users = JSON.parse(localStorage.getItem('porra_users') || '[]');

            let sql = `/*\n`;
            sql += `  ==========================================================================\n`;
            sql += `  PORRA DEL MUNDIAL 2026 - BASE DE DATOS DE USUARIOS\n`;
            sql += `  Fecha: ${new Date().toLocaleString()}\n`;
            sql += `  ==========================================================================\n`;
            sql += `*/\n\n`;

            sql += `CREATE TABLE IF NOT EXISTS usuarios (\n`;
            sql += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
            sql += `    username VARCHAR(100) NOT NULL,\n`;
            sql += `    email VARCHAR(150) NOT NULL,\n`;
            sql += `    password VARCHAR(255) NOT NULL,\n`;
            sql += `    fecha_registro DATETIME,\n`;
            sql += `    pagado VARCHAR(2) DEFAULT 'No'\n`;
            sql += `);\n\n`;

            users.forEach(u => {
                const cleanUser = u.username.replace(/'/g, "''");
                const cleanEmail = u.email.replace(/'/g, "''");
                const cleanPass = u.password.replace(/'/g, "''");
                const paidText = u.paid ? 'Si' : 'No';
                sql += `INSERT INTO usuarios (username, email, password, fecha_registro, pagado) VALUES ('${cleanUser}', '${cleanEmail}', '${cleanPass}', '${u.fecha}', '${paidText}');\n`;
            });

            downloadFile(sql, 'usuarios.sql');
        });
    }

    // Descargar SQL Pronósticos Diarios
    const downloadPredictionsBtn = document.getElementById('download-predictions-btn');
    if (downloadPredictionsBtn) {
        downloadPredictionsBtn.addEventListener('click', () => {
            const predictions = JSON.parse(localStorage.getItem('user_predictions') || '{}');

            let sql = `/*\n`;
            sql += `  ==========================================================================\n`;
            sql += `  PORRA DEL MUNDIAL 2026 - PRONÓSTICOS DIARIOS\n`;
            sql += `  Fecha: ${new Date().toLocaleString()}\n`;
            sql += `  ==========================================================================\n`;
            sql += `*/\n\n`;

            sql += `CREATE TABLE IF NOT EXISTS pronosticos_diarios (\n`;
            sql += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
            sql += `    username VARCHAR(100) NOT NULL,\n`;
            sql += `    match_id VARCHAR(255) NOT NULL,\n`;
            sql += `    sign VARCHAR(2) NOT NULL,\n`;
            sql += `    fecha_pronostico DATETIME\n`;
            sql += `);\n\n`;

            Object.keys(predictions).forEach(user => {
                Object.values(predictions[user]).forEach(p => {
                    const cleanUser = user.replace(/'/g, "''");
                    const cleanMatch = p.matchId.replace(/'/g, "''");
                    sql += `INSERT INTO pronosticos_diarios (username, match_id, sign, fecha_pronostico) VALUES ('${cleanUser}', '${cleanMatch}', '${p.sign}', '${p.timestamp}');\n`;
                });
            });

            downloadFile(sql, 'pronostico_diario.sql');
        });
    }

    // Descargar SQL Porras (Grupos)
    const downloadPorrasBtn = document.getElementById('download-porras-btn');
    if (downloadPorrasBtn) {
        downloadPorrasBtn.addEventListener('click', () => {
            const porraPredictions = JSON.parse(localStorage.getItem('porra_predictions') || '{}');

            let sql = `/*\n`;
            sql += `  ==========================================================================\n`;
            sql += `  PORRA DEL MUNDIAL 2026 - EXPORTACIÓN DE GRUPOS\n`;
            sql += `  Fecha: ${new Date().toLocaleString()}\n`;
            sql += `  ==========================================================================\n`;
            sql += `*/\n\n`;

            sql += `CREATE TABLE IF NOT EXISTS porras (\n`;
            sql += `    id INTEGER PRIMARY KEY AUTOINCREMENT,\n`;
            sql += `    username VARCHAR(100) NOT NULL,\n`;
            sql += `    grupo VARCHAR(5) NOT NULL,\n`;
            sql += `    p1 VARCHAR(100),\n`;
            sql += `    p2 VARCHAR(100),\n`;
            sql += `    p3 VARCHAR(100),\n`;
            sql += `    detalle_texto TEXT,\n`;
            sql += `    fecha_creacion DATETIME\n`;
            sql += `);\n\n`;

            sql += `-- INICIO DE INSERCIONES\n\n`;

            Object.keys(porraPredictions).forEach(user => {
                const userPicks = porraPredictions[user];
                sql += `-- Pronósticos de: ${user}\n`;

                Object.keys(groups).forEach(group => {
                    const p1 = userPicks[`group-${group}-pos-1`] || '';
                    const p2 = userPicks[`group-${group}-pos-2`] || '';
                    const p3 = userPicks[`group-${group}-pos-3`] || '';

                    if (p1 || p2 || p3) {
                        const cleanUser = user.replace(/'/g, "''");
                        const cleanP1 = p1.replace(/'/g, "''");
                        const cleanP2 = p2.replace(/'/g, "''");
                        const cleanP3 = p3.replace(/'/g, "''");
                        const detalle = `Grupo ${group} puesto 1: ${cleanP1} /* ${cleanP2} /* ${cleanP3}`;
                        const fecha = new Date().toISOString().slice(0, 19).replace('T', ' ');

                        sql += `INSERT INTO porras (username, grupo, p1, p2, p3, detalle_texto, fecha_creacion) VALUES ('${cleanUser}', '${group}', '${cleanP1}', '${cleanP2}', '${cleanP3}', '${detalle}', '${fecha}');\n`;
                    }
                });
                sql += `\n`;
            });

            sql += `-- FIN DE EXPORTACIÓN\n`;
            downloadFile(sql, 'porras.sql');
        });
    }
}

function downloadFile(content, fileName) {
    const blob = new Blob([content], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Exportación SQL Fase 2 y 3 desde el panel principal
function downloadSQLFase2() {
    const picks = JSON.parse(localStorage.getItem('all_users_fase2_picks') || '[]');
    let sql = `/* EXPORTACIÓN FASE 2 - CUADRO (TODOS LOS USUARIOS) */\n`;
    sql += `CREATE TABLE IF NOT EXISTS pronosticos_fase2 (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100), equipo_ganador VARCHAR(100), partido_id VARCHAR(50));\n`;

    if (picks.length > 0) {
        const values = picks.map(p => `('${p.username}', '${p.winner}', '${p.match_id}')`).join(',\n');
        sql += `INSERT INTO pronosticos_fase2 (username, equipo_ganador, partido_id) VALUES \n${values};`;
    } else {
        sql += `-- No se encontraron pronósticos. (Simula hasta la Fase 2 para autogenerarlos)\n`;
    }
    downloadFile(sql, 'pronosticos_fase2_todos.sql');
}

function downloadSQLFase3() {
    const scores = JSON.parse(localStorage.getItem('all_users_fase3_score') || '[]');
    let sql = `/* EXPORTACIÓN FASE 3 - FINAL (TODOS LOS USUARIOS) */\n`;
    sql += `CREATE TABLE IF NOT EXISTS pronosticos_fase3 (id INT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(100), goles_local INT, goles_visitante INT);\n`;

    if (scores.length > 0) {
        const values = scores.map(s => `('${s.username}', ${s.goles_local}, ${s.goles_visitante})`).join(',\n');
        sql += `INSERT INTO pronosticos_fase3 (username, goles_local, goles_visitante) VALUES \n${values};`;
    } else {
        sql += `-- No se encontraron pronósticos. (Simula hasta la Fase 2 para autogenerarlos)\n`;
    }
    downloadFile(sql, 'pronosticos_fase3_todos.sql');
}



// Sedes Oficiales del Mundial 2026
const venues = [
    "Estadio Azteca, CDMX",
    "Estadio Akron, Guadalajara",
    "Estadio BBVA, Monterrey",
    "BMO Field, Toronto",
    "BC Place, Vancouver",
    "MetLife Stadium, NY/NJ",
    "AT&T Stadium, Dallas",
    "Arrowhead Stadium, Kansas City",
    "NRG Stadium, Houston",
    "Mercedes-Benz Stadium, Atlanta",
    "SoFi Stadium, Los Ángeles",
    "Lincoln Financial Field, Filadelfia",
    "Lumen Field, Seattle",
    "Levi's Stadium, San Francisco",
    "Gillette Stadium, Boston",
    "Hard Rock Stadium, Miami"
];

// Cargar horarios personalizados de localStorage o usar los por defecto
let matchSchedule = JSON.parse(localStorage.getItem('custom_match_schedule')) || {
    "1": [
        {
            "t1": "México",
            "t2": "Sudáfrica",
            "date": "11/06",
            "time": "21:00",
            "venue": "Estadio Azteca, CDMX"
        },
        {
            "t1": "Corea del Sur",
            "t2": "República Checa",
            "date": "12/06",
            "time": "04:00",
            "venue": "Estadio AKRON, Guadalajara"
        },
        {
            "t1": "Canadá",
            "t2": "Bosnia Herzegovina",
            "date": "12/06",
            "time": "21:00",
            "venue": "BC Place Stadium, Vancouver"
        },
        {
            "t1": "Estados Unidos",
            "t2": "Paraguay",
            "date": "13/06",
            "time": "03:00",
            "venue": "SoFi Stadium, Los Ángeles"
        },
        {
            "t1": "Qatar",
            "t2": "Suiza",
            "date": "13/06",
            "time": "21:00"
        },
        {
            "t1": "Brasil",
            "t2": "Marruecos",
            "date": "14/06",
            "time": "00:00"
        },
        {
            "t1": "Haití",
            "t2": "Escocia",
            "date": "14/06",
            "time": "03:00"
        },
        {
            "t1": "Australia",
            "t2": "Turquía",
            "date": "14/06",
            "time": "06:00"
        },
        {
            "t1": "Alemania",
            "t2": "Curaçao",
            "date": "14/06",
            "time": "19:00"
        },
        {
            "t1": "Países Bajos",
            "t2": "Japón",
            "date": "14/06",
            "time": "22:00"
        },
        {
            "t1": "Costa de Marfil",
            "t2": "Ecuador",
            "date": "15/06",
            "time": "01:00"
        },
        {
            "t1": "Suecia",
            "t2": "Túnez",
            "date": "15/06",
            "time": "04:00"
        },
        {
            "t1": "España",
            "t2": "Cabo Verde",
            "date": "15/06",
            "time": "18:00"
        },
        {
            "t1": "Bélgica",
            "t2": "Egipto",
            "date": "15/06",
            "time": "21:00"
        },
        {
            "t1": "Arabia Saudí",
            "t2": "Uruguay",
            "date": "16/06",
            "time": "00:00"
        },
        {
            "t1": "Irán",
            "t2": "Nueva Zelanda",
            "date": "16/06",
            "time": "03:00"
        },
        {
            "t1": "Francia",
            "t2": "Senegal",
            "date": "16/06",
            "time": "21:00"
        },
        {
            "t1": "Iraq",
            "t2": "Noruega",
            "date": "17/06",
            "time": "00:00"
        },
        {
            "t1": "Argentina",
            "t2": "Argelia",
            "date": "17/06",
            "time": "03:00"
        },
        {
            "t1": "Austria",
            "t2": "Jordania",
            "date": "17/06",
            "time": "06:00"
        },
        {
            "t1": "Portugal",
            "t2": "Congo",
            "date": "17/06",
            "time": "19:00"
        },
        {
            "t1": "Inglaterra",
            "t2": "Croacia",
            "date": "17/06",
            "time": "22:00"
        },
        {
            "t1": "Ghana",
            "t2": "Panamá",
            "date": "18/06",
            "time": "01:00"
        },
        {
            "t1": "Uzbekistán",
            "t2": "Colombia",
            "date": "18/06",
            "time": "04:00"
        }
    ],
    "2": [
        {
            "t1": "República Checa",
            "t2": "Sudáfrica",
            "date": "18/06",
            "time": "18:00"
        },
        {
            "t1": "Suiza",
            "t2": "Bosnia Herzegovina",
            "date": "18/06",
            "time": "21:00"
        },
        {
            "t1": "Canadá",
            "t2": "Qatar",
            "date": "19/06",
            "time": "00:00"
        },
        {
            "t1": "México",
            "t2": "Corea del Sur",
            "date": "19/06",
            "time": "03:00"
        },
        {
            "t1": "Estados Unidos",
            "t2": "Australia",
            "date": "19/06",
            "time": "21:00"
        },
        {
            "t1": "Escocia",
            "t2": "Marruecos",
            "date": "20/06",
            "time": "00:00"
        },
        {
            "t1": "Brasil",
            "t2": "Haití",
            "date": "20/06",
            "time": "02:30"
        },
        {
            "t1": "Turquía",
            "t2": "Paraguay",
            "date": "20/06",
            "time": "05:00"
        },
        {
            "t1": "Países Bajos",
            "t2": "Suecia",
            "date": "20/06",
            "time": "19:00"
        },
        {
            "t1": "Alemania",
            "t2": "Costa de Marfil",
            "date": "20/06",
            "time": "22:00"
        },
        {
            "t1": "Ecuador",
            "t2": "Curaçao",
            "date": "21/06",
            "time": "02:00"
        },
        {
            "t1": "Túnez",
            "t2": "Japón",
            "date": "21/06",
            "time": "06:00"
        },
        {
            "t1": "España",
            "t2": "Arabia Saudí",
            "date": "21/06",
            "time": "18:00"
        },
        {
            "t1": "Bélgica",
            "t2": "Irán",
            "date": "21/06",
            "time": "21:00"
        },
        {
            "t1": "Uruguay",
            "t2": "Cabo Verde",
            "date": "22/06",
            "time": "00:00"
        },
        {
            "t1": "Nueva Zelanda",
            "t2": "Egipto",
            "date": "22/06",
            "time": "03:00"
        },
        {
            "t1": "Argentina",
            "t2": "Austria",
            "date": "22/06",
            "time": "19:00"
        },
        {
            "t1": "Francia",
            "t2": "Iraq",
            "date": "22/06",
            "time": "23:00"
        },
        {
            "t1": "Noruega",
            "t2": "Senegal",
            "date": "23/06",
            "time": "02:00"
        },
        {
            "t1": "Jordania",
            "t2": "Argelia",
            "date": "23/06",
            "time": "05:00"
        },
        {
            "t1": "Portugal",
            "t2": "Uzbekistán",
            "date": "23/06",
            "time": "19:00"
        },
        {
            "t1": "Inglaterra",
            "t2": "Ghana",
            "date": "23/06",
            "time": "22:00"
        },
        {
            "t1": "Panamá",
            "t2": "Croacia",
            "date": "24/06",
            "time": "01:00"
        },
        {
            "t1": "Colombia",
            "t2": "Congo",
            "date": "24/06",
            "time": "04:00"
        }
    ],
    "3": [
        {
            "t1": "Bosnia Herzegovina",
            "t2": "Qatar",
            "date": "24/06",
            "time": "21:00"
        },
        {
            "t1": "Suiza",
            "t2": "Canadá",
            "date": "24/06",
            "time": "21:00"
        },
        {
            "t1": "Marruecos",
            "t2": "Haití",
            "date": "25/06",
            "time": "00:00"
        },
        {
            "t1": "Escocia",
            "t2": "Brasil",
            "date": "25/06",
            "time": "00:00"
        },
        {
            "t1": "República Checa",
            "t2": "México",
            "date": "25/06",
            "time": "03:00"
        },
        {
            "t1": "Sudáfrica",
            "t2": "Corea del Sur",
            "date": "25/06",
            "time": "03:00"
        },
        {
            "t1": "Curaçao",
            "t2": "Costa de Marfil",
            "date": "25/06",
            "time": "22:00"
        },
        {
            "t1": "Ecuador",
            "t2": "Alemania",
            "date": "25/06",
            "time": "22:00"
        },
        {
            "t1": "Japón",
            "t2": "Suecia",
            "date": "26/06",
            "time": "01:00"
        },
        {
            "t1": "Túnez",
            "t2": "Países Bajos",
            "date": "26/06",
            "time": "01:00"
        },
        {
            "t1": "Paraguay",
            "t2": "Australia",
            "date": "26/06",
            "time": "04:00"
        },
        {
            "t1": "Turquía",
            "t2": "Estados Unidos",
            "date": "26/06",
            "time": "04:00"
        },
        {
            "t1": "Noruega",
            "t2": "Francia",
            "date": "26/06",
            "time": "21:00"
        },
        {
            "t1": "Senegal",
            "t2": "Iraq",
            "date": "26/06",
            "time": "21:00"
        },
        {
            "t1": "Cabo Verde",
            "t2": "Arabia Saudí",
            "date": "27/06",
            "time": "02:00"
        },
        {
            "t1": "Uruguay",
            "t2": "España",
            "date": "27/06",
            "time": "02:00"
        },
        {
            "t1": "Egipto",
            "t2": "Irán",
            "date": "27/06",
            "time": "05:00"
        },
        {
            "t1": "Nueva Zelanda",
            "t2": "Bélgica",
            "date": "27/06",
            "time": "05:00"
        },
        {
            "t1": "Croacia",
            "t2": "Ghana",
            "date": "27/06",
            "time": "23:00"
        },
        {
            "t1": "Panamá",
            "t2": "Inglaterra",
            "date": "27/06",
            "time": "23:00"
        },
        {
            "t1": "Colombia",
            "t2": "Portugal",
            "date": "28/06",
            "time": "01:30"
        },
        {
            "t1": "Congo",
            "t2": "Uzbekistán",
            "date": "28/06",
            "time": "01:30"
        },
        {
            "t1": "Argelia",
            "t2": "Austria",
            "date": "28/06",
            "time": "04:00"
        },
        {
            "t1": "Jordania",
            "t2": "Argentina",
            "date": "28/06",
            "time": "04:00"
        }
    ]
};



function renderMatches(jornada) {
    const container = document.getElementById('matches-container');
    if (!container) return;

    container.innerHTML = '';
    const matches = matchSchedule[jornada] || [];

    matches.forEach((match, index) => {
        const team1 = getTeamInfo(match.t1);
        const team2 = getTeamInfo(match.t2);

        // Asignar una sede basada en el objeto match o rotar las oficiales
        const venue = match.venue || venues[index % venues.length];

        const card = document.createElement('div');
        card.className = 'bg-brand-card rounded-2xl border border-slate-700 overflow-hidden hover-lift flex flex-col';
        card.innerHTML = `
            <div class="bg-slate-900 py-3 px-5 border-b border-slate-700 flex justify-between items-center">
                <span class="text-xs font-bold text-brand-green uppercase tracking-wider">${t('group_label')} ${team1.group}</span>
                <span class="text-xs font-bold text-slate-400 bg-slate-800 px-2 py-1 rounded">${match.date} • ${match.time}</span>
            </div>
            <div class="p-6 flex-grow flex flex-col justify-center">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center space-x-3 w-2/5">
                        <img src="https://flagcdn.com/w40/${team1.flag}.png" class="w-8 h-auto rounded-sm shadow-sm" alt="${team1.name}">
                        <span class="font-bold text-white text-lg">${team1.code}</span>
                    </div>
                    <div class="w-1/5 text-center">
                        <span class="bg-slate-900 border border-slate-700 text-white font-black px-3 py-1 rounded-lg">
                            ${officialMatchScores[`${match.t1}_vs_${match.t2}`] || '- : -'}
                        </span>
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
            ${officialMatchScores[`${match.t1}_vs_${match.t2}`] ? `
            <div class="px-6 py-3 bg-slate-900/50 border-t border-slate-800 flex justify-center">
                <button onclick="showMatchSummary('${match.t1}_vs_${match.t2}')" class="text-[10px] font-black text-brand-gold uppercase tracking-[0.2em] hover:text-white transition-colors">${t('btn_summary')}</button>
            </div>` : ''}
        `;
        container.appendChild(card);
    });
}

function changeJornada(jornada) {
    // Actualizar botones
    document.querySelectorAll('.jornada-btn').forEach(btn => {
        btn.classList.remove('bg-purple-500', 'text-white', 'shadow-lg');
        btn.classList.add('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
    });

    const activeBtn = document.getElementById(`btn-jornada-${jornada}`);
    if (activeBtn) {
        activeBtn.classList.remove('text-slate-400', 'hover:text-white', 'hover:bg-slate-700/50');
        activeBtn.classList.add('bg-purple-500', 'text-white', 'shadow-lg');
    }

    // Animar salida
    const container = document.getElementById('matches-container');
    if (container) {
        container.style.opacity = '0';
        container.style.transform = 'translateY(10px)';
        container.style.transition = 'all 0.3s ease';

        setTimeout(() => {
            renderMatches(jornada);
            // Animar entrada
            container.style.opacity = '1';
            container.style.transform = 'translateY(0)';
        }, 300);
    }
}

// (EventListener movido al final para consolidación)

// --- IA de Predicción Realista ---

const teamRatings = {
    // --- CONCACAF ---
    "México": { rating: 82, star: "Santiago Giménez", style: "presión alta y transiciones rápidas", form: "en pleno crecimiento como local" },
    "Estados Unidos": { rating: 82, star: "Christian Pulisic", style: "juego dinámico y transiciones rápidas", form: "creciendo como anfitrión del torneo" },
    "Canadá": { rating: 78, star: "Alphonso Davies", style: "potencia física y juego por bandas", form: "mejorando su estructura defensiva" },
    "Panamá": { rating: 74, star: "Adalberto Carrasquilla", style: "orden defensivo y bloque bajo", form: "con mucha ilusión competitiva" },
    "Haití": { rating: 69, star: "Duckens Nazon", style: "juego directo y físico", form: "buscando dar la sorpresa" },
    "Curaçao": { rating: 68, star: "Leandro Bacuna", style: "juego asociativo", form: "enfocados en la posesión" },

    // --- UEFA ---
    "España": { rating: 93, star: "Lamine Yamal", style: "posesión absoluta y juego asociativo", form: "dominando Europa con su juventud" },
    "Francia": { rating: 95, star: "Kylian Mbappé", style: "contraataque letal y potencia física", form: "favorito indiscutible al título" },
    "Inglaterra": { rating: 91, star: "Jude Bellingham", style: "equilibrio táctico y llegada al área", form: "un bloque sólido y muy físico" },
    "Alemania": { rating: 88, star: "Jamal Musiala", style: "disciplina táctica y transiciones rápidas", form: "en fase de reconstrucción competitiva" },
    "Portugal": { rating: 90, star: "Rafael Leão", style: "despliegue físico y verticalidad", form: "una de las plantillas más completas" },
    "Países Bajos": { rating: 87, star: "Xavi Simons", style: "fútbol total y presión asfixiante", form: "siempre competitivos y dinámicos" },
    "Italia": { rating: 89, star: "Nicolò Barella", style: "solidez defensiva y control táctico", form: "buscando redimirse en la gran cita" },
    "Bélgica": { rating: 85, star: "Kévin De Bruyne", style: "creatividad ofensiva y pases filtrados", form: "en el último baile de su generación dorada" },
    "Croacia": { rating: 85, star: "Luka Modric", style: "maestría en mediocampo y resistencia", form: "expertos en aguantar partidos límite" },
    "Suiza": { rating: 83, star: "Granit Xhaka", style: "bloque compacto y orden suizo", form: "un rival incómodo para cualquier grande" },
    "Noruega": { rating: 82, star: "Erling Haaland", style: "finalización letal y fuerza", form: "dependientes de su gran goleador" },
    "Austria": { rating: 80, star: "David Alaba", style: "polivalencia y rigor táctico", form: "un equipo muy difícil de batir" },
    "República Checa": { rating: 78, star: "Patrik Schick", style: "juego aéreo y segundas jugadas", form: "clásicos competidores europeos" },
    "Escocia": { rating: 76, star: "Andrew Robertson", style: "intensidad y balones parados", form: "con el corazón de su afición" },
    "Turquía": { rating: 83, star: "Arda Güler", style: "talento técnico y pasión", form: "capaces de ganar a cualquiera en su día" },
    "Bosnia Herzegovina": { rating: 75, star: "Edin Dzeko", style: "juego directo y veteranía", form: "luchando cada balón al máximo" },
    "Suecia": { rating: 81, star: "Alexander Isak", style: "velocidad y técnica", form: "buscando recuperar su sitio en la élite" },

    // --- CONMEBOL ---
    "Argentina": { rating: 94, star: "Lionel Messi", style: "control de juego y genialidad individual", form: "defendiendo la corona con veteranía" },
    "Brasil": { rating: 92, star: "Vinícius Jr.", style: "fútbol ofensivo y desborde constante", form: "buscando recuperar el prestigio mundial" },
    "Uruguay": { rating: 87, star: "Fede Valverde", style: "presión intensa y garra charrúa", form: "bajo la dirección de un juego vertical" },
    "Ecuador": { rating: 82, star: "Moisés Caicedo", style: "intensidad en mediocampo y velocidad", form: "una generación joven muy talentosa" },
    "Colombia": { rating: 86, star: "Luis Díaz", style: "juego alegre y desequilibrio individual", form: "invictos y con mucha confianza" },
    "Paraguay": { rating: 76, star: "Miguel Almirón", style: "sacrificio defensivo y contragolpe", form: "siempre rocosos atrás" },

    // --- CAF (África) ---
    "Marruecos": { rating: 83, star: "Achraf Hakimi", style: "orden defensivo y contras veloces", form: "el bloque más compacto de África" },
    "Senegal": { rating: 81, star: "Sadio Mané", style: "velocidad explosiva y potencia", form: "el campeón africano siempre peligroso" },
    "Costa de Marfil": { rating: 79, star: "Sébastien Haller", style: "potencia física y llegada", form: "en un momento dulce de forma" },
    "Egipto": { rating: 78, star: "Mohamed Salah", style: "dependencia de su estrella y orden", form: "buscando reinar con su faraón" },
    "Ghana": { rating: 77, star: "Mohammed Kudus", style: "talento individual y fuerza", form: "una plantilla joven e impredecible" },
    "Túnez": { rating: 74, star: "Aissa Laidouni", style: "orden táctico y rigor", form: "un equipo muy disciplinado" },
    "Sudáfrica": { rating: 72, star: "Percy Tau", style: "juego rápido por bandas", form: "con ganas de demostrar su nivel" },
    "Cabo Verde": { rating: 71, star: "Ryan Mendes", style: "juego colectivo", form: "la gran revelación africana" },
    "Congo": { rating: 70, star: "Chancel Mbemba", style: "fuerza defensiva", form: "buscando consolidarse" },
    "Argelia": { rating: 79, star: "Riyad Mahrez", style: "clase individual y posesión", form: "tratando de volver a lo más alto" },

    // --- AFC (Asia) ---
    "Japón": { rating: 83, star: "Take Kubo", style: "orden táctico y precisión técnica", form: "el gigante asiático en su mejor momento" },
    "Corea del Sur": { rating: 81, star: "Heung-min Son", style: "velocidad y transiciones rápidas", form: "siempre competitivos en mundiales" },
    "Arabia Saudí": { rating: 75, star: "Salem Al-Dawsari", style: "bloque bajo y contras", form: "con el impulso de su liga local" },
    "Irán": { rating: 76, star: "Mehdi Taremi", style: "solidez defensiva y olfato goleador", form: "el equipo más difícil de batir de Asia" },
    "Uzbekistán": { rating: 72, star: "Eldor Shomuroduro", style: "orden y disciplina", form: "en su primera gran cita histórica" },
    "Iraq": { rating: 70, star: "Aymen Hussein", style: "juego aéreo y pasión", form: "con mucha garra en el campo" },
    "Jordania": { rating: 69, star: "Musa Al-Taamari", style: "desequilibrio individual", form: "buscando sorprender al mundo" },
    "Qatar": { rating: 73, star: "Akram Afif", style: "conocimiento del sistema", form: "con la experiencia de su mundial previo" },

    // --- OFC (Oceanía) ---
    "Nueva Zelanda": { rating: 71, star: "Chris Wood", style: "juego directo y balones aéreos", form: "los reyes de Oceanía" },
    "Australia": { rating: 76, star: "Harry Souttar", style: "fuerza física y orden", form: "expertos en competiciones cortas" }
};

const genericRatings = {
    "Africa": { rating: 76, star: "su bloque colectivo", style: "juego físico e intensidad", form: "una gran motivación" },
    "Asia": { rating: 75, star: "su disciplina", style: "orden táctico y velocidad", form: "un sistema muy trabajado" },
    "Europe": { rating: 80, star: "sus jugadores de élite", style: "rigor táctico y posesión", form: "experiencia en grandes torneos" },
    "SouthAmerica": { rating: 82, star: "su técnica individual", style: "intensidad y creatividad", form: "mucho carácter competitivo" }
};

function getAIAnalysis(t1, t2) {
    const r1 = teamRatings[t1] || { rating: 77, star: "su estrella principal", style: "un bloque equilibrado", form: "una actitud muy competitiva" };
    const r2 = teamRatings[t2] || { rating: 76, star: "sus jugadores clave", style: "un sistema sólido", form: "ganas de dar la sorpresa" };

    const diff = r1.rating - r2.rating;

    // Probabilidades base corregidas
    let p1 = 38 + (diff * 2.0);
    let p2 = 34 - (diff * 2.0);
    let px = 28;

    // Normalizar
    const total = p1 + p2 + px;
    p1 = (p1 / total * 100).toFixed(1);
    p2 = (p2 / total * 100).toFixed(1);
    px = (px / total * 100).toFixed(1);

    let reasoning = "";
    if (diff > 5) {
        reasoning = `El análisis de datos muestra un claro favoritismo para <b>${t1}</b>. Su estilo de ${r1.style} debería imponerse a un <b>${t2}</b> que llega ${r2.form}. La presencia de <b>${r1.star}</b> será determinante frente a la resistencia que pueda ofrecer <b>${r2.star}</b>.`;
    } else if (diff < -5) {
        reasoning = `La IA detecta una ventaja táctica para <b>${t2}</b>. Con un sistema de ${r2.style} y <b>${r2.star}</b> en gran momento, podrían neutralizar a una <b>${t1}</b> que basa su juego en ${r1.style}. Se espera que <b>${t2}</b> domine las áreas.`;
    } else {
        reasoning = `Se prevé un duelo extremadamente equilibrado. <b>${t1}</b> intentará imponer su ${r1.style} liderado por <b>${r1.star}</b>, mientras que <b>${t2}</b> responderá con ${r2.style} y la calidad de <b>${r2.star}</b>. Las estadísticas sugieren un partido de pocos goles donde el detalle individual marcará la diferencia.`;
    }

    return { p1, px, p2, reasoning };
}

// Integrar botón de IA en la UI
function injectAIButton() {
    const predictionForm = document.getElementById('prediction-form');
    if (!predictionForm || document.getElementById('ai-consult-btn')) return;

    const aiContainer = document.createElement('div');
    aiContainer.className = "mt-6 pt-6 border-t border-slate-800";
    aiContainer.innerHTML = `
        <button id="ai-consult-btn" type="button" class="w-full bg-slate-800 hover:bg-slate-700 text-brand-gold border border-brand-gold/30 rounded-xl py-3 px-4 flex items-center justify-center space-x-2 transition-all group">
            <svg class="w-5 h-5 animate-pulse group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span class="font-bold text-xs uppercase tracking-widest">Consultar Análisis de IA</span>
        </button>
        <div id="ai-result" class="hidden mt-4 animate-in fade-in zoom-in duration-300">
            <div class="grid grid-cols-3 gap-2 mb-4">
                <div class="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                    <div id="ai-p1" class="text-lg font-black text-white">0%</div>
                    <div class="text-[8px] text-slate-500 uppercase">Local</div>
                </div>
                <div class="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                    <div id="ai-px" class="text-lg font-black text-white">0%</div>
                    <div class="text-[8px] text-slate-500 uppercase">Empate</div>
                </div>
                <div class="bg-slate-900 p-2 rounded-lg text-center border border-slate-800">
                    <div id="ai-p2" class="text-lg font-black text-white">0%</div>
                    <div class="text-[8px] text-slate-500 uppercase">Visita</div>
                </div>
            </div>
            <p id="ai-reasoning" class="text-[10px] text-slate-400 italic leading-tight text-center bg-brand-gold/5 p-3 rounded-xl border border-brand-gold/10"></p>
        </div>
    `;
    predictionForm.after(aiContainer);

    document.getElementById('ai-consult-btn').addEventListener('click', function () {
        const motd = JSON.parse(localStorage.getItem('active_motd'));
        if (!motd) return;

        this.innerHTML = `<span class="animate-spin mr-2">⚙️</span> Analizando estadísticas...`;
        this.disabled = true;

        setTimeout(() => {
            const analysis = getAIAnalysis(motd.t1, motd.t2);
            document.getElementById('ai-p1').innerText = analysis.p1 + '%';
            document.getElementById('ai-px').innerText = analysis.px + '%';
            document.getElementById('ai-p2').innerText = analysis.p2 + '%';
            document.getElementById('ai-reasoning').innerHTML = analysis.reasoning;

            document.getElementById('ai-result').classList.remove('hidden');
            this.innerHTML = `Análisis Completado`;
            this.classList.add('bg-brand-gold/10', 'border-brand-gold/50');
        }, 1500);
    });
}

// Función para sembrar datos iniciales (20 usuarios con porras y pagados)
function seedUsers() {
    // Si ya sembramos con la nueva versión (inteligente), no repetir
    if (localStorage.getItem('data_seeded_v3')) return;

    let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    let allPredictions = JSON.parse(localStorage.getItem('porra_predictions') || '{}');

    users = users.filter(u => !u.username.includes(' ') && u.username !== 'Usuario');

    const mockUsers = [
        "AstroGoal", "CyberStriker", "PixelFan", "GoalMaster26", "RetroKicker",
        "TurboForward", "MegaDefensor", "UltraFanatic", "NeonWinner", "GamerX_Fut",
        "QuantumKeeper", "SonicScorer", "VortexVanguard", "ShadowStriker", "AlphaBaller",
        "ZenZealot", "NovaNomad", "TitanTactician", "OrbitOffensive", "ApexAce"
    ];

    mockUsers.forEach((name) => {
        if (!users.some(u => u.username === name)) {
            const newUser = {
                username: name,
                email: `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@example.com`,
                password: "123",
                fecha: new Date().toISOString().slice(0, 19).replace('T', ' '),
                paid: true
            };
            users.push(newUser);

            // Generar predicciones INTELIGENTES (basadas en rating real)
            const userPicks = {};
            Object.keys(groups).forEach(group => {
                const teams = [...groups[group]];
                teams.sort((a, b) => {
                    const ra = teamRatings[a.name] ? teamRatings[a.name].rating : 75;
                    const rb = teamRatings[b.name] ? teamRatings[b.name].rating : 75;
                    const perturbedA = ra + (Math.random() * 8 - 4); // Ruido de suerte
                    const perturbedB = rb + (Math.random() * 8 - 4);
                    return perturbedB - perturbedA;
                });
                userPicks[`group-${group}-pos-1`] = teams[0].name;
                userPicks[`group-${group}-pos-2`] = teams[1].name;
                userPicks[`group-${group}-pos-3`] = teams[2].name;
            });
            allPredictions[name] = userPicks;
        }
    });

    localStorage.setItem('porra_users', JSON.stringify(users));
    localStorage.setItem('porra_predictions', JSON.stringify(allPredictions));
    localStorage.setItem('data_seeded_v3', 'true');

    // Actualizar UI
    updateInscriptionCounter();
}

let officialResults = {
    'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [],
    'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': []
};
let officialMatchScores = JSON.parse(localStorage.getItem('official_match_scores')) || {};
let matchSummaries = JSON.parse(localStorage.getItem('match_summaries')) || {};

// --- Función de Simulación de Resultados Realista ---
async function simulateAllResults() {
    const simulationDateInput = document.getElementById('simulation-date');
    const simulationLimit = simulationDateInput ? new Date(simulationDateInput.value) : new Date('2026-07-20');

    // UI Progress Elements
    const progressContainer = document.getElementById('sim-progress-container');
    const progressBar = document.getElementById('sim-progress-bar');
    const progressPct = document.getElementById('sim-progress-pct');
    const statusText = document.getElementById('sim-status-text');
    const btn = document.getElementById('simulate-results-btn');

    if (progressContainer) progressContainer.classList.remove('hidden');
    if (btn) btn.disabled = true;

    try {
        console.log("Iniciando simulación hasta:", simulationLimit.toDateString());

        const parseMatchDate = (dateStr) => {
            const [day, month] = dateStr.split('/').map(Number);
            return new Date(2026, month - 1, day);
        };

        Object.keys(officialResults).forEach(group => officialResults[group] = []);
        officialMatchScores = {};
        const groupStandingsGlobal = {};

        const groupLetters = Object.keys(groups);
        const totalGroups = groupLetters.length;

        for (let i = 0; i < totalGroups; i++) {
            const groupLetter = groupLetters[i];
            if (statusText) statusText.innerText = `Simulando Grupo ${groupLetter}...`;

            const groupTeams = groups[groupLetter];
            const standings = groupTeams.map(t => ({
                name: t.name,
                pts: 0,
                pj: 0,
                gf: 0,
                gc: 0,
                gd: 0,
                rating: (teamRatings[t.name] ? teamRatings[t.name].rating : 75)
            }));

            const jornadaKeys = ['1', '2', '3'];
            jornadaKeys.forEach(j => {
                const matches = matchSchedule[j] || [];
                matches.forEach(m => {
                    const mDate = parseMatchDate(m.date);
                    if (mDate > simulationLimit) return;

                    const t1 = standings.find(s => s.name === m.t1);
                    const t2 = standings.find(s => s.name === m.t2);

                    if (t1 && t2) {
                        const res = simulateMatch(t1.rating, t2.rating, t1.name, t2.name);
                        t1.pj += 1; t2.pj += 1;
                        t1.gf += res.score1; t1.gc += res.score2;
                        t2.gf += res.score2; t2.gc += res.score1;

                        if (res.score1 > res.score2) t1.pts += 3;
                        else if (res.score1 < res.score2) t2.pts += 3;
                        else { t1.pts += 1; t2.pts += 1; }

                        const matchKey = `${m.t1}_vs_${m.t2}`;
                        officialMatchScores[matchKey] = `${res.score1} : ${res.score2}`;
                        matchSummaries[matchKey] = res.summary;
                    }
                });
            });

            standings.forEach(s => s.gd = s.gf - s.gc);
            standings.sort((a, b) => {
                if (b.pts !== a.pts) return b.pts - a.pts;
                if (b.gd !== a.gd) return b.gd - a.gd;
                if (b.gf !== a.gf) return b.gf - a.gf;
                return b.rating - a.rating;
            });

            officialResults[groupLetter] = [standings[0].name, standings[1].name, standings[2].name];
            groupStandingsGlobal[groupLetter] = standings;

            const pct = Math.round(((i + 1) / totalGroups) * 80);
            if (progressBar) progressBar.style.width = `${pct}%`;
            if (progressPct) progressPct.innerText = `${pct}%`;

            await new Promise(resolve => setTimeout(resolve, 50));
        }

        localStorage.setItem('official_results', JSON.stringify(officialResults));
        localStorage.setItem('official_match_scores', JSON.stringify(officialMatchScores));
        localStorage.setItem('group_standings', JSON.stringify(groupStandingsGlobal));
        localStorage.setItem('match_summaries', JSON.stringify(matchSummaries));

        renderStandings();
        renderGroupStandings();

        // Actualizar la vista de la jornada actual para que se vean los marcadores sin refrescar
        const currentJornadaBtn = document.querySelector('.jornada-btn.bg-purple-500');
        if (currentJornadaBtn) {
            const jId = currentJornadaBtn.id.replace('btn-jornada-', '');
            if (jId !== 'bracket') {
                renderMatches(jId);
            }
        }

        const groupStageEnd = new Date('2026-06-28T00:00:00');
        if (simulationLimit >= groupStageEnd) {
            if (statusText) statusText.innerText = `Poblando Cuadro Eliminatorio...`;
            populateKnockoutBracket();
            generateAllUsersKnockoutPredictions(); // Generar pronósticos automáticamente para la gente
            if (progressBar) progressBar.style.width = `90%`;
            if (progressPct) progressPct.innerText = `90%`;
            await new Promise(resolve => setTimeout(resolve, 300));

            if (statusText) statusText.innerText = `Simulando Eliminatorias...`;
            simulateKnockoutMatches(simulationLimit);
            if (progressBar) progressBar.style.width = `100%`;
            if (progressPct) progressPct.innerText = `100%`;
            await new Promise(resolve => setTimeout(resolve, 300));

            // Ya no hace falta el trigger aquí, se hace dentro de simulateKnockoutMatches
        } else {
            if (progressBar) progressBar.style.width = `100%`;
            if (progressPct) progressPct.innerText = `100%`;
        }

        if (statusText) statusText.innerText = `Simulación completada`;
        localStorage.setItem('simulation_limit', simulationDateInput.value);
        updatePhasesVisibility();
        renderStandings();

        // Auto-asignar Partido del Día (MOTD) y Apuestas para TODOS los días simulados
        const allSimulatedDates = new Set();

        Object.keys(matchSchedule).forEach(jornada => {
            matchSchedule[jornada].forEach(m => {
                const [day, month] = m.date.split('/').map(Number);
                const mDate = new Date(2026, month - 1, day);
                if (mDate <= simulationLimit) allSimulatedDates.add(m.date);
            });
        });

        const structureForDates = JSON.parse(localStorage.getItem(STORAGE_KEY_BRACKET)) || {};
        const rounds = ['dieciseisavos_L', 'dieciseisavos_R', 'L-2', 'R-2', 'L-3', 'R-3', 'L-4', 'R-4', 'third', 'final'];
        rounds.forEach(roundKey => {
            let matches = structureForDates[roundKey] || [];
            matches.forEach((m, i) => {
                let matchDate = m.date;
                if (!matchDate && structureForDates.roundSchedule && structureForDates.roundSchedule[roundKey]) {
                    const sched = structureForDates.roundSchedule[roundKey][i];
                    if (sched) matchDate = sched.split(', ')[0];
                }
                if (matchDate) {
                    const [day, month] = matchDate.split('/').map(Number);
                    const mD = new Date(2026, month - 1, day);
                    if (mD <= simulationLimit) allSimulatedDates.add(matchDate);
                }
            });
        });

        // Para cada fecha simulada, elegir un MOTD y generar apuestas
        Array.from(allSimulatedDates).forEach(dateStr => {
            let selectedMatch = null;
            Object.keys(matchSchedule).forEach(jornada => {
                const matches = matchSchedule[jornada].filter(m => m.date === dateStr);
                if (matches.length > 0 && !selectedMatch) selectedMatch = matches[0];
            });
            if (!selectedMatch) {
                for (let roundKey of rounds) {
                    let matches = structureForDates[roundKey] || [];
                    for (let i = 0; i < matches.length; i++) {
                        const m = matches[i];
                        let matchDate = m.date;
                        let matchTime = m.time;
                        if (!matchDate && structureForDates.roundSchedule && structureForDates.roundSchedule[roundKey]) {
                            const sched = structureForDates.roundSchedule[roundKey][i];
                            if (sched) { matchDate = sched.split(', ')[0]; matchTime = sched.split(', ')[1]; }
                        }
                        if (matchDate === dateStr && m.home !== "Por definir" && m.away !== "Por definir") {
                            selectedMatch = { t1: m.home, t2: m.away, date: matchDate, time: matchTime };
                            break;
                        }
                    }
                    if (selectedMatch) break;
                }
            }

            if (selectedMatch) {
                const motd = { t1: selectedMatch.t1, t2: selectedMatch.t2, date: selectedMatch.date, time: selectedMatch.time, id: Date.now() };

                const simDateParts = simulationDateInput.value.split('-');
                const formattedSimDate = `${simDateParts[2]}/${simDateParts[1]}`;
                if (dateStr === formattedSimDate) {
                    localStorage.setItem('active_motd', JSON.stringify(motd));
                    if (typeof loadActiveMOTD === 'function') loadActiveMOTD();
                }

                autoGenerateMotdPredictions(motd);
            }
        });

        // Recalcular puntos una vez que se han procesado todos los MOTD posibles hasta la fecha
        renderStandings();

        // Notificación automática Fase 2 (28 de Junio)
        const phase2Threshold = new Date(2026, 5, 28); // 28 de Junio
        if (simulationLimit >= phase2Threshold && !localStorage.getItem('phase2_email_sent')) {
            sendPhase2Notification();
            localStorage.setItem('phase2_email_sent', 'true');
            console.log('Notificación de Fase 2 disparada automáticamente.');
        }

        // Notificación automática Fase 3 (16 de Julio)
        const phase3Threshold = new Date(2026, 6, 16); // 16 de Julio (Mes 6 es Julio)
        if (simulationLimit >= phase3Threshold && !localStorage.getItem('phase3_email_sent')) {
            sendPhase3Notification();
            localStorage.setItem('phase3_email_sent', 'true');
            console.log('Notificación de Fase 3 disparada automáticamente.');
        }

        alert(`¡Simulación completada hasta el ${simulationLimit.toLocaleDateString()}!`);
    } catch (error) {
        console.error("Error en la simulación:", error);
        if (statusText) statusText.innerText = `Error en la simulación`;
        alert("Ocurrió un error durante la simulación. Revisa la consola para más detalles.");
    } finally {
        if (btn) btn.disabled = false;
        setTimeout(() => {
            if (progressContainer) progressContainer.classList.add('hidden');
        }, 2000);
    }
}

function simulateKnockoutMatches(simulationLimit) {
    // Fechas aproximadas de las rondas para la simulación
    const roundDates = {
        1: new Date('2026-06-29T00:00:00'), // Dieciseisavos
        2: new Date('2026-07-04T00:00:00'), // Octavos
        3: new Date('2026-07-09T00:00:00'), // Cuartos
        4: new Date('2026-07-14T00:00:00'), // Semis
        5: new Date('2026-07-19T00:00:00')  // Final
    };

    // Helper para simular un partido individual en el bracket
    const simulateBracketMatch = (key, id) => {
        let matchDataKey = key;
        let index = id - 1;

        if (key === 'L-1') {
            matchDataKey = 'dieciseisavos_L';
            index = id - 1;
        } else if (key === 'R-1') {
            matchDataKey = 'dieciseisavos_R';
            index = id - 9; // IDs 9-16 correspond to indices 0-7
        } else if (key === 'final' || key === 'third') {
            index = 0;
        }

        const match = structureBracket[matchDataKey] ? structureBracket[matchDataKey][index] : null;
        if (!match) return;

        const homeName = match.home;
        const awayName = match.away;

        if (homeName === "Por definir" || awayName === "Por definir") return;

        const rating1 = (teamRatings[homeName] ? teamRatings[homeName].rating : 75);
        const rating2 = (teamRatings[awayName] ? teamRatings[awayName].rating : 75);

        const res = simulateMatch(rating1, rating2, homeName, awayName);

        // Simular prórroga/penaltis si hay empate (en eliminatorias no hay empate)
        let s1 = res.score1;
        let s2 = res.score2;
        let penalties = null;

        if (s1 === s2) {
            // Empate -> Penaltis basados en CALIDAD (rating)
            const qualityDiff = rating1 - rating2;
            const p1Base = 3 + (qualityDiff > 0 ? 1 : 0);
            const p2Base = 3 + (qualityDiff < 0 ? 1 : 0);

            const p1 = Math.floor(Math.random() * 3) + p1Base;
            const p2 = Math.floor(Math.random() * 3) + p2Base;

            penalties = { p1, p2: p1 === p2 ? p2 + 1 : p2 };

            // El ganador de penaltis avanza (ajustamos s1 o s2 para la lógica de winner)
            if (penalties.p1 > penalties.p2) s1 += 0.1;
            else s2 += 0.1;
        }

        const winner = s1 > s2 ? homeName : awayName;
        const loser = s1 > s2 ? awayName : homeName;

        // Guardar marcador en el objeto de datos
        match.score1 = res.score1;
        match.score2 = res.score2;
        match.penalties = penalties;
        matchSummaries[`${key}-${id}`] = res.summary;

        const matchKey = `${homeName}_vs_${awayName}`;
        officialMatchScores[matchKey] = `${res.score1} : ${res.score2}`;
        matchSummaries[matchKey] = res.summary;

        // Determinar siguiente fase
        if (key === 'final' || key === 'third') return;

        const [side, roundStr] = key.split('-');
        const round = parseInt(roundStr);
        const nextKey = configBracket[side][round].next;

        if (nextKey === 'final') {
            const finalPos = side === 'L' ? 'home' : 'away';
            updateBracketMatch('final', 1, finalPos, winner);
            updateBracketMatch('third', 1, finalPos, loser);
        } else {
            const nextMatchId = Math.ceil(id / 2);
            const nextPos = id % 2 === 0 ? 'away' : 'home';
            updateBracketMatch(nextKey, nextMatchId, nextPos, winner);
        }
    };

    // Simular por rondas
    if (simulationLimit >= roundDates[1]) {
        // Dieciseisavos
        for (let i = 0; i < 8; i++) {
            simulateBracketMatch('L-1', 1 + i);
            simulateBracketMatch('R-1', 9 + i);
        }
    }
    if (simulationLimit >= roundDates[2]) {
        // Octavos
        for (let i = 0; i < 4; i++) {
            simulateBracketMatch('L-2', 1 + i);
            simulateBracketMatch('R-2', 5 + i);
        }
    }
    if (simulationLimit >= roundDates[3]) {
        // Cuartos
        for (let i = 0; i < 2; i++) {
            simulateBracketMatch('L-3', 1 + i);
            simulateBracketMatch('R-3', 3 + i);
        }
    }
    if (simulationLimit >= roundDates[4]) {
        // Semifinales
        simulateBracketMatch('L-4', 1);
        simulateBracketMatch('R-4', 2);
    }
    if (simulationLimit >= roundDates[5]) {
        // Final y Tercer Puesto
        simulateBracketMatch('final', 1);
        simulateBracketMatch('third', 1);

        // Si hay marcador en la final, actualizar el podio inmediatamente
        updatePodium();
    }

    // IMPORTANTE: Guardar el bracket completo tras la simulación
    localStorage.setItem(STORAGE_KEY_BRACKET, JSON.stringify(structureBracket));
    localStorage.setItem('match_summaries', JSON.stringify(matchSummaries));
    localStorage.setItem('official_match_scores', JSON.stringify(officialMatchScores));

    // Refrescar la UI para mostrar los resultados
    renderSide('L');
    renderSide('R');
    renderCenterColumn();
}

function populateKnockoutBracket() {
    const standingsData = JSON.parse(localStorage.getItem('group_standings'));
    if (!standingsData) return;

    // 1. Obtener clasificados (1º y 2º) y potenciales 3º
    const qualifiers = {};
    const thirdPlaces = [];

    Object.keys(standingsData).forEach(group => {
        const teams = standingsData[group];
        if (teams.length >= 2) {
            qualifiers[`1${group}`] = teams[0].name;
            qualifiers[`2${group}`] = teams[1].name;
        }
        if (teams.length >= 3) {
            thirdPlaces.push({
                name: teams[2].name,
                pts: teams[2].pts,
                gd: teams[2].gd,
                gf: teams[2].gf
            });
        }
    });

    // 2. Ordenar mejores terceros (Top 8)
    thirdPlaces.sort((a, b) => {
        if (b.pts !== a.pts) return b.pts - a.pts;
        if (b.gd !== a.gd) return b.gd - a.gd;
        return b.gf - a.gf;
    });

    const bestThirds = thirdPlaces.slice(0, 8);

    // 3. Resetear estructura a placeholders usando el template para evitar "arrastrar" resultados anteriores
    structureBracket.dieciseisavos_L = JSON.parse(JSON.stringify(BRACKET_TEMPLATE.dieciseisavos_L));
    structureBracket.dieciseisavos_R = JSON.parse(JSON.stringify(BRACKET_TEMPLATE.dieciseisavos_R));

    // 4. Limpiar todas las rondas posteriores
    ['L-2', 'L-3', 'L-4', 'R-2', 'R-3', 'R-4', 'final', 'third'].forEach(k => {
        if (structureBracket[k]) {
            structureBracket[k] = structureBracket[k].map(m => {
                const newMatch = { ...m, home: "Por definir", away: "Por definir" };
                delete newMatch.score1;
                delete newMatch.score2;
                delete newMatch.penalties;
                return newMatch;
            });
        }
    });

    // 4. Mapear al structureBracket
    const sides = ['L', 'R'];
    let thirdIdx = 0;

    sides.forEach(side => {
        const key = `dieciseisavos_${side}`;
        structureBracket[key].forEach(match => {
            const mapTeam = (placeholder) => {
                // Caso "1A", "2B", etc.
                if (/^[12][A-L]$/.test(placeholder)) {
                    return qualifiers[placeholder] || placeholder;
                }
                // Caso "Group I Winner" o similar
                if (placeholder.includes("Winner")) {
                    const matchGroup = placeholder.match(/Group ([A-L]) Winner/);
                    if (matchGroup) return qualifiers[`1${matchGroup[1]}`] || placeholder;
                    if (placeholder === "Group L Winner") return qualifiers["1L"] || placeholder;
                    if (placeholder === "Group I Winner") return qualifiers["1I"] || placeholder;
                }
                // Caso "Group X 2nd"
                if (placeholder.includes("2nd")) {
                    const matchGroup = placeholder.match(/Group ([A-L]) 2nd/);
                    if (matchGroup) return qualifiers[`2${matchGroup[1]}`] || placeholder;
                    if (placeholder === "Group I 2nd") return qualifiers["2I"] || placeholder;
                    if (placeholder === "Group J 2nd") return qualifiers["2J"] || placeholder;
                    if (placeholder === "Group K 2nd") return qualifiers["2K"] || placeholder;
                    if (placeholder === "Group L 2nd") return qualifiers["2L"] || placeholder;
                }
                // Caso Mejores Terceros
                if (placeholder.startsWith("3rd")) {
                    if (thirdIdx < bestThirds.length) {
                        return bestThirds[thirdIdx++].name;
                    }
                }
                return placeholder;
            };

            match.home = mapTeam(match.home);
            match.away = mapTeam(match.away);
        });
    });

    // 4. Guardar y Renderizar
    localStorage.setItem(STORAGE_KEY_BRACKET, JSON.stringify(structureBracket));
    renderSide('L');
    renderSide('R');
    renderCenterColumn();
}

function renderCenterColumn() {
    ['final', 'third'].forEach(key => {
        const matchData = (structureBracket[key] && structureBracket[key][0]) ? structureBracket[key][0] : { home: "Por definir", away: "Por definir" };
        const isHomeWinner = matchData.score1 !== undefined && matchData.score2 !== undefined && (matchData.score1 > matchData.score2 || (matchData.penalties && matchData.penalties.p1 > matchData.penalties.p2));
        const isAwayWinner = matchData.score1 !== undefined && matchData.score2 !== undefined && (matchData.score2 > matchData.score1 || (matchData.penalties && matchData.penalties.p2 > matchData.penalties.p1));

        // Botón de Resumen en el centro
        const matchBox = document.getElementById(`match-${key}`);
        if (matchBox) {
            let btnContainer = matchBox.querySelector('.btn-summary-container');
            if (matchData.score1 !== undefined) {
                if (!btnContainer) {
                    btnContainer = document.createElement('div');
                    btnContainer.className = "btn-summary-container mt-2 pt-2 border-t border-slate-700/50 flex justify-center w-full";

                    const btn = document.createElement('button');
                    btn.type = 'button';
                    btn.className = "flex items-center justify-center gap-1.5 w-full bg-brand-gold/10 hover:bg-brand-gold text-brand-gold hover:text-slate-950 border border-brand-gold/30 text-[7px] font-black uppercase tracking-widest py-1.5 rounded transition-all shadow-lg hover:shadow-brand-gold/20";
                    btn.innerHTML = `<svg class="w-2.5 h-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg> ${t('btn_summary')}`;
                    btn.onclick = (e) => { e.stopPropagation(); showMatchSummary(`${key}-1`); };

                    btnContainer.appendChild(btn);
                    matchBox.appendChild(btnContainer);
                }
            } else if (btnContainer) {
                btnContainer.remove();
            }
        }

        ['home', 'away'].forEach(pos => {
            const name = matchData[pos];
            const el = document.getElementById(`${key}-1-${pos}`);
            if (el) {
                const nameEl = el.querySelector('.team-name');
                nameEl.innerText = name;
                nameEl.style.color = name === "Por definir" ? '#94a3b8' : 'white';

                // Puntuación
                const scoreSpanId = `${key}-1-${pos}-score`;
                let scoreSpan = document.getElementById(scoreSpanId);
                const score = matchData[`score${pos === 'home' ? 1 : 2}`];

                if (score !== undefined) {
                    const isWinner = pos === 'home' ? isHomeWinner : isAwayWinner;
                    if (!scoreSpan) {
                        scoreSpan = document.createElement('span');
                        scoreSpan.id = scoreSpanId;
                        scoreSpan.className = `match-score font-black ml-2 ${isWinner ? 'text-brand-green' : 'text-slate-400'}`;
                        el.appendChild(scoreSpan);
                    } else {
                        scoreSpan.className = `match-score font-black ml-2 ${isWinner ? 'text-brand-green' : 'text-slate-400'}`;
                    }

                    const p = matchData.penalties ? (pos === 'home' ? matchData.penalties.p1 : matchData.penalties.p2) : null;
                    scoreSpan.innerHTML = `${score}${p !== null ? `<span class="text-[8px] opacity-60 ml-0.5">(${p})</span>` : ''}`;

                    // Resaltar nombre del ganador
                    if (isWinner) nameEl.classList.add('font-bold', 'text-white');
                    else nameEl.classList.remove('font-bold');
                } else {
                    if (scoreSpan) scoreSpan.remove();
                    nameEl.classList.remove('font-bold');
                }

                // Bandera
                const teamInfo = getTeamInfo(name);
                const existingImg = el.querySelector('img');
                const existingSvg = el.querySelector('svg');
                if (name !== "Por definir") {
                    if (existingSvg) existingSvg.remove();
                    if (!existingImg) {
                        const img = document.createElement('img');
                        img.src = `https://flagcdn.com/w20/${teamInfo.flag}.png`;
                        img.className = "w-4 h-3 mr-2 rounded-sm";
                        el.prepend(img);
                    } else {
                        existingImg.src = `https://flagcdn.com/w20/${teamInfo.flag}.png`;
                    }
                } else {
                    if (existingImg) existingImg.remove();
                    if (!existingSvg) {
                        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
                        svg.setAttribute("class", "team-shield");
                        svg.setAttribute("fill", "currentColor");
                        svg.setAttribute("viewBox", "0 0 20 20");
                        svg.innerHTML = '<path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path>';
                        el.prepend(svg);
                    }
                }

                // Resaltar Ganador de la Final
                if (key === 'final') {
                    const isWinner = pos === 'home' ? isHomeWinner : isAwayWinner;
                    if (isWinner) {
                        el.classList.add('winner-glow', 'bg-brand-gold/20');
                    } else {
                        el.classList.remove('winner-glow', 'bg-brand-gold/20');
                    }
                }
            }
        });
    });
}

function resetTournament() {
    if (confirm("¿Estás seguro de que quieres reiniciar el torneo? Se borrarán todos los resultados oficiales simulados y la clasificación volverá a cero.")) {
        localStorage.removeItem('official_results');
        localStorage.removeItem('official_match_scores');
        localStorage.removeItem('group_standings');
        localStorage.removeItem(STORAGE_KEY_BRACKET);
        localStorage.removeItem('match_summaries');

        // Resetear variables en memoria
        Object.keys(officialResults).forEach(group => officialResults[group] = []);
        officialMatchScores = {};
        matchSummaries = {};
        structureBracket = JSON.parse(JSON.stringify(BRACKET_TEMPLATE));

        // Recargar componentes de la UI
        renderStandings();
        renderGroupStandings();

        // Recargar bracket si existe en la página
        if (typeof renderSide === 'function') {
            const colL = document.getElementById('col-L-1');
            if (colL) {
                renderSide('L');
                renderSide('R');
                renderCenterColumn();
            }
        }

        // Recargar jornada actual para limpiar marcadores
        const currentJornada = document.querySelector('.jornada-btn.bg-purple-500');
        if (currentJornada) {
            renderMatches(currentJornada.id.replace('btn-jornada-', ''));
        }

        alert("El torneo ha sido reiniciado correctamente.");
    }
}

function simulateMatch(r1, r2, home = "Equipo A", away = "Equipo B") {
    const diff = r1 - r2;

    // Configuración Base: 0.85 (Promedio de ~1.7 goles por partido en duelo equilibrado)
    let lambda1 = 0.85 + (diff * 0.07);
    let lambda2 = 0.85 - (diff * 0.07);

    // Sesgo Defensivo
    if (r1 > 85 && r2 > 85) {
        lambda1 *= 0.85;
        lambda2 *= 0.85;
    }

    // "Muro de los Favoritos"
    if (r1 >= 90) lambda2 *= 0.6;
    if (r2 >= 90) lambda1 *= 0.6;

    // Bono de Jerarquía Progresivo
    if (diff > 15) { lambda1 += 0.2; lambda2 *= 0.8; }
    if (diff > 25) { lambda1 += 0.3; lambda2 *= 0.7; }
    if (diff < -15) { lambda2 += 0.2; lambda1 *= 0.8; }
    if (diff < -25) { lambda2 += 0.3; lambda1 *= 0.7; }

    // Cap de Lambda para evitar goleadas irreales (Máximo ~3.5 goles esperados por equipo)
    lambda1 = Math.max(0.01, Math.min(2.5, lambda1));
    lambda2 = Math.max(0.01, Math.min(2.5, lambda2));

    function poisson(lambda) {
        let L = Math.exp(-lambda);
        let p = 1.0;
        let k = 0;
        do { k++; p *= Math.random(); } while (p > L);
        return k - 1;
    }

    let score1 = poisson(lambda1);
    let score2 = poisson(lambda2);

    // "Regla de Misericordia" y Realismo: Evitar más de 5 goles si la diferencia es abismal
    if (score1 > 5 && score1 - score2 > 4) score1 = 5 + (score1 % 2);
    if (score2 > 5 && score2 - score1 > 4) score2 = 5 + (score2 % 2);

    const luck = Math.random();
    if (luck > 0.99 && Math.abs(diff) < 10) {
        if (Math.random() > 0.5) score1 += 1;
        else score2 += 1;
    }

    score1 = Math.min(score1, 7); // Cap absoluto de 7 para casos extremos
    score2 = Math.min(score2, 7);

    // Generar Resumen Detallado
    // Función auxiliar para obtener jugador real
    const getRealPlayer = (teamName, teamCode) => {
        const players = playersData[teamCode] || [];
        if (players.length > 0) {
            // Probabilidad basada en goles previos o posición (más probable que marquen delanteros)
            const weights = players.map(p => (p.pos === 'Forward' ? 5 : p.pos === 'Midfielder' ? 2 : 0.5));
            const totalWeight = weights.reduce((a, b) => a + b, 0);
            let random = Math.random() * totalWeight;
            for (let i = 0; i < players.length; i++) {
                if (random < weights[i]) return players[i];
                random -= weights[i];
            }
            return players[0];
        }
        return { name: `Jugador de ${teamName}` };
    };

    // Obtener códigos de equipo (asumiendo que los tenemos disponibles o mapeados)
    const getTeamCode = (name) => {
        for (const g in groups) {
            const team = groups[g].find(t => t.name === name);
            if (team) return team.code;
        }
        return null;
    };

    const code1 = getTeamCode(home);
    const code2 = getTeamCode(away);

    const possession = 40 + Math.floor(Math.random() * 21); // 40-60%
    const events = [];

    for (let i = 0; i < score1; i++) {
        const p = getRealPlayer(home, code1);
        events.push({ minute: Math.floor(Math.random() * 90) + 1, type: 'goal', team: home, player: p.name });
    }
    for (let i = 0; i < score2; i++) {
        const p = getRealPlayer(away, code2);
        events.push({ minute: Math.floor(Math.random() * 90) + 1, type: 'goal', team: away, player: p.name });
    }

    // Añadir algunas tarjetas amarillas aleatorias (1-4)
    const cards = 1 + Math.floor(Math.random() * 4);
    for (let i = 0; i < cards; i++) {
        const isHome = Math.random() > 0.5;
        const p = getRealPlayer(isHome ? home : away, isHome ? code1 : code2);
        events.push({ minute: Math.floor(Math.random() * 90) + 1, type: 'yellow-card', team: isHome ? home : away, player: p.name });
    }
    events.sort((a, b) => a.minute - b.minute);

    const narratives = [
        `Un encuentro táctico donde ${home} intentó controlar el ritmo ante un ${away} muy ordenado.`,
        `Duelo de alta intensidad física con constantes llegadas a las áreas por parte de ambos conjuntos.`,
        `Partido marcado por el respeto mutuo, donde cada error se pagó caro en el marcador final.`,
        `Espectáculo de fútbol vertical con transiciones rápidas que mantuvieron a la grada en vilo.`
    ];

    const summary = {
        stats: {
            possession: [possession, 100 - possession],
            shots: [score1 + Math.floor(Math.random() * 8), score2 + Math.floor(Math.random() * 8)],
            corners: [Math.floor(Math.random() * 7), Math.floor(Math.random() * 7)]
        },
        events: events,
        mvp: score1 >= score2 ? (events.filter(e => e.team === home && e.type === 'goal')[0]?.player || getRealPlayer(home, code1).name) : (events.filter(e => e.team === away && e.type === 'goal')[0]?.player || getRealPlayer(away, code2).name),
        narrative: narratives[Math.floor(Math.random() * narratives.length)]
    };

    return { score1, score2, summary };
}

function updatePodium() {
    const finalMatch = (structureBracket['final'] && structureBracket['final'][0]) ? structureBracket['final'][0] : null;
    const thirdMatch = (structureBracket['third'] && structureBracket['third'][0]) ? structureBracket['third'][0] : null;

    if (!finalMatch || finalMatch.score1 === undefined) return;

    const podiumSection = document.getElementById('bracket-podium');
    if (!podiumSection) return;

    let champion, runnerUp, thirdPlace;

    // Determinar Campeón y Subcampeón
    const isHomeWinner = finalMatch.score1 > finalMatch.score2 || (finalMatch.penalties && finalMatch.penalties.p1 > finalMatch.penalties.p2);
    champion = isHomeWinner ? finalMatch.home : finalMatch.away;
    runnerUp = isHomeWinner ? finalMatch.away : finalMatch.home;

    // Determinar Tercer Puesto
    if (thirdMatch && thirdMatch.score1 !== undefined) {
        const isThirdHomeWinner = thirdMatch.score1 > thirdMatch.score2 || (thirdMatch.penalties && thirdMatch.penalties.p1 > thirdMatch.penalties.p2);
        thirdPlace = isThirdHomeWinner ? thirdMatch.home : thirdMatch.away;
    } else {
        thirdPlace = "Por definir";
    }

    // Actualizar UI
    const setPodiumTeam = (num, name) => {
        const flagEl = document.getElementById(`bp-${num}-flag`);
        const nameEl = document.getElementById(`bp-${num}-name`);
        if (flagEl) {
            const info = getTeamInfo(name);
            flagEl.src = `https://flagcdn.com/w160/${info.flag}.png`;
            flagEl.title = name;
            flagEl.alt = name;
        }
        if (num === 1) {
            const champNameEl = document.getElementById('bp-champion-name');
            if (champNameEl) champNameEl.innerText = name;
        }
        if (nameEl) nameEl.innerText = name;
    };

    setPodiumTeam(1, champion);
    setPodiumTeam(2, runnerUp);
    setPodiumTeam(3, thirdPlace);

    const bracketPodium = document.getElementById('bracket-podium');
    if (bracketPodium) {
        bracketPodium.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function showMatchSummary(matchId) {
    let summary = matchSummaries[matchId];

    // Fallback: Si no se encuentra con ID directo, intentar buscar por nombre de equipo si están disponibles
    if (!summary && !matchId.includes('_vs_')) {
        const parts = matchId.split('-');
        let side, round, id;
        if (parts.length === 3) {
            [side, round, id] = parts;
        } else {
            [side, id] = parts; // Final o Third
            round = "";
        }

        let key = side;
        if (round) key = `${side}-${round}`;
        if (key === 'L-1') key = 'dieciseisavos_L';
        if (key === 'R-1') key = 'dieciseisavos_R';

        const matchArray = structureBracket[key];
        const match = matchArray ? matchArray[parseInt(id) - 1] : null;

        if (match && match.home && match.away) {
            const matchKey = `${match.home}_vs_${match.away}`;
            summary = matchSummaries[matchKey];
        }
    }

    if (!summary) {
        alert("Aún no hay resumen maestro disponible para este partido. Simula los resultados primero.");
        return;
    }

    const modal = document.getElementById('summary-modal');
    if (!modal) return;

    let home, away, s1, s2, penalties;

    if (matchId.includes('_vs_')) {
        [home, away] = matchId.split('_vs_');
        const scoreStr = officialMatchScores[matchId];
        if (scoreStr) [s1, s2] = scoreStr.split(' : ').map(Number);
    } else {
        const parts = matchId.split('-');
        let side, round, id;
        if (parts.length === 3) {
            [side, round, id] = parts;
        } else {
            [side, id] = parts; // Final o Third
            round = "";
        }

        let key = side;
        if (round) key = `${side}-${round}`;
        if (key === 'L-1') key = 'dieciseisavos_L';
        if (key === 'R-1') key = 'dieciseisavos_R';

        const matchArray = structureBracket[key];
        const match = matchArray ? matchArray[parseInt(id) - 1] : null;

        if (match) {
            home = match.home;
            away = match.away;
            s1 = match.score1;
            s2 = match.score2;
            penalties = match.penalties;
        }
    }

    document.getElementById('sm-team1').innerText = home || "---";
    document.getElementById('sm-team2').innerText = away || "---";
    document.getElementById('sm-score1').innerText = s1 !== undefined ? s1 : "0";
    document.getElementById('sm-score2').innerText = s2 !== undefined ? s2 : "0";

    const penEl = document.getElementById('sm-penalties');
    if (penalties) {
        penEl.innerText = `(${penalties.p1}-${penalties.p2} pen.)`;
        penEl.classList.remove('hidden');
    } else {
        penEl.classList.add('hidden');
    }

    const homeInfo = getTeamInfo(home);
    const awayInfo = getTeamInfo(away);
    document.getElementById('sm-flag1').src = `https://flagcdn.com/w160/${homeInfo.flag}.png`;
    document.getElementById('sm-flag2').src = `https://flagcdn.com/w160/${awayInfo.flag}.png`;

    document.getElementById('sm-narrative').innerText = `"${summary.narrative}"`;
    document.getElementById('sm-mvp').innerText = summary.mvp;

    const statsContainer = document.getElementById('sm-stats');
    statsContainer.innerHTML = '';
    const statLabels = { possession: 'Posesión', shots: 'Remates', corners: 'Córners' };

    Object.keys(summary.stats).forEach(stat => {
        const val1 = summary.stats[stat][0];
        const val2 = summary.stats[stat][1];
        const isPct = stat === 'possession';
        const total = val1 + val2;
        const pct1 = total > 0 ? (val1 / total) * 100 : 50;

        const statHtml = `
            <div>
                <div class="flex justify-between text-[10px] font-bold uppercase mb-1">
                    <span>${val1}${isPct ? '%' : ''}</span>
                    <span class="text-slate-500">${statLabels[stat]}</span>
                    <span>${val2}${isPct ? '%' : ''}</span>
                </div>
                <div class="stat-bar-container">
                    <div class="stat-bar-left" style="width: ${pct1}%"></div>
                    <div class="stat-bar-right" style="width: ${100 - pct1}%"></div>
                </div>
            </div>
        `;
        statsContainer.insertAdjacentHTML('beforeend', statHtml);
    });

    const eventsContainer = document.getElementById('sm-events');
    eventsContainer.innerHTML = '';
    summary.events.forEach(ev => {
        const isGoal = ev.type === 'goal';
        const icon = isGoal ? '⚽' : '🟨';
        const teamSide = ev.team === home ? 'left' : 'right';

        const eventHtml = `
            <div class="event-item ${teamSide === 'right' ? 'flex-row-reverse space-x-reverse text-right border-r-2 border-r-slate-700' : 'border-l-2 border-l-brand-green'}">
                <span class="font-black text-brand-gold w-8 text-center shrink-0">${ev.minute}'</span>
                <span class="text-lg shrink-0">${icon}</span>
                <div class="flex-grow">
                    <div class="font-bold text-white text-[12px]">${ev.player || ev.team}</div>
                    <div class="text-[9px] text-slate-500 uppercase tracking-tighter">${isGoal ? 'Golazo' : 'Amonestación'}</div>
                </div>
            </div>
        `;
        eventsContainer.insertAdjacentHTML('beforeend', eventHtml);
    });

    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
}

function closeSummaryModal() {
    const modal = document.getElementById('summary-modal');
    if (modal) modal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

function renderGroupStandings() {
    const container = document.getElementById('group-standings-container');
    if (!container) return;

    let standingsData = JSON.parse(localStorage.getItem('group_standings'));

    // Si no hay datos guardados, generar estado inicial con 0 puntos
    if (!standingsData || Object.keys(standingsData).length === 0) {
        standingsData = {};
        Object.keys(groups).forEach(groupLetter => {
            standingsData[groupLetter] = groups[groupLetter].map(t => ({
                name: t.name,
                pts: 0,
                pj: 0,
                gf: 0,
                gc: 0,
                gd: 0
            }));
        });
    }

    container.innerHTML = '';

    Object.keys(standingsData).sort().forEach(groupLetter => {
        const teams = standingsData[groupLetter];
        const card = document.createElement('div');
        card.className = 'bg-slate-900 border border-slate-700 rounded-xl overflow-hidden hover-lift';

        let tableHTML = `
            <div class="bg-brand-green/20 border-b border-brand-green/30 py-2 px-4 text-center">
                <h4 class="text-brand-green font-black uppercase tracking-widest text-sm">${t('group_label')} ${groupLetter}</h4>
            </div>
            <table class="w-full text-xs text-left">
                <thead class="bg-slate-800 text-slate-400 border-b border-slate-700">
                    <tr>
                        <th class="py-2 px-3 font-semibold">${t('table_head_team')}</th>
                        <th class="py-2 px-2 text-center font-semibold" title="${t('table_title_pts')}">${t('table_head_pts_short')}</th>
                        <th class="py-2 px-2 text-center font-semibold" title="${t('table_title_pj')}">${t('table_head_pj_short')}</th>
                        <th class="py-2 px-2 text-center font-semibold" title="${t('table_title_dif')}">${t('table_head_dif_short')}</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/50">
        `;

        teams.forEach((team, index) => {
            const teamInfo = getTeamInfo(team.name);
            const isQualified = index < 3; // Top 3 pasa

            tableHTML += `
                <tr class="hover:bg-slate-800/30 transition-colors ${isQualified ? 'bg-brand-green/5' : ''}">
                    <td class="py-2 px-3 flex items-center">
                        <span class="w-4 inline-block text-center text-slate-500 font-bold mr-2 text-[10px]">${index + 1}</span>
                        <img src="https://flagcdn.com/w20/${teamInfo.flag}.png" class="w-4 h-3 rounded-[2px] shadow-sm mr-2 opacity-90" alt="${team.name}">
                        <span class="text-white font-bold truncate max-w-[80px] sm:max-w-full" title="${team.name}">${teamInfo.code}</span>
                    </td>
                    <td class="py-2 px-2 text-center font-black ${isQualified ? 'text-brand-green' : 'text-slate-400'}">${team.pts}</td>
                    <td class="py-2 px-2 text-center text-slate-400">${team.pj}</td>
                    <td class="py-2 px-2 text-center font-bold ${team.gd > 0 ? 'text-blue-400' : (team.gd < 0 ? 'text-red-400' : 'text-slate-500')}">${team.gd > 0 ? '+' + team.gd : team.gd}</td>
                </tr>
            `;
        });

        tableHTML += `
                </tbody>
            </table>
        `;
        card.innerHTML = tableHTML;
        container.appendChild(card);
    });
}

// Vincular botón al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    const simBtn = document.getElementById('simulate-results-btn');
    const resetBtn = document.getElementById('reset-tournament-btn');

    if (simBtn) {
        simBtn.addEventListener('click', simulateAllResults);
    }
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTournament);
    }

    const populateBtn = document.getElementById('admin-populate-bracket-btn');
    if (populateBtn) {
        populateBtn.addEventListener('click', () => {
            if (confirm("¿Quieres forzar la población del cuadro con los resultados actuales?")) {
                populateKnockoutBracket();
                alert("Cuadro poblado con éxito.");
            }
        });
    }

    // Cargar resultados guardados si existen
    const savedResults = localStorage.getItem('official_results');
    const savedScores = localStorage.getItem('official_match_scores');
    if (savedResults) {
        const parsed = JSON.parse(savedResults);
        Object.keys(parsed).forEach(k => officialResults[k] = parsed[k]);
        if (savedScores) officialMatchScores = JSON.parse(savedScores);
        renderStandings();
        renderGroupStandings();
    } else {
        renderGroupStandings(); // Para mostrar el mensaje de "No hay datos"
    }
});

function calculateUserPoints(username) {
    const allPredictions = JSON.parse(localStorage.getItem('porra_predictions') || '{}');
    const userPicks = allPredictions[username];

    let totalPoints = 0;

    // --- 1. PUNTOS FASE 1 (GRUPOS) ---
    if (userPicks) {
        const groupStandings = JSON.parse(localStorage.getItem('group_standings') || '{}');
        Object.keys(officialResults).forEach(group => {
            let isGroupFinished = false;
            if (groupStandings[group] && groupStandings[group].length > 0) {
                isGroupFinished = groupStandings[group].every(team => team.pj >= 3);
            }
            if (!isGroupFinished) return;

            const result = officialResults[group];
            const p1 = userPicks[`group-${group}-pos-1`];
            const p2 = userPicks[`group-${group}-pos-2`];
            const p3 = userPicks[`group-${group}-pos-3`];

            if (result.includes(p1)) totalPoints += 1;
            if (result.includes(p2)) totalPoints += 1;
            if (result.includes(p3)) totalPoints += 1;
            if (p1 === result[0]) totalPoints += 2;
            if (p2 === result[1]) totalPoints += 2;
            if (p3 === result[2]) totalPoints += 2;
        });
    }

    // --- 2. PUNTOS FASE 2 (ELIMINATORIAS) ---
    const allFase2 = JSON.parse(localStorage.getItem('all_users_fase2_picks') || '[]');
    const userFase2 = allFase2.filter(p => p.username === username);

    if (userFase2.length > 0) {
        const structure = JSON.parse(localStorage.getItem(STORAGE_KEY_BRACKET) || '{}');

        const getRealWinner = (match) => {
            if (!match || match.score1 === undefined) return null;
            if (match.score1 > match.score2) return match.home;
            if (match.score2 > match.score1) return match.away;
            if (match.penalties) {
                if (match.penalties.p1 > match.penalties.p2) return match.home;
                return match.away;
            }
            return null;
        };

        const realWinners = {};
        ['L-1', 'R-1', 'L-2', 'R-2', 'L-3', 'R-3', 'L-4', 'R-4', 'third', 'final'].forEach(roundKey => {
            let matches = [];
            if (roundKey === 'L-1') matches = structure.dieciseisavos_L || [];
            else if (roundKey === 'R-1') matches = structure.dieciseisavos_R || [];
            else matches = structure[roundKey] || [];

            matches.forEach((m, idx) => {
                let matchId = roundKey === 'third' || roundKey === 'final' ? `${roundKey}-1` : `${roundKey}-${idx + 1}`;
                let winner = getRealWinner(m);
                if (winner) realWinners[matchId] = winner;
            });
        });

        // Escala progresiva de puntos (Total = 128 pts)
        userFase2.forEach(pick => {
            if (realWinners[pick.match_id] && realWinners[pick.match_id] === pick.winner) {
                if (pick.match_id.includes('-1-')) totalPoints += 2; // Dieciseisavos (32)
                else if (pick.match_id.includes('-2-')) totalPoints += 4; // Octavos (32)
                else if (pick.match_id.includes('-3-')) totalPoints += 6; // Cuartos (24)
                else if (pick.match_id.includes('-4-')) totalPoints += 10; // Semis (20)
                else if (pick.match_id.includes('third')) totalPoints += 5; // Tercer Puesto (5)
                else if (pick.match_id.includes('final')) totalPoints += 15; // Final (15)
            }
        });
    }

    // --- 3. PUNTOS FASE 3 (GRAN FINAL - MARCADOR EXACTO) ---
    const allFase3 = JSON.parse(localStorage.getItem('all_users_fase3_score') || '[]');
    const userFase3 = allFase3.find(p => p.username === username);

    if (userFase3) {
        const structure = JSON.parse(localStorage.getItem(STORAGE_KEY_BRACKET) || '{}');
        const finalMatch = structure.final ? structure.final[0] : null;

        if (finalMatch && finalMatch.score1 !== undefined) {
            if (finalMatch.score1 === userFase3.goles_local && finalMatch.score2 === userFase3.goles_visitante) {
                totalPoints += 5; // Acierto de marcador exacto
            } else {
                let realSign = finalMatch.score1 > finalMatch.score2 ? '1' : (finalMatch.score2 > finalMatch.score1 ? '2' : 'X');
                let userSign = userFase3.goles_local > userFase3.goles_visitante ? '1' : (userFase3.goles_visitante > userFase3.goles_local ? '2' : 'X');
                if (realSign === userSign) {
                    totalPoints += 2; // Solo acierto de ganador/empate
                }
            }
        }
    }

    // --- 4. PUNTOS POR PARTIDOS DEL DÍA (MOTD) ---
    const allPredictionsDaily = JSON.parse(localStorage.getItem('user_predictions') || '{}');
    const userDailyPicks = allPredictionsDaily[username];

    if (userDailyPicks) {
        const officialScores = JSON.parse(localStorage.getItem('official_match_scores') || '{}');

        Object.keys(userDailyPicks).forEach(fullMatchId => {
            const pred = userDailyPicks[fullMatchId];
            // fullMatchId format: ESP_vs_FRA_21/06
            const baseMatchId = fullMatchId.substring(0, fullMatchId.lastIndexOf('_'));

            const scoreStr = officialScores[baseMatchId]; // e.g. "2 : 1"
            if (scoreStr && scoreStr.includes(' : ')) {
                const [s1, s2] = scoreStr.split(' : ').map(Number);
                let realSign = s1 > s2 ? '1' : (s2 > s1 ? '2' : 'X');
                if (pred.sign === realSign) {
                    totalPoints += 4; // +4 puntos (Plenos) por acertar el 1X2 del Partido del Día
                }
            }
        });
    }

    // --- BOOST EXPERTO PARA USUARIOS MOCK (Simulación de "Super Usuarios") ---
    const loggedUser = localStorage.getItem('logged_user');
    if (username !== loggedUser) {
        const limitStr = localStorage.getItem('simulation_limit');
        if (limitStr) {
            const simulationLimit = new Date(limitStr);
            const startDate = new Date('2026-06-11');
            const totalDays = 39; // Duración del torneo
            const daysPassed = Math.floor((simulationLimit - startDate) / (1000 * 60 * 60 * 24));
            const progress = Math.max(0, Math.min(1, daysPassed / totalDays));

            // Generar un boost determinista basado en el nombre (entre 100 y 160 puntos extra)
            let seed = 0;
            for (let i = 0; i < username.length; i++) seed += username.charCodeAt(i);
            const boost = 100 + (seed % 61);

            totalPoints += Math.floor(boost * progress);

            // Cap máximo absoluto para que nunca rompan la regla de los 376 puntos
            const cap = 370 - (seed % 15);
            if (totalPoints > cap) totalPoints = cap;
        }
    }

    return totalPoints;
}

function autoGenerateMotdPredictions(motd) {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    let allPredictions = JSON.parse(localStorage.getItem('user_predictions') || '{}');
    const loggedUser = localStorage.getItem('logged_user');
    const matchId = `${motd.t1}_vs_${motd.t2}_${motd.date}`;

    users.forEach(u => {
        if (u.username === loggedUser) return;
        if (!allPredictions[u.username]) allPredictions[u.username] = {};

        if (allPredictions[u.username][matchId]) return;

        const r1 = teamRatings[motd.t1] ? teamRatings[motd.t1].rating : 75;
        const r2 = teamRatings[motd.t2] ? teamRatings[motd.t2].rating : 75;
        const diff = r1 - r2;
        let sign;
        const rand = Math.random();

        // Apuesta INTELIGENTE basada en rating
        if (diff > 4) {
            sign = rand < 0.65 ? '1' : (rand < 0.85 ? 'X' : '2');
        } else if (diff < -4) {
            sign = rand < 0.65 ? '2' : (rand < 0.85 ? 'X' : '1');
        } else {
            sign = rand < 0.38 ? '1' : (rand < 0.76 ? 'X' : '2');
        }

        allPredictions[u.username][matchId] = {
            username: u.username,
            matchId: matchId,
            sign: sign,
            timestamp: new Date().toISOString().slice(0, 19).replace('T', ' ')
        };
    });

    localStorage.setItem('user_predictions', JSON.stringify(allPredictions));
}

function renderStandings() {
    const standingsTable = document.getElementById('standings-body');
    if (!standingsTable) return;

    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');

    // Calcular puntos para cada usuario
    const leaderboard = users.map(user => {
        return {
            username: user.username,
            points: calculateUserPoints(user.username),
            isPaid: user.paid
        };
    });

    // Ordenar por puntos (Descendente)
    leaderboard.sort((a, b) => b.points - a.points);

    // Renderizar filas
    standingsTable.innerHTML = '';
    leaderboard.forEach((entry, index) => {
        const isCurrentPlayer = entry.username === localStorage.getItem('logged_user');
        const row = document.createElement('tr');
        row.className = `border-b border-slate-800/50 hover:bg-white/5 transition-colors ${isCurrentPlayer ? 'bg-brand-green/10' : ''}`;

        row.innerHTML = `
            <td class="py-4 px-6 text-center">
                <span class="inline-flex items-center justify-center w-8 h-8 rounded-full ${index < 3 ? 'bg-brand-gold text-slate-900 font-black' : 'text-slate-500 font-bold'}">
                    ${index + 1}
                </span>
            </td>
            <td class="py-4 px-6">
                <div class="flex items-center">
                    <div class="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center mr-3 text-[10px] font-bold text-slate-400">
                        ${entry.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                        <div class="font-bold text-white flex items-center">
                            ${entry.username}
                            ${isCurrentPlayer ? `<span class="ml-2 text-[8px] bg-brand-green text-white px-1.5 py-0.5 rounded-full uppercase">${t('label_you')}</span>` : ''}
                        </div>
                        <div class="text-[10px] ${entry.isPaid ? 'text-brand-green' : 'text-red-400'} uppercase font-black">
                            ${entry.isPaid ? t('status_paid') : t('status_pending')}
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-right">
                <div class="text-xl font-black text-white">${entry.points}</div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">${t('table_head_pts')}</div>
            </td>
        `;
        standingsTable.appendChild(row);
    });
}

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar Cuadro Eliminatorio PRIMERO para asegurar renderizado
    try {
        if (document.getElementById('col-L-1')) {
            console.log("Iniciando renderizado de cuadro...");
            renderSide('L');
            renderSide('R');
            renderCenterColumn();
        }
    } catch (e) {
        console.error("Error renderizando el cuadro:", e);
    }

    renderMatches(1);
    seedUsers(); // Sembrar usuarios con nombres variados
    updateInscriptionCounter();
    initSqlExport(); // Inicializar botones de exportación
    renderStandings(); // Renderizar clasificación inicial
});

// --- WhatsApp Simulation ---
function openWhatsAppSimulation() {
    const modal = document.getElementById('whatsapp-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        startWhatsAppSimulation();
    }
}

function closeWhatsAppSimulation() {
    const modal = document.getElementById('whatsapp-modal');
    if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

async function startWhatsAppSimulation() {
    const chatArea = document.getElementById('whatsapp-chat-area');
    const status = document.getElementById('whatsapp-status');
    const footerGuest = document.getElementById('whatsapp-footer-guest');
    const footerAdmin = document.getElementById('whatsapp-footer-admin');
    const sendBtn = document.getElementById('whatsapp-send-btn');
    const input = document.getElementById('whatsapp-input');

    if (!chatArea || !status) return;

    // Verificar si el usuario es administrador
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    const loggedUser = localStorage.getItem('logged_user');

    if (isAdmin) {
        if (footerGuest) footerGuest.classList.add('hidden');
        if (footerAdmin) footerAdmin.classList.remove('hidden');

        // Vincular eventos solo una vez
        if (sendBtn && !sendBtn.dataset.bound) {
            sendBtn.addEventListener('click', handleWhatsAppSend);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') handleWhatsAppSend();
            });
            sendBtn.dataset.bound = 'true';
        }
    } else {
        if (footerGuest) footerGuest.classList.remove('hidden');
        if (footerAdmin) footerAdmin.classList.add('hidden');
    }

    // Cargar mensajes de localStorage o usar iniciales
    let messages = JSON.parse(localStorage.getItem('whatsapp_messages'));
    if (!messages) {
        const paidCount = JSON.parse(localStorage.getItem('porra_users') || '[]').filter(u => u.paid).length;
        messages = [
            { sender: 'Administrador', color: 'text-brand-green', text: '¡Bienvenidos a todos! ⚽ Este es el canal oficial de la Porra Mundial 2026.', time: '14:20' },
            { sender: 'Administrador', color: 'text-brand-green', text: 'Recuerden que para validar su inscripción deben realizar el pago por Bizum y enviar el comprobante.', time: '14:22' },
            { sender: 'Administrador', color: 'text-brand-green', text: 'Normas del Grupo:\n• Solo se permiten pronósticos en el formato oficial.\n• Respeto absoluto entre competidores.\n• Las decisiones del admin son inapelables.', time: '14:25', isRules: true },
            { sender: 'Administrador', color: 'text-brand-green', text: `¡Ya somos ${paidCount} participantes oficiales! 🏃‍♂️💨 Las plazas vuelan. ¡No te quedes fuera!`, time: '14:30' }
        ];
        localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
    }

    chatArea.innerHTML = `
        <div class="flex justify-center mb-4">
            <span class="bg-[#182229] text-[10px] text-[#8696a0] px-3 py-1 rounded-lg shadow-sm">
                LOS MENSAJES ESTÁN CIFRADOS DE EXTREMO A EXTREMO
            </span>
        </div>
    `;

    renderWhatsAppMessages();
}

function renderWhatsAppMessages() {
    const chatArea = document.getElementById('whatsapp-chat-area');
    const isAdmin = localStorage.getItem('is_admin') === 'true';
    if (!chatArea) return;

    const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
    chatArea.innerHTML = `
        <div class="flex justify-center mb-4">
            <span class="bg-[#182229] text-[10px] text-[#8696a0] px-3 py-1 rounded-lg shadow-sm">
                LOS MENSAJES ESTÁN CIFRADOS DE EXTREMO A EXTREMO
            </span>
        </div>
    `;

    messages.forEach((msg, index) => {
        const msgDiv = document.createElement('div');
        msgDiv.className = 'flex flex-col items-start max-w-[85%] group relative mb-4';

        msgDiv.innerHTML = `
            <div class="bg-[#202c33] p-2 rounded-lg rounded-tl-none shadow-sm relative ${msg.isRules ? 'border-l-4 border-brand-gold' : ''}">
                <span class="${msg.color || 'text-brand-green'} text-[10px] font-bold block mb-1">${msg.sender}</span>
                <p class="text-white text-xs leading-relaxed ${msg.isRules ? 'italic' : ''}">
                    ${msg.text.replace(/\n/g, '<br>')}
                </p>
                <div class="flex items-center justify-end space-x-1 mt-1">
                    <span class="text-[9px] text-slate-400">${msg.time}</span>
                    <svg class="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"/></svg>
                </div>
                
                ${isAdmin ? `
                    <div class="absolute -right-10 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col space-y-1">
                        <button onclick="editWhatsAppMessage(${index})" class="p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-brand-gold">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                        </button>
                        <button onclick="deleteWhatsAppMessage(${index})" class="p-1.5 bg-slate-800 rounded-full text-slate-400 hover:text-red-500">
                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/></svg>
                        </button>
                    </div>
                ` : ''}
            </div>
        `;

        chatArea.appendChild(msgDiv);
    });
    chatArea.scrollTop = chatArea.scrollHeight;
}

function handleWhatsAppSend() {
    const input = document.getElementById('whatsapp-input');
    if (!input || !input.value.trim()) return;

    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;

    const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
    messages.push({
        sender: 'Administrador',
        color: 'text-brand-green',
        text: input.value.trim(),
        time: time
    });

    localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
    input.value = '';
    renderWhatsAppMessages();
}

window.editWhatsAppMessage = function (index) {
    const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
    const msg = messages[index];
    const newText = prompt('Editar mensaje:', msg.text);

    if (newText !== null) {
        messages[index].text = newText;
        localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
        renderWhatsAppMessages();
    }
}

window.deleteWhatsAppMessage = function (index) {
    if (confirm('¿Seguro que quieres borrar este mensaje?')) {
        const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
        messages.splice(index, 1);
        localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
        renderWhatsAppMessages();
    }
}


// --- Lógica de Edición de Horarios para Admin ---
document.addEventListener('DOMContentLoaded', () => {
    const loadMatchesBtn = document.getElementById('admin-load-matches-btn');
    const saveScheduleBtn = document.getElementById('admin-save-schedule-btn');
    const matchesList = document.getElementById('admin-matches-list');
    const jornadaSelect = document.getElementById('admin-schedule-jornada');
    const saveContainer = document.getElementById('admin-save-schedule-container');

    if (loadMatchesBtn) {
        loadMatchesBtn.addEventListener('click', () => {
            const jornada = jornadaSelect.value;
            renderAdminMatches(jornada);
        });
    }

    function renderAdminMatches(jornada) {
        if (!matchesList) return;
        matchesList.innerHTML = '';
        saveContainer.classList.remove('hidden');

        if (jornada === 'bracket') {
            // Renderizar eliminatorias (Dieciseisavos)
            ['L', 'R'].forEach(side => {
                const matches = structureBracket[`dieciseisavos_${side}`];
                const header = document.createElement('h4');
                header.className = 'text-brand-green font-bold text-sm mt-4 mb-2 uppercase tracking-widest';
                header.innerText = `Bloque ${side}`;
                matchesList.appendChild(header);

                matches.forEach((match, index) => {
                    const matchDiv = document.createElement('div');
                    matchDiv.className = 'bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col space-y-3';
                    matchDiv.innerHTML = `
                        <div class="flex justify-between items-center">
                            <span class="text-sm font-bold text-white">${match.home} vs ${match.away}</span>
                            <span class="text-[10px] text-slate-500 uppercase font-bold">Ref: Bracket-${side}-${index}</span>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha (DD/MM)</label>
                                <input type="text" value="${match.date}" data-type="bracket" data-side="${side}" data-index="${index}" data-field="date"
                                    class="admin-match-input w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-brand-gold outline-none">
                            </div>
                            <div>
                                <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hora (HH:MM)</label>
                                <input type="text" value="${match.time}" data-type="bracket" data-side="${side}" data-index="${index}" data-field="time"
                                    class="admin-match-input w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-brand-gold outline-none">
                            </div>
                        </div>
                    `;
                    matchesList.appendChild(matchDiv);
                });
            });

            // También permitir editar roundSchedule (Octavos en adelante)
            const scheduleHeader = document.createElement('h4');
            scheduleHeader.className = 'text-brand-gold font-bold text-sm mt-6 mb-2 uppercase tracking-widest';
            scheduleHeader.innerText = `Siguientes Rondas (Octavos a Final)`;
            matchesList.appendChild(scheduleHeader);

            Object.keys(structureBracket.roundSchedule).forEach(key => {
                const times = structureBracket.roundSchedule[key];
                const roundDiv = document.createElement('div');
                roundDiv.className = 'bg-slate-900/50 p-4 rounded-xl border border-slate-800 space-y-3 mb-4';
                roundDiv.innerHTML = `<div class="text-[10px] font-bold text-slate-400 uppercase mb-2">Ronda: ${key}</div>`;

                times.forEach((timeStr, idx) => {
                    roundDiv.innerHTML += `
                        <div class="flex items-center space-x-2">
                            <span class="text-[10px] text-slate-500 w-8">M${idx + 1}:</span>
                            <input type="text" value="${timeStr}" data-type="roundSchedule" data-key="${key}" data-index="${idx}"
                                class="admin-match-input w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-1 text-xs text-white focus:border-brand-gold outline-none">
                        </div>
                    `;
                });
                matchesList.appendChild(roundDiv);
            });

        } else {
            // Renderizar jornada normal
            const matches = matchSchedule[jornada] || [];
            matches.forEach((match, index) => {
                const matchDiv = document.createElement('div');
                matchDiv.className = 'bg-slate-800/50 p-4 rounded-xl border border-slate-700 flex flex-col space-y-3';
                matchDiv.innerHTML = `
                    <div class="flex justify-between items-center">
                        <span class="text-sm font-bold text-white">${match.t1} vs ${match.t2}</span>
                        <span class="text-[10px] text-slate-500 uppercase font-bold">Ref: ${jornada}-${index}</span>
                    </div>
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Fecha (DD/MM)</label>
                            <input type="text" value="${match.date}" data-type="group" data-jornada="${jornada}" data-index="${index}" data-field="date"
                                class="admin-match-input w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-brand-gold outline-none">
                        </div>
                        <div>
                            <label class="block text-[10px] font-bold text-slate-400 uppercase mb-1">Hora (HH:MM)</label>
                            <input type="text" value="${match.time}" data-type="group" data-jornada="${jornada}" data-index="${index}" data-field="time"
                                class="admin-match-input w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white focus:border-brand-gold outline-none">
                        </div>
                    </div>
                `;
                matchesList.appendChild(matchDiv);
            });
        }
    }

    if (saveScheduleBtn) {
        saveScheduleBtn.addEventListener('click', () => {
            const inputs = document.querySelectorAll('.admin-match-input');
            let groupsChanged = false;
            let bracketChanged = false;

            inputs.forEach(input => {
                const type = input.dataset.type;

                if (type === 'group') {
                    const jornada = input.dataset.jornada;
                    const index = parseInt(input.dataset.index);
                    const field = input.dataset.field;
                    matchSchedule[jornada][index][field] = input.value;
                    groupsChanged = true;
                } else if (type === 'bracket') {
                    const side = input.dataset.side;
                    const index = parseInt(input.dataset.index);
                    const field = input.dataset.field;
                    structureBracket[`dieciseisavos_${side}`][index][field] = input.value;
                    bracketChanged = true;
                } else if (type === 'roundSchedule') {
                    const key = input.dataset.key;
                    const index = parseInt(input.dataset.index);
                    structureBracket.roundSchedule[key][index] = input.value;
                    bracketChanged = true;
                }
            });

            if (groupsChanged) {
                localStorage.setItem('custom_match_schedule', JSON.stringify(matchSchedule));
            }
            if (bracketChanged) {
                localStorage.setItem(STORAGE_KEY_BRACKET, JSON.stringify(structureBracket));
            }

            alert('¡Horarios actualizados correctamente!');

            // Recargar vistas
            const currentJornada = document.querySelector('.jornada-btn.bg-purple-500');
            if (currentJornada) {
                renderMatches(currentJornada.id.replace('btn-jornada-', ''));
            }

            // Recargar bracket si existe en la página
            if (typeof renderSide === 'function') {
                const colL = document.getElementById('col-L-1');
                if (colL) {
                    colL.innerHTML = '';
                    document.getElementById('col-L-2').innerHTML = '';
                    document.getElementById('col-L-3').innerHTML = '';
                    document.getElementById('col-L-4').innerHTML = '';
                    document.getElementById('col-R-1').innerHTML = '';
                    document.getElementById('col-R-2').innerHTML = '';
                    document.getElementById('col-R-3').innerHTML = '';
                    document.getElementById('col-R-4').innerHTML = '';
                    renderSide('L');
                    renderSide('R');
                }
            }
        });
    }
});

// --- Lógica del Contador Mundial 2026 ---
function initWorldCupCountdown() {
    const openingDate = new Date('June 11, 2026 18:00:00').getTime();

    const updateCountdown = () => {
        const now = new Date().getTime();
        const distance = openingDate - now;

        // Elementos del DOM
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');

        if (!daysEl) return;

        if (distance < 0) {
            daysEl.innerText = "00";
            hoursEl.innerText = "00";
            minutesEl.innerText = "00";
            secondsEl.innerText = "00";
            return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        daysEl.innerText = String(days).padStart(2, '0');
        hoursEl.innerText = String(hours).padStart(2, '0');
        minutesEl.innerText = String(minutes).padStart(2, '0');
        secondsEl.innerText = String(seconds).padStart(2, '0');
    };

    // Actualizar cada segundo para mostrar los segundos
    updateCountdown();
    setInterval(updateCountdown, 1000);
}

// --- Progreso de Fase 1 ---
function updatePhase1Progress() {
    const predictions = JSON.parse(localStorage.getItem('user_predictions')) || {};
    // Asumimos 12 grupos A-L. Cada grupo debe tener 3 seleccionados.
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];
    let completedGroups = 0;

    groups.forEach(g => {
        if (predictions[g] && predictions[g].length >= 3) {
            completedGroups++;
        }
    });

    const pct = Math.round((completedGroups / groups.length) * 100);

    const bar = document.getElementById('phase-1-progress-bar');
    const pctText = document.getElementById('phase-1-progress-pct');
    const statusText = document.getElementById('phase-1-status-text');

    if (bar) bar.style.width = `${pct}%`;
    if (pctText) pctText.innerText = `${pct}%`;
    if (statusText) {
        if (pct === 100) statusText.innerText = "¡Completado!";
        else if (pct > 0) statusText.innerText = "En progreso...";
        else statusText.innerText = "Sin empezar";
    }
}

// --- Gestión de Visibilidad de Fases (Apertura automática) ---
function updatePhasesVisibility() {
    console.log("Comprobando visibilidad de fases...");
    // Fecha fin de fase de grupos: 28/06/2026 00:00
    const groupStageEnd = new Date('2026-06-28T00:00:00');

    // Fecha actual o simulada
    const simulationLimitStr = localStorage.getItem('simulation_limit');
    const effectiveDate = simulationLimitStr ? new Date(simulationLimitStr) : new Date();

    // Fase 1: Grupos
    updatePhase1Progress();
    const phase1Card = document.querySelector('a[href="pronosticos.html"]')?.parentElement;
    const tournamentStart = new Date('2026-06-11T18:00:00');
    if (phase1Card) {
        const statusText = document.getElementById('phase-1-status-text');
        const link = document.getElementById('phase-1-link');
        if (effectiveDate >= groupStageEnd) {
            if (statusText) statusText.innerText = "Fase finalizada";
            if (link) {
                link.innerText = "Ver Resultados";
                link.classList.replace('bg-brand-green', 'bg-slate-700');
            }
        } else if (effectiveDate >= tournamentStart) {
            if (statusText) statusText.innerText = "Torneo en marcha";
            if (link) link.innerText = "Ver Mi Porra";
        }
    }

    // Fase 2: Cuadro
    const phase2Lock = document.getElementById('phase-2-lock');
    const phase2Content = document.getElementById('phase-2-content');
    const phase2Link = document.getElementById('phase-2-link');
    const phase2Timer = document.getElementById('phase-2-mini-timer');
    const phase2Desc = document.getElementById('phase-2-desc');

    if (phase2Lock && phase2Content) {
        if (effectiveDate >= groupStageEnd) {
            phase2Lock.classList.add('hidden');
            phase2Content.classList.remove('opacity-40');
            if (phase2Link) {
                phase2Link.innerText = "Entrar";
                phase2Link.classList.remove('bg-slate-800/50', 'text-slate-500');
                phase2Link.classList.add('bg-purple-600', 'text-white', 'hover:bg-purple-700');
            }
        } else {
            phase2Lock.classList.remove('hidden');
            phase2Content.classList.add('opacity-40');

            // Mostrar cuenta atrás en el candado
            const diff = groupStageEnd - effectiveDate;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

            const lockSpan = phase2Lock.querySelector('span');
            if (lockSpan) {
                lockSpan.innerText = days > 0 ? `Abre en ${days}d ${hours}h` : `Abre en ${hours}h`;
            }

            // Actualizar mini timer en el contenido
            if (phase2Timer && phase2Desc) {
                phase2Timer.classList.remove('hidden');
                phase2Desc.innerText = "Faltan para abrir:";
                const dSpan = document.getElementById('p2-days');
                const hSpan = document.getElementById('p2-hours');
                if (dSpan) dSpan.innerText = String(days).padStart(2, '0');
                if (hSpan) hSpan.innerText = String(hours).padStart(2, '0');
            }
        }
    }

    // Fase 3: Final
    const phase3Lock = document.getElementById('phase-3-lock');
    const phase3Content = document.getElementById('phase-3-content');
    const phase3LinkCont = document.getElementById('phase-3-link-container');
    const finalDate = new Date('2026-07-16T10:00:00');
    const finalCloseDate = new Date('2026-07-18T00:00:00');

    if (phase3Lock && phase3Content) {
        if (effectiveDate >= finalDate) {
            phase3Lock.classList.add('hidden');
            phase3Content.classList.remove('opacity-40');
            if (phase3LinkCont) {
                if (effectiveDate >= finalCloseDate) {
                    phase3LinkCont.innerHTML = '<a href="final.html" class="block w-full py-3 bg-slate-700 text-white font-black text-center rounded-xl">Ver Final</a>';
                    const p3Status = document.getElementById('phase-3-status');
                    if (p3Status) p3Status.innerText = "Pronósticos Cerrados";
                } else {
                    phase3LinkCont.innerHTML = '<a href="final.html" class="block w-full py-3 bg-brand-gold text-slate-950 font-black text-center rounded-xl">Entrar</a>';
                }
            }
        } else {
            const diff = finalDate - effectiveDate;
            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const lockSpan = phase3Lock.querySelector('span');
            if (lockSpan) {
                if (days > 0) lockSpan.innerText = `Abre en ${days} días`;
                else lockSpan.innerText = `Abre en ${hours}h`;
            }
        }
    }
}

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    initWorldCupCountdown();
    updatePhasesVisibility();
});

function generateAllUsersKnockoutPredictions() {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    if (users.length === 0) return;
    const structure = JSON.parse(localStorage.getItem(STORAGE_KEY_BRACKET));
    if (!structure || !structure.dieciseisavos_L) return;
    let allFase2 = [];
    let allFase3 = [];

    const getWinnerSmart = (home, away) => {
        if (home === "Por definir") return away;
        if (away === "Por definir") return home;
        const r1 = teamRatings[home] ? teamRatings[home].rating : 75;
        const r2 = teamRatings[away] ? teamRatings[away].rating : 75;
        const prob = r1 / (r1 + r2);
        return Math.random() < (prob + (Math.random() * 0.2 - 0.1)) ? home : away;
    };

    users.forEach(u => {
        let L1_w = [];
        for (let i = 0; i < 8; i++) {
            let m = structure.dieciseisavos_L[i];
            let w = getWinnerSmart(m.home, m.away);
            L1_w.push(w);
            allFase2.push({ username: u.username, match_id: `L-1-${i + 1}`, winner: w });
        }
        let R1_w = [];
        for (let i = 0; i < 8; i++) {
            let m = structure.dieciseisavos_R[i];
            let w = getWinnerSmart(m.home, m.away);
            R1_w.push(w);
            allFase2.push({ username: u.username, match_id: `R-1-${i + 1}`, winner: w });
        }
        let L2_w = [];
        for (let i = 0; i < 4; i++) {
            let w = getWinnerSmart(L1_w[i * 2], L1_w[i * 2 + 1]);
            L2_w.push(w);
            allFase2.push({ username: u.username, match_id: `L-2-${i + 1}`, winner: w });
        }
        let R2_w = [];
        for (let i = 0; i < 4; i++) {
            let w = getWinnerSmart(R1_w[i * 2], R1_w[i * 2 + 1]);
            R2_w.push(w);
            allFase2.push({ username: u.username, match_id: `R-2-${i + 1}`, winner: w });
        }
        let L3_w = [];
        for (let i = 0; i < 2; i++) {
            let w = getWinnerSmart(L2_w[i * 2], L2_w[i * 2 + 1]);
            L3_w.push(w);
            allFase2.push({ username: u.username, match_id: `L-3-${i + 1}`, winner: w });
        }
        let R3_w = [];
        for (let i = 0; i < 2; i++) {
            let w = getWinnerSmart(R2_w[i * 2], R2_w[i * 2 + 1]);
            R3_w.push(w);
            allFase2.push({ username: u.username, match_id: `R-3-${i + 1}`, winner: w });
        }
        let L4_w = getWinnerSmart(L3_w[0], L3_w[1]);
        allFase2.push({ username: u.username, match_id: `L-4-1`, winner: L4_w });
        let R4_w = getWinnerSmart(R3_w[0], R3_w[1]);
        allFase2.push({ username: u.username, match_id: `R-4-1`, winner: R4_w });
        let final_w = getWinnerSmart(L4_w, R4_w);
        allFase2.push({ username: u.username, match_id: `final-1`, winner: final_w });
        let L4_l = L4_w === L3_w[0] ? L3_w[1] : L3_w[0];
        let R4_l = R4_w === R3_w[0] ? R3_w[1] : R3_w[0];
        let third_w = getWinnerSmart(L4_l, R4_l);
        allFase2.push({ username: u.username, match_id: `third-1`, winner: third_w });
        allFase3.push({ username: u.username, goles_local: Math.floor(Math.random() * 3), goles_visitante: Math.floor(Math.random() * 3) });
    });
    localStorage.setItem('all_users_fase2_picks', JSON.stringify(allFase2));
    localStorage.setItem('all_users_fase3_score', JSON.stringify(allFase3));
}

async function exportGroupsImage(e) {
    const container = document.getElementById('group-standings-container');
    if (!container) return;

    const btn = e ? e.currentTarget : null;
    const originalText = btn ? btn.innerHTML : "";

    try {
        if (btn) {
            btn.disabled = true;
            btn.style.opacity = '0.5';
            const divs = btn.querySelectorAll('div');
            divs.forEach(d => {
                if (d.innerText.includes("Exportar Grupos")) d.innerText = "Procesando...";
            });
        }

        const canvas = await html2canvas(container, {
            backgroundColor: '#020617', // bg-brand-darker
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: false,
            onclone: (clonedDoc) => {
                const clonedContainer = clonedDoc.getElementById('group-standings-container');
                if (clonedContainer) {
                    clonedContainer.style.padding = '20px';
                }
            }
        });

        const image = canvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = 'Clasificacion-Grupos-Mundial-2026.png';
        link.href = image;
        link.click();
    } catch (err) {
        console.error("Error exportando imagen de grupos:", err);
        alert("Hubo un error al generar la imagen de los grupos.");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.style.opacity = '1';
            btn.innerHTML = originalText;
        }
    }
}
