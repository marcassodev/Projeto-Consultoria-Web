# +Vida | Consultoria em Saúde

Sistema web de consultoria na área da saúde, desenvolvido como Projeto Integrador. Permite cadastrar clientes e agendar atendimentos com profissionais de nutrição, psicologia, fisioterapia e educação física.

## Funcionalidades

- Cadastro de clientes com verificação de nome, e-mail e CPF já cadastrados.
- Login por e-mail e senha.
- Agendamento com profissional, data, horário e plano semanal, mensal ou anual.
- Verificação de conflito para o mesmo profissional, data e horário.
- Listagem e exclusão de consultorias, com filtro por profissional no navegador.
- Página de profissionais e perguntas frequentes.

O campo `medico` representa o profissional selecionado. Os dados de cartão são cadastrados, mas não há integração de pagamento.

## Tecnologias

| Camada | Tecnologias |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5.7, Spring Web |
| Persistência | Spring Data JPA, Hibernate, MySQL |
| Frontend | HTML, CSS, JavaScript e Fetch API |
| Build | Maven Wrapper, configurado para Maven 3.9.11 |
| Testes existentes | JUnit e Spring Boot Test: carregamento do contexto |

Thymeleaf, Validation e Lombok estão declarados no `pom.xml`; as páginas atuais são estáticas e os controllers não usam `@Valid`.

## Como executar

Requisitos: JDK 21 no `PATH`, `JAVA_HOME` configurado e MySQL em execução. A primeira execução do wrapper precisa de internet para baixar Maven e dependências.

1. Crie o banco no MySQL:

   ```sql
   CREATE DATABASE IF NOT EXISTS consultoria CHARACTER SET utf8mb4;
   ```

2. Configure as credenciais no PowerShell:

   ```powershell
   $env:SPRING_DATASOURCE_URL = 'jdbc:mysql://localhost:3306/consultoria'
   $env:SPRING_DATASOURCE_USERNAME = 'seu_usuario'
   $env:SPRING_DATASOURCE_PASSWORD = 'sua_senha_local'
   ```

3. Execute na raiz do projeto:

   ```powershell
   .\mvnw.cmd spring-boot:run
   ```

   No Linux/macOS, use `./mvnw spring-boot:run` e conceda permissão de execução ao wrapper se necessário.

4. Acesse [http://localhost:8080](http://localhost:8080). Cadastre um cliente em `/cadastro-clientes.html` e use o mesmo e-mail ao agendar em `/cadastro-consultorias.html`.

Os padrões de [application.properties](src/main/resources/application.properties) são: banco `consultoria`, usuário `root`, senha vazia e porta `8080`. O Hibernate usa `ddl-auto=update` para atualizar as tabelas; o banco precisa existir previamente.

**Problema conhecido de compilação:** `src/main/java/com/maisVida/consultoria/model/consultoria.java` declara a classe pública `Consultoria`. O nome esperado pelo compilador é `Consultoria.java`. Essa divergência precisa ser corrigida antes de compilar, caso ainda esteja presente no checkout. Esta entrega altera somente a documentação.

## Endpoints

Base local: `http://localhost:8080`. Corpos de requisição usam `Content-Type: application/json`.

| Método | Caminho | Finalidade | Sucesso | Erro tratado |
| --- | --- | --- | --- | --- |
| POST | `/api/clientes` | Cadastrar cliente | 200 | 400 |
| POST | `/api/login` | Conferir credenciais | 200 | 401 |
| GET | `/api/consultorias` | Listar todas as consultorias | 200 | — |
| POST | `/api/consultorias` | Agendar consultoria | 200 | 400 |
| DELETE | `/api/consultorias/{id}` | Excluir consultoria | 200 | 400 |

Consulte os contratos, exemplos e erros na [referência da API](docs/API.md). Não existem rotas de edição, busca por ID ou listagem de clientes.

## Documentação

- [API REST](docs/API.md): campos, JSONs, respostas e validações.
- [Arquitetura e dados](docs/ARQUITETURA.md): camadas, entidades e fluxos.
- [Execução e uso](docs/EXECUCAO.md): configuração, telas, build, testes e diagnóstico.

## Estrutura

```text
src/main/java/com/maisVida/consultoria/
├── ConsultoriaApplication.java
├── controller/       # Endpoints REST
├── service/          # Regras de negócio
├── repository/       # Acesso ao banco via JPA
└── model/            # Cliente, Consultoria e Plano
src/main/resources/
├── application.properties
└── static/           # HTML, CSS, JavaScript e imagens
src/test/             # Teste de carregamento do contexto
docs/                 # Documentação detalhada
```

## Estado atual

O projeto tem finalidade educacional. O login não cria token ou sessão, e os endpoints não exigem autenticação nem limitam o acesso por cliente. A senha é armazenada em texto simples. As respostas de consultoria incluem dados de cartão e o cliente com sua senha, pois serializam as entidades completas. Utilize somente dados fictícios enquanto esses comportamentos existirem.

Autenticação com autorização, proteção de senhas, respostas sem dados sensíveis, integração de pagamento e ampliação dos testes são evoluções pendentes.

## Build e testes

```powershell
.\mvnw.cmd test
.\mvnw.cmd clean package
java -jar target/consultoria-0.0.1-SNAPSHOT.jar
```

O teste existente carrega a aplicação e depende de conexão com o MySQL. Veja detalhes no [guia de execução](docs/EXECUCAO.md).

## Licença

Não há arquivo de licença no repositório. As condições de uso e redistribuição devem ser definidas pelo responsável pelo projeto.
