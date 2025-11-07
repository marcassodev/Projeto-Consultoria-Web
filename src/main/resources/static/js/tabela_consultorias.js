document.addEventListener("DOMContentLoaded", async () => {
  const tabela = document.querySelector("#tabela-consultorias tbody");

  const resp = await fetch("http://localhost:8080/api/consultorias");
  const consultorias = await resp.json();

  tabela.innerHTML = "";
  consultorias.forEach((c, i) => {
    tabela.innerHTML += `
      <tr>
        <td>${i + 1}</td>
        <td>${c.paciente}</td>
        <td>${c.tipo}</td>
        <td>${c.sala}</td>
        <td>${c.medico}</td>
        <td>${c.data}</td>
        <td>${c.hora}</td>
      </tr>`;
  });
});


