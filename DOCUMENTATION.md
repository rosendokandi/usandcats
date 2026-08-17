# 📖 Project Technical Documentation & Architecture Manual

## 1. Executive Summary
- **Project Name**: Us & Cats (我们的像素甜蜜空间)
- **Source Stitch Project ID**: `8346850299510640107`
- **Core Technology Stack**: React 18.3, Vite 6.0, TypeScript 5.7, Tailwind CSS 3.4
- **Audio & Visual Engines**: Web Audio API (Realtime Synthesizer), Canvas Confetti, Google Material Symbols, Google Fonts (`Space Mono`, `Be Vietnam Pro`, `Press Start 2P`).

---

## 2. Architecture & Design Patterns

### 2.1 State Flow & Storage Model
The application uses React's Context API (`AppContext.tsx`) as a single source of truth, backed by browser `LocalStorage`:
- **`us_cats_settings`**: Stores anniversary date, partner names, cat name, avatar URL, sound toggle, and dark mode status.
- **`us_cats_milestones`**: Stores romance journey timeline nodes, likes, and dates.
- **`us_cats_memories`**: Stores polaroid gallery photos, aspect ratios, tape angles, captions, and categories.
- **`us_cats_notes`**: Stores sticky guestbook messages, pinned status, moods, colors, and authors.

### 2.2 8-Bit Audio Synthesis System (`src/utils/sound.ts`)
Instead of loading heavyweight mp3/wav audio files, all sound effects are generated algorithmically on-the-fly using browser native `AudioContext`:
- **`playClick()`**: Square wave frequency shift (440Hz -> 880Hz, 50ms decay).
- **`playHeart()`**: Triangle wave arpeggio (C5 -> E5 -> G5 -> C6).
- **`playMeow()`**: Sine wave pitch bend (400Hz -> 750Hz -> 550Hz with linear gain envelope).
- **`playSuccess()`**: 4-note celebratory chime.

### 2.3 Visual Design System Tokens
- **Pixel Shadows**: `4px 4px 0px #574144`
- **Pixel Borders**: `4px solid #574144` (Normal) / `2px solid #574144` (Small)
- **Stepped Photo Border**: Dual-layer offset box-shadows emulating CRT pixel scaling.
- **Palette**:
  - `primary`: `#70585b`
  - `primary-container`: `#fadadd` (Peach Pink)
  - `tertiary-container`: `#d6e6d7` (Matcha Mint)
  - `secondary-container`: `#e1e1f5` (Lavender Mist)
  - `pixel-outline`: `#574144` (Warm Charcoal Border)

---

## 3. Status Matrix: What is Done vs. What is Next

| Feature / Domain | Status in v1.0.0 | Description | Next Phase (v1.1 ~ v2.0) |
| :--- | :--- | :--- | :--- |
| **Home Space** | ✅ Completed | Hero Polaroid, Stepped Frame, Animated Days counter, Interactive Cat, Quick Stats | Add weather widget & daily couple horoscope |
| **Story Timeline** | ✅ Completed | Milestone cards, category filters, Likes, Add Milestone modal | Add milestone search & year slider |
| **Memory Gallery** | ✅ Completed | Polaroid cards, Masonry layout, Lightbox, Add Memory modal | Add local image file upload + Base64 auto compression |
| **Love Notes Board** | ✅ Completed | 4-color sticky notes, 6 moods, Pinned notes, Likes, Delete, Add Note form | Real-time push notifications between devices |
| **8-Bit Sound Engine** | ✅ Completed | Zero-asset Web Audio synth for clicks, meows, hearts | Add 8-bit Lofi BGM background music player |
| **Theme & Settings** | ✅ Completed | Dark/Light mode, Custom anniversary, Custom names, 4 avatars | Export/Import JSON backup files |
| **Data Synchronization** | ⚠️ Local Only | LocalStorage persistence | Supabase / Firebase cloud backend integration |

---

## 4. Changelog

### Version 1.0.0 (2026-08-17)
- Initial production-ready implementation from Stitch prototype `8346850299510640107`.
- Implemented full responsiveness for Desktop, Tablet, and Mobile viewports.
- Integrated Web Audio synthesis and Canvas Confetti particle systems.
- Zero compile-time warnings, 100% strict TypeScript compliance.
