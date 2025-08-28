# HSI Admin Dashboard - PRD

## What we want to do?
Create a simple admin dashboard to manage HSI (Himpunan Santri Indonesia) content with AI enhancement.

**Problem**: Manual transcription → AI enhancement → MDX file creation is time-consuming
current manual process: guide-catatan-hsi-creation.md
**Solution**: Admin interface to automate the workflow

## How we do it?

### Tech Stack
- **Frontend**: Next.js + Tailwind + shadcn/ui
- **Database**: Supabase (PostgreSQL + Auth)
- **AI**: OpenRouter + Gemini API
- **Auth**: Google OAuth + role-based access

### Database Tables
1. **user_profiles**: Store admin users with role column
2. **catatan_hsi**: Store HSI content with frontmatter fields

### Workflow
1. **Input**: Admin pastes raw transcription → Save as `status: 'raw'`
2. **Enhance**: AI improves transcription → Update to `status: 'draft'`
3. **Publish**: Generate MDX files → Update to `status: 'published'`

### Admin Routes
- `/admin/auth` - Google login
- `/admin` - Dashboard overview
- `/admin/catatan-hsi` - Content list
- `/admin/catatan-hsi/create` - Create new content
- `/admin/catatan-hsi/[id]/edit` - Edit content

## Progress

### Phase 1: Database Setup ✅ COMPLETED
- ✅ Supabase CLI setup
- ✅ Created `user_profiles` table
- ✅ Created `catatan_hsi` table
- ✅ Row Level Security policies
- ✅ TypeScript types
- ✅ MDX sync utilities

### Phase 2: Admin Interface 🚧 TODO
- 🔄 Add `role` column to user_profiles
- 🔄 Google OAuth authentication
- 🔄 Role-based access control
- 🔄 Admin dashboard layout
- 🔄 Content creation form
- 🔄 AI enhancement integration
- 🔄 Publish to MDX workflow

### Phase 3: Polish 📋 PLANNED
- 📋 Error handling
- 📋 UI improvements
- 📋 Audio upload (Cloudflare R2)
- 📋 Performance optimization

## Environment Variables Needed
```
# Existing
NEXT_PUBLIC_SUPABASE_URL=xxx
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx

# New
OPENROUTER_API_KEY=xxx
```

## Success Criteria
- Admin can login with Google
- Admin can create/edit HSI content
- AI can enhance transcriptions
- System generates proper MDX files
- Published content appears on website