# 📱 Aplikasi Doa PWA - Proposal

## 🎯 **App Overview**
- **Platform**: Progressive Web App (PWA)
- **Data Source**: EQuran.id API (228 doa & dzikir)
- **Target**: Simple, clean, mudah digunakan
- **Focus**: Quick access, situational use

---

## 🗂️ **App Structure**

### **Main Flow**
```
App Launch → Menu Doa → Tab Interface
```

### **3 Tab System**

#### **Tab 1: "Doa Sehari-hari"** 
- **Layout**: Timeline linear pagi → malam
- **Content**: ~30-50 doa dengan timeline jelas
- **Organization**:
  - 🌅 **Pagi**: Bangun tidur, keluar rumah, dzikir pagi
  - 🌞 **Siang**: Makan, WC, aktivitas harian  
  - 🌆 **Sore**: Dzikir sore
  - 🌙 **Malam**: Sebelum tidur
- **UX**: List format dengan visual cues (icons)

#### **Tab 2: "Situasional"**
- **Content**: ~180 doa sisanya
- **Categories**:
  - 🚗 Perjalanan
  - 🏥 Kesehatan  
  - 📚 Pekerjaan/Studi
  - 🌦️ Cuaca & Keadaan Khusus

#### **Tab 3: "Favorit"**
- **Content**: User-customized berdasarkan usage
- **Feature**: Quick access doa yang paling sering digunakan

---

## 🔍 **Search System**

### **Technology Stack**
- **Method**: Context Mapping + Fuse.js
- **Type**: Smart semantic search tanpa LLM cost

### **Search Behavior**
- **Trigger**: As you type
- **Minimum**: 4 characters
- **Scope**: Indonesian text + Arabic text dari semua 228 doa

### **Context Mapping**
```javascript
{
  "waktu": "pagi|malam|siang|sore",
  "aktivitas": "makan|wc|perjalanan|keluar|masuk",
  "perasaan": "takut|sedih|sakit|khawatir",
  "cuaca": "hujan|panas|angin"
}
```

### **Search Flow**
```
User types → Real-time search → Results list → Detail page
```

---

## 📱 **UX Principles**

### **Design Philosophy**
- ✅ **Simple**: Minimal clicks untuk akses
- ✅ **Clean**: Modern UI, tidak outdated
- ✅ **Quick**: Fast loading, PWA benefits
- ✅ **Contextual**: Smart suggestions berdasarkan situasi

### **Key Features**
1. **Sticky search bar** - Always accessible
2. **Smart categorization** - Timeline + situational
3. **Offline capability** - PWA advantage
4. **Responsive design** - Mobile-first
5. **Add to homescreen** - Native-like experience

---

## 🛠️ **Technical Implementation**

### **Frontend Stack**
- PWA dengan service workers
- Fuse.js untuk fuzzy search
- Context mapping untuk semantic understanding

### **Data Management**
- Static context map untuk search patterns
- API calls ke EQuran.id untuk doa content
- Local storage untuk favorit

### **Search Architecture**
- Client-side processing
- No LLM API calls needed
- Low cost, high performance

---

## 🎨 **User Experience Flow**

### **Daily Usage Pattern**
1. **Morning**: Buka app → Tab "Sehari-hari" → Scroll ke doa pagi
2. **Situational**: Quick search "perjalaan" → Select from results
3. **Frequent**: Access dari Tab "Favorit"

### **Search Experience**
1. User types "takut gelap" (4+ chars)
2. Real-time context matching + fuzzy search
3. Results: "Doa ketika takut", "Doa perlindungan malam"
4. Click → Detail page dengan Arabic + Indonesian + hadith reference

---

## ✨ **Success Metrics**
- Quick access: <2 clicks untuk doa frequent
- Search accuracy: Relevant results untuk natural language
- Performance: Fast loading, smooth PWA experience
- Simplicity: Intuitive navigation, minimal learning curve
