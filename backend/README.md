## ⚙️ Backend / Core API

A API (core da aplicação) foi construída utilizando **NestJS** com **Fastify** como servidor HTTP.

Ela é responsável por:
- Autenticação do frontend
- Regras de negócio
- Upload e vídeos

Para executa-la separadamente, basta rodar o seguinte comando:

```bash
docker compose up --build backend
```
Você pode acessá-la em 👉 [http://localhost:3001/api](http://localhost:3001/api):

---

## 🔐 Autenticação

A autenticação do sistema é feita utilizando **JWT**, armazenado em **cookies HTTP-only**, garantindo que o token não seja acessível pelo JavaScript no browser.

O frontend se comunica com a API através de um **BFF (Nuxt Nitro)**, permitindo o uso seguro de cookies e evitando exposição direta de credenciais.

---

## 👤 Usuários e 🎥 Vídeos

A API é responsável pelo:

### Usuários
- CRUD de usuários
- Gerenciamento de autenticação e sessão

### Vídeos
- CRUD de vídeos (metadados)
- Upload do vídeo original
- Atualização de informações como título, descrição, status, etc.

A API **não é responsável pelo streaming nem pelo processamento dos vídeos**.

Essas responsabilidades ficam a cargo dos serviços:

- **Video Streaming Service**  
  ➜ Veja detalhes em [`video-streaming/README.md`](../video-streaming/README.md)

- **Video Processor**  
  ➜ Veja detalhes em [`video-processor/README.md`](../video-processor/README.md)

---
## 📘 Documentação da API (Swagger)

A API possui documentação das rotas gerada com **Swagger**.  

Você pode acessá-la em 👉 [http://localhost:3001/api](http://localhost:3001/api)

Essa documentação permite visualizar os endpoints disponíveis, parâmetros e exemplos de requisição/resposta.
<img width="1904" height="885" alt="swagger" src="https://github.com/user-attachments/assets/dc6dda97-c6f4-4263-83ba-8d099b9a5e40" />

---

## 💾 Storage, Cache e Banco de Dados

Seguindo os princípios de **Clean Architecture**, tanto o **storage** quanto o **banco de dados** são acessados através de **interfaces e adapters**, permitindo fácil substituição de implementações.

### Storage
- Implementação atual: storage local (ambiente de desenvolvimento)
- Possível troca para: **Amazon S3**, sem impacto na lógica de negócio

### Cache
- Para cache, foi utilizada a lib **nestjs/cache-manager**, aplicada na rota principal de busca de vídeos.

### Banco de Dados
- Banco relacional: **PostgreSQL**
- ORM utilizado: **TypeORM**

A abstração permite, por exemplo, a substituição futura do TypeORM por outra ferramenta (como Prisma), mantendo a camada de domínio intacta.

---

## 🗄️ Modelo de Dados

A estrutura do banco de dados (Banco de dados único acessado apenas pelo Backend) segue o seguinte **ERD**:
<img width="1152" height="576" alt="Untitled Diagram" src="https://github.com/user-attachments/assets/5b8fd11a-c266-44fb-b04e-e88ad92f0ec5" />

---

## 📊 Observabilidade

A API possui instrumentação para logs, métricas e tracing distribuído.

### Logs
- Utiliza o **logger adapter do Fastify**
- Logs simples e estruturados para acompanhamento da aplicação

### Tracing
- Integração com **OpenTelemetry**
- Visualização via **Jaeger**
- Acesso em:  
  `http://localhost:16686`

### Métricas
- Integração com **Prometheus**
- Endpoint de métricas exposto em:  
  `http://localhost:3001/metrics`

- Visualização de métricas via **Grafana**
- Acesso em:  
  `http://localhost:3002`

---

## 🧪 Testes

Foram desenvolvidos testes automatizados utilizando **Jest**, incluindo:

- Testes de entidades
- Testes de repositórios
- Testes de integração via requisições HTTP para a API

Os testes da API estão organizados **próximos aos arquivos que validam**, dentro de uma pasta `__tests__` em cada módulo correspondente, facilitando manutenção, leitura e evolução do código.

Para executar a suíte de testes, basta rodar o seguinte comando:

```bash
docker compose exec backend npm run test
```
---

## ⚡ Testes de Stress

A API também possui integração com **K6** para testes de carga e stress, permitindo avaliar o comportamento do sistema sob alta concorrência.

➜ Veja mais detalhes em [`k6/README.md`](../k6/README.md)
