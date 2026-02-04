# 📊 Frutería Dashboard 🍎🍌

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue?logo=react" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" />
  <img src="https://img.shields.io/badge/Vite-Fast-purple?logo=vite" />
  <img src="https://img.shields.io/badge/Ant%20Design-UI-blue?logo=antdesign" />
  <img src="https://img.shields.io/badge/json--server-Fake%20API-orange" />
</p>

<p align="center">
  <img src="https://img.shields.io/github/repo-size/JAREDhrndz/examen-ux-fruteria" />
  <img src="https://img.shields.io/github/last-commit/JAREDhrndz/examen-ux-fruteria" />
  <img src="https://img.shields.io/github/license/JAREDhrndz/examen-ux-fruteria" />
</p>

---

## 🧾 Descripción

**Frutería Dashboard** es un proyecto de gestión básica para una frutería, con control de productos, registro de entradas y salidas, y visualización de stock.

Incluye un frontend en **React + Vite** y un backend simulado con **json-server**.

---

## 📦 Requisitos

- Node.js v18 o superior  
- npm (incluido con Node.js)  
- Git (opcional)

---

## 🚀 Instalación

```bash
git clone https://github.com/JAREDhrndz/examen-ux-fruteria.git
cd examen-ux-fruteria
```

```bash
cd fruteria-dashboard
npm install
```

---

## ▶️ Cómo correr el proyecto

### 1️⃣ Backend (json-server)

Desde la raíz del proyecto:

```bash
npx json-server --watch db.json --port 3001
```

API disponible en:

```
http://localhost:3001
```

---

### 2️⃣ Frontend

En otra terminal:

```bash
cd fruteria-dashboard
npm run dev
```

Aplicación disponible en:

```
http://localhost:5173
```

---

## ⚠️ Notas importantes

- El backend debe estar corriendo para que el dashboard funcione correctamente.
- El archivo `db.json` contiene los datos de productos, entradas y salidas.
- El proyecto fue desarrollado como una prueba técnica enfocada en funcionalidad y estructura.

---

## 🛠️ Tecnologías utilizadas

| Tecnología | Uso |
|------------|-----|
| React | Frontend |
| TypeScript | Tipado |
| Vite | Build y desarrollo |
| Ant Design | Interfaz |
| json-server | API simulada |

---

## 📁 Estructura del proyecto

```text
examen-ux-fruteria/
├── db.json
├── fruteria-dashboard/
│   ├── src/
│   ├── public/
│   └── package.json
└── README.md
```

---

## ✨ Autor

Jared Hernández
