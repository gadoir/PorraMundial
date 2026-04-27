// --- Constantes del Cuadro Eliminatorio ---
let structureBracket = JSON.parse(localStorage.getItem('custom_bracket_structure')) || {
    dieciseisavos_L: [
        { id: 1, home: "2A", away: "2B", date: "28/06", time: "21:00" },
        { id: 2, home: "1C", away: "2F", date: "29/06", time: "19:00" },
        { id: 3, home: "1E", away: "3rd A/B/C/D/F", date: "29/06", time: "22:30" },
        { id: 4, home: "1F", away: "2C", date: "30/06", time: "03:00" },
        { id: 5, home: "2E", away: "Group I 2nd", date: "30/06", time: "19:00" },
        { id: 6, home: "Group I Winner", away: "3rd C/D/F/G/H", date: "30/06", time: "23:00" },
        { id: 7, home: "1A", away: "3rd C/E/F/H/I", date: "01/07", time: "03:00" },
        { id: 8, home: "Group L Winner", away: "3rd E/H/I/J/K", date: "01/07", time: "18:00" }
    ],
    dieciseisavos_R: [
        { id: 9, home: "1G", away: "3rd A/E/H/I/J", date: "01/07", time: "22:00" },
        { id: 10, home: "1D", away: "3rd B/E/F/I/J", date: "02/07", time: "02:00" },
        { id: 11, home: "1H", away: "Group J 2nd", date: "02/07", time: "21:00" },
        { id: 12, home: "Group K 2nd", away: "Group L 2nd", date: "03/07", time: "01:00" },
        { id: 13, home: "1B", away: "3rd E/F/G/I/J", date: "03/07", time: "05:00" },
        { id: 14, home: "2D", away: "2G", date: "03/07", time: "20:00" },
        { id: 15, home: "Group J Winner", away: "2H", date: "04/07", time: "00:00" },
        { id: 16, home: "Group K Winner", away: "3rd D/E/I/J/L", date: "04/07", time: "03:30" }
    ],
    roundSchedule: {
        "L-2": ["04/07, 19:00", "04/07, 23:00", "05/07, 22:00", "06/07, 02:00"],
        "R-2": ["06/07, 21:00", "07/07, 02:00", "07/07, 18:00", "07/07, 22:00"],
        "L-3": ["09/07, 22:00", "10/07, 21:00"],
        "R-3": ["11/07, 23:00", "12/07, 03:00"],
        "L-4": ["14/07, 21:00"],
        "R-4": ["15/07, 21:00"]
    }
};

const configBracket = {
    L: { 1: { next: "L-2", count: 8 }, 2: { next: "L-3", count: 4 }, 3: { next: "L-4", count: 2 }, 4: { next: "final", count: 1 } },
    R: { 1: { next: "R-2", count: 8 }, 2: { next: "R-3", count: 4 }, 3: { next: "R-4", count: 2 }, 4: { next: "final", count: 1 } }
};

