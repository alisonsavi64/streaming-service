# ⚡ K6 

O sistema possui integração com o **K6** para execução de **testes de carga e stress**, garantindo a estabilidade e o desempenho das aplicações.

---

## 🧠 Objetivo

O objetivo desses testes é **avaliar o comportamento e a performance** dos serviços principais (Backend, Streaming, Processor, etc.) quando submetidos a múltiplas requisições simultâneas.

---

## ⚙️ Requisitos

Antes de rodar os testes, é necessário ter todos os serviços em execução

---

## 🚀 Execução dos Testes

Para rodar os testes de stress, basta executar o seguinte comando na raiz dos projetos:

```bash
docker compose run k6 content-load-test.js
