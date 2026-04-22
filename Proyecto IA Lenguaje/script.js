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
