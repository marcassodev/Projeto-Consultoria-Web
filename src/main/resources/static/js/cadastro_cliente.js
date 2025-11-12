const formCadastro = document.getElementById('form-cadastro');
const msgCadastro = document.getElementById('msg-cadastro');

formCadastro.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nome: formCadastro.nome.value.trim(),
        email: formCadastro.email.value.trim(),
        senha: formCadastro.senha.value.trim(),
        telefone: formCadastro.telefone.value.trim(),
        cpf: formCadastro.cpf.value.trim(),
        nascimento: formCadastro.nascimento.value
    };

    if (data.nome.length > 100) {
        msgCadastro.style.color = 'red';
        msgCadastro.innerText = 'Nome não pode ter mais de 100 caracteres!';
        return;
    }
    if (data.cpf.length > 14) {
        msgCadastro.style.color = 'red';
        msgCadastro.innerText = 'CPF não pode ter mais de 14 caracteres!';
        return;
    }
    if (data.telefone && data.telefone.length > 14) {
        msgCadastro.style.color = 'red';
        msgCadastro.innerText = 'Telefone não pode ter mais de 14 caracteres!';
        return;
    }
    if (!data.nome || !data.email || !data.senha || !data.cpf) {
        msgCadastro.style.color = 'red';
        msgCadastro.innerText = 'Preencha todos os campos obrigatórios!';
        return;
    }

    try {
        const res = await fetch('/api/clientes', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        });

        const result = await res.json();
        if (res.ok) {
            msgCadastro.style.color = 'green';
            msgCadastro.innerText = result.message;
        } else {
            msgCadastro.style.color = 'red';
            msgCadastro.innerText = result.error;
        }

    } catch (error) {
        msgCadastro.style.color = 'red';
        msgCadastro.innerText = 'Erro ao cadastrar. Tente novamente.';
        console.error(error);
    }
});
