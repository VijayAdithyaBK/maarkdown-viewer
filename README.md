<div align="center">

# ✨ Maarkdown Viewer

**A beautiful, modern markdown editor and viewer built for distraction-free writing.**

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen?style=for-the-badge)](https://vijayadithyabk.github.io/maarkdown-viewer/)
[![Built with React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)

[Live Demo](https://vijayadithyabk.github.io/maarkdown-viewer/) • [Report Bug](../../issues) • [Request Feature](../../issues)

</div>

---

## 🎯 What is this?

Maarkdown Viewer is a sleek, browser-based markdown editor that lets you write, preview, and export your documents with style. No installations, no sign-ups – just open and start writing!

## 🆕 What's New in V2

> **11 files changed, 1195 additions, 784 deletions**

- **🎨 Redesigned Settings Panel** — MS Word-style controls with dropdowns
- **🎯 Preview-Only Themes** — Theme changes now only affect the preview pane
- **🖥️ Fullscreen Improvements** — Settings accessible in fullscreen mode
- **🏠 New Homepage** — Modern landing page with feature cards
- **📄 PDF Conversion** — Enhanced document conversion workflow
- **🧹 Cleaner Codebase** — Removed blue light filter, simplified theme logic

## ✨ Features

- **📝 Live Editor** — Write markdown with instant preview
- **🔀 Split View** — See your markdown and preview side-by-side  
- **🎨 Reading Themes** — White, Dark, and Cream backgrounds for comfortable reading
- **📖 Typography Controls** — Customize font style, size, weight, line height, and spacing
- **📤 Export Options** — Download as TXT, DOC, or PDF
- **📁 File Upload** — Import existing `.md` files
- **🖥️ Fullscreen Mode** — Distraction-free writing experience
- **💾 Auto-Save** — Your preferences are saved locally

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/vijayadithyabk/maarkdown-viewer.git

# Navigate to project
cd maarkdown-viewer

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:8080](http://localhost:8080) and start writing! 🎉

## 🛠️ Tech Stack

| Technology         | Purpose            |
| ------------------ | ------------------ |
| **React 18**       | UI Framework       |
| **TypeScript**     | Type Safety        |
| **Vite**           | Build Tool         |
| **Tailwind CSS**   | Styling            |
| **shadcn/ui**      | Component Library  |
| **react-markdown** | Markdown Rendering |
| **jsPDF**          | PDF Export         |

## 📁 Project Structure

```
src/
├── components/
│   ├── MarkdownViewer.tsx   # Main editor component
│   ├── ControlPanel.tsx     # Reading preferences UI
│   └── ThemeProvider.tsx    # Theme context
├── pages/
│   ├── Home.tsx             # Landing page
│   └── Index.tsx            # Main app wrapper
└── lib/
    └── utils.ts             # Utility functions
```

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">

**⭐ If you find this project interesting, please consider giving it a star! ⭐**

</div>

<p align="center">
  <i>⚡ Crafted by Vijay Adithya B K</i>
</p>
