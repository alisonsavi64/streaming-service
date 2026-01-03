## 💻 Frontend

O **Frontend** é a interface principal da aplicação, responsável por **autenticar usuários**, **permitir o upload de vídeos** e **exibir vídeos processados via streaming**.

---
## ▶️ Execução

Para executar o frontend de forma isolada, utilize o comando:

```bash
docker compose up --build frontend
```
Para acessar a aplicação localmente:
http://localhost:3000

---

## ⚙️ Função Principal

O frontend foi desenvolvido utilizando **Nuxt + Vue**, com **Server-Side Rendering (SSR)**, e atua como a interface principal da aplicação, integrando-se ao **Backend (Core API)** e ao **Video Streaming Service**.

Ele é responsável por:

- 🧑‍💻 **Autenticação e criação de usuários**
- 📤 **Upload de vídeos e thumbnails**
- 🎬 **Visualização de vídeos processados via streaming HLS**
- 🛠️ **Gerenciamento de vídeos do usuário** (edição e exclusão)
- 🌗 **Interface moderna e responsiva**, com suporte a **tema claro e escuro**
- 🌍 **Internacionalização (i18n)** da aplicação

---

## 🔐 Autenticação e Comunicação

A autenticação é realizada por meio de **cookies HTTP-only**, aumentando a segurança e evitando a exposição de tokens no cliente.

O **Nuxt Nitro** atua como um **BFF (Backend for Frontend)**, intermediando a comunicação entre o frontend e o backend.

Todas as requisições sensíveis passam pelo BFF antes de chegar ao backend, o que:

- Centraliza a lógica de autenticação
- Protege credenciais e tokens
- Simplifica a comunicação entre frontend ↔ backend

---

### 🔄 Fluxo de Autenticação (Resumo)

1. O usuário realiza login ou registro no frontend.
2. O BFF encaminha a requisição ao backend.
3. O backend retorna um **cookie HTTP-only**.
4. O frontend passa a consumir recursos autenticados por meio do BFF.
---

## 📡 Integrações

O frontend se comunica com os seguintes serviços:

| Serviço | Função |
|----------|--------|
| **Backend (Core API)** | Autenticação, CRUD de usuários e vídeos |
| **Video Streaming Service** | Busca de links HLS de vídeos processados |
| **Nginx/CDN** | Streaming dos vídeos processados |

---

## 🧱 Tecnologias Utilizadas

- **Nuxt** — Framework Vue com suporte SSR e rotas automáticas  
- **Vue** — Biblioteca de UI reativa  
- **Tailwind CSS** — Estilização rápida e responsiva  
- **Pinia** — Gerenciamento de estado centralizado  
- **i18n** — Suporte a múltiplos idiomas  
- **Dark/Light Mode** — Alternância entre temas claro e escuro  
- **ViteTest** — Framework de testes unitários para o frontend  

---

## 🧪 Testes

- ✅ Testes unitários com **ViteTest**  
- ✅ Testes de integração com APIs simuladas  
- 🔜 Testes end-to-end (E2E) com Cypress (planejado)

Os testes do frontend se encontram na pasta /test na raiz do projeto.

Para executar a suíte de testes, basta rodar o seguinte comando:
```
docker compose exec frontend npm run test
```
---
## 🧭 Telas Disponíveis

O frontend contém as seguintes páginas:

- 🔐 **Login**
<img width="1925" height="789" alt="login" src="https://github.com/user-attachments/assets/a1eb5d82-f200-4e79-bd89-1f8ab9b49079" />

- 🆕 **Registro**
<img width="1918" height="795" alt="registro" src="https://github.com/user-attachments/assets/b062f923-8579-405d-8048-1888eaa79647" />

- 🏠 **Home**
- Mostra os vídeos processados de todos os usuários
<img width="1906" height="758" alt="home" src="https://github.com/user-attachments/assets/e15364b4-10ad-4dcf-ba61-ee270cad0f24" />

- 🎥 **Meus Vídeos**
- Mostra todo os vídeos do usuário e seus respectivos status
<img width="1908" height="778" alt="meusvideos" src="https://github.com/user-attachments/assets/0721ed06-224a-4264-9748-69c9127b870e" />

- 👤 **Perfil**
<img width="1928" height="786" alt="perfil" src="https://github.com/user-attachments/assets/73cb1ea5-fa2a-43b6-9333-0f6e16c3795d" />

- ⬆️ **Envio de Vídeos**
<img width="1923" height="745" alt="Envio" src="https://github.com/user-attachments/assets/b9ec9e81-dd18-41de-909f-e1230b1b1dec" />

- ✏️ **Edição de Vídeo**
<img width="1921" height="800" alt="image" src="https://github.com/user-attachments/assets/68ed66e3-9c69-40c9-aebb-6ce29a333e89" />


