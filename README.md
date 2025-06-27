# QnA App (Azure AI Quiz)

A modern, responsive quiz application for Azure AI-102 and related modules, built with Next.js 15.

---

## Features

- **Multiple modules**: Select from different quiz modules (JSON files) via a dropdown.
- **Unit-wise questions**: Each module can have multiple units, each with its own set of questions.
- **Single/Multiple choice**: Supports both single and multiple answer questions.
- **Instant feedback**: Check your answer and see explanations immediately.
- **Score tracking**: See your score for each unit.
- **Responsive UI**: Works great on desktop and mobile, with a sidebar that becomes a hamburger menu on small screens.
- **Easy extensibility**: Add new modules or units by dropping in new JSON files.

---

## Getting Started

### 1. Clone the repository

```sh
git clone https://github.com/jyotiprakash-m/qna_app.git
cd qna_app
```

### 2. Install dependencies

```sh
npm install
```

### 3. Run locally (Next.js)

```sh
npm start
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Adding/Editing Quiz Modules

- Place your quiz JSON files in the `/public` directory.
- Each JSON file should follow this structure:

```json
{
  "units": [
    {

```
