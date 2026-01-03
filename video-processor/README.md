# 🎞️ Video Processor Service

O **Video Processor Service** é um microserviço desenvolvido em **Fastify** e integrado com **Kafka**, responsável por **processar vídeos originais (ex: MP4)** e convertê-los para o formato **HLS (HTTP Live Streaming)**.

Para executa-la separadamente, basta rodar o seguinte comando:

```bash
docker compose up --build video-processor
```
---

## ⚙️ Função Principal

Este serviço é o responsável por toda a **etapa de processamento de vídeos**, garantindo que os arquivos enviados pelos usuários sejam convertidos para o formato ideal de streaming (HLS).

Fluxo resumido:

1. O **backend principal** recebe o upload do vídeo original (ex: MP4);  
2. O backend salva o arquivo no **storage** e publica uma mensagem no **Kafka** informando que um novo vídeo foi salvo;  
3. O **Video Processor Service** consome essa mensagem, obtém o **ID do vídeo** e o busca no storage;  
4. O vídeo é **processado e convertido** para o formato HLS;  
5. Após o processamento, o serviço **envia uma nova mensagem para o Kafka** informando que o vídeo foi processado;  
6. O **backend consome** essa mensagem e atualiza o status do vídeo no banco de dados como `processado`.

---

## 🧠 Detalhes

- Desenvolvido com **Fastify** (Node.js)  
- Comunicação assíncrona via **Kafka**  
- Conversão de vídeo (ex: usando **FFmpeg**)  
- Sem conexão direta com banco de dados  
- Acesso apenas ao **storage** para leitura e gravação de arquivos

---

## 🚧 Status Atual

| Recurso | Status |
|----------|--------|
| Receber eventos Kafka de vídeos enviados | ✅ Implementado |
| Processar vídeos originais para HLS | ✅ Implementado |
| Enviar eventos Kafka de vídeos processados | ✅ Implementado |
| Reprocessamento de vídeos com erros | ✅ Implementado |
| Assinatura e autenticação de mensagens | 🔜 Planejado |
