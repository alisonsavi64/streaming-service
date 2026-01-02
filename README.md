# Mini YouTube

Este projeto é uma aplicação **fullstack** inspirada no funcionamento de plataformas de streaming de vídeo, desenvolvida como **desafio técnico** com foco em **arquitetura distribuída**, **escalabilidade**, **observabilidade** e **boas práticas de engenharia de software**.

O sistema permite **upload**, **processamento assíncrono** e **streaming adaptativo de vídeos utilizando HLS**, com suporte a múltiplas resoluções (ex: 1080p, 720p).

---

## Visão Geral da Arquitetura

A aplicação é composta por múltiplos serviços independentes, comunicando-se de forma **síncrona** e **assíncrona**, seguindo princípios de desacoplamento e responsabilidade única.

### Principais Componentes

- **Frontend (Nuxt + Vue.js)**  
  Interface do usuário com Server-Side Rendering (SSR), utilizando Nitro como BFF para comunicação segura com o backend via cookies HTTP-only.  
  ➜ Veja detalhes em `frontend/README.md`

- **Backend Principal – Core da Aplicação (NestJS + Fastify)**  
  API responsável por autenticação, regras de negócio, orquestração dos fluxos e publicação/consumo de eventos.  
  ➜ Veja detalhes em `backend/README.md`

- **Video Processor**  
  Microserviço responsável pelo processamento assíncrono de vídeos, convertendo arquivos originais para o formato HLS a partir de eventos recebidos via Kafka.  
  ➜ Veja detalhes em `video-processor/README.md`

- **Video Streaming**  
  Serviço responsável por fornecer, de forma controlada, os caminhos dos arquivos HLS utilizados pelo player no frontend.  
  ➜ Veja detalhes em [`video-streaming/README.md`](video-streaming/README.md)

- **Nginx | CDN**  
  Servidor responsável por servir arquivos HLS e thumbnails de vídeo no ambiente local.  
  ➜ Veja detalhes em `nginx/README.md`

- **Kafka**  
  Sistema de mensageria utilizado para comunicação assíncrona e desacoplamento entre os serviços.

- **Observabilidade**  
  Instrumentação com Prometheus, Grafana e Jaeger para métricas, logs e tracing distribuído.  
  ➜ Veja detalhes em `backend/README.md`

- **Testes de Carga (K6)**  
  Ferramenta utilizada para testes de stress e performance da API.  
  ➜ Veja detalhes em `k6/README.md`

---

## Fluxo Principal da Aplicação

### Visualização de Vídeos

1. O usuário acessa o frontend e visualiza os vídeos disponíveis.
2. Ao clicar em um vídeo:
   - O frontend solicita ao serviço de **video-streaming** o caminho do arquivo HLS.
   - O player consome o stream fornecido via **Nginx/CDN**, com suporte a múltiplas resoluções (ex: 1080p, 720p).

---

### Upload e Processamento de Vídeos

1. O usuário realiza autenticação no sistema.
2. O upload do vídeo e da thumbnail é feito via backend principal.
3. O backend salva o arquivo original no **storage compartilhado** e publica um evento no Kafka.
4. O **video-processor** consome o evento e processa o vídeo para o formato HLS.
5. Após o processamento, um evento de retorno atualiza o status do vídeo para `processed`.
6. O vídeo passa a ser exibido no frontend.

---

## Arquitetura Local

No ambiente local, os serviços compartilham um **storage físico** montado entre os containers Docker, facilitando o desenvolvimento e testes.

![Arquitetura Local](https://github.com/user-attachments/assets/03d5e3a8-2d8e-43ce-9ccf-abce2a06e4b3)

---

## Arquitetura em Produção (Proposta)

Em um ambiente de produção, o fluxo geral permanece o mesmo, porém com adaptações para escalabilidade, segurança e alta disponibilidade:

- O **storage compartilhado** é substituído por um **bucket Amazon S3**
- O acesso ao storage é feito através de um **adapter**, permitindo fácil troca da implementação (detalhado no README do backend)
- O **Nginx** é substituído por um **CDN (ex: Amazon CloudFront)**
- O serviço de **video-streaming** passa a ser responsável por gerar **URLs assinadas e autenticadas** para acesso aos vídeos
- Os serviços backend, video-processor e video-streaming são executados em containers gerenciados (ex: ECS + Fargate)

![Arquitetura em Produção](https://github.com/user-attachments/assets/367590e2-e9ca-4eda-8a68-af8d88ab3955)

---

## Execução do Projeto

Todo o ambiente pode ser executado localmente via **Docker Compose** utilizando o comando abaixo e aguardando de 1 a 2 minutos até que todos os serviços estejam disponíveis, após isso acesse http://localhost:3000
```bash
docker-compose up --build
