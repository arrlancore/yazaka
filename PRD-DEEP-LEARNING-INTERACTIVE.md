# PRD: Deep Learning Interactive System

## Overview
An interactive AI-powered learning companion that transforms passive Islamic content consumption into active, systematic learning through contextual Socratic dialogue.

## What We've Built (Phase 1)
✅ **Learning Objectives Generation**: AI automatically extracts comprehensive learning objectives during content enhancement:
- **Conceptual objectives** (understanding core concepts)  
- **Quran verse objectives** (one per ayah mentioned in kajian)
- **Hadith objectives** (one per hadith mentioned in kajian)
- **Scholar objectives** (one per ulama reference in kajian)
- **Database storage**: `learning_objectives TEXT[]` in `catatan_hsi` table
- **Example**: HSI 09 Halaqah 05 = 12+ objectives (5 conceptual + 5 Quran + 2 hadith + scholar refs)

## Phase 2: Interactive Deep Learning

### User Flow
1. **Entry Point**: Student sees "Belajar Lebih Lanjut" button on any kajian page
2. **Deep Learning Page**: Opens `catatan-hsi/[slug]/belajar` with title "Pelajaran Mendalam: [Original Title]"
3. **Interactive Session**: AI guides student through each learning objective with adaptive questioning
4. **Session Summary**: Shows mastery evidence and recommendations

### Core Features

#### 1. Natural Adaptive Questioning (3-Step System)
For each learning objective:
- **Question 1**: Normal contextual question about the objective
- **Question 2**: If student shows lack of understanding → provide hint/guidance  
- **Question 3**: If still struggling → give explanation + check understanding

**Maximum 3 AI messages per objective** → Auto-advance to next

#### 2. Context-Aware Learning
- **Stay within kajian context**: Questions based only on what ustad explained in that specific kajian
- **No external knowledge required**: Don't ask about hadith sources, kitab pages, or details not covered
- **Contextual dalil questions**: Focus on meaning/application as explained by ustad, not academic details

#### 3. Evidence-Based Mastery Tracking
```typescript
interface ObjectiveMastery {
  objective: string;
  question_count: 1 | 2 | 3; // How many questions needed
  student_reasoning: string[]; // All student responses
  ai_feedback: string[]; // All AI responses
  mastery_level: "excellent" | "good" | "needs_review";
  completed: boolean;
}
```

#### 4. Session Management
- **Local storage only**: `deep_learning_session_[slug]`
- **Resume capability**: Can continue session later
- **Progress indicator**: "Objective 3/12"

## Technical Implementation

### New Pages & Components
```
app/catatan-hsi/[slug]/belajar/page.tsx       # Deep learning interface
components/deep-learning/
├── ChatInterface.tsx                          # Chat UI component
├── ProgressIndicator.tsx                      # Objective progress
├── SessionSummary.tsx                         # Final mastery summary
└── ObjectiveCard.tsx                          # Current objective display
```

### AI System Enhancement
New function in `lib/ai/openrouter.ts`:

```typescript
interface DeepLearningRequest {
  objectives: string[];
  kajian_content: string; // Original content for context
  current_objective: string;
  question_count: number; // 1, 2, or 3
  student_answer?: string;
}

interface DeepLearningResponse {
  question?: string;
  feedback?: string;
  explanation?: string;
  mastery_assessment: "excellent" | "good" | "needs_review";
  should_advance: boolean;
}
```

## Draft AI Prompts

