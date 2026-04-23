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

    // Mostrar paneles correspondientes
    if (isAdmin) {
        if (adminPanel) adminPanel.classList.remove('hidden');
    } else {
        if (adminPanel) adminPanel.classList.add('hidden');
    }

    // Siempre mostramos el panel de usuario para que todos vean su estado/pago
    const userPanel = document.getElementById('user-panel');
    if (userPanel) {
        userPanel.classList.remove('hidden');
        const welcomeName = document.getElementById('user-welcome-name');
        if (welcomeName) welcomeName.innerText = username;
        updatePaymentStatusUI(isPaid);
    }

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

    if (username) {
        if (authBtn) authBtn.classList.add('hidden');
        if (registerBtn) registerBtn.classList.add('hidden');
        if (userProfile) userProfile.classList.remove('hidden');
        if (navUsername) navUsername.innerText = username;
    } else {
        if (authBtn) authBtn.classList.remove('hidden');
        if (registerBtn) registerBtn.classList.remove('hidden');
        if (userProfile) userProfile.classList.add('hidden');
    }
}

// Al cargar la página, verificar sesión
document.addEventListener('DOMContentLoaded', () => {
    const loggedUser = localStorage.getItem('logged_user');
    if (loggedUser) {
        const isAdmin = localStorage.getItem('is_admin') === 'true';
        const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
        const userObj = users.find(u => u.username === loggedUser);
        processLoginSuccess(loggedUser, isAdmin, userObj ? userObj.paid : false);
    }
});

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
    });
});

// --- Lógica del Partido del Día ---

// 1. Cargar Partido del Día al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadActiveMOTD();
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

// Modificar el login para mostrar el MOTD al entrar
// Buscamos la parte del login donde se muestra el userPanel

// Descargar SQL Usuarios
if (downloadSqlBtn) {
    downloadSqlBtn.addEventListener('click', () => {
        const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
        
        let sql = `-- Usuarios de la Porra Mundial 2026\n`;
        sql += `-- Generado el: ${new Date().toLocaleString()}\n\n`;
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

// Descargar SQL Pronósticos
const downloadPredictionsBtn = document.getElementById('download-predictions-btn');
if (downloadPredictionsBtn) {
    downloadPredictionsBtn.addEventListener('click', () => {
        const predictions = JSON.parse(localStorage.getItem('user_predictions') || '{}');
        
        let sql = `-- Pronósticos Diarios de la Porra Mundial 2026\n`;
        sql += `-- Generado el: ${new Date().toLocaleString()}\n\n`;
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

const matchSchedule = {
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

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderMatches(1);
    updateInscriptionCounter();
});

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

// Inicializar al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    renderMatches(1);
    updateInscriptionCounter();
});

// Función para actualizar el contador de participantes (basado en pagos reales)
function updateInscriptionCounter() {
    const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
    const localPaidCount = users.filter(u => u.paid).length;
    
    // La base empieza en 0 como solicitó el usuario
    const totalPaid = localPaidCount;
    const maxSlots = 25;
    
    const countEl = document.getElementById('inscription-count');
    const leftEl = document.getElementById('inscription-left');
    
    if (countEl) {
        countEl.innerText = `${totalPaid}/${maxSlots}`;
    }
    
    if (leftEl) {
        const left = maxSlots - totalPaid;
        if (left > 0) {
            leftEl.innerText = `¡Quedan ${left} plazas!`;
            leftEl.className = "text-sm font-medium text-blue-400";
        } else {
            leftEl.innerText = "Plazas cerradas";
            leftEl.className = "text-sm font-medium text-red-400 animate-pulse";
        }
    }
}
