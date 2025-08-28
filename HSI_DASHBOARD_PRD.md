# Bekhair Admin Dashboard - Product Requirements Document

## 1. Overview

**Product Name**: Bekhair Content Management Dashboard  
**Purpose**: General-purpose content management system for Islamic educational content, starting with HSI (Himpunan Santri Indonesia) episodes and expandable to other content types.

## 2. Problem Statement

Current HSI content creation workflow is manual and time-consuming:
- Manual transcription processing
- Manual formatting and grammar correction  
- Manual GitHub commits and deployments
- Multiple deployment cycles required

## 3. Solution

A simple dashboard that automates processes 4-8 of the HSI workflow while keeping processes 1-3 manual.

## 4. Tech Stack

- **Frontend**: Next.js (existing Bekhair app)
- **Database**: Supabase (PostgreSQL + Auth + Real-time)
- **AI Processing**: OpenRouter + Gemini API
- **Code Repository**: GitHub API
- **Styling**: Tailwind CSS + shadcn/ui (consistent with existing app)

## 5. Core Features

### 5.1 Authentication
- Simple login/logout using Supabase Auth
- Basic user management (admin only)

### 5.2 Transcription Input (Process 4)
- Text area for manual transcription input
- Save as draft functionality
- Basic validation

### 5.3 AI Enhancement (Process 5)
- Combine transcriptions from two sources
- Enhance accuracy using Gemini API via OpenRouter
- Show before/after comparison
- Manual review and edit capability

### 5.4 Content Formatting (Process 6)
- Auto-format transcription into MDX article
- Grammar and defect correction
- Generate proper frontmatter (title, date, author, etc.)
- Preview functionality

### 5.5 GitHub Integration (Processes 7 & 8)
- Auto-commit to GitHub repository
- Create pull requests
- Deploy trigger
- Status tracking

## 6. User Flow

### 6.1 Complete Navigation Flow
```
1. Login → Admin Dashboard
2. Dashboard → Catatan HSI Section
3. Catatan HSI → Episode List (with Create button)
4. Click "Create New Episode"
5. Episode Creation Workflow:
   - Input transcription text (from steps 1-4)
   - Click "Enhance Transcription" (AI combine & enhance)
   - Review enhanced transcription
   - Click "Generate Article" (format to MDX)
   - Preview article with audio upload
   - Click "Publish" (GitHub commit)
   - Deployment tracking
```

### 6.2 Dashboard Structure
```
Bekhair Admin Dashboard
├── Overview (stats, analytics)
├── Content Management
│   ├── Catatan HSI
│   │   ├── Episode List
│   │   ├── Create New Episode
│   │   └── Drafts
│   ├── Blog Posts
│   │   ├── Article List
│   │   ├── Create Article
│   │   └── Drafts
│   ├── Quran Content
│   └── Prayer Time Content
├── Media Management
│   ├── Audio Files
│   ├── Images
│   └── Documents
├── User Management
│   ├── Authors
│   └── Permissions
└── Settings
    ├── API Keys
    ├── GitHub Config
    └── Content Types
```

## 7. Database Schema

### 7.1 Content Types Table
```sql
- id (uuid, primary key)
- name (text) -- 'catatan-hsi', 'blog-post', 'quran-content'
- display_name (text) -- 'Catatan HSI', 'Blog Post'
- workflow_config (jsonb) -- AI processing, file paths, etc.
- created_at (timestamp)
```

### 7.2 Content Items Table
```sql
- id (uuid, primary key)
- content_type_id (uuid, foreign key)
- title (text)
- slug (text)
- raw_content (text)
- enhanced_content (text, nullable)
- final_content (text, nullable)
- metadata (jsonb) -- episode number, author, tags, etc.
- status (enum: draft, enhanced, formatted, published)
- github_commit_sha (text, nullable)
- file_paths (jsonb) -- index.md, transcription.txt, audio files
- created_at (timestamp)
- updated_at (timestamp)
- user_id (uuid, foreign key)
```

### 7.3 Processing Logs Table
```sql
- id (uuid, primary key)
- content_item_id (uuid, foreign key)
- process_type (enum: ai_enhance, format_content, github_commit, media_upload)
- status (enum: pending, success, error)
- response_data (jsonb)
- error_message (text, nullable)
- created_at (timestamp)
```

### 7.4 Media Files Table
```sql
- id (uuid, primary key)
- content_item_id (uuid, foreign key)
- file_name (text)
- file_path (text)
- file_type (enum: audio, image, document)
- file_size (bigint)
- upload_status (enum: pending, uploaded, error)
- created_at (timestamp)
```

## 8. API Endpoints

### 8.1 Projects API
- `POST /api/projects` - Create new project
- `GET /api/projects` - List all projects
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### 8.2 Processing API
- `POST /api/process/enhance/:id` - AI enhance transcription
- `POST /api/process/format/:id` - Format to MDX
- `POST /api/process/publish/:id` - Publish to GitHub

## 9. UI Components

### 9.1 Dashboard Layout
- Sidebar navigation
- Main content area
- Status indicators

### 9.2 Project List
- Table with project status
- Quick actions (edit, delete, publish)
- Search and filter

### 9.3 Project Editor
- Tabbed interface (Raw, Enhanced, MDX, Preview)
- Action buttons for each process step
- Progress indicators

### 9.4 GitHub Integration
- Repository selector
- Branch selector
- Commit message editor
- Deployment status

## 10. Configuration

### 10.1 Environment Variables
```
SUPABASE_URL=
SUPABASE_ANON_KEY=
OPENROUTER_API_KEY=
GITHUB_TOKEN=
GITHUB_REPO_OWNER=
GITHUB_REPO_NAME=
```

### 10.2 AI Model Settings
- Model: Gemini (via OpenRouter)
- Temperature: 0.3
- Max tokens: 4000

## 11. Success Metrics

- **Time Reduction**: Reduce content creation time from X hours to Y minutes
- **Error Reduction**: Minimize formatting errors by 90%
- **Automation**: Automate 80% of processes 4-8
- **User Satisfaction**: Simple, intuitive interface

## 12. Implementation Phases

### Phase 1: Core Infrastructure
- Supabase setup and authentication
- Basic dashboard layout
- Database schema implementation

### Phase 2: Content Processing
- Transcription input interface
- AI enhancement integration
- MDX formatting

### Phase 3: GitHub Integration
- GitHub API integration
- Auto-commit and PR creation
- Deployment tracking

### Phase 4: Polish & Testing
- UI/UX improvements
- Error handling
- Testing and bug fixes

## 13. Future Enhancements

### 13.1 Content Type Expansion
- Quran commentary articles
- Prayer time announcements
- Islamic educational series
- Podcast transcriptions

### 13.2 Advanced Features
- Batch processing multiple items
- Content templates and workflows
- AI-powered content suggestions
- Multi-language support
- SEO optimization tools

### 13.3 Integration & Analytics
- Webhook notifications
- Analytics and reporting
- Multi-user collaboration
- Content scheduling
- Social media integration

## 14. Risks & Mitigations

### 14.1 API Rate Limits
- **Risk**: OpenRouter/GitHub API limits
- **Mitigation**: Implement queuing system and rate limiting

### 14.2 Content Quality
- **Risk**: AI-generated content quality issues
- **Mitigation**: Always provide manual review step

### 14.3 GitHub Access
- **Risk**: Token expiration or permission issues
- **Mitigation**: Proper error handling and token refresh