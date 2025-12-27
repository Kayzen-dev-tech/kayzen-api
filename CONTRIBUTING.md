# 👋 Contributing to Kayzen API

![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.svg?v=103)

[← Back to Main README](README.md)

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to **Kayzen API**. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 📜 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Coding Standards](#coding-standards)
- [Submission Guidelines](#submission-guidelines)

---

## 🤝 Code of Conduct

This project and everyone participating in it is governed by the [Kayzen API Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

---

## 🚀 Getting Started

1.  **Fork the repository** on GitHub.
2.  **Clone the project** to your own machine.
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Run the development server**:
    ```bash
    npm run dev
    ```
    (See [INSTALLATION.md](INSTALLATION.md) for full setup details).

---

## 🎨 Coding Standards

To maintain the quality and consistency of this project, please adhere to the following rules:

### 1. Clean Code Policy (Strict) ⚠️
This project follows a strict **No Comments** policy for the source code to ensure cleanliness and readability through logic, not text.
* ❌ **Do NOT** use `//` or `/* */` inside `api/` or `lib/` files.
* ✅ **DO** write self-explanatory variable and function names.
* ✅ **DO** use the Documentation files (`docs.html` or Markdown) to explain complex logic, not the code itself.

### 2. File Structure
* **Logic:** Put scraper/AI logic in `lib/`.
* **Routes:** Put Express routes in `api/`.
* **Assets:** Put images/CSS in `public/`.

---

## 📝 Submission Guidelines

### How to Submit a Pull Request (PR)

1.  **Fork & Clone**
    Ensure you have the latest version of the main branch.

2.  **Create a Branch**
    Create a new branch for your feature or fix. Use a clear naming convention:
    ```bash
    # For new features
    git checkout -b feature/amazing-new-scraper

    # For bug fixes
    git checkout -b fix/youtube-download-error
    ```

3.  **Make Your Changes**
    Write your code following the [Coding Standards](#coding-standards) above.

4.  **Commit Your Changes**
    Use clear, descriptive commit messages.
    ```bash
    git commit -m "feat: add instagram downloader support"
    ```

5.  **Push to GitHub**
    ```bash
    git push origin feature/amazing-new-scraper
    ```

6.  **Open a Pull Request**
    * Go to the original repository.
    * Click "New Pull Request".
    * Select your branch.
    * Describe your changes clearly in the description box.

### After Submission
* We will review your PR as soon as possible.
* We might ask for changes or improvements.
* Once approved, your code will be merged into the `main` branch.

---

Thank you for being part of this project! 🚀

**Kayzen Izumi**
