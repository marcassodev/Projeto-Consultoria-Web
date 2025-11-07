document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-cliente");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nome = form.querySelector("input[name='nome']").value.trim();
    const email = form.querySelector("input[name='email']").value.trim();
    const telefone = form.querySelector("input[name='telefone']").value.trim();
    const cpf = form.querySelector("input[name='cpf']").value.trim();
    const nascimento = form.querySelector("input[name='nascimento']").value;

    if (!nome || !email || !telefone || !cpf || !nascimento) {
      alert("Preencha todos os campos!");
      return;
    }

    const cliente = { nome, email, telefone, cpf, nascimento };

    try {
      const response = await fetch("/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente)
      });

      if (response.ok) {
        alert("Cliente cadastrado com sucesso!");
        form.reset();
      } else {
        alert("Erro ao cadastrar cliente!");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão com o servidor.");
    }
  });
});