document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-consultoria");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const consultoria = {
      paciente: form.paciente.value,
      tipo: form.tipo.value,
      sala: form.sala.value,
      medico: form.medico.value,
      data: form.data.value,
      hora: form.hora.value
    };

    const resp = await fetch("http://localhost:8080/api/consultorias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(consultoria)
    });

    if (resp.ok) {
      alert("Consultoria cadastrada com sucesso!");
      form.reset();
    } else {
      alert("Erro ao salvar consultoria.");
    }
  });
});




