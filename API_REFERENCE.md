[← Back to Main Menu](README.md)

# API Reference

Base URL: `https://kayzen-api.my.id`

**Authentication:**
All endpoints require the `apikey` query parameter.
Default key: `kayzen`

## Social Media

### TikTok
* **GET** `/api/tiktok`
  * `url` (string): TikTok video URL.
  * Returns: Video (No WM), Audio, Author info.

### YouTube
* **GET** `/api/youtube`
  * `url` (string): YouTube video URL.
  * `type` (string): `mp3` or `mp4`.

### Instagram
* **GET** `/api/instagram`
  * `url` (string): Post/Reel URL.

### Pinterest
* **GET** `/api/pinterest`
  * `query` (string): Search keyword (e.g., 'anime').
  * `url` (string): Specific pin URL (optional, for download).

## Artificial Intelligence

### Chat
* **GET** `/api/ai/chat`
  * `text` (string): Your message.
  * Returns: Response from Kayzen AI (18yo Persona).
