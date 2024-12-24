import { URLS } from "@/config";
import axios from "axios";

export const fetchQuranSuratByNumber = async (
  number: number
): Promise<SurahDetailResponse> => {
  try {
    const response = await axios.get(`${URLS.quranApi}/surah/${number}`);
    return response.data as SurahDetailResponse;
  } catch (error) {
    console.error("Failed to fetch Quran surah by number", error);
    throw error;
  }
};
