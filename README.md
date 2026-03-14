# 🎸 Audio Splitter Pro — Frontend

> Interface Angular para separação de stems de áudio via IA

[![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat&logo=angular)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Vercel](https://img.shields.io/badge/Deploy-Vercel-000000?style=flat&logo=vercel)](https://vercel.com/)

---

## ✨ Funcionalidades

* **Drop Zone** — arraste ou selecione arquivos MP3, WAV, FLAC e OGG
* **Progresso em tempo real** — polling automático a cada 5 segundos via RxJS
* **6 Players de áudio** — um para cada stem separado (Voz, Bateria, Baixo, Guitarra, Piano, Outros)
* **Mixer personalizado** — selecione quais faixas manter e baixe o mix em MP3
* **Design dark editorial** — tema escuro com tipografia display e animações CSS

---

## 🛠️ Stack

```
Angular 21 · TypeScript · SCSS · RxJS · Angular Material
```

---

## 🏗️ Arquitetura

```
src/app/
├── components/
│   ├── upload/       → drop zone, seleção de arquivo e envio para a API
│   ├── progress/     → polling automático do status do processamento
│   ├── stems/        → exibição dos 6 stems com player de áudio e download
│   └── mixer/        → seleção de faixas e download do mix personalizado
├── services/
│   └── audio.service.ts  → HttpClient, interfaces e lógica de polling RxJS
└── app.ts            → orquestra os estados: upload → processing → completed
```

---

## 🚀 Como Executar

### Pré-requisitos

* Node.js 18+
* Angular CLI 21: `npm install -g @angular/cli`
* [Backend Django rodando](https://github.com/FlpRocha236/audio_project) em `http://localhost:8000`

### Instalação

```bash
git clone https://github.com/FlpRocha236/audio-splitter-frontend.git
cd audio-splitter-frontend
npm install
ng serve
```

Acesse `http://localhost:4200`

---

## 🔗 API Consumida

| Método  | Endpoint              | Descrição                        |
| -------- | --------------------- | ---------------------------------- |
| `POST` | `/api/upload/`      | Envia o arquivo de áudio          |
| `GET`  | `/api/status/{id}/` | Verifica o status do processamento |
| `POST` | `/api/mix/{id}/`    | Baixa o mix com stems selecionados |

O backend completo está em: [github.com/FlpRocha236/audio_project](https://github.com/FlpRocha236/audio_project)

---

## 📁 Fluxo da Aplicação

```
Upload arquivo → POST /api/upload/ → recebe separation_id
      ↓
Polling a cada 5s → GET /api/status/{id}/ → aguarda COMPLETED
      ↓
Exibe 6 stems com player e download individual
      ↓
Mixer → POST /api/mix/{id}/ → baixa MP3 personalizado
```

---

## 🌐 Deploy

Frontend → **Vercel** (detecta Angular automaticamente)

```json
// vercel.json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

---

## 👨‍💻 Autor

**Felipe Rocha** · Junior Back-End Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Felipe_Rocha-0077B5?style=flat&logo=linkedin)](https://www.linkedin.com/in/felipe-rafael-rocha-4b4081245/)
[![GitHub](https://img.shields.io/badge/GitHub-FlpRocha236-181717?style=flat&logo=github)](https://github.com/FlpRocha236)

---

## 📄 Licença

MIT License
