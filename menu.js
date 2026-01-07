// Função para alternar o menu mobile
function toggleMenu() {
    const nav = document.querySelector(".nav-links");
    const hamburger = document.querySelector(".hamburger");

    if (nav && hamburger) {
        nav.classList.toggle("open");
        hamburger.classList.toggle("active");
        
        // Atualiza o atributo aria-expanded para acessibilidade
        const isOpen = nav.classList.contains("open");
        hamburger.setAttribute("aria-expanded", isOpen);
        
        // Previne scroll quando menu está aberto no mobile
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }
}

// Função para fechar o menu ao clicar em um link
function closeMenuOnLinkClick() {
    const nav = document.querySelector(".nav-links");
    const hamburger = document.querySelector(".hamburger");
    const links = document.querySelectorAll(".nav-link");

    links.forEach(link => {
        link.addEventListener("click", () => {
            if (nav && hamburger && nav.classList.contains("open")) {
                nav.classList.remove("open");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
            }
        });
    });
}

// Debounce para otimizar performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
}

// Máscara para telefone
function maskPhone(input) {
    let value = input.value.replace(/\D/g, "");
    
    if (value.length <= 10) {
        // Formato (00) 0000-0000
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, "($1) $2-$3");
    } else {
        // Formato (00) 00000-0000
        value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, "($1) $2-$3");
    }
    
    input.value = value;
}

// Validação de email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validação de telefone
function isValidPhone(phone) {
    const phoneDigits = phone.replace(/\D/g, "");
    return phoneDigits.length >= 10 && phoneDigits.length <= 11;
}

// Sanitização de input para prevenir XSS
function sanitizeInput(str) {
    if (!str) return '';
    
    // Remove caracteres perigosos
    return str
        .trim()
        .replace(/[<>'"]/g, '')
        .substring(0, 500); // Limita tamanho
}

// Mostra mensagem de erro temporária
function showError(message) {
    const existingError = document.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = `
        position: fixed;
        top: 100px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff4444;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideDown 0.3s ease;
    `;
    errorDiv.textContent = message;
    document.body.appendChild(errorDiv);
    
    setTimeout(() => {
        errorDiv.style.animation = 'slideUp 0.3s ease';
        setTimeout(() => errorDiv.remove(), 300);
    }, 3000);
}

// Adiciona animações CSS dinamicamente
if (!document.querySelector('#dynamic-animations')) {
    const style = document.createElement('style');
    style.id = 'dynamic-animations';
    style.textContent = `
        @keyframes slideDown {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes slideUp {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    document.head.appendChild(style);
}

// Função para enviar formulário via WhatsApp
function handleSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();
    const submitBtn = document.getElementById("submit-btn");
    const btnText = submitBtn.querySelector(".btn-text");
    const btnLoading = submitBtn.querySelector(".btn-loading");

    // Validações com feedback visual melhorado
    if (!nome || nome.length < 3) {
        showError("Por favor, insira seu nome completo (mínimo 3 caracteres).");
        document.getElementById("nome").focus();
        return;
    }

    if (!isValidEmail(email)) {
        showError("Por favor, insira um e-mail válido.");
        document.getElementById("email").focus();
        return;
    }

    if (!isValidPhone(telefone)) {
        showError("Por favor, insira um telefone válido com DDD.");
        document.getElementById("telefone").focus();
        return;
    }

    if (!mensagem || mensagem.length < 10) {
        showError("Por favor, insira uma mensagem com pelo menos 10 caracteres.");
        document.getElementById("mensagem").focus();
        return;
    }

    // Mostra loading
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";

    // Sanitiza inputs antes de enviar
    const nomeSanitized = sanitizeInput(nome);
    const emailSanitized = sanitizeInput(email);
    const telefoneSanitized = sanitizeInput(telefone);
    const mensagemSanitized = sanitizeInput(mensagem);

    // Monta a mensagem para WhatsApp
    const texto =
        `Olá! Gostaria de atendimento.\n\n` +
        `*Nome:* ${nomeSanitized}\n` +
        `*Email:* ${emailSanitized}\n` +
        `*Telefone:* ${telefoneSanitized}\n\n` +
        `*Mensagem:*\n${mensagemSanitized}`;

    const mensagemCodificada = encodeURIComponent(texto);
    const numero = "5554999465299";

    // Detecta se é mobile para usar a URL correta
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = isMobile
        ? `https://wa.me/${numero}?text=${mensagemCodificada}`
        : `https://web.whatsapp.com/send?phone=${numero}&text=${mensagemCodificada}`;

    // Pequeno delay para simular processamento
    setTimeout(() => {
        window.open(url, "_blank", "noopener,noreferrer");
        
        // Reseta o formulário
        e.target.reset();
        
        // Restaura o botão
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
        
        // Mensagem de sucesso
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.style.cssText = `
            position: fixed;
            top: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: #1a771e;
            color: white;
            padding: 1rem 2rem;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 9999;
            animation: slideDown 0.3s ease;
        `;
        successDiv.textContent = '✓ Mensagem enviada! Você será redirecionado para o WhatsApp.';
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.style.animation = 'slideUp 0.3s ease';
            setTimeout(() => successDiv.remove(), 300);
        }, 3000);
    }, 500);
}

// Lazy loading para imagens
function setupLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado - inicializando Serra Gás...");

    // Inicializa o menu hamburger
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        console.log("Menu hamburger inicializado ✓");
        hamburger.onclick = null;
        hamburger.addEventListener("click", toggleMenu);
    }

    // Fecha menu ao clicar nos links
    closeMenuOnLinkClick();

    // Adiciona máscara de telefone com debounce
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) {
        const debouncedMask = debounce(() => maskPhone(telefoneInput), 100);
        telefoneInput.addEventListener("input", debouncedMask);
    }

    // Fecha o menu ao clicar fora dele
    document.addEventListener("click", (e) => {
        const nav = document.querySelector(".nav-links");
        const hamburger = document.querySelector(".hamburger");
        
        if (nav && hamburger && nav.classList.contains("open")) {
            if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
                nav.classList.remove("open");
                hamburger.classList.remove("active");
                hamburger.setAttribute("aria-expanded", "false");
                document.body.style.overflow = '';
            }
        }
    });

    // Melhora o scroll suave
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            
            if (href === "#") return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: "smooth"
                });
            }
        });
    });

    // Setup lazy loading
    setupLazyLoading();

    console.log("Serra Gás inicializado com sucesso! ✓");
});