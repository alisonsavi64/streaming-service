# 🎬 Video Streaming Service

O **Video Streaming Service** é um microserviço simples desenvolvido com **Fastify**, responsável por fornecer **links de acesso aos vídeos em formato HLS** (HTTP Live Streaming).

Para executa-la separadamente, basta rodar o seguinte comando:

```bash
docker compose up --build video-streaming
```
---

## ⚙️ Função Principal

Este serviço atua como uma camada de **intermediação entre o frontend e a origem dos vídeos**, sendo responsável por:

- Receber do frontend o **identificador do vídeo** desejado;  
- **Montar e retornar** a URL do vídeo em formato HLS;  
- (Futuro) **Assinar e validar** os links, garantindo acesso temporário e seguro em produção.

---

## 🧩 Arquitetura de Execução Local

No ambiente de desenvolvimento (execução local), o fluxo funciona assim:

1. O **frontend (Nuxt)** solicita o link de um vídeo ao **Video Streaming Service**;  
2. O serviço **monta o link** com base no ID ou caminho do vídeo;  
3. O **frontend utiliza o link** retornado para acessar o vídeo;  
4. O vídeo é **servido por um servidor Nginx**, que tem acesso direto ao storage local.

---
## ☁️ Arquitetura de Produção

Em produção, o serviço deverá:

- **Assinar e validar os links** de acesso, garantindo que cada link tenha um **tempo de expiração limitado**;  
- Retornar URLs que apontem para vídeos hospedados em uma **CDN** conectada a um **bucket S3**;  
- Reforçar a **segurança do acesso** aos vídeos, evitando exposição pública.
---

## 🚧 Status Atual

- ✅ Retorna links de vídeos em HLS  
- 🔜 Implementar **mecanismo de assinatura e expiração de links**  
- 🔜 Adicionar **validação de tokens de acesso**  

---

## 🛠️ Tecnologias Utilizadas

- **Fastify** — Framework web rápido e leve para Node.js  
- **TypeScript** — Tipagem estática e segurança no desenvolvimento  
- **Nginx** — Servidor HTTP usado para servir os arquivos de vídeo localmente  
- **Amazon S3 / CDN** — (Planejado) origem dos vídeos em ambiente de produção  
