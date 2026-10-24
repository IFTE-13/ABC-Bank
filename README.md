# ABC Bank — Minimalist Banking App

A simple, distraction-free web banking application built with pure HTML, CSS, and Vanilla JavaScript. Designed with clean typographic hierarchy and purposeful layout, avoiding bloated UI frameworks and visual clutter.

[![GitHub Repo](https://img.shields.io/badge/GitHub-ABC--Bank-18181b?logo=github)](https://github.com/IFTE-13/ABC-Bank)

---

## ✨ Features

- **Simple Authentication**: Clean, fast login screen with prefilled demo credentials and quick sign-out.
- **Side-by-Side Dashboard Layout**: Form controls and transaction feed sit side-by-side, eliminating whole-page scrolling on desktop viewports.
- **Visual Debit Card**: Minimalist platinum card preview displaying cardholder name, masked account number, chip, and expiration date.
- **Deposit & Withdrawal Engine**:
  - Segmented toggle between Deposit and Withdraw.
  - Quick-amount presets (`+$20`, `+$50`, `+$100`, `+$500`) for one-tap entry.
  - Input validation guarding against overdrafts and invalid values.
- **Recent Activity Log**: Chronological transaction history with timestamps, custom notes, and a 1-click **Clear log** button.
- **Data Persistence**: Automatically stores account balance, inflow/outflow metrics, and transaction history in browser `localStorage`.
- **Pure Vanilla Stack**: Zero external dependencies—no Bootstrap, no jQuery, no framework overhead.
- **Adaptive Dark Mode**: Seamless support for both light and dark system color schemes.

---

## 📁 Project Structure

```text
Bank App/
├── index.html   # Semantic HTML5 layout (Login screen + Side-by-side dashboard)
├── style.css    # Clean, minimalist design system with CSS custom properties
├── app.js       # Pure vanilla JavaScript for state management & transactions
└── README.md    # Project documentation
```

---

## 🚀 Getting Started

No build tools or package installations are required.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/IFTE-13/ABC-Bank.git
   ```
2. **Open the app:**
   - Double-click `index.html` to open directly in any modern browser, or
   - Serve using any lightweight server (e.g., Live Server, `npx serve`, or `python -m http.server`).

---

## 🔗 Repository

- **GitHub**: [https://github.com/IFTE-13/ABC-Bank](https://github.com/IFTE-13/ABC-Bank)
