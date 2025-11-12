const formConsultoria = document.getElementById('form-consultoria');
const msgConsultoria = document.getElementById('msg-consultoria');

formConsultoria.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
        nomePaciente: formConsultoria.nomePaciente.value.trim(),
        emailPaciente: formConsultoria.emailPaciente.value.trim(),
        medico: formConsultoria.medico.value,
        data: formConsultoria.data.value,
        hora: formConsultoria.hora.value,
        plano: formConsultoria.plano.value.toUpperCase(),
        numeroCartao: formConsultoria.numeroCartao.value.trim(),
        cvv: formConsultoria.cvv.value.trim(),
        empresaCartao: formConsultoria.empresaCartao.value.trim(),
        cliente: {
            email: formConsultoria.emailPaciente.value.trim()
        }
    };

    try {
        const res = await fetch('/api/consultorias', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await res.json();

        if (res.ok) {
            msgConsultoria.style.color = 'green';
            msgConsultoria.innerText = 'Consultoria criada com sucesso!';
            formConsultoria.reset();
        } else {
            msgConsultoria.style.color = 'red';
            msgConsultoria.innerText = result.error || 'Erro ao criar consultoria.';
        }
    } catch (error) {
        msgConsultoria.style.color = 'red';
        msgConsultoria.innerText = 'Erro de conexão com o servidor.';
        console.error(error);
    }
});