### System Prompt for Deep Learning AI
```
Anda adalah tutor AI yang membantu siswa memahami kajian Islam secara mendalam melalui dialog Socratic. 

**KONTEKS KAJIAN:**
{kajian_content}

**ATURAN PEMBELAJARAN:**
1. **Tetap dalam konteks kajian** - Hanya tanyakan tentang apa yang dijelaskan ustad dalam kajian ini
2. **Jangan tanyakan detail teknis** - Hindari pertanyaan tentang sumber hadis, nomor halaman kitab, dll
3. **Fokus pada pemahaman dan penerapan** - Tanyakan makna, hikmah, dan aplikasi dalam kehidupan
4. **Gunakan bahasa yang ramah dan mendorong** - Gaya seperti ustadz yang sabar dan bijaksana

**SISTEM PERTANYAAN (3 TAHAP):**
- **Tahap 1**: Pertanyaan normal untuk mengecek pemahaman
- **Tahap 2**: Jika siswa belum paham, berikan hint/petunjuk
- **Tahap 3**: Jika masih belum paham, berikan penjelasan + pertanyaan konfirmasi

**FORMAT RESPONSE:**
{
  "question": "pertanyaan untuk siswa (jika tahap 1 atau 2)",
  "feedback": "tanggapan terhadap jawaban siswa",
  "explanation": "penjelasan lengkap (jika tahap 3)",
  "mastery_assessment": "excellent|good|needs_review",
  "should_advance": true/false
}
```

### User Prompts by Question Stage

#### **Stage 1 - Initial Question**
```
**OBJECTIVE SAAT INI:** {current_objective}
**TAHAP:** 1 (Pertanyaan Normal)

Buatlah pertanyaan yang mengecek pemahaman siswa tentang objective ini berdasarkan penjelasan dalam kajian. Gunakan gaya yang ramah dan mendorong.
```

#### **Stage 2 - Hint/Guidance**  
```
**OBJECTIVE SAAT INI:** {current_objective}
**TAHAP:** 2 (Berikan Hint)
**JAWABAN SISWA:** {student_answer}

Siswa belum menunjukkan pemahaman yang cukup. Berikan hint atau petunjuk yang membantu, lalu ajukan pertanyaan lanjutan yang lebih terarah.
```

#### **Stage 3 - Explanation**
```
**OBJECTIVE SAAT INI:** {current_objective}  
**TAHAP:** 3 (Berikan Penjelasan)
**JAWABAN SISWA:** {student_answer}

Siswa masih kesulitan. Berikan penjelasan lengkap tentang objective ini berdasarkan kajian, lalu ajukan pertanyaan sederhana untuk konfirmasi pemahaman.
```

## User Experience Flow

### Entry Experience
```
[Kajian Page] → [Belajar Lebih Lanjut Button] → [Deep Learning Page]

Page Title: "Pelajaran Mendalam: HSI 09 ~ Halaqah 05 dari 25"
AI Greeting: "Assalamualaikum! Mari kita dalami 12 tujuan pembelajaran dari kajian ini. Saya akan memandu dengan pertanyaan untuk memastikan pemahaman yang mendalam. Siap memulai?"
```

### Learning Session
```
AI: "Objective 1/12: Memahami tingkatan kedua iman kepada takdir yaitu Al-Kitabah"
AI: "Berdasarkan penjelasan ustadz, apa yang dimaksud dengan Al-Kitabah dalam konteks iman kepada takdir?"

Student: [Answer]

AI: [Feedback + next question OR hint OR explanation based on understanding level]
```

### Session Completion
```
"Alhamdulillah! Anda telah menyelesaikan 12 tujuan pembelajaran.

RINGKASAN PENGUASAAN:
✅ Excellent (8): Objective 1, 2, 4, 5, 7, 9, 11, 12
📚 Good (3): Objective 3, 6, 10  
🔄 Needs Review (1): Objective 8

REKOMENDASI:
- Ulangi objective 8 tentang QS. Al-Hajj: 70
- Lanjut ke Halaqah 06 untuk memperdalam pemahaman takdir"
```

## Technical Specifications

### Data Structure (Local Storage)
```typescript
interface DeepLearningSession {
  slug: string;
  objectives: ObjectiveMastery[];
  session_start: string;
  session_end?: string;
  total_objectives: number;
  completed_objectives: number;
}
```

### Performance Considerations
- **Session state** persisted in localStorage
- **Responsive design** for mobile learning
- **Offline capability** for stored sessions
- **Fast AI responses** using Gemini Flash for real-time interaction

## Success Metrics
- **Engagement**: % students who click "Belajar Lebih Lanjut"
- **Completion**: % students who finish all objectives  
- **Mastery distribution**: excellent/good/needs_review ratios
- **Session duration**: Average time per objective

This creates a **simple but powerful** learning experience that's contextual, adaptive, and evidence-based! 🎯