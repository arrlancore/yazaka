# Product Requirements Document (PRD)
## Doa Feature Integration for Bekhair App

---

## 📋 **Product Overview**

### **Feature Name**: Doa & Dzikir Module
### **Integration Type**: New feature in existing Bekhair Islamic productivity app
### **Version**: 1.0 MVP

### **Feature Description**
New doa and dzikir module for the Bekhair app that provides quick access to 228 daily and situational prayers, with smart search functionality integrated seamlessly into the existing Islamic productivity platform.

### **Problem Statement**
- Bekhair users currently lack integrated access to doa and dzikir collections
- Users switch between multiple apps for Quran reading and daily prayers
- Need quick access to situational doa within the existing workflow
- 228 doa entries require smart organization and search capabilities

---

## 🎯 **Goals & Objectives**

### **Primary Goals**
1. **Quick Access**: Users dapat mengakses doa yang dibutuhkan dalam <2 klik
2. **Simple UX**: Interface yang clean, modern, dan intuitive
3. **Smart Search**: Pencarian semantic yang memahami context natural language
4. **Seamless Integration**: Feature yang terintegrasi smooth dengan existing Bekhair features

### **Secondary Goals**
1. Meningkatkan frequency of Islamic practice melalui easy access
2. Menyediakan reference yang akurat dengan dalil hadith
3. Consistent UX dengan existing Bekhair design system
4. Integration dengan existing hafalan and Quran features

### **Success Metrics**
- User engagement: >70% daily active users kembali dalam 7 hari
- Search success rate: >80% queries menghasilkan relevant results
- Performance: <2 second initial load time
- User satisfaction: >4.5/5 rating

---

## 👥 **Target Users**

### **Primary Users**
- **Muslim praktisi** (18-45 tahun)
- **Tech-savvy** dengan smartphone
- **Daily routine** yang include doa/dzikir regular
- **Time-conscious** users yang butuh quick access

### **User Personas**
1. **Ahmad (25, Professional)**: Butuh doa cepat di office breaks, commuting
2. **Siti (35, Ibu rumah tangga)**: Daily routine doa dengan anak-anak
3. **Umar (22, Mahasiswa)**: Butuh doa situational (ujian, travel, dll)

---

## 🚀 **Features & Requirements**

### **MVP Features (Version 1.0)**

#### **Core Features**
1. **New Doa Menu Item**
   - Add "Doa" to main navigation alongside existing Quran, Hafalan, Prayer Times
   - Tab-based interface within doa page:
     - Tab 1: "Doa Sehari-hari" (timeline-organized)
     - Tab 2: "Situasional" (category-organized)  
     - Tab 3: "Favorit" (user-customized)

2. **Smart Search System**
   - Real-time search (as-you-type, min 4 chars)
   - Context-aware semantic search
   - Indonesian + Arabic text search
   - Search results overlay all tabs

3. **Doa Detail Page**
   - Arabic text dengan harakat
   - Latin transliteration  
   - Indonesian translation
   - Hadith source reference
   - Add to favorites functionality

4. **Integration Features**
   - Leverage existing Bekhair state management (Zustand)
   - Use existing UI components (shadcn/ui)
   - Follow existing routing patterns (App Router)
   - Maintain consistent theming and design

#### **Technical Requirements**

**Frontend Integration**
- Integrate with existing Next.js 14 App Router structure
- Use existing Tailwind CSS + shadcn/ui components
- Follow existing state management patterns with Zustand
- Add doa routes under app/doa/ directory
- **New SVG Icon**: Create custom doa icon for main navigation menu

**Static Generation**
- Generate static pages for all 228 doa entries for SEO
- Follow existing patterns used for Quran content
- Use generateStaticParams for dynamic routes
- Pre-build all search indices for client-side performance

**Search Technology**
- Integrate Fuse.js with existing project dependencies
- Context mapping untuk semantic understanding
- Client-side processing following existing patterns

**Data Management Strategy**
- **Static Data Approach**: Snapshot all 228 doa from EQuran.id API to local JSON files
- **SEO Optimization**: Pre-render static pages for each doa (similar to existing Quran pages)
- **Data Location**: Store in data/doa/ directory following existing patterns
- **API Usage**: One-time snapshot, then use local JSON for all operations
- **Update Strategy**: Manual sync checks with API for content updates
- **Service Layer**: doaServices.ts in services/ directory for data access

**Performance Requirements**
- Consistent with existing Bekhair page load times
- Search response: <300ms
- Leverage existing localStorage patterns
- Maintain current mobile performance standards

---

## 📖 **User Stories**

### **Epic 1: Daily Doa Access**
- **As a** practicing Muslim, **I want to** quickly access morning doa **so that** I can start my day with proper prayers
- **As a** busy professional, **I want to** find doa before meals in <2 clicks **so that** I don't skip this sunnah
- **As a** parent, **I want to** access bedtime doa for children **so that** I can teach them proper Islamic practices

### **Epic 2: Situational Doa Discovery**
- **As a** traveler, **I want to** search "perjalanan" and get relevant travel doa **so that** I can pray for safe journey
- **As a** student, **I want to** find exam-related doa **so that** I can seek Allah's help during tests
- **As a** person feeling anxious, **I want to** search "takut" and get protection doa **so that** I can find comfort

