function toggleMenu() {
    document.querySelector('.nav-links').classList.toggle('open');
}

function handleSubmit(e) {
    e.preventDefault();

    // Pegar os valores do formulário
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const telefone = document.getElementById('telefone').value;
    const mensagem = document.getElementById('mensagem').value;

    // Montar a mensagem para o WhatsApp
    const texto = `Olá, meu nome é ${nome}.%0AEmail: ${email}%0ATelefone: ${telefone}%0AMensagem: ${mensagem}`;

    // Número do WhatsApp (55 + DDD + número)
    const numero = "5554999465299";

    // Abrir o WhatsApp com a mensagem
    window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');

    // Limpar formulário
    e.target.reset();
}