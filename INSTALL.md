# Installation Guide

Follow these steps to set up the project locally or deploy it to Vercel.

## Prerequisites

* **Node.js**: Version 20.x or higher.
* **npm**: Version 9.x or higher.
* **Git**: Latest version.

## Local Setup

1. **Clone the Repository**
   ```bash
   git clone [https://github.com/kayzenfry/kayzen-api-pro.git](https://github.com/Kayzen-dev-tech/kayzen-api.git)
   cd kayzen-api
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server**
   ```bash
   npm start
   ```
The server will run on http://localhost:3000.

## ercel Deployment

1. **Install Vercel CLI:**
  ```bash
  npm i -g vercel
  ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```
   
3. **Deploy:**
   ```bash
   vercel
   ```
   
Folder Structure
```
/
├── api/             # Backend Logic (Express)
├── lib/             # Helper Functions (Scrapers/AI)
├── public/          # Static Assets (Images, CSS, HTML)
├── vercel.json      # Vercel Configuration
└── package.json     # Dependencies
```
