# API REST — +Vida

[Voltar ao README](../README.md)

Referência baseada nos controllers, serviços e entidades atuais. Exemplos ilustrativos com dados fictícios; não são registros de chamadas executadas.

## Convenções

- Base local: `http://localhost:8080`.
- Corpos JSON: `Content-Type: application/json`.
- Datas de consultoria: `AAAA-MM-DD`; horários: `HH:mm` ou `HH:mm:ss`, sem fuso.
- Planos: `SEMANAL`, `MENSAL`, `ANUAL`, respeitando maiúsculas.
- Cadastros retornam **200**, não 201; exclusão retorna **200**, não 204.
- Não há token, sessão autenticada, paginação ou filtros no servidor.
- Omita `id` na criação: ele é gerado pelo banco. O backend recebe entidades diretamente, sem DTO para restringir os campos do modelo.

## POST `/api/clientes`

Cadastra um cliente:

```json
{
  "nome": "Cliente de Exemplo",
  "email": "cliente@example.com",
  "senha": "senha-ficticia-local",
  "telefone": "11999999999",
  "cpf": "000.000.000-00",
  "nascimento": "1990-01-15"
}
```

| Campo | Tipo | Restrição no modelo/banco | Validação explícita no serviço |
| --- | --- | --- | --- |
| `nome` | string | Não nulo, até 100 caracteres | Comprimento e nome duplicado |
| `email` | string | Não nulo, único, até 100 caracteres | E-mail duplicado |
| `senha` | string | Não nulo, até 255 caracteres | Nenhuma |
| `telefone` | string | Opcional, até 14 caracteres | Comprimento quando não nulo |
| `cpf` | string | Não nulo, único, até 14 caracteres | Comprimento e CPF duplicado |
| `nascimento` | string | Opcional, até 10 caracteres | Nenhuma; não é `LocalDate` |

O formulário exige nome, e-mail, senha e CPF preenchidos. A API não faz essa verificação completa: nome ou CPF nulos podem gerar exceções não tratadas pelo controller. O serviço não valida dígitos do CPF, formato do e-mail ou força da senha.

**200 — sucesso:**

```json
{"message": "Cadastro realizado com sucesso!"}
```

**400 — regra de negócio:** objeto `{"error": "mensagem"}` com uma destas mensagens:

- `Nome não pode ter mais de 100 caracteres!`
- `CPF não pode ter mais de 14 caracteres!`
- `Telefone não pode ter mais de 14 caracteres!`
- `Email já cadastrado!`
- `CPF já cadastrado!`
- `Nome já cadastrado!`

O cadastro não retorna ID. Ele aparece na resposta do login.

## POST `/api/login`

Confere e-mail e senha do cliente:

```json
{"email": "cliente@example.com", "senha": "senha-ficticia-local"}
```

**200 — sucesso, com ID ilustrativo:**

```json
{
  "id": 1,
  "nome": "Cliente de Exemplo",
  "email": "cliente@example.com",
  "cpf": "000.000.000-00",
  "telefone": "11999999999",
  "nascimento": "1990-01-15",
  "message": "Login realizado com sucesso!"
}
```

**401 — credenciais inválidas:**

```json
{"error": "Email ou senha incorretos"}
```

Não gera token ou sessão. O navegador guarda apenas `clienteId` no `localStorage` e redireciona para `/index.html`.

## POST `/api/consultorias`

Cria uma consultoria vinculada a um cliente existente, localizado por `cliente.email`:

```json
{
  "nomePaciente": "Cliente de Exemplo",
  "emailPaciente": "cliente@example.com",
  "medico": "Ana Costa",
  "data": "2027-01-20",
  "hora": "14:00:00",
  "plano": "MENSAL",
  "numeroCartao": "CARTAO-FICTICIO",
  "cvv": "000",
  "empresaCartao": "Exemplo",
  "cliente": {"email": "cliente@example.com"}
}
```

| Campo | Tipo | Comportamento |
| --- | --- | --- |
| `nomePaciente`, `emailPaciente` | string | Dados informados para o atendimento |
| `medico` | string | Nome do profissional, sem entidade própria |
| `data` | data ISO | `LocalDate` |
| `hora` | horário ISO | `LocalTime` |
| `plano` | enum string | `SEMANAL`, `MENSAL` ou `ANUAL` |
| `numeroCartao`, `cvv`, `empresaCartao` | string | Armazenados sem processamento de pagamento |
| `cliente` | objeto | Deve conter `email` cadastrado; somente `id` não atende ao serviço |