function renderSide(side) {
    for (let round = 1; round <= 4; round++) {
        const col = document.getElementById(`col-${side}-${round}`);
        if (!col) continue;
        const count = configBracket[side][round].count;
        for (let i = 0; i < count; i++) {
            const matchId = i + 1;
            const key = `${side}-${round}`;
            const schedule = structureBracket.roundSchedule[key] ? structureBracket.roundSchedule[key][i] : "TBD, TBD";
            const matchData = (round === 1) ? structureBracket[`dieciseisavos_${side}`][i] : { home: "Por definir", away: "Por definir", date: schedule.split(', ')[0], time: schedule.split(', ')[1] };
            const container = document.createElement('div');
            container.className = `match-container ${i % 2 === 0 ? 'top-of-pair' : 'bottom-of-pair'} ${round > 1 ? 'is-entry' : ''}`;
            const spacerTop = document.createElement('div');
            spacerTop.className = "match-spacer";
            col.appendChild(spacerTop);
            container.innerHTML = `
                <div class="connector-in connector"></div>
                <div class="match-box">
                    <div class="match-header">${matchData.date}, ${matchData.time}</div>
                    <div class="team-row" onclick="pick('${side}-${round}', ${matchId}, 'home')" id="${side}-${round}-${matchId}-home">
                        <svg class="team-shield" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path></svg>
                        <span class="team-name">${matchData.home}</span>
                    </div>
                    <div class="team-row" onclick="pick('${side}-${round}', ${matchId}, 'away')" id="${side}-${round}-${matchId}-away">
                        <svg class="team-shield" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6z"></path></svg>
                        <span class="team-name">${matchData.away}</span>
                    </div>
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
    const el = document.getElementById(`${key}-${id}-${pos}`);
    if (el) {
        const nameEl = el.querySelector('.team-name');
        nameEl.innerText = name;
        nameEl.style.color = 'white';
        el.classList.remove('selected');
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
    const el = document.getElementById(`${key}-${id}-${pos}`);
    if (el) {
        el.querySelector('.team-name').innerText = "Por definir";
        el.querySelector('.team-name').style.color = '#94a3b8';
        el.classList.remove('selected');
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
    // Nota: Como estamos en index.html, los datos reales de Fase 2 estarían en localStorage
    // Si no hay datos guardados aún, exportamos una estructura básica.
    const picks = JSON.parse(localStorage.getItem('fase2_picks') || '[]');
    
    let sql = `/* EXPORTACIÓN FASE 2 - CUADRO */\n`;
    sql += `CREATE TABLE IF NOT EXISTS pronosticos_fase2 (id INT AUTO_INCREMENT PRIMARY KEY, equipo_ganador VARCHAR(100), partido_id VARCHAR(50));\n`;
    
    if (picks.length > 0) {
        const values = picks.map(p => `('${p.team}', '${p.matchId}')`).join(',\n');
        sql += `INSERT INTO pronosticos_fase2 (equipo_ganador, partido_id) VALUES \n${values};`;
    } else {
        sql += `-- No se encontraron pronósticos guardados en el navegador para la Fase 2.\n`;
    }
    
    downloadFile(sql, 'pronosticos_fase2_dashboard.sql');
}

function downloadSQLFase3() {
    const score = JSON.parse(localStorage.getItem('fase3_score') || '{"a": 0, "b": 0}');
    
    let sql = `/* EXPORTACIÓN FASE 3 - FINAL */\n`;
    sql += `CREATE TABLE IF NOT EXISTS pronosticos_fase3 (id INT AUTO_INCREMENT PRIMARY KEY, goles_local INT, goles_visitante INT);\n`;
    sql += `INSERT INTO pronosticos_fase3 (goles_local, goles_visitante) VALUES (${score.a}, ${score.b});`;
    
    downloadFile(sql, 'pronosticos_fase3_dashboard.sql');
}

// Datos de Grupos y Equipos
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
            "time": "21:00"
        },
        {
            "t1": "Corea del Sur",
            "t2": "República Checa",
            "date": "12/06",
            "time": "04:00"
        },
        {
            "t1": "Canadá",
            "t2": "Bosnia Herzegovina",
            "date": "12/06",
            "time": "21:00"
        },
        {
            "t1": "Estados Unidos",
            "t2": "Paraguay",
            "date": "13/06",
            "time": "03:00"
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
    "México": { rating: 79, star: "Santiago Giménez", style: "presión alta y transiciones rápidas", form: "en pleno crecimiento como local" },
    "Estados Unidos": { rating: 82, star: "Christian Pulisic", style: "juego dinámico y transiciones rápidas", form: "creciendo como anfitrión del torneo" },
    "Canadá": { rating: 78, star: "Alphonso Davies", style: "potencia física y juego por bandas", form: "mejorando su estructura defensiva" },
    "Panamá": { rating: 74, star: "Adalberto Carrasquilla", style: "orden defensivo y bloque bajo", form: "con mucha ilusión competitiva" },
    "Haití": { rating: 69, star: "Duckens Nazon", style: "juego directo y físico", form: "buscando dar la sorpresa" },
    "Curaçao": { rating: 68, star: "Leandro Bacuna", style: "juego asociativo", form: "enfocados en la posesión" },

    // --- UEFA ---
    "España": { rating: 90, star: "Lamine Yamal", style: "posesión absoluta y juego asociativo", form: "dominando Europa con su juventud" },
    "Francia": { rating: 93, star: "Kylian Mbappé", style: "contraataque letal y potencia física", form: "favorito indiscutible al título" },
    "Inglaterra": { rating: 88, star: "Jude Bellingham", style: "equilibrio táctico y llegada al área", form: "un bloque sólido y muy físico" },
    "Alemania": { rating: 86, star: "Jamal Musiala", style: "disciplina táctica y transiciones rápidas", form: "en fase de reconstrucción competitiva" },
    "Portugal": { rating: 87, star: "Rafael Leão", style: "despliegue físico y verticalidad", form: "una de las plantillas más completas" },
    "Países Bajos": { rating: 85, star: "Xavi Simons", style: "fútbol total y presión asfixiante", form: "siempre competitivos y dinámicos" },
    "Italia": { rating: 87, star: "Nicolò Barella", style: "solidez defensiva y control táctico", form: "buscando redimirse en la gran cita" },
    "Bélgica": { rating: 84, star: "Kévin De Bruyne", style: "creatividad ofensiva y pases filtrados", form: "en el último baile de su generación dorada" },
    "Croacia": { rating: 84, star: "Luka Modric", style: "maestría en mediocampo y resistencia", form: "expertos en aguantar partidos límite" },
    "Suiza": { rating: 82, star: "Granit Xhaka", style: "bloque compacto y orden suizo", form: "un rival incómodo para cualquier grande" },
    "Noruega": { rating: 81, star: "Erling Haaland", style: "finalización letal y fuerza", form: "dependientes de su gran goleador" },
    "Austria": { rating: 79, star: "David Alaba", style: "polivalencia y rigor táctico", form: "un equipo muy difícil de batir" },
    "República Checa": { rating: 78, star: "Patrik Schick", style: "juego aéreo y segundas jugadas", form: "clásicos competidores europeos" },
    "Escocia": { rating: 76, star: "Andrew Robertson", style: "intensidad y balones parados", form: "con el corazón de su afición" },
    "Turquía": { rating: 82, star: "Arda Güler", style: "talento técnico y pasión", form: "capaces de ganar a cualquiera en su día" },
    "Bosnia Herzegovina": { rating: 75, star: "Edin Dzeko", style: "juego directo y veteranía", form: "luchando cada balón al máximo" },
    "Suecia": { rating: 81, star: "Alexander Isak", style: "velocidad y técnica", form: "buscando recuperar su sitio en la élite" },

    // --- CONMEBOL ---
    "Argentina": { rating: 91, star: "Lionel Messi", style: "control de juego y genialidad individual", form: "defendiendo la corona con veteranía" },
    "Brasil": { rating: 89, star: "Vinícius Jr.", style: "fútbol ofensivo y desborde constante", form: "buscando recuperar el prestigio mundial" },
    "Uruguay": { rating: 86, star: "Fede Valverde", style: "presión intensa y garra charrúa", form: "bajo la dirección de un juego vertical" },
    "Ecuador": { rating: 81, star: "Moisés Caicedo", style: "intensidad en mediocampo y velocidad", form: "una generación joven muy talentosa" },
    "Colombia": { rating: 85, star: "Luis Díaz", style: "juego alegre y desequilibrio individual", form: "invictos y con mucha confianza" },
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
                    <h5 class="text-white font-bold text-sm">Porra Mundial 2026 🏆</h5>
                    <p id="whatsapp-status" class="text-[10px] text-slate-400">Administrador</p>
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

    document.getElementById('ai-consult-btn').addEventListener('click', function() {
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
    // Si ya sembramos con la nueva versión, no repetir
    if (localStorage.getItem('data_seeded_v2')) return;

    let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    let allPredictions = JSON.parse(localStorage.getItem('porra_predictions') || '{}');
    
    // Limpiar usuarios antiguos con espacios o nombres genéricos para renovar
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

            // Generar predicciones aleatorias pero realistas para este usuario
            const userPicks = {};
            Object.keys(groups).forEach(group => {
                const teams = [...groups[group]];
                // Mezclar y elegir 3
                const shuffled = teams.sort(() => 0.5 - Math.random());
                userPicks[`group-${group}-pos-1`] = shuffled[0].name;
                userPicks[`group-${group}-pos-2`] = shuffled[1].name;
                userPicks[`group-${group}-pos-3`] = shuffled[2].name;
            });
            allPredictions[name] = userPicks;
        }
    });

    localStorage.setItem('porra_users', JSON.stringify(users));
    localStorage.setItem('porra_predictions', JSON.stringify(allPredictions));
    localStorage.setItem('data_seeded_v2', 'true');
    
    // Actualizar UI
    updateInscriptionCounter();
}

let officialResults = {
    'A': [], 'B': [], 'C': [], 'D': [], 'E': [], 'F': [],
    'G': [], 'H': [], 'I': [], 'J': [], 'K': [], 'L': []
};
let officialMatchScores = JSON.parse(localStorage.getItem('official_match_scores')) || {};

// --- Función de Simulación de Resultados Realista ---
function simulateAllResults() {
    const simulationDateInput = document.getElementById('simulation-date');
    const simulationLimit = simulationDateInput ? new Date(simulationDateInput.value) : new Date('2026-07-20');
    
    console.log("Iniciando simulación hasta:", simulationLimit.toDateString());
    
    // Helper para parsear fechas de partidos (DD/MM)
    const parseMatchDate = (dateStr) => {
        const [day, month] = dateStr.split('/').map(Number);
        return new Date(2026, month - 1, day);
    };
    
    // 1. Limpiar resultados anteriores
    Object.keys(officialResults).forEach(group => officialResults[group] = []);
    officialMatchScores = {};
    const groupStandingsGlobal = {};

    // 2. Simular cada grupo
    Object.keys(groups).forEach(groupLetter => {
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

        // Buscar partidos de este grupo en matchSchedule
        // Nota: Los grupos en matchSchedule son 1-12, los mapeamos a A-L
        const groupIndex = groupLetter.charCodeAt(0) - 65; // A=0, B=1...
        const jornadaKeys = ['1', '2', '3'];
        
        jornadaKeys.forEach(j => {
            const matches = matchSchedule[j] || [];
            matches.forEach(m => {
                // Verificar si el partido ya ocurrió según el límite de simulación
                const mDate = parseMatchDate(m.date);
                if (mDate > simulationLimit) return; // Saltarse partidos futuros

                const t1 = standings.find(s => s.name === m.t1);
                const t2 = standings.find(s => s.name === m.t2);

                if (t1 && t2) {
                    // Simulación Realista
                    const res = simulateMatch(t1.rating, t2.rating);
                    
                    // Actualizar Tabla
                    t1.pj += 1;
                    t2.pj += 1;
                    t1.gf += res.g1;
                    t1.gc += res.g2;
                    t2.gf += res.g2;
                    t2.gc += res.g1;

                    if (res.g1 > res.g2) t1.pts += 3;
                    else if (res.g1 < res.g2) t2.pts += 3;
                    else { t1.pts += 1; t2.pts += 1; }

                    // Guardar resultado individual
                    officialMatchScores[`${m.t1}_vs_${m.t2}`] = `${res.g1} : ${res.g2}`;
                }
            });
        });

        // Calcular Diferencia de Goles
        standings.forEach(s => s.gd = s.gf - s.gc);

        // Ordenar: Puntos -> GD -> GF -> Rating (Tie-breaker)
        standings.sort((a, b) => {
            if (b.pts !== a.pts) return b.pts - a.pts;
            if (b.gd !== a.gd) return b.gd - a.gd;
            if (b.gf !== a.gf) return b.gf - a.gf;
            return b.rating - a.rating;
        });

        // Guardar Top 3 para la Porra
        officialResults[groupLetter] = [standings[0].name, standings[1].name, standings[2].name];
        
        // Guardar tabla completa del grupo
        groupStandingsGlobal[groupLetter] = standings;
    });

    localStorage.setItem('official_results', JSON.stringify(officialResults));
    localStorage.setItem('official_match_scores', JSON.stringify(officialMatchScores));
    localStorage.setItem('group_standings', JSON.stringify(groupStandingsGlobal));
    console.log("Simulación completada:", officialResults);
    
    // Actualizar Clasificación
    renderStandings();
    renderGroupStandings();
    alert(`¡Simulación completada hasta el ${simulationLimit.toLocaleDateString()}! La clasificación general se ha actualizado con los resultados de los partidos jugados hasta esa fecha.`);
}

function resetTournament() {
    if (confirm("¿Estás seguro de que quieres reiniciar el torneo? Se borrarán todos los resultados oficiales simulados y la clasificación volverá a cero.")) {
        localStorage.removeItem('official_results');
        localStorage.removeItem('official_match_scores');
        localStorage.removeItem('group_standings');
        Object.keys(officialResults).forEach(group => officialResults[group] = []);
        officialMatchScores = {};
        renderStandings();
        renderGroupStandings();
        
        // Recargar jornada actual para limpiar marcadores
        const currentJornada = document.querySelector('.jornada-btn.bg-purple-500');
        if (currentJornada) {
            renderMatches(currentJornada.id.replace('btn-jornada-', ''));
        }
        
        alert("El torneo ha sido reiniciado.");
    }
}

function simulateMatch(r1, r2) {
    const diff = r1 - r2;
    
    // Calcular Expected Goals (lambda) de forma realista
    // Base de 1.3 goles por equipo, ajustado por diferencia de calidad (0.05 por punto)
    let lambda1 = 1.3 + (diff * 0.05);
    let lambda2 = 1.3 - (diff * 0.05);
    
    // Asegurar límites realistas (mínimo 0.2 para que los débiles siempre tengan algo de chance, máximo 3.5)
    lambda1 = Math.max(0.2, Math.min(3.5, lambda1));
    lambda2 = Math.max(0.2, Math.min(3.5, lambda2));

    // Función Poisson simple para generar goles
    function poisson(lambda) {
        let L = Math.exp(-lambda);
        let p = 1.0;
        let k = 0;
        do {
            k++;
            p *= Math.random();
        } while (p > L);
        return k - 1;
    }

    let g1 = poisson(lambda1);
    let g2 = poisson(lambda2);

    // Factor locura sutil (solo +1 gol inesperado en el ~4% de los casos)
    if (Math.random() > 0.96) g1 += 1;
    if (Math.random() > 0.96) g2 += 1;
    
    // Evitar goleadas absolutamente ridículas por aleatoriedad (tope en 7)
    g1 = Math.min(g1, 7);
    g2 = Math.min(g2, 7);

    return { g1, g2 };
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
                <h4 class="text-brand-green font-black uppercase tracking-widest text-sm">Grupo ${groupLetter}</h4>
            </div>
            <table class="w-full text-xs text-left">
                <thead class="bg-slate-800 text-slate-400 border-b border-slate-700">
                    <tr>
                        <th class="py-2 px-3 font-semibold">Equipo</th>
                        <th class="py-2 px-2 text-center font-semibold" title="Puntos">Pts</th>
                        <th class="py-2 px-2 text-center font-semibold" title="Partidos Jugados">PJ</th>
                        <th class="py-2 px-2 text-center font-semibold" title="Diferencia de Goles">Dif</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/50">
        `;

        teams.forEach((team, index) => {
            const teamInfo = teamLookup[team.name] || { flag: 'un', code: team.name.substring(0,3).toUpperCase() };
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
                    <td class="py-2 px-2 text-center font-bold ${team.gd > 0 ? 'text-blue-400' : (team.gd < 0 ? 'text-red-400' : 'text-slate-500')}">${team.gd > 0 ? '+'+team.gd : team.gd}</td>
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
    if (!userPicks) return 0;

    let totalPoints = 0;

    Object.keys(officialResults).forEach(group => {
        const result = officialResults[group];
        const p1 = userPicks[`group-${group}-pos-1`];
        const p2 = userPicks[`group-${group}-pos-2`];
        const p3 = userPicks[`group-${group}-pos-3`];

        // 1. Puntos por Top 3 (1 punto si el equipo está en el top 3 real)
        if (result.includes(p1)) totalPoints += 1;
        if (result.includes(p2)) totalPoints += 1;
        if (result.includes(p3)) totalPoints += 1;

        // 2. Puntos Extra por Posición Exacta (+2 puntos adicionales)
        if (p1 === result[0]) totalPoints += 2;
        if (p2 === result[1]) totalPoints += 2;
        if (p3 === result[2]) totalPoints += 2;
    });

    return totalPoints;
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
                            ${isCurrentPlayer ? '<span class="ml-2 text-[8px] bg-brand-green text-white px-1.5 py-0.5 rounded-full uppercase">Tú</span>' : ''}
                        </div>
                        <div class="text-[10px] ${entry.isPaid ? 'text-brand-green' : 'text-red-400'} uppercase font-black">
                            ${entry.isPaid ? 'Inscrito' : 'Pendiente'}
                        </div>
                    </div>
                </div>
            </td>
            <td class="py-4 px-6 text-right">
                <div class="text-xl font-black text-white">${entry.points}</div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Puntos</div>
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

window.editWhatsAppMessage = function(index) {
    const messages = JSON.parse(localStorage.getItem('whatsapp_messages') || '[]');
    const msg = messages[index];
    const newText = prompt('Editar mensaje:', msg.text);
    
    if (newText !== null) {
        messages[index].text = newText;
        localStorage.setItem('whatsapp_messages', JSON.stringify(messages));
        renderWhatsAppMessages();
    }
}

window.deleteWhatsAppMessage = function(index) {
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
                            <span class="text-[10px] text-slate-500 w-8">M${idx+1}:</span>
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
                localStorage.setItem('custom_bracket_structure', JSON.stringify(structureBracket));
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

// Inicializar al cargar el DOM
document.addEventListener('DOMContentLoaded', initWorldCupCountdown);
