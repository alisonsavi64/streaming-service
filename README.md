## 🎬 Mini YouTube

Este projeto é uma aplicação **fullstack** inspirada no funcionamento de plataformas de streaming de vídeo, desenvolvida como **desafio técnico** com foco em **arquitetura distribuída**, **escalabilidade**, **observabilidade** e **boas práticas de engenharia de software**.

O sistema permite **upload**, **processamento assíncrono** e **streaming adaptativo de vídeos utilizando HLS**, com suporte a múltiplas resoluções (ex: 1080p, 720p).

---

## 🚀 Requisitos

Para executar o projeto localmente, é necessário:

- **Docker**
- **Docker Compose >= v2.0**  
  - Projeto desenvolvido e testado com a versão **v2.40.3**

> Não é necessária a instalação de dependências adicionais na máquina host,  
> pois todo o ambiente é provisionado via containers Docker.
> 
## ▶️ Execução

Todo o ambiente pode ser executado localmente utilizando **Docker Compose** segundo os seguintes comandos:

```bash
git clone https://github.com/alisonsavi64/streaming-service.git
cd streaming-service
docker compose up --build
```

Após executar o comando, aguarde alguns minutos até que todos os containers sejam iniciados e acesse: http://localhost:3000
## Visão Geral da Arquitetura

A aplicação é composta por múltiplos serviços independentes, comunicando-se de forma **síncrona** e **assíncrona**.

## 🧩 Serviços

### 🌐 Frontend (Nuxt + Vue.js)

- Interface do usuário com **Server-Side Rendering (SSR)**
- Utiliza **Nitro como BFF**, garantindo:
  - Comunicação segura com o backend
  - Autenticação via **cookies HTTP-only**
- Responsável pelo player HLS e interações do usuário

📄 Detalhes e preview das telas em: [`frontend/README.md`](frontend/README.md)

---

### ⚙️ Backend Principal (NestJS + Fastify + PostgreSQL)

- Core da aplicação
- Responsável por:
  - Autenticação
  - Regras de negócio
  - Upload de vídeos e thumbnails
  - Publicação de eventos no Kafka
- Banco de dados relacional com modelagem explícita (ERD)

📄 Detalhes em: [`backend/README.md`](backend/README.md)

---

### 🎞️ Video Processor

- Microserviço responsável pelo **processamento assíncrono** dos vídeos
- Consome eventos do Kafka
- Converte vídeos para o formato **HLS**
- Gera múltiplas resoluções (ex: 1080p, 720p)
- Publica eventos de retorno com status do processamento

📄 Detalhes em: [`video-processor/README.md`](video-processor/README.md)

---

### 📡 Video Streaming

- Serviço responsável por fornecer os **caminhos dos arquivos HLS**
- Atua como camada de controle entre:
  - Player no frontend
  - Infraestrutura de storage/CDN
- Em produção, é responsável por gerar **URLs assinadas**

📄 Detalhes em: [`video-streaming/README.md`](video-streaming/README.md)

---

### 🗄️ Nginx (CDN Local)

- Responsável por servir:
  - Arquivos HLS
  - Thumbnails
- Simula o comportamento de uma CDN em ambiente local

---

### 📨 Kafka

- Sistema de mensageria
- Utilizado para:
  - Comunicação assíncrona entre serviços
  - Desacoplamento do processamento de vídeos
- Essencial para escalabilidade e tolerância a falhas

---

### 📊 Observabilidade

- Stack de observabilidade composta por:
  - **Prometheus** (métricas)
  - **Grafana** (dashboards)
  - **Jaeger** (tracing distribuído)
- Permite análise de performance, gargalos e fluxo entre serviços

📄 Detalhes em: [`backend/README.md`](backend/README.md)

---

### 🔥 Testes de Carga (K6)

- Ferramenta utilizada para testes de stress e performance da API
- Simulação de cenários reais de uso

📄 Detalhes em: [`k6/README.md`](k6/README.md)

---
## 🔄 Fluxo Principal da Aplicação

### ▶️ Visualização de Vídeos

1. O usuário acessa o frontend e visualiza a lista de vídeos disponíveis.
2. Ao selecionar um vídeo:
   - O frontend solicita ao serviço de **video-streaming** o caminho do arquivo HLS.
   - O serviço de *video-streaming* valida o acesso e retorna o caminho do stream.
   - O player no frontend consome o stream via **Nginx/CDN**.
   - O HLS permite **streaming adaptativo**, selecionando automaticamente a melhor resolução disponível (ex: 1080p, 720p).
