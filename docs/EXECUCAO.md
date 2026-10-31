# Execução, uso e manutenção

[Voltar ao README](../README.md) · [API](API.md) · [Arquitetura](ARQUITETURA.md)

## Ambiente e configuração

Use JDK 21 no `PATH`, `JAVA_HOME` configurado e MySQL acessível. Verifique na raiz do projeto:

```powershell
java -version
.\mvnw.cmd -version
```

O wrapper baixa Maven 3.9.11. Linux/macOS usam `./mvnw` no lugar de `.\mvnw.cmd`.

Crie o banco no MySQL. O usuário da aplicação precisa de permissão para criar/alterar tabelas e manipular os dados desse banco:

```sql
CREATE DATABASE IF NOT EXISTS consultoria CHARACTER SET utf8mb4;
```

Os padrões estão em `src/main/resources/application.properties`:

| Propriedade | Padrão | Variável de ambiente |
| --- | --- | --- |
| `spring.datasource.url` | `jdbc:mysql://localhost:3306/consultoria` | `SPRING_DATASOURCE_URL` |
| `spring.datasource.username` | `root` | `SPRING_DATASOURCE_USERNAME` |
| `spring.datasource.password` | Vazia | `SPRING_DATASOURCE_PASSWORD` |
| `server.port` | `8080` | `SERVER_PORT` |
| `spring.jpa.hibernate.ddl-auto` | `update` | `SPRING_JPA_HIBERNATE_DDL_AUTO` |
| `spring.jpa.show-sql` | `true` | `SPRING_JPA_SHOW_SQL` |

Exemplo em PowerShell, válido para o terminal atual e seus processos filhos:

```powershell
$env:SPRING_DATASOURCE_USERNAME = 'seu_usuario'
$env:SPRING_DATASOURCE_PASSWORD = 'sua_senha_local'
$env:SERVER_PORT = '8080'
.\mvnw.cmd spring-boot:run
```

Não há carregamento automático de `.env` implementado. Apesar de `spring.h2.console.enabled=true`, não existe dependência H2: a persistência configurada usa MySQL.

## Páginas

| Caminho em `http://localhost:8080` | Finalidade |
| --- | --- |
| `/` ou `/index.html` | Página inicial |
| `/cadastro-clientes.html` | Cadastro de cliente |
| `/login.html` | Conferência de credenciais |
| `/cadastro-consultorias.html` | Agendamento |
| `/tabela-consultorias.html` | Listagem, filtro e exclusão |
| `/perguntas-frequentes.html` | Profissionais e dúvidas |

Abra as páginas pelo servidor. Abrir HTML diretamente pelo sistema de arquivos não fornece os endpoints `/api` utilizados pelos scripts.

## Roteiro de verificação manual

Use somente dados fictícios. Este roteiro orienta verificações futuras; não registra testes executados.

1. Cadastre um cliente com nome, e-mail e CPF ainda não utilizados.
2. Faça login e confira o redirecionamento para a página inicial.
3. Agende uma consultoria com o mesmo e-mail, profissional, data, horário, plano e valores fictícios nos campos de cartão.
4. Confira o registro na tabela e teste o filtro por profissional.
5. Tente repetir profissional, data e horário: a API deve responder com a mensagem de conflito.
6. Exclua a consultoria de teste e confira a atualização da tabela.

Para verificar erros de credenciais e cliente inexistente, consulte os contratos na [API](API.md).

## Build e testes

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
java -jar target/consultoria-0.0.1-SNAPSHOT.jar
```

`clean package` também executa os testes. `ConsultoriaApplicationTests.contextLoads` usa `@SpringBootTest` e carrega o contexto completo, dependendo da configuração e disponibilidade do MySQL. Não há perfil de teste isolado ou banco em memória configurado.

Não há testes específicos de controllers, regras de negócio ou interface. O teste de contexto não verifica todos os contratos da API.

### Nome do arquivo Java

`model/consultoria.java` declara `public class Consultoria`. O compilador exige o nome `Consultoria.java`. Em Windows, um renomeio que altera apenas maiúsculas pode exigir uma etapa intermediária para ser registrado pelo Git. Este trabalho de documentação não aplica esse ajuste ao código.

## Diagnóstico

| Sintoma | Verificar |
| --- | --- |
| `java` não reconhecido ou `JAVA_HOME` inválido | Instalação do JDK 21, `PATH` e `JAVA_HOME` |
| Erro mencionando `Consultoria.java` | Nome do arquivo descrito acima |
| `Unknown database 'consultoria'` | Criação prévia do banco |
| `Access denied` | Usuário, senha e permissões MySQL |
| Falha de conexão | Serviço MySQL, host, porta e URL JDBC |
| Porta 8080 ocupada | Processo usando a porta ou variável `SERVER_PORT` |
| `Cliente não encontrado!` | Cadastro prévio do e-mail enviado em `cliente.email` |
| Conflito de consultoria | Mesmo profissional, data e horário já cadastrados |
| Falha ao converter plano/data/hora | Valores e formatos da API |
| Erro 500 ao cadastrar cliente | Campos nulos e restrições do banco não tratadas pelo controller |
| Falha de `contextLoads` | Conexão e credenciais MySQL durante o teste |

## Manutenção

Atualize a referência da API ao mudar rotas, campos, mensagens ou códigos HTTP. Mudanças nas entidades afetam os JSONs atuais, pois a serialização é direta. Mantenha alinhadas as validações do formulário e do servidor.

`ddl-auto=update` não substitui migrações versionadas. Antes de uso com dados reais, revise a estratégia de banco e os comportamentos de acesso e exposição de dados descritos na arquitetura.
