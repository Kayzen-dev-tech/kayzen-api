# 📡 API Endpoints Reference

![API Status](https://img.shields.io/website?down_message=offline&label=API%20Status&style=flat-square&up_message=online&url=https%3A%2F%2Fkayzen-api.my.id)
![Endpoints](https://img.shields.io/badge/endpoints-9+-blueviolet?style=flat-square)

[← Back to Main README](README.md) | [View Interactive Docs →](/docs)

## Authentication
Add `?apikey=kayzen` to all requests.

## 📥 Downloader Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tiktok` | `url` | Download TikTok video without watermark. |
| `GET` | `/api/youtube` | `url` | Get YouTube video download link. |
| `GET` | `/api/ytmp3` | `url` | Convert YouTube video to Audio (MP3). |

## 🧠 AI Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ai/chat` | `prompt` | Chat with AI model. |
| `GET` | `/api/ai/image` | `prompt` | Generate AI images. |
| `GET` | `/api/ai/code` | `code` | Explain code snippets. |
| `GET` | `/api/ai/grammar`| `text` | Correct grammar errors. |

## 🔍 Search Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pinterest` | `query` | Search images on Pinterest. |

---
> **Note:** All endpoints return JSON format.