<img width="1162" height="642" alt="useCase1" src="https://github.com/user-attachments/assets/ebc6229f-b25c-43f4-b785-f416ffd29589" />

---

### ⬆️ Upload e Processamento de Vídeos (Obs: para testes e processamento rápido utilizar vídeos curtos)

1. O usuário realiza autenticação no sistema.
2. O upload do vídeo e da thumbnail é realizado via **backend principal**.
3. O backend:
   - Persiste os metadados do vídeo no banco de dados.
   - Salva o arquivo original no **storage compartilhado**.
   - Publica um evento no **Kafka** informando que um novo vídeo foi enviado.
4. O **video-processor**:
   - Consome o evento do Kafka.
   - Processa o vídeo, convertendo-o para o formato **HLS**.
   - Gera múltiplas resoluções (ex: 1080p, 720p).
5. Após a conclusão do processamento:
   - Um evento de retorno é publicado no Kafka.
   - O backend atualiza o status do vídeo para `PROCESSED`.
6. O vídeo passa a ficar disponível para visualização no frontend.

<img width="1351" height="831" alt="usecase2" src="https://github.com/user-attachments/assets/c4c72142-0cc2-4615-a921-59eede6fd0eb" />

Observação: Caso o serviço Kafka esteja indisponível ou o processamento seja interrompido, a API verificará posteriormente o status do vídeo por meio de um serviço vinculado ao Contrab e reenviará o evento de processamento, se necessário.

---

## 🏗️ Arquiteturas

### 🏠 Arquitetura Local

No ambiente local, a aplicação é executada inteiramente via **Docker Compose**, com os seguintes pontos principais:

- Todos os serviços rodam em containers Docker.
- Existe um **storage físico compartilhado**, montado como volume entre os containers.
- O compartilhamento de storage facilita:
  - Desenvolvimento local
  - Testes integrados
  - Depuração do fluxo de processamento de vídeos
- O **Nginx** atua como uma **CDN local**, servindo:
  - Arquivos HLS
  - Thumbnails de vídeos

![Arquitetura Local](https://github.com/user-attachments/assets/3c7a78c2-088e-4f79-852d-0a6c60ebb657)

---

### ☁️ Arquitetura em Produção (Proposta)

Em um ambiente de produção, o fluxo principal da aplicação permanece o mesmo, porém com adaptações para **escala**, **segurança** e **alta disponibilidade**:

- O storage local é substituído por um **bucket Amazon S3**.
- O acesso ao storage ocorre através de um **adapter**, permitindo:
  - Troca de provider sem impacto na regra de negócio
  - Maior desacoplamento da infraestrutura
- O **Nginx** é substituído por um **CDN** (ex: **Amazon CloudFront**).
- O serviço de **video-streaming** passa a ser responsável por:
  - Geração de **URLs assinadas**
  - Controle de acesso aos arquivos de vídeo
- Os serviços:
  - Backend
  - Video Processor (Podendo criar várias instâncias para o processamento dos vídeos)
  - Video Streaming  

Passam a ser executados em containers gerenciados (ex: **ECS + Fargate**).
- A infraestrutura é definida como código utilizando **Terraform**.

![Arquitetura Produção](https://github.com/user-attachments/assets/bd25faa2-f0a5-4468-b045-9d8afe8604ed)
---

## 🛠️ Melhorias Futuras

Caso houvesse mais tempo para desenvolvimento, seriam realizadas as seguintes melhorias:

- Finalizar o sistema de **assinatura de URLs** no *video-streaming service*  
  (atualmente o serviço retorna o link sem autenticação).
- Adicionar validações de **autenticidade e segurança** no *video-processor*.
- Implementar novas **funcionalidades**, como:
  - Comentários
  - Likes
- Realizar o **deploy em produção de forma completa**.  
  > Os *workflows* de CI/CD e arquivos **Terraform** já estão presentes no projeto como exemplos.
- Implementar **WebSocket** no frontend para atualização em tempo real do status dos vídeos (No momento é necessário atualizar a página para carregar o status atual dos vídeos).
- Adicionar **métricas** e instrumentação de observabilidade nos demais microserviços.
- Melhorar a **padronização e clareza das respostas de erro da API**.
- Finalizar a **cobertura total de testes automatizados**, pois alguns módulos ainda não foram contemplados.
- Implementar paginação e filtros de categoria nas páginas de vídeos
---
