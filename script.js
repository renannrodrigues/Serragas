/* HELPERS */
const $ = (id) => document.getElementById(id);
const $$ = (q) => document.querySelectorAll(q);

/* NAVBAR SCROLL */
const navbar = $('navbar');
if (navbar) {
    window.addEventListener('scroll', () => {
        navbar.classList.toggle('scrolled', window.scrollY > 50);
    });
}

/* MOBILE MENU */
const mobileMenuBtn = $('mobileMenuBtn');
const mobileMenu = $('mobileMenu');

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('active');
    });

    const overlay = mobileMenu.querySelector('.mobile-menu-overlay');
    if (overlay) {
        overlay.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    }

    mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
        });
    });
}

/* SMOOTH SCROLL */
$$('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

/* HERO PARTICLES */
function createParticles() {
    const container = $('particles');
    if (!container) return;

    for (let i = 0; i < 30; i++) {
        const p = document.createElement('div');
        p.className = 'particle';
        
        p.style.left = Math.random() * 100 + '%';
        p.style.top = Math.random() * 100 + '%';
        
        const size = Math.random() * 4 + 2;
        p.style.width = size + 'px';
        p.style.height = size + 'px';
        
        p.style.opacity = Math.random() * 0.5 + 0.1;
        
        container.appendChild(p);
        animateParticle(p);
    }
}

function animateParticle(p) {
    const speed = Math.random() * 0.5 + 0.2;
    const drift = (Math.random() - 0.5) * 0.3;
    
    function move() {
        let top = parseFloat(p.style.top);
        let left = parseFloat(p.style.left);
        
        top -= speed;
        left += drift;
        
        if (top < -10) {
            top = 110;
            left = Math.random() * 100;
        }
        if (left < -5) left = 105;
        if (left > 105) left = -5;
        
        p.style.top = top + '%';
        p.style.left = left + '%';
        
        requestAnimationFrame(move);
    }
    move();
}

createParticles();

/* SCROLL INDICATOR */
const scrollIndicator = document.querySelector('.scroll-indicator');
const produtos = $('produtos');

if (scrollIndicator && produtos) {
    scrollIndicator.addEventListener('click', () => {
        produtos.scrollIntoView({ behavior: 'smooth' });
    });
}

/* FADE-IN ON SCROLL */
const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.15 });

$$('.produto-card, .diferencial-card, .cylinder').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = '0.6s ease';
    fadeObserver.observe(el);
});

/* CATÁLOGO MODAL */
const catalogModal = {
    el: null,

    create() {
        this.el = document.createElement('div');
        this.el.className = 'catalog-modal';
        this.el.innerHTML = `
            <div class="modal-overlay"></div>
            <div class="modal-content">
                <button class="modal-close">✕</button>
                <h3>Catálogo Serra Gás</h3>
                <p>Baixe nosso catálogo completo</p>
                <button class="btn-modal-primary">Baixar PDF</button>
            </div>
        `;
        document.body.appendChild(this.el);

        this.el.querySelector('.modal-overlay').onclick = () => this.close();
        this.el.querySelector('.modal-close').onclick = () => this.close();
        this.el.querySelector('.btn-modal-primary').onclick = () => {
            window.open('./catalogoserragas1.pdf', '_blank');
            this.close();
        };
    },

    open() {
        if (!this.el) this.create();
        this.el.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        this.el.classList.remove('active');
        document.body.style.overflow = '';
    }
};

/* FORMULÁRIO DE CONTATO - WHATSAPP */
const contatoForm = $('contatoForm');
if (contatoForm) {
    contatoForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const nome = $('nome').value;
        const email = $('email').value;
        const telefone = $('telefone').value;
        const mensagem = $('mensagem').value;

        const numeroWhatsApp = '5554999465299';

        const texto = `Olá! Gostaria de solicitar um orçamento.

*Nome:* ${nome}
*Email:* ${email}
*Telefone:* ${telefone}
*Mensagem:* ${mensagem}`;

        const url = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(texto)}`;

        window.open(url, '_blank');
        
        // Limpar formulário após envio
        contatoForm.reset();
    });
}

['btnCatalog', 'btnCatalogDownload'].forEach(id => {
    const btn = $(id);
    if (btn) btn.addEventListener('click', () => catalogModal.open());
});

const mobileCatalogBtn = document.querySelector('.btn-catalog-mobile');
if (mobileCatalogBtn) {
    mobileCatalogBtn.addEventListener('click', () => {
        catalogModal.open();
        mobileMenu?.classList.remove('active');
    });
}

/* WHATSAPP FLOAT BUTTON */
window.addEventListener('load', () => {
    const wa = document.createElement('a');
    wa.href = 'https://wa.me/5554999465299';
    wa.target = '_blank';
    wa.className = 'whatsapp-button show';
    wa.innerHTML = 'WhatsApp';
    document.body.appendChild(wa);
});

/* STATS COUNTER */
function animateCounter(el, target) {
    let current = 0;
    const step = target / 80;

    function update() {
        current += step;
        if (current >= target) {
            el.textContent = target;
        } else {
            el.textContent = Math.floor(current);
            requestAnimationFrame(update);
        }
    }
    update();
}

$$('.stat-item').forEach(stat => {
    const number = stat.querySelector('.stat-number');
    if (!number) return;

    const value = parseInt(number.textContent.replace(/\D/g, ''));
    number.textContent = '0';

    new IntersectionObserver(e => {
        if (e[0].isIntersecting) animateCounter(number, value);
    }, { threshold: 0.6 }).observe(stat);
});

console.log('✅ Serra Gás JS carregado corretamente');