### **Epic 3: Personalized Experience**
- **As a** regular user, **I want to** save frequently used doa to favorites **so that** I can access them instantly
- **As a** mobile user, **I want to** use the app offline **so that** I can access doa anywhere without internet
- **As a** user, **I want to** add the app to my home screen **so that** it feels like a native app

---

## 🏗️ **Technical Architecture**

### **System Architecture**
```
Bekhair App (Next.js 14)
    ↓
app/doa/ (New Route)
    ↓
components/doa/ (Feature Components)
    ↓
services/doaServices.ts (API Layer)
    ↓
EQuran.id API + Zustand Store
```

### **Data Flow**
1. **App Load**: Load context mapping + cache structure
2. **Search**: User query → Context matching + Fuzzy search → Results
3. **Detail**: API call untuk full doa content + cache locally
4. **Favorites**: Store locally, sync across sessions

### **Context Mapping Structure**
```javascript
const contextMap = {
  "waktu": {
    "pagi|subuh|bangun": [doa_ids],
    "malam|tidur": [doa_ids]
  },
  "aktivitas": {
    "makan|makanan": [doa_ids],
    "perjalanan|safar": [doa_ids]
  },
  "perasaan": {
    "takut|khawatir": [doa_ids],
    "sakit|sehat": [doa_ids]
  }
}
```

---

## 📅 **Development Timeline**

### **Phase 1: MVP Development (6 weeks)**

**Week 1-2: Foundation & Data Setup**
- Snapshot all 228 doa from EQuran.id API to local JSON files
- Create doa SVG icon for navigation
- Add doa routes to app/ directory structure
- Set up static data service layer

**Week 3-4: Core Features**
- Build doa components using existing UI library
- Implement 3-tab system within doa page
- Timeline and category organization

**Week 5-6: Integration & Polish**
- Add Fuse.js dependency and search functionality
- Integrate with existing Zustand patterns
- Test integration with existing features

### **Phase 2: Enhancement (4 weeks)**
- Advanced search filters
- Better context understanding
- Analytics integration
- User feedback implementation

---

## 💾 **Data Snapshot & Sync Strategy**

### **Initial Data Setup**
- **One-time API Call**: Fetch all 228 doa from EQuran.id API
- **Local Storage**: Save complete dataset to `data/doa/doa-collection.json`
- **Structure**: Maintain original API response structure for compatibility
- **Validation**: Ensure all doa entries have required fields (Arabic, Latin, Indonesian, hadith reference)

### **Static Generation Benefits**
- **SEO**: Each doa gets its own static page with proper meta tags
- **Performance**: No runtime API calls, instant loading
- **Reliability**: Works offline, no API dependency for users
- **Search**: Build search indices at build time for faster client-side search

### **Update Management**
- **Manual Sync**: Periodic manual checks against API for content updates
- **Version Control**: Track data changes through git commits
- **Update Process**: Run snapshot script when API updates detected
- **Fallback**: Keep API integration for emergency live updates if needed

### **Implementation Pattern**
Follow existing Bekhair patterns for static data (similar to Quran content management)

---

## 🔍 **Testing Requirements**

### **Functional Testing**
- Search accuracy across different query types
- Tab navigation and content loading
- Favorites add/remove functionality
- Offline mode testing

### **Performance Testing**
- Load time measurements
- Search response time
- Memory usage optimization
- Network efficiency

### **User Testing**
- Usability testing dengan target users
- Search behavior analysis
- Navigation flow validation
- Content accessibility testing

---

## 📊 **Analytics & Metrics**

### **Key Performance Indicators (KPIs)**
1. **Usage Metrics**
   - Daily/Monthly Active Users
   - Session duration
   - Pages per session
   - Return user rate

2. **Feature Metrics**
   - Search success rate
   - Most searched queries
   - Tab usage distribution
   - Favorites usage

3. **Performance Metrics**
   - App load time
   - Search response time
   - Offline usage
   - Error rates

---

## 🚧 **Assumptions & Dependencies**

### **Assumptions**
- EQuran.id API remains stable and accessible
- Target users have modern smartphones with PWA support
- Internet connectivity available for initial content loading
- Users familiar with basic Islamic terminology

### **Dependencies**
- EQuran.id API availability and performance
- Fuse.js library stability
- Browser PWA support (85%+ modern browsers)
- Arabic font rendering support

### **Risks & Mitigations**
- **API Dependency**: Cache critical content locally
- **Search Accuracy**: Continuous context map refinement
- **Performance**: Optimize bundle size dan lazy loading
- **User Adoption**: Focus pada UX testing dan iteration

---

## ✅ **Definition of Done**

### **MVP Completion Criteria**
- [ ] All 228 doa successfully snapshotted to local JSON files
- [ ] Custom SVG icon created and integrated in main navigation
- [ ] New "Doa" menu item added to Bekhair main navigation
- [ ] All 3 tabs functional dalam doa page dengan proper content organization
- [ ] Search works dengan >80% accuracy untuk common queries  
- [ ] Static pages generated for all doa entries (SEO-optimized)
- [ ] Integration seamless dengan existing Bekhair features
- [ ] Consistent dengan existing Bekhair design dan performance
- [ ] User testing completed dengan >4/5 satisfaction
- [ ] All hadith references accurate dan properly cited
- [ ] Favorites functionality menggunakan existing storage patterns

---

*Document Version: 1.0*  
*Last Updated: [Current Date]*  
*Next Review: Post-MVP Launch*