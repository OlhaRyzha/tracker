# Music Tracks Manager

A single-page React application for managing music tracks: create, edit, delete, search, filter, paginate, and upload audio files.

---

## Features

1. **Create Track (metadata only)**

   - Modal form (Formik + Yup) with client-side validation
   - Fields: title, artist, album, genres (multi-select tags), cover image URL (with URL format validation & default placeholder)

2. **Edit Track**

   - Same modal form, pre-filled with existing data
   - Optimistic UI updates via React-Query

3. **Delete Track**

   - Per-item delete with confirmation dialog
   - Bulk delete via “select mode”

4. **List View**

   - Server-side pagination, sorting, and filtering
   - Filter by artist and genre
   - Debounced search (title, artist, album)
   - Loading indicators

5. **Upload Audio**

   - Separate “Upload Audio” modal
   - File type (MP3, WAV) & size validation
   - Replace or remove existing audio
   - Inline HTML5 `<audio>` player + waveform visualization (WaveSurfer.js)

6. **Extras**
   - Redux slice to persist table state (page, filters, search)
   - Toast notifications (Radix UI + custom variants)
   - “Select Mode” toggle for bulk operations

---

## Tech Stack

- **Framework**: React (Vite)
- **State & Data**: React-Query, Redux Toolkit
- **Form Validation**: Formik + Yup
- **UI Components**: shadcn/ui, Radix UI primitives
- **Audio**: HTML5 `<audio>`, WaveSurfer.js
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Tooling**: TypeScript, ESLint, Prettier

---

## Extra Tasks

1. **Bulk Delete Functionality**

   - “Select Mode” toggle allows entering selection mode (data-testid="select-mode-toggle")
   - Checkbox per track (`data-testid="track-checkbox-{id}"`) and “Select All” (`data-testid="select-all"`)
   - “Delete Selected” button (`data-testid="bulk-delete-button"`) to remove multiple tracks in one action

2. **Optimistic UI Updates**

   - All create, edit, delete and bulk-delete mutations update the list immediately
   - On‐error rollback restores previous state
   - Toast notifications confirm success or report errors without waiting for round-trip latency

3. **Audio Waveform Visualization**
   - WaveSurfer.js integration renders a live waveform for any uploaded audio
   - Inline “Play / Pause” control under each waveform (`data-testid="play-button-{id}"` / `data-testid="pause-button-{id}"`)
   - Smooth user feedback while the track is playing, with progress visuals
