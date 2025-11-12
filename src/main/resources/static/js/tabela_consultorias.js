const tabelaBody = document.querySelector('#tabela-consultorias tbody');
const msgTabela = document.getElementById('msg-tabela');

async function carregarConsultorias() {
    tabelaBody.innerHTML = '';
    msgTabela.innerText = 'Carregando consultorias...';
    msgTabela.style.color = '#555';

    try {
        const res = await fetch('/api/consultorias');
        console.log('Resposta da API:', res);

        if (!res.ok)
            throw new Error(`Erro HTTP: ${res.status}`);

        const consultorias = await res.json();
        console.log('Consultorias recebidas:', consultorias);

        if (!consultorias || consultorias.length === 0) {
            msgTabela.innerText = 'Nenhuma consultoria cadastrada.';
            msgTabela.style.color = '#c00';
            return;
        }

        msgTabela.innerText = '';

        consultorias.forEach(c => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${c.id}</td>
                <td>${c.nomePaciente}</td>
                <td>${c.emailPaciente}</td>
                <td>${c.medico}</td>
                <td>${c.data}</td>
                <td>${c.hora}</td>
                <td>${c.plano}</td>
                <td>
                    <button class="btn-excluir" data-id="${c.id}">Excluir</button>
                </td>
            `;
            tabelaBody.appendChild(row);
        });

        adicionarEventosExclusao();
    } catch (error) {
        console.error('Erro ao carregar consultorias:', error);
        msgTabela.innerText = 'Erro ao carregar consultorias.';
        msgTabela.style.color = 'red';
    }
}

function adicionarEventosExclusao() {
    const botoesExcluir = document.querySelectorAll('.btn-excluir');
    console.log('Botões encontrados:', botoesExcluir.length);

    botoesExcluir.forEach(btn => {
        btn.addEventListener('click', async () => {
            const id = btn.getAttribute('data-id');
            if (!confirm('Tem certeza que deseja excluir esta consultoria?'))
                return;

            try {
                const res = await fetch(`/api/consultorias/${id}`, {method: 'DELETE'});

                if (res.ok) {
                    msgTabela.style.color = 'green';
                    msgTabela.innerText = 'Consultoria excluída com sucesso!';
                    carregarConsultorias();
                } else {
                    const texto = await res.text();
                    msgTabela.style.color = 'red';
                    msgTabela.innerText = texto || 'Erro ao excluir consultoria.';
                }
            } catch (error) {
                console.error('Erro ao excluir consultoria:', error);
                msgTabela.style.color = 'red';
                msgTabela.innerText = 'Erro de conexão com o servidor.';
            }
        });
    });
}

const filtroMedico = document.getElementById('filtroMedico');

if (filtroMedico) {
    filtroMedico.addEventListener('input', () => {
        const termo = filtroMedico.value.toLowerCase();
        const linhas = document.querySelectorAll('table tbody tr');

        linhas.forEach(linha => {
            const medico = linha.children[3].innerText.toLowerCase();
            linha.style.display = medico.includes(termo) ? '' : 'none';
        });
    });
}

document.addEventListener('DOMContentLoaded', carregarConsultorias);


