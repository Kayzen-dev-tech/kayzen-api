# 📡 API Endpoints Reference

[![Kayzen API](https://img.shields.io/badge/API%20STATUS-ONLINE-brightgreen?style=flat-square&logo=vercel)](https://kayzen-api.my.id)
![Endpoints](https://img.shields.io/badge/endpoints-20+-blueviolet?style=flat-square)

[← Back to Main README](README.md) | [View Interactive Docs →](/docs)

## Authentication
Add `?apikey=kayzen` to all requests.

## 🎵 TikTok Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/tiktok` | `url` | Download video without watermark. |
| `GET` | `/api/tiktok` | `type=search`, `query` | Search for videos. |
| `GET` | `/api/tiktok` | `type=stalk`, `username` | Get user profile data. |

## 📺 YouTube Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/youtube` | `url` | Download video (MP4). |
| `GET` | `/api/youtube` | `type=audio`, `url` | Convert video to audio (MP3). |
| `GET` | `/api/youtube` | `type=search`, `query` | Search for videos. |

## 📸 Instagram Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/instagram` | `url` | Download Reels, Stories, or Images. |
| `GET` | `/api/instagram` | `type=stalk`, `username` | Get user profile & latest posts. |

## 📌 Pinterest Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/pinterest` | `type=download`, `url` | Download Image or Video Pin. |
| `GET` | `/api/pinterest` | `query` | Search for pins. |

## 🐦 Twitter / X Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/twitter` | `url` | Download Video or Image Tweet. |
| `GET` | `/api/twitter` | `type=search`, `query` | Search tweets. |
| `GET` | `/api/twitter` | `type=stalk`, `username` | Stalk user profile & tweets. |

## 🧠 AI Features

| Method | Endpoint | Params | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/ai/chat` | `prompt` | Chat with Kayzen AI. |
| `GET` | `/api/ai/image` | `prompt` | Generate AI images. |
| `GET` | `/api/ai/code` | `code` | Explain code snippets. |
| `GET` | `/api/ai/grammar`| `text` | Correct grammar errors. |
| `GET` | `/api/ai/summary`| `text` | Summarize long text. |

---
> **Note:** All endpoints return JSON format.
