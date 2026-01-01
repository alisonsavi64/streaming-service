# Mini YouTube – Fullstack Distributed System

Este projeto é uma aplicação fullstack inspirada no funcionamento de plataformas de streaming de vídeo, desenvolvida como desafio técnico com foco em arquitetura distribuída, escalabilidade, observabilidade e boas práticas de engenharia de software.

O sistema permite upload, processamento assíncrono e streaming adaptativo de vídeos utilizando HLS, com suporte a múltiplas resoluções (ex: 1080p, 720p).

---

## Visão Geral da Arquitetura

A aplicação é composta por múltiplos serviços independentes, comunicando-se de forma síncrona e assíncrona:

- **Frontend (Nuxt + Vue.js)** – Interface do usuário com SSR
- **Backend Principal (NestJS + Fastify)** – API, autenticação, orquestração
- **Video Processor** – Processamento assíncrono de vídeos via Kafka
- **Video Streaming** – Serviço de entrega de streams HLS
- **Nginx** – Servidor de arquivos HLS e thumbnails
- **Kafka** – Mensageria para desacoplamento
- **Prometheus + Grafana + Jaeger** – Observabilidade
- **K6** – Testes de carga

---

## Fluxo Principal da Aplicação

1. O usuário acessa o frontend e visualiza os vídeos disponíveis.
2. Ao clicar em um vídeo:
   - O frontend solicita ao serviço de **video-streaming** o caminho do arquivo HLS.
   - O player consome o stream fornecido via **Nginx**, com suporte a múltiplas resoluções.
3. Para upload:
   - O usuário se autentica.
   - O upload do vídeo e thumbnail é feito via backend principal.
   - O backend salva o arquivo original e publica um evento no Kafka.
   - O **video-processor** consome o evento e processa o vídeo para HLS.
   - Após o processamento, um evento de retorno atualiza o status do vídeo para `processed`.
   - O vídeo passa a ser exibido no frontend.

---

## Como Executar o Projeto

```bash
docker-compose up --build
