import { Location } from "@/types/prayerTypes";
import axios from "axios";

export const fetchPrayerTimes = async (
  latitude: number,
  longitude: number,
  method = 20, // kemenag
  currentTime = new Date()
) => {
  const response = await axios.get(
    `https://api.aladhan.com/v1/calendar?latitude=${latitude}&longitude=${longitude}&method=${method}`
  );
  return response.data?.data[currentTime.getDate() - 1];
};

export const fetchLocationName = async (lat: number, lon: number) => {
  try {
    const response = await axios.get(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`,
      {
        headers: {
          "Accept-Language": "id-ID, en-US",
        },
      }
    );

    const address = response.data.address;
    let locationText = "";

    if (address.city) {
      locationText = address.city;
    } else if (address.town) {
      locationText = address.town;
    } else if (address.municipality) {
      locationText = address.municipality;
    } else if (address.county) {
      locationText = address.county;
    } else if (address.state) {
      locationText = address.state;
    }

    if (address.state && locationText !== address.state) {
      locationText += `, ${address.state}`;
    }

    return locationText || "Lokasi Tidak Diketahui";
  } catch (error) {
    console.error("Gagal mendapatkan nama lokasi", error);
    return "Lokasi Tidak Diketahui";
  }
};

export const getInitPrayerTimesData = async (defaultLocation: Location) => {
  try {
    const prayerTimesData = await fetchPrayerTimes(
      defaultLocation.latitude,
      defaultLocation.longitude
    );

    const locationName = await fetchLocationName(
      defaultLocation.latitude,
      defaultLocation.longitude
    );

    return {
      prayerTimesData,
      locationName,
      location: defaultLocation,
    };
  } catch (error) {
    console.error("Failed to fetch initial prayer times data", error);
    return {
      prayerTimesData: null,
      locationName: "Lokasi Tidak Diketahui",
      location: defaultLocation,
    };
  }
};
