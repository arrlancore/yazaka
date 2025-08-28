const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

interface CombineRequest {
  transcription: string;
}

interface CombineResponse {
  combined_transcription: string;
}

interface EnhancementRequest {
  combined_transcription: string;
  title?: string;
  ustad?: string;
  series?: string;
}

interface EnhancementResponse {
  enhanced_transcription: string;
  enhanced_content: string;
  improved_summary: string;
  suggested_tags: string[];
  extracted_title: string;
  extracted_ustad: string;
  extracted_series: string;
}

// Step 1: Combine multiple transcriptions
export async function combineTranscriptions(
  request: CombineRequest
): Promise<CombineResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const systemPrompt = `Your task is to merge multiple audio transcriptions into a single, enhanced version that is more accurate and coherent. The final output should be a clean transcription formatted as:

\`\`\`
(m:ss)+text  
(m:ss)+text  
...
\`\`\`

example output:
\`\`\`txt
(0:00) Assalamualaikum warahmatullahi wabarakatuh
(0:05) Alhamdulillah wassalatu wassalamu ala rasulillah
(0:09) wa ala alihi wa sahbihi ajma'in.
(0:13) Halaqah yang ketiga dari silsilah ilmiah
(0:16) beriman dengan takdir Allah
(0:19) adalah tentang kedudukan iman dengan takdir
\`\`\`

Each timestamped line should reflect the most accurate and natural phrasing based on the provided sources.`;

  const userPrompt = `**Context:**  
${request.transcription}

Please combine and clean up this transcription following the format specified.`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bekhair.com",
        "X-Title": "Bekhair HSI Transcription Combining",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenRouter API");
    }

    return {
      combined_transcription: content.trim(),
    };
  } catch (error) {
    console.error("OpenRouter combine API error:", error);
    throw new Error(
      `Failed to combine transcription: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

// Step 2: Enhance transcription and create content
export async function enhanceTranscription(
  request: EnhancementRequest
): Promise<EnhancementResponse> {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured");
  }

  const profileContext = `Ustadz Dr. Abdullah Roy, yang nama aslinya adalah Roy Grafika Penataran, adalah seorang dai dan akademisi kelahiran Bantul, Yogyakarta, tahun 1980. Beliau merupakan lulusan S1, S2, dan S3 dari Universitas Islam Madinah (UIM), di mana ia mendalami bidang Akidah. Beliau dikenal sebagai pendiri program belajar online HSI AbdullahRoy dan pernah menjadi pengajar tetap kajian berbahasa Indonesia di Masjid Nabawi pada periode 2013–2017`;

  const systemPrompt = `Anda adalah asisten AI yang bertugas memperbaiki transkrip audio kajian Islam dan mengubahnya menjadi artikel konten yang terstruktur dan akurat, sesuai dengan contoh dan aturan ketat yang diberikan di bawah ini.

**Prinsip Utama: Akurasi dan Otentisitas**
Konten transkrip dan artikel harus sama persis dengan makna yang terkandung dalam transkrip asli. Jangan mengubah, menafsirkan ulang, atau mengurangi ajaran atau dalil (Al-Quran dan Hadits) yang disampaikan.

**Tugas Anda:**
1.  **Perbaiki Transkrip:** Terima transkrip mentah yang diberikan. Perbaiki kesalahan ejaan (misal: \`halakoh\` → \`halaqah\`), kesalahan transliterasi, dan kesalahan ketik lainnya. Namun, pertahankan gaya bahasa lisan dari penceramah dan format timestamp.
2.  **Buat Artikel:** Berdasarkan transkrip yang sudah diperbaiki, buatlah artikel lengkap dengan format Markdown yang rapi.

**Aturan Wajib (Berlaku untuk Transkrip DAN Artikel):**

**1. Aturan Penulisan Dalil (Al-Quran & Hadits):**
    *   **Gunakan Teks Arab Asli:** Untuk semua kutipan ayat Al-Quran, Hadits, dan perkataan ulama dalam bahasa Arab, **wajib** menggunakan skrip (teks) Arab asli. Jangan pernah menggunakan transliterasi Latin untuk teks dalil.
    *   **Sertakan Terjemahan:** Letakkan terjemahan dalam bahasa Indonesia di bawah teks Arab (dalam transkrip) atau di dalam format *blockquote* yang sama (dalam artikel).
    *   **Sebutkan Sumber:** Selalu sertakan sumber kutipan (contoh: Surat Al-Qamar, Ayat 49; HR. Muslim).

**2. Aturan Adab Penulisan (Tanpa Singkatan):**
    *   **Jangan menyingkat gelar kehormatan.** Tuliskan secara lengkap:
        *   \`SWT\` → **Subhanahu wa Ta'ala**
        *   \`SAW\` → **Shallallahu 'alaihi wa sallam**
        *   \`AS\` → **'Alaihissalam**
        *   \`RA\` → **Radhiyallahu 'anhu** (untuk laki-laki tunggal), **Radhiyallahu 'anha** (untuk perempuan tunggal), atau **Radhiyallahu 'anhuma** (untuk dua orang/ayah&anak).
        *   \`Azza wa Jalla\` → Tulis lengkap, jangan disingkat.
        *   Dalam artikel, Anda boleh menggunakan simbol ﷺ untuk **Shallallahu 'alaihi wa sallam**.

**3. Aturan Perbaikan Transkrip:**
    *   **Pertahankan Format Timestamp:** Jangan ubah format \`(0:00)\` yang ada.
    *   **Perbaiki Kesalahan Ejaan:** Koreksi kesalahan transliterasi dan ejaan bahasa Indonesia.
    *   **Pertahankan Gaya Lisan:** Jaga intonasi dan gaya bahasa penceramah.
    *   **Gunakan Teks Arab:** Ganti semua transliterasi Arab dengan teks Arab asli.
    *   **Lengkapi Gelar:** Tulis lengkap semua gelar kehormatan sesuai aturan di atas.
    *   **AUTO DETECTION:** Coba analisa time frame dan text, jika ada content yang dirasa hilang karena keterbatasan konversi transkrip. Coba periksa text apakah text berkaitan dengan Al Quran atau hadist atau perkataan ulama yang mahsyur yang sahih, jika iya coba lengkapi informasi tersebut dengan data eksternal. jika bukan quran/hadis/perkataan ulama dan tidak ada cukup data untuk mengisinya maka cukup berikan tanda ?? atau dua question mark

**4. Aturan Pemformatan Artikel:**
    *   **Struktur:** Gunakan Markdown untuk menyusun artikel:
        *   Judul utama (\`#\`).
        *   Sub-judul (\`##\`, \`###\`) untuk memisahkan topik.
        *   *Blockquote* (\`>\`) untuk mengutip ayat, hadits, dan terjemahannya.
        *   Daftar berpoin (*bullet points*) untuk ringkasan atau penjelasan.
        *   Teks tebal (\`**teks**\`) untuk menekankan istilah penting.
    *   **Penutup:** Akhiri artikel dengan kalimat penutup dari penceramah, nama, dan lokasi.
    *   **Ringkasan Poin:** Buat bagian "Poin Penting untuk Diingat" di akhir untuk merangkum pelajaran utama dari kajian.
     
**Biografi Ustad**: ${profileContext}   

**WAJIB: Format response sebagai:**
{
  "enhanced_transcription": "transkrip yang sudah diperbaiki dengan format timestamp",
  "enhanced_content": "artikel dalam format Markdown",
  "improved_summary": "ringkasan 2-3 kalimat",
  "suggested_tags": ["tag1", "tag2", ...],
  "extracted_title": "judul yang diambil dari konten",
  "extracted_ustad": "nama ustad dari konten",
  "extracted_series": "nama seri kajian"
}`;

  const userPrompt = `**Combined Transcription:**
${request.combined_transcription}

Silakan perbaiki transkrip dan buat artikel sesuai dengan aturan yang telah diberikan.`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: userPrompt },
  ];

  try {
    const response = await fetch(OPENROUTER_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://bekhair.com",
        "X-Title": "Bekhair HSI Content Enhancement",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: messages,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} ${error}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content received from OpenRouter API");
    }

    // Try to parse as JSON, handling potential markdown code blocks
    try {
      // Remove potential markdown code blocks if they exist
      let jsonContent = content.trim();
      if (jsonContent.startsWith("```json")) {
        jsonContent = jsonContent
          .replace(/^```json\s*/, "")
          .replace(/\s*```$/, "");
      } else if (jsonContent.startsWith("```")) {
        jsonContent = jsonContent.replace(/^```\s*/, "").replace(/\s*```$/, "");
      }

      const parsed = JSON.parse(jsonContent);

      return {
        enhanced_transcription: parsed.enhanced_transcription || "",
        enhanced_content: parsed.enhanced_content || parsed.content || content,
        improved_summary:
          parsed.improved_summary ||
          parsed.summary ||
          "Enhanced content generated",
        suggested_tags: parsed.suggested_tags ||
          parsed.tags || ["islam", "ceramah"],
        extracted_title:
          parsed.extracted_title || parsed.title || "HSI Content",
        extracted_ustad: parsed.extracted_ustad || parsed.ustad || "Unknown",
        extracted_series:
          parsed.extracted_series || parsed.series || "HSI Series",
      };
    } catch (parseError) {

      // Try to extract JSON from within the content if it's wrapped in other text
      const jsonMatch = content.match(/```json\s*(\{[\s\S]*?\})\s*```/);
      if (jsonMatch) {
        try {

          // Extract fields using regex patterns instead of JSON.parse
          const extractField = (
            fieldName: string,
            defaultValue: string = ""
          ) => {
            // Find the field start
            const startPattern = new RegExp(`"${fieldName}":\\s*"`);
            const startMatch = startPattern.exec(jsonMatch[1]);

            if (!startMatch) return defaultValue;

            const startIndex = startMatch.index + startMatch[0].length;
            let endIndex = startIndex;
            let inEscape = false;

            // Manually parse to find the end of the string value
            // We need to find the closing quote that ends this field, not any quote inside the content
            for (let i = startIndex; i < jsonMatch[1].length; i++) {
              const char = jsonMatch[1][i];

              if (inEscape) {
                inEscape = false;
                continue;
              }

              if (char === "\\") {
                inEscape = true;
                continue;
              }

              if (char === '"') {
                // Check if this is actually the end of the field by looking ahead
                const nextChars = jsonMatch[1].substring(i + 1, i + 10).trim();
                if (nextChars.startsWith(",") || nextChars.startsWith("}")) {
                  endIndex = i;
                  break;
                }
                // If not followed by comma or closing brace, it's a quote inside the content
                continue;
              }
            }

            if (endIndex > startIndex) {
              let result = jsonMatch[1].substring(startIndex, endIndex);
              // Properly handle escape sequences
              result = result.replace(/\\n/g, "\n");
              result = result.replace(/\\"/g, '"');
              result = result.replace(/\\\\/g, "\\");
              return result;
            }

            return defaultValue;
          };

          const extractArrayField = (
            fieldName: string,
            defaultValue: string[] = []
          ) => {
            const pattern = new RegExp(
              `"${fieldName}":\\s*\\[([^\\]]+)\\]`,
              "s"
            );
            const match = jsonMatch[1].match(pattern);
            if (match) {
              try {
                const arrayStr = "[" + match[1] + "]";
                return JSON.parse(arrayStr);
              } catch {
                return defaultValue;
              }
            }
            return defaultValue;
          };

          const result = {
            enhanced_transcription: extractField("enhanced_transcription"),
            enhanced_content: extractField("enhanced_content"),
            improved_summary: extractField(
              "improved_summary",
              "Enhanced content generated"
            ),
            suggested_tags: extractArrayField("suggested_tags", [
              "islam",
              "ceramah",
            ]),
            extracted_title: extractField("extracted_title", "HSI Content"),
            extracted_ustad: extractField("extracted_ustad", "Unknown"),
            extracted_series: extractField("extracted_series", "HSI Series"),
          };

          return result;
        } catch (innerParseError) {
        }
      }

      // If all JSON parsing fails, create structured response
      return {
        enhanced_transcription: "",
        enhanced_content: content,
        improved_summary:
          "Content has been enhanced with AI following HSI guidelines",
        suggested_tags: ["islam", "ceramah", "kajian"],
        extracted_title: "HSI Content",
        extracted_ustad: "Unknown",
        extracted_series: "HSI Series",
      };
    }
  } catch (error) {
    console.error("OpenRouter API error:", error);
    throw new Error(
      `Failed to enhance content: ${error instanceof Error ? error.message : "Unknown error"}`
    );
  }
}

export async function testOpenRouterConnection(): Promise<boolean> {
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) return false;

    const response = await fetch(`${OPENROUTER_API_URL}/models`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    return response.ok;
  } catch {
    return false;
  }
}
