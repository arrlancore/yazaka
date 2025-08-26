# Product Requirements Document: Catatan HSI MVP

## 1. Product Overview

**Product Name:** Catatan HSI (Catatan Kajian Study Notes)

**Vision:** Create a focused learning platform that synchronizes audio lectures with text transcripts for immersive Islamic study experiences.

**MVP Goal:** Deliver core audio-text synchronization functionality with minimal viable features for launch.

## 2. Problem Statement

Islamic learners need a way to follow along with audio lectures while reading synchronized text to improve comprehension and retention. Current solutions lack real-time synchronization between spoken content and written materials.

## 3. MVP Scope

### 3.1 Core Features (Must Have)
- ✅ Audio playback with basic controls (play/pause/seek)
- ✅ Real-time text highlighting synchronized with audio
- ✅ Click-to-jump functionality on text segments
- ✅ Single catatan (study note) page layout
- ✅ Basic catatan listing page

Just for example/reference, demo available at: components/demo/audio-text-sync.tsx

### 3.2 Excluded from MVP
- ❌ User accounts/authentication
- ❌ Bookmarking system
- ❌ Speed controls
- ❌ Progress tracking
- ❌ Search functionality
- ❌ Categories/filtering
- ❌ Comments/discussions
- ❌ Mobile app

## 4. User Stories

### Primary User: Islamic Student
1. **As a student**, I want to play an audio lecture so I can listen to the ustad's teaching
2. **As a student**, I want to see highlighted text that matches what's being spoken so I can follow along easily
3. **As a student**, I want to click on any text segment to jump to that part of the audio so I can review specific sections
4. **As a student**, I want to browse available study notes so I can choose what to study

## 5. Technical Requirements

### 5.1 Content Structure

**MDX Frontmatter (Actual):**
```yaml
---
title: "HSI 09 ~ Halaqah 01 dari 25"
ustad: "Abdullah Roi"
publishedAt: "2024-01-15"
summary: "Halaqah pertama dari silsilah ilmiah beriman dengan takdir Allah tentang pengertian Al-Qada' dan Al-Qadar"
audioSrc: "HSI 09 ~ Halaqah 01 dari 25.mp3"
transcriptionSrc: "transcription.text"
duration: 229
location: "Kota Almadina"
series: "HSI 09"
episode: 1
totalEpisodes: 25
tags: ["akidah", "takdir", "qada", "qadar"]
level: "menengah"
source: "https://edu.hsi.id"
---
```

**Transcription Format (Text-based with timestamps):**
```text
(0:02) Assalamualaikum warahmatullahi wabarakatuh
(0:06) Alhamdulillah, wassalatu wassalamu ala rasulillah
(0:10) wa ala alihi wa sahbihi ajama'in
(0:14) Halaqah yang pertama dari silsilah ilmiah
(0:17) beriman dengan takdir Allah
(0:20) adalah tentang pengertian Al-Qada' dan Al-Qadar
```

### 5.2 Core Components

1. **AudioPlayer Component**
   - HTML5 audio element
   - Play/pause button
   - Progress bar with seek functionality
   - Current time display

2. **SynchronizedContent Component**
   - Parses text-based transcription format `(mm:ss) text content`
   - Renders transcription text with clickable segments
   - Highlights active segment based on audio time
   - Handles click-to-seek functionality

3. **CatatanPage Component**
   - Combines AudioPlayer and SynchronizedContent
   - Manages audio state and time synchronization
   - Displays source citation at bottom (from frontmatter `source` field)

### 5.3 File Structure (Actual)

```
app/catatan-hsi/
├── page.tsx                           # Listing page
└── [slug]/page.tsx                   # Individual catatan page

content/catatan-hsi/                  # Content directories
├── hsi-09-halaqah-01/
│   ├── index.mdx                     # Content file
│   └── transcription.text            # Timestamped transcription
├── hsi-09-halaqah-02/
│   ├── index.mdx
│   └── transcription.text
└── ...

public/audio/                         # Audio files (root level)
├── HSI 09 ~ Halaqah 01 dari 25.mp3
├── HSI 09 ~ Halaqah 02 dari 25.mp3
└── ...

components/catatan-hsi/
├── AudioPlayer.tsx
├── SynchronizedContent.tsx
└── CatatanCard.tsx
```

## 6. User Interface

### 6.1 Catatan Page Layout
```
[Header/Navigation]

[Audio Player - Fixed at top]
[Play] [||||||||||||||||    ] [0:45 / 47:30]

[Content Area]
Highlighted text segment appears here as audio plays.
User can click any text to jump to that audio timestamp.

[Source Citation]
Source: https://edu.hsi.id

[Footer]
```

### 6.2 Design Principles
- **Minimal Distraction**: Clean, focused layout
- **Clear Highlighting**: Obvious visual indication of active text
- **Easy Navigation**: Simple audio controls
- **Mobile Responsive**: Works on all devices

## 7. Success Metrics

### 7.1 Technical Metrics
- Page load time < 3 seconds
- Audio sync accuracy within 100ms
- Zero broken audio/transcription files

### 7.2 User Engagement
- Average session duration > 10 minutes
- Click-to-seek usage > 20% of sessions
- Zero critical bugs reported

## 8. Implementation Plan

### Phase 1: Foundation (1 week)
- [ ] Setup basic file structure
- [ ] Create AudioPlayer component
- [ ] Implement basic audio controls

### Phase 2: Synchronization (1 week)
- [ ] Build SynchronizedContent component
- [ ] Implement text highlighting logic
- [ ] Add click-to-seek functionality

### Phase 3: Integration (1 week)
- [ ] Create catatan page layout
- [ ] Build listing page
- [ ] Test with sample content

### Phase 4: Polish (1 week)
- [ ] Responsive design
- [ ] Performance optimization
- [ ] Bug fixes and testing

## 9. Content Requirements

### 9.1 Initial Content (Available)
- HSI 09 series (Islamic study sessions)
- Each halaqah approximately 3-4 minutes long
- Topics: Islamic teachings by Abdullah Roi from Kota Almadina
- Format: "HSI 09 ~ Halaqah [XX] dari 25"

### 9.2 Existing Content Structure
1. Audio files: `HSI 09 ~ Halaqah 01 dari 25.mp3` (in `/public/audio/`)
2. Transcription: `transcription.text` format with `(mm:ss) text content`
3. MDX content: `index.mdx` in content directory
4. Each halaqah is self-contained with complete audio-text sync

## 10. Launch Criteria

### Must Have
- [ ] All core components functional
- [ ] At least 3 complete catatan available
- [ ] Mobile responsive design
- [ ] Audio sync accuracy tested

### Nice to Have
- [ ] Loading states
- [ ] Error handling for missing files
- [ ] Basic analytics tracking

## 11. Post-MVP Roadmap

**Phase 2 Features:**
- User bookmarking
- Speed controls (0.75x, 1x, 1.25x, 1.5x)
- Progress tracking
- Search functionality

**Phase 3 Features:**
- Categories and filtering
- User accounts
- Comments/discussions
- Mobile app consideration

---

**Document Version:** 1.0  
**Last Updated:** 2025-08-26  
**Owner:** Development Team