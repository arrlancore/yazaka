/**
 * Prayer Time Calculator Utility
 * Calculates Islamic prayer times for notification scheduling
 */

export interface PrayerTime {
  name: string;
  nameEn: string;
  time: string; // HH:MM format
  timestamp: Date;
}

export interface PrayerTimes {
  fajr: PrayerTime;
  dhuhr: PrayerTime;
  asr: PrayerTime;
  maghrib: PrayerTime;
  isha: PrayerTime;
}

/**
 * Calculate prayer times for a specific date using latitude/longitude
 */
export async function calculatePrayerTimes(
  latitude: number,
  longitude: number,
  timezone: string,
  date: Date = new Date()
): Promise<PrayerTimes> {
  try {
    // Use Aladhan API with coordinates for accurate prayer times
    const response = await fetch(
      `https://api.aladhan.com/v1/timings/${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}?latitude=${latitude}&longitude=${longitude}&method=2&timezone=${encodeURIComponent(timezone)}`
    );
    
    if (!response.ok) {
      throw new Error(`Prayer times API error: ${response.status}`);
    }
    
    const data = await response.json();
    const timings = data.data.timings;
    
    // Convert API response to our format
    const prayerTimes: PrayerTimes = {
      fajr: {
        name: "Subuh",
        nameEn: "Fajr", 
        time: timings.Fajr,
        timestamp: parseTimeInTimezone(timings.Fajr, date, timezone)
      },
      dhuhr: {
        name: "Dzuhur",
        nameEn: "Dhuhr",
        time: timings.Dhuhr,
        timestamp: parseTimeInTimezone(timings.Dhuhr, date, timezone)
      },
      asr: {
        name: "Ashar",
        nameEn: "Asr",
        time: timings.Asr,
        timestamp: parseTimeInTimezone(timings.Asr, date, timezone)
      },
      maghrib: {
        name: "Maghrib",
        nameEn: "Maghrib",
        time: timings.Maghrib,
        timestamp: parseTimeInTimezone(timings.Maghrib, date, timezone)
      },
      isha: {
        name: "Isya",
        nameEn: "Isha",
        time: timings.Isha,
        timestamp: parseTimeInTimezone(timings.Isha, date, timezone)
      }
    };
    
    return prayerTimes;
  } catch (error) {
    console.error('Error calculating prayer times:', error);
    throw error;
  }
}

/**
 * Find the next prayer time from current moment
 */
export function findNextPrayer(prayerTimes: PrayerTimes, currentTime: Date = new Date()): PrayerTime {
  const prayers = [
    prayerTimes.fajr,
    prayerTimes.dhuhr, 
    prayerTimes.asr,
    prayerTimes.maghrib,
    prayerTimes.isha
  ];
  
  // Find next prayer today
  for (const prayer of prayers) {
    if (prayer.timestamp > currentTime) {
      return prayer;
    }
  }
  
  // If no prayer left today, return tomorrow's Fajr
  const tomorrow = new Date(currentTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  // This is a simplified version - in production you'd calculate tomorrow's actual Fajr time
  const tomorrowFajr: PrayerTime = {
    name: "Subuh",
    nameEn: "Fajr",
    time: prayerTimes.fajr.time, // Approximate - should be calculated for tomorrow
    timestamp: new Date(tomorrow.toDateString() + ' ' + prayerTimes.fajr.time)
  };
  
  return tomorrowFajr;
}

/**
 * Calculate next prayer time with reminder offset using stored prayer times
 */
export function calculateNextPrayerFromStored(
  storedPrayerTimes: { [key: string]: string },
  timezone: string,
  reminderMinutes: number = 0,
  currentTime: Date = new Date()
): PrayerTime {
  const prayers = [
    { name: "Subuh", nameEn: "Fajr", time: storedPrayerTimes.fajr },
    { name: "Dzuhur", nameEn: "Dhuhr", time: storedPrayerTimes.dhuhr },
    { name: "Ashar", nameEn: "Asr", time: storedPrayerTimes.asr },
    { name: "Maghrib", nameEn: "Maghrib", time: storedPrayerTimes.maghrib },
    { name: "Isya", nameEn: "Isha", time: storedPrayerTimes.isha }
  ];
  
  const currentDate = new Date(currentTime);
  
  // Find next prayer today
  for (const prayer of prayers) {
    const prayerTime = parseTimeInTimezone(prayer.time, currentDate, timezone);
    
    // Apply reminder offset
    if (reminderMinutes > 0) {
      prayerTime.setMinutes(prayerTime.getMinutes() - reminderMinutes);
    }
    
    if (prayerTime > currentTime) {
      return {
        name: prayer.name,
        nameEn: prayer.nameEn,
        time: prayer.time,
        timestamp: prayerTime
      };
    }
  }
  
  // If no prayer left today, return tomorrow's Fajr
  const tomorrow = new Date(currentTime);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const tomorrowFajr = parseTimeInTimezone(storedPrayerTimes.fajr, tomorrow, timezone);
  if (reminderMinutes > 0) {
    tomorrowFajr.setMinutes(tomorrowFajr.getMinutes() - reminderMinutes);
  }
  
  return {
    name: "Subuh",
    nameEn: "Fajr",
    time: storedPrayerTimes.fajr,
    timestamp: tomorrowFajr
  };
}

/**
 * Get simplified prayer times object for storage
 */
export function formatPrayerTimesForStorage(prayerTimes: PrayerTimes): { [key: string]: string } {
  return {
    fajr: prayerTimes.fajr.time,
    dhuhr: prayerTimes.dhuhr.time,
    asr: prayerTimes.asr.time,
    maghrib: prayerTimes.maghrib.time,
    isha: prayerTimes.isha.time
  };
}

/**
 * Parse prayer time string (HH:MM) into Date object for specific timezone
 */
function parseTimeInTimezone(timeString: string, date: Date, timezone: string): Date {
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create date in the specified timezone
  const targetDate = new Date(date);
  targetDate.setHours(hours, minutes, 0, 0);
  
  // Convert to proper timezone
  // Note: This is simplified - in production you'd use a proper timezone library
  // like date-fns-tz or moment-timezone for accurate timezone handling
  const offsetDate = new Date(targetDate.toLocaleString("en-US", { timeZone: timezone }));
  
  return offsetDate;
}

/**
 * Get the next prayer after current prayer (for updating after notification sent)
 */
export async function getNextPrayerAfter(
  currentPrayerName: string,
  timezone: string,
  currentTime: Date = new Date()
): Promise<PrayerTime> {
  const prayerOrder = ["Subuh", "Dzuhur", "Ashar", "Maghrib", "Isya"];
  const currentIndex = prayerOrder.indexOf(currentPrayerName);
  
  if (currentIndex === -1) {
    throw new Error(`Invalid prayer name: ${currentPrayerName}`);
  }
  
  // If it's the last prayer of the day (Isya), get tomorrow's Fajr
  if (currentIndex === prayerOrder.length - 1) {
    const tomorrow = new Date(currentTime);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    // Note: This function requires lat/long - for now return a placeholder
    // In production, lat/long should be passed as parameters or stored in context
    throw new Error('getNextPrayerAfter requires latitude/longitude for tomorrow calculation');
  }
  
  // Otherwise get the next prayer today - this shouldn't need API call
  // as we should use the stored prayer times instead
  throw new Error('getNextPrayerAfter should use stored prayer times, not API calls');
}