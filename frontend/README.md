# 💻 Frontend

O **Frontend** é a interface principal da aplicação, responsável por **autenticar usuários**, **permitir o upload de vídeos** e **exibir os vídeos processados**.

---

## ⚙️ Função Principal

O frontend foi desenvolvido em **Nuxt + Vue**, com renderização **Server-Side Rendering (SSR)**, e funciona em conjunto com o **Backend (Core API)** e o **Video Streaming Service**.

Ele é responsável por:

- 🧑‍💻 **Autenticação e criação de usuários**  
- 📤 **Envio de vídeos** para o backend  
- 🎬 **Visualização de vídeos processados** via streaming  
- 🌗 **Interface moderna** com suporte a temas claro e escuro  

---

## 🔐 Autenticação e Comunicação

A autenticação é feita por meio de **cookies HTTP-only**, garantindo mais segurança.

- O **Nuxt Nitro** funciona como um **BFF (Backend for Frontend)**, intermediando as requisições para o backend.  
- Isso evita que o frontend exponha tokens diretamente e mantém o fluxo de autenticação seguro.  

### 🔄 Fluxo de Autenticação

---

## 👥 Permissões de Acesso

| Estado do Usuário | Ações Permitidas |
|--------------------|------------------|
| **Deslogado** | Visualizar vídeos públicos enviados por outros usuários |
| **Autenticado** | Enviar novos vídeos, editar e gerenciar seus próprios vídeos |

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

---

## 🖥️ Acesso e Execução

Para acessar a aplicação localmente:  
👉 **[https://localhost:3000](https://localhost:3000)**  

---

## 🧭 Telas Disponíveis

O frontend contém as seguintes páginas:

- 🔐 **Login**  
- 🆕 **Registro**  
- 🏠 **Home**  
- 🎥 **Meus Vídeos**  
- 👤 **Perfil**  
- ⬆️ **Envio de Vídeos**  
- ✏️ **Edição de Vídeo**

---

## 🚀 Próximos Passos

- [ ] Melhorar feedback visual de upload e processamento  
- [ ] Melhorar UI e erros retornados da api
- [ ] Finalizar testes 

---
