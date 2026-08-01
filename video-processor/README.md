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
2. O backend salva o arquivo no **storage** e publica uma mensagem no **Kafka** informando que um novo vídeo foi salvo (Caso o serviço esteja indisponível ou o processamento pare na metade o backend enviará/reenviará o evento posteriormente);  
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
| Aceleração de vídeo por GPU (NVIDIA) com fallback para CPU | ✅ Implementado |
| Assinatura e autenticação de mensagens | 🔜 Planejado |

---

## 🚀 Aceleração por GPU (NVIDIA)

O serviço detecta automaticamente, na inicialização, se há uma GPU NVIDIA disponível (via `nvidia-smi`) e se o `ffmpeg` instalado suporta o encoder `h264_nvenc`. Quando ambos estão disponíveis, o processamento usa o encoder de GPU; caso contrário, usa `libx264` (CPU).

Se o encoder de GPU falhar durante o processamento de um vídeo específico, o serviço automaticamente refaz a tentativa usando o encoder de CPU — não há dependência obrigatória de GPU para o funcionamento do serviço.

Para habilitar o acesso à GPU no container, é necessário ter o [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/latest/install-guide.html) instalado no host e subir o serviço combinando o compose principal com o override `docker-compose.gpu.yml` (na raiz do repositório):

```bash
docker compose -f docker-compose.yml -f docker-compose.gpu.yml up --build video-processor
```
