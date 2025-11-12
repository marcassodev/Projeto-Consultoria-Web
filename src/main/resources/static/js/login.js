const formLogin = document.getElementById('form-login');
const msgLogin = document.getElementById('msg-login');

formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = formLogin.email.value.trim();
    const senha = formLogin.senha.value.trim();

    if (!email || !senha) {
        msgLogin.style.color = 'red';
        msgLogin.innerText = 'Preencha todos os campos!';
        return;
    }

    try {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, senha })
        });

        const result = await res.json();

        if (res.ok) {
            localStorage.setItem('clienteId', result.id);
            msgLogin.style.color = 'green';
            msgLogin.innerText = 'Login realizado com sucesso!';
            // Redireciona para index ou dashboard
            window.location.href = '/index.html';
        } else {
            msgLogin.style.color = 'red';
            msgLogin.innerText = result.error || 'Email ou senha inválidos';
        }
    } catch (error) {
        msgLogin.style.color = 'red';
        msgLogin.innerText = 'Erro ao fazer login. Tente novamente.';
        console.error(error);
    }
});



