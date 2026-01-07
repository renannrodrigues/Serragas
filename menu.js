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
            }
        });
    });
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

    // Validações
    if (!nome || nome.length < 3) {
        alert("Por favor, insira seu nome completo (mínimo 3 caracteres).");
        document.getElementById("nome").focus();
        return;
    }

    if (!isValidEmail(email)) {
        alert("Por favor, insira um e-mail válido.");
        document.getElementById("email").focus();
        return;
    }

    if (!isValidPhone(telefone)) {
        alert("Por favor, insira um telefone válido com DDD.");
        document.getElementById("telefone").focus();
        return;
    }

    if (!mensagem || mensagem.length < 10) {
        alert("Por favor, insira uma mensagem com pelo menos 10 caracteres.");
        document.getElementById("mensagem").focus();
        return;
    }

    // Mostra loading
    submitBtn.disabled = true;
    btnText.style.display = "none";
    btnLoading.style.display = "inline-flex";

    // Monta a mensagem para WhatsApp
    const texto =
        `Olá! Gostaria de atendimento.\n\n` +
        `*Nome:* ${nome}\n` +
        `*Email:* ${email}\n` +
        `*Telefone:* ${telefone}\n\n` +
        `*Mensagem:*\n${mensagem}`;

    const mensagemCodificada = encodeURIComponent(texto);
    const numero = "5554999465299";

    // Detecta se é mobile para usar a URL correta
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const url = isMobile
        ? `https://wa.me/${numero}?text=${mensagemCodificada}`
        : `https://web.whatsapp.com/send?phone=${numero}&text=${mensagemCodificada}`;

    // Pequeno delay para simular processamento
    setTimeout(() => {
        window.open(url, "_blank");
        
        // Reseta o formulário
        e.target.reset();
        
        // Restaura o botão
        submitBtn.disabled = false;
        btnText.style.display = "inline";
        btnLoading.style.display = "none";
        
        // Mensagem de sucesso
        alert("Mensagem preparada! Você será redirecionado para o WhatsApp.");
    }, 500);
}

// Inicialização quando o DOM estiver pronto
document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM carregado - inicializando menu...");

    // Inicializa o menu hamburger
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        console.log("Hamburger encontrado!");
        // Remove event listener anterior se existir
        hamburger.onclick = null;
        // Adiciona novo event listener
        hamburger.addEventListener("click", toggleMenu);
    } else {
        console.log("Hamburger NÃO encontrado!");
    }

    // Fecha menu ao clicar nos links
    closeMenuOnLinkClick();

    // Adiciona máscara de telefone
    const telefoneInput = document.getElementById("telefone");
    if (telefoneInput) {
        telefoneInput.addEventListener("input", function() {
            maskPhone(this);
        });
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
            }
        }
    });

    // Melhora o scroll suave para navegadores antigos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", function(e) {
            const href = this.getAttribute("href");
            
            // Ignora # vazio
            if (href === "#") return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    });
});