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

// Alternar entre Registro y Login
if (showLoginBtn) {
    showLoginBtn.addEventListener('click', () => {
        loginForm.classList.toggle('hidden');
        showLoginBtn.innerText = loginForm.classList.contains('hidden') 
            ? '¿Ya tienes cuenta? Inicia sesión aquí' 
            : 'Volver al registro';
    });
}

// Registro de Usuario
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('reg-username').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const messageEl = document.getElementById('reg-message');
        
        try {
            // Obtener usuarios existentes
            let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
            
            // Guardar nuevo usuario
            const newUser = {
                username,
                email,
                password,
                fecha: new Date().toISOString().slice(0, 19).replace('T', ' ')
            };
            
            users.push(newUser);
            localStorage.setItem('porra_users', JSON.stringify(users));
            
            // Feedback
            messageEl.classList.remove('hidden', 'bg-red-500/20', 'text-red-400');
            messageEl.classList.add('bg-green-500/20', 'text-green-400');
            messageEl.innerText = '¡Registro exitoso en el navegador! Datos guardados localmente.';
            registerForm.reset();
            
        } catch (error) {
            messageEl.classList.remove('hidden');
            messageEl.classList.add('bg-red-500/20', 'text-red-400');
            messageEl.innerText = 'Error al guardar los datos.';
        }
    });
}

// Login de Usuario / Administrador
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const user = document.getElementById('login-username').value;
        const pass = document.getElementById('login-password').value;
        const messageEl = document.getElementById('login-message');
        const userPanel = document.getElementById('user-panel');
        
        const admins = {
            'Nacho': '2005',
            'Irene': '2007',
            'Leandro': '2006'
        };
        
        // 1. Verificar si es Admin
        if (admins[user] && admins[user] === pass) {
            messageEl.classList.add('hidden');
            adminPanel.classList.remove('hidden');
            userPanel.classList.add('hidden');
            loginForm.classList.add('hidden');
            registerForm.closest('div').classList.add('hidden');
            window.scrollTo({ top: adminPanel.offsetTop - 100, behavior: 'smooth' });
            return;
        } 
        
        // 2. Verificar si es un usuario registrado
        const users = JSON.parse(localStorage.getItem('porra_users') || '[]');
        const foundUser = users.find(u => u.username === user && u.password === pass);
        
        if (foundUser) {
            messageEl.classList.add('hidden');
            userPanel.classList.remove('hidden');
            adminPanel.classList.add('hidden');
            loginForm.classList.add('hidden');
            registerForm.closest('div').classList.add('hidden');
            
            // Guardar usuario en sesión
            localStorage.setItem('logged_user', foundUser.username);
            
            // Personalizar mensaje de bienvenida y estado de pago
            document.getElementById('user-welcome-name').innerText = foundUser.username;
            updatePaymentStatusUI(foundUser.paid);
            
            window.scrollTo({ top: userPanel.offsetTop - 100, behavior: 'smooth' });
        } else {
            messageEl.classList.remove('hidden');
            messageEl.classList.add('bg-red-500/20', 'text-red-400');
            messageEl.innerText = 'Usuario o contraseña incorrectos.';
        }
    });
}

// Función para actualizar la UI del estado de pago
function updatePaymentStatusUI(isPaid) {
    const statusUnpaid = document.getElementById('status-unpaid');
    const statusPaid = document.getElementById('status-paid');
    const ctaContainer = document.getElementById('user-cta-container');
    
    if (isPaid) {
        statusUnpaid.classList.add('hidden');
        statusPaid.classList.remove('hidden');
        if (ctaContainer) ctaContainer.classList.remove('hidden');
    } else {
        statusUnpaid.classList.remove('hidden');
        statusPaid.classList.add('hidden');
        if (ctaContainer) ctaContainer.classList.add('hidden');
    }
}

// Lógica de Pago
const payNowBtn = document.getElementById('pay-now-btn');
if (payNowBtn) {
    payNowBtn.addEventListener('click', () => {
        const username = document.getElementById('user-welcome-name').innerText;
        
        // Simulación de proceso de pago
        payNowBtn.innerText = 'Procesando Bizum...';
        payNowBtn.disabled = true;
        payNowBtn.classList.add('opacity-50');
        
        setTimeout(() => {
            let users = JSON.parse(localStorage.getItem('porra_users') || '[]');
            const userIndex = users.findIndex(u => u.username === username);
            
            if (userIndex !== -1) {
                users[userIndex].paid = true;
                localStorage.setItem('porra_users', JSON.stringify(users));
                
                updatePaymentStatusUI(true);
                alert('¡Pago realizado con éxito! Ya estás oficialmente inscrito.');
            }
            
            payNowBtn.innerText = 'Realizar Pago (Simulación Bizum)';
            payNowBtn.disabled = false;
            payNowBtn.classList.remove('opacity-50');
        }, 1500);
    });
}

// Cerrar Sesión
const logoutButtons = document.querySelectorAll('#logout-btn, #user-logout-btn');
logoutButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        localStorage.removeItem('logged_user');
        adminPanel.classList.add('hidden');
        document.getElementById('user-panel').classList.add('hidden');
        registerForm.closest('div').classList.remove('hidden');
        loginForm.reset();
    });
});

// Descargar SQL
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
        
        const blob = new Blob([sql], { type: 'text/sql' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'usuarios.sql';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
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
});