Os demais campos são exigidos pelo formulário, mas não possuem validação explícita de obrigatoriedade no serviço. O backend não exige igualdade entre `cliente.email` e `emailPaciente`; a interface preenche ambos com o mesmo valor.

**200 — sucesso:** retorna a entidade completa persistida:

```json
{
  "id": 1,
  "nomePaciente": "Cliente de Exemplo",
  "emailPaciente": "cliente@example.com",
  "medico": "Ana Costa",
  "data": "2027-01-20",
  "hora": "14:00:00",
  "plano": "MENSAL",
  "numeroCartao": "CARTAO-FICTICIO",
  "cvv": "000",
  "empresaCartao": "Exemplo",
  "cliente": {
    "id": 1,
    "nome": "Cliente de Exemplo",
    "email": "cliente@example.com",
    "senha": "senha-ficticia-local",
    "telefone": "11999999999",
    "cpf": "000.000.000-00",
    "nascimento": "1990-01-15"
  }
}
```

A senha e os dados de cartão aparecem porque não há DTO ou mascaramento na serialização atual.

**400 — regra de negócio:** objeto `{"error": "mensagem"}`:

- `Cliente não informado!`: cliente ausente/nulo ou e-mail nulo.
- `Cliente não encontrado!`: e-mail sem cadastro correspondente.
- `Já existe uma consultoria com esse médico nesse horário!`: mesmo profissional, data e hora já cadastrados.

O conflito usa igualdade desses três campos. Não considera duração, intervalos ou datas passadas. A consulta antes de salvar também não garante exclusividade entre requisições concorrentes.

## GET `/api/consultorias`

Sem corpo de requisição. **200** retorna um array de objetos completos no mesmo formato do POST, incluindo dados de cartão e o cliente com senha. Sem registros:

```json
[]
```

Não há ordenação explícita, paginação, filtro ou separação por cliente. O filtro da interface ocorre no navegador após carregar todos os registros.

## DELETE `/api/consultorias/{id}`

Exclui permanentemente um registro. `id` é um inteiro compatível com `Long`. Não recebe corpo.

**200 — texto simples:**

```text
Consultoria excluída com sucesso!
```

**400 — ID inexistente, texto simples:**

```text
Consultoria não encontrada!
```

Não retorna JSON. Registro inexistente usa 400, não 404.

## Chamadas no PowerShell

Com o servidor ativo, cadastre um cliente fictício:

```powershell
$baseUrl = 'http://localhost:8080'
$cliente = @{
    nome = 'Cliente de Exemplo'
    email = 'cliente@example.com'
    senha = 'senha-ficticia-local'
    telefone = '11999999999'
    cpf = '000.000.000-00'
    nascimento = '1990-01-15'
} | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/api/clientes" -Method Post -ContentType 'application/json; charset=utf-8' -Body ([System.Text.Encoding]::UTF8.GetBytes($cliente))

$credenciais = @{ email = 'cliente@example.com'; senha = 'senha-ficticia-local' } | ConvertTo-Json
Invoke-RestMethod -Uri "$baseUrl/api/login" -Method Post -ContentType 'application/json' -Body $credenciais
Invoke-RestMethod -Uri "$baseUrl/api/consultorias" -Method Get
```

Para criar uma consultoria, envie o JSON do agendamento acima. Para excluir um registro de teste, substitua `1` pelo ID retornado na criação:

```powershell
Invoke-RestMethod -Uri "$baseUrl/api/consultorias/1" -Method Delete
```

## Outros erros e limites

JSON inválido, enum desconhecido, data/horário malformados ou ID incompatível podem gerar 400 pelo Spring, com corpo diferente dos erros de negócio. Exceções de banco e campos nulos não tratados podem gerar 500. Não há tratamento global que uniformize as respostas; `server.error.include-message=Always` está configurado.

Não existem rotas de atualização, busca por ID, logout, recuperação de senha, cadastro de profissionais ou cobrança. Swagger/OpenAPI não está configurado.
