# Mini YouTube 

Este projeto é uma aplicação fullstack inspirada no funcionamento de plataformas de streaming de vídeo, desenvolvida como desafio técnico com foco em arquitetura distribuída, escalabilidade, observabilidade e boas práticas de engenharia de software.

O sistema permite upload, processamento assíncrono e streaming adaptativo de vídeos utilizando HLS, com suporte a múltiplas resoluções (ex: 1080p, 720p).

---

## Visão Geral da Arquitetura

A aplicação é composta por múltiplos serviços independentes, comunicando-se de forma síncrona e assíncrona:

- **Frontend (Nuxt + Vue.js)**  
  Interface do usuário com Server-Side Rendering (SSR)  
  ➜ Veja detalhes em `frontend/README.md`

- **Backend Principal - Core da aplicação - (NestJS + Fastify)**  
  API responsável por autenticação (Http-only com cookies), regras de negócio e orquestração  
  ➜ Veja detalhes em `backend/README.md`

- **Video Processor**  
  Microserviço responsável pelo processamento assíncrono de vídeos para hsl via Kafka  
  ➜ Veja detalhes em `video-processor/README.md`

- **Video Streaming**  
  Serviço responsável por fornecer os caminhos dos arquivos HLS  
  ➜ Veja detalhes em `video-streaming/README.md`

- **Nginx**  
  Servidor responsável por servir arquivos HLS e thumbnails  
  ➜ Veja detalhes em `nginx/README.md`

- **Kafka**  
  Mensageria utilizada para desacoplamento entre serviços

- **Observabilidade**  
  Instrumentação com Prometheus, Grafana e Jaeger  
  ➜ Veja detalhes em `backend/README.md`

- **Testes de Carga (K6)**  
  Testes de stress e performance da API  
  ➜ Veja detalhes em `k6/README.md`

---

## Fluxo Principal da Aplicação

### Visualização de Vídeos
1. O usuário acessa o frontend e visualiza os vídeos disponíveis.
2. Ao clicar em um vídeo:
   - O frontend solicita ao serviço de **video-streaming** o caminho do arquivo HLS.
   - O player consome o stream fornecido via **Nginx**, com suporte a múltiplas resoluções.

### Upload e Processamento de Vídeos
1. O usuário realiza autenticação no sistema.
2. O upload do vídeo e thumbnail é feito via backend principal.
3. O backend salva o arquivo original no storage compartilhado e publica um evento no Kafka.
4. O **video-processor** consome o evento e processa o vídeo para o formato HLS.
5. Após o processamento, um evento de retorno atualiza o status do vídeo para `processed`.
6. O vídeo passa a ser exibido no frontend.
<img width="921" height="321" alt="Diagrama sem nome drawio (2)" src="https://github.com/user-attachments/assets/a6ee28b2-9016-4b83-af27-df16391ba055" />

---

## Execução do Projeto

Todo o ambiente pode ser executado localmente via Docker Compose:

```bash
docker-compose up --build
