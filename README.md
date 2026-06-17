# 🌟 ATTARIK — The Art of Scent

Welcome to the official repository for **ATTARIK**, a premium luxury fragrance house website. This application features a stunning monochrome black & white theme, interactive UI elements, a custom scent-finding quiz, and a secure backend service to manage customer inquiries.

Live URL (default): **[https://attarik-website.onrender.com](https://attarik-website.onrender.com)** *(Note: Your exact URL is visible in your Render Dashboard and might have a custom suffix depending on name availability.)*

---

## ✨ Features

### 🎨 Premium UI & Visuals
* **Monochrome Luxury Theme**: Sophisticated black & white minimalism designed to reflect high-end luxury fashion and scent brands (Byredo, Le Labo, Tom Ford).
* **Interactive Mouse Glow**: A modern, smooth radial light glow that follows the user's cursor on desktop.
* **Canvas Gold/Silver Particles**: Subtle, slow-floating ambient particles in the background of the landing section.
* **Scroll-Triggered Reveals**: Dynamic scroll animation states using vanilla CSS and JavaScript (Intersection Observer API).
* **Review Slider**: Responsive Customer reviews card carousel with touch gestures support, automated shifting, and dot controls.

### 🧪 Signature Scent Finder Quiz
* An interactive 3-step personality and preference quiz (Mood → Occasion → Scent Family).
* Calculates and recommends the ideal client product, complete with notes descriptions and direct **"Order on WhatsApp"** links with pre-filled order text.

### 📱 Product Lineup Integrated
* Features the brand's actual product catalogue and imagery:
  1. **Ni8t Moon (30ml EDP)** — A refreshing lavender, night jasmine, and amber blend.
  2. **Love With You (10ml EDP)** — A sparkling citrus, rose, and white musk symphony.
  3. **Coffee Car Perfume (10ml hanging pod)** — Roasted coffee beans, cream, and warm hazelnut.
  4. **Aqua Car Perfume (10ml hanging pod)** — Cool mint, fresh sea breeze, and cedarwood.
* Primary lifestyle graphics featuring real branding assets (`model-spray.png`).

---

## 🛠️ Tech Stack

* **Frontend**: HTML5, Vanilla CSS3 (Custom properties design system), Modern ES6+ JavaScript.
* **Backend**: Node.js, Express.js.
* **Datastore**: Secure local JSON-based file storage (forces light, fast, serverless database setup).
* **Deployment**: Render Web Services (configured via Blueprint `render.yaml`).

---

## 🚀 Quick Start (Local Setup)

### Prerequisites
* [Node.js](https://nodejs.org/) installed on your machine.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/devanshudhoble/attarik.in-.git
   cd attarik.in-
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   npm start
   ```

4. View the website locally at:
   👉 **`http://localhost:3000`**

---

## ☁️ Deployment on Render

This project includes a Render Blueprint configuration (`render.yaml`). To deploy:

1. Log in to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** and select **Blueprint**.
3. Link your GitHub repository `devanshudhoble/attarik.in-`.
4. Click **Apply**. Render will automatically configure and build the Node web service for you.

---

## 🔒 API & Admin Documentation

The backend includes endpoints to submit and view contact forms and newsletter signups:

### Public Endpoints
* **Health Check**: `GET /api/health`
* **Contact Submission**: `POST /api/contact` (JSON body: `name`, `email`, `phone`, `subject`, `message`)
* **Newsletter Subscription**: `POST /api/newsletter` (JSON body: `email`)

### Secure Admin Endpoints (Query Key Authorized)
You can view form submissions directly in your browser:
* **Contact Forms List**: `https://<your-render-url>/api/admin/contacts?key=attarik2024`
* **Subscribers List**: `https://<your-render-url>/api/admin/subscribers?key=attarik2024`

---

## 📁 Project Structure

```
attarik-website/
├── public/
│   ├── index.html        # Main HTML layout
│   ├── css/
│   │   └── style.css     # Design tokens and custom B&W styles
│   ├── js/
│   │   └── main.js       # Interactivity, Quiz, & slider scripts
│   └── images/           # Client product images & backgrounds
├── data/
│   ├── contacts.json     # Saved contact inquiries
│   └── newsletter.json   # Saved newsletter subscribers
├── server.js             # Node/Express API Server
├── render.yaml           # Render Blueprint configuration
├── package.json          # Node configuration & scripts
└── README.md             # Project documentation
```

---

## 📞 Brand Contact & Socials

* **Phone / WhatsApp**: +91 8787088432
* **Instagram**: [@attarik.in](https://www.instagram.com/attarik.in)
