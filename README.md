# 🧾 Job Tracker

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge&logo=vercel)](https://job-tracker-one-bay.vercel.app)

A modern full-stack **Job Tracking** application built with **React**, **Redux Toolkit**, **MUI**, **Webpack**, and **Docker**.  
It enables:

- 🧑‍💻 **Candidates** to apply for jobs
- 🧑‍💼 **Recruiters** to manage job listings and applications

---

## ✨ Features

### 👤 Candidate Panel
- ✅ Browse all available jobs
- ✅ Apply with resume and cover letter
- ✅ Track application statuses (APPLIED, INTERVIEW, OFFER, REJECTED)

### 🧑‍💼 Recruiter Panel
- ✅ Post new job listings
- ✅ View applications per job
- ✅ Filter and update application statuses

---


## 📁 Folder Structure

```
job-tracker/
├── dist/                   # Production build output (auto-generated)
├── node_modules/           # Installed dependencies
├── public/
│   └── index.html          # HTML template
├── src/
│   ├── api/                # Axios service handlers
│   ├── components/         # Reusable UI components
│   ├── pages/              # View-level pages (Dashboard, Jobs, etc.)
│   ├── routes/             # React Router definitions
│   ├── store/              # Redux store setup and slices
│   ├── styles/             # Global/utility styles
│   ├── utils/              # Helper functions/utilities
│   ├── App.css             # Global CSS
│   ├── App.jsx             # Root App component
│   ├── config.js           # Runtime config (API base URL, etc.)
│   └── index.js            # Main React entry point
├── .babelrc                # Babel transpilation config
├── .dockerignore           # Docker ignore rules
├── .env                    # Environment variables
├── .gitignore              # Git ignore rules
├── Dockerfile              # Docker container configuration
├── package.json            # Project metadata and dependencies
├── package-lock.json       # Dependency lockfile
├── README.md               # Project documentation
├── vercel.json             # Vercel deployment config
└── webpack.config.mjs      # Custom Webpack build config
```


---

## ⚙️ Tech Stack

| Category     | Tech Stack                            |
|--------------|---------------------------------------|
| Frontend     | React, React Router DOM, MUI          |
| State Mgmt   | Redux Toolkit                         |
| Styling      | Emotion, CSS                          |
| Build Tool   | Webpack + Babel                       |
| Deployment   | Docker + NGINX, Vercel                |

---

## Local Development Setup

### 1. Clone the Repo

```
git clone https://github.com/pinkeshroy/job-tracker

cd job-tracker
```
### 2.Create .env
```
REACT_APP_API_BASE_URL=http://localhost:5001
NODE_ENV=develpoment

```
### 3. Install Dependencies
```
npm install
```

### 4. Start Dev Server
```
npm start
```

### 5. Build for Production
```
npm run build
```

## Docker Support
Build & Run

```
docker build -t job-tracker .
docker run -p 80:80 job-tracker

```


## Deployment
You can deploy this app on:

[✔️ Vercel (Live Demo)](https://job-tracker-one-bay.vercel.app)

- Netlify

- Dockerized NGINX (for any cloud platform)

---

## 👥 License & Author

**📄 License:**  
This project is licensed under the **ISC License** — feel free to use, modify, and distribute it as needed.

**🧑‍💻 Author:**  
Crafted with ❤️ by [@pinkeshroy](https://github.com/pinkeshroy)

> If you find this project helpful, give it a ⭐️ on GitHub and feel free to contribute or report issues!
