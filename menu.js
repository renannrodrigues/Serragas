function toggleMenu() {
    const nav = document.querySelector(".nav-links");
    const hamburger = document.querySelector(".hamburger");

    nav.classList.toggle("open");
    hamburger.classList.toggle("active");
}

document.addEventListener("DOMContentLoaded", () => {
    const hamburger = document.querySelector(".hamburger");
    if (hamburger) {
        hamburger.addEventListener("click", toggleMenu);
    }
});

function handleSubmit(e) {
    e.preventDefault();

    const nome = document.getElementById("nome").value.trim();
    const email = document.getElementById("email").value.trim();
    const telefone = document.getElementById("telefone").value.trim();
    const mensagem = document.getElementById("mensagem").value.trim();

    if (!nome || !email || !telefone || !mensagem) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    const texto =
        `Olá! Gostaria de atendimento.\n\n` +
        `🧑 Nome: ${nome}\n` +
        `📧 Email: ${email}\n` +
        `📞 Telefone: ${telefone}\n\n` +
        `💬 Mensagem:\n${mensagem}`;

    const mensagemCodificada = encodeURIComponent(texto);

    const numero = "554999465299";

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    const url = isMobile
        ? `https://wa.me/${numero}?text=${mensagemCodificada}`
        : `https://web.whatsapp.com/send?phone=${numero}&text=${mensagemCodificada}`;

    window.open(url, "_blank");

    e.target.reset();
}