"use client";
import { useState, useEffect } from "react";
import { Compass, MapPin, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import RequestLocation from "./request-location";
import RequestOrientation from "./RequestOrientation";
import { useLocationWithName } from "@/hooks/useLocationWithName";

const QIBLA_DEV_MODE = false; // Set this to false for production

// mock jakarta pusat coordinates
const DEV_COORDINATES = {
  latitude: -6.2146,
  longitude: 106.8451,
};

// Copy all the component logic from the original file to here
export default function QiblaFinder() {
  const {
    locationName,
    location,
    request: requestLocation,
  } = useLocationWithName({
    onRequestGranted: () => setLocationPermission("granted"),
  });
  const [qiblaAngle, setQiblaAngle] = useState(0);
  const [compass, setCompass] = useState(0);
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const [orientationPermission, setOrientationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");
  const [locationPermission, setLocationPermission] = useState<
    "granted" | "denied" | "prompt"
  >("prompt");

  // Kaaba coordinates
  const KAABA_LAT = 21.4225;
  const KAABA_LNG = 39.8262;

  const TOLERANCE_ANGLE = 3; // Tolerance in degrees

  const isNearMakkah = (direction: number) => {
    return Math.abs(direction % 360) <= TOLERANCE_ANGLE;
  };

  const calculateQibla = (lat: number, lng: number): number => {
    const φ1 = (lat * Math.PI) / 180;
    const φ2 = (KAABA_LAT * Math.PI) / 180;
    const Δλ = ((KAABA_LNG - lng) * Math.PI) / 180;

    const y = Math.sin(Δλ);
    const x = Math.cos(φ1) * Math.tan(φ2) - Math.sin(φ1) * Math.cos(Δλ);

    let qibla = (Math.atan2(y, x) * 180) / Math.PI;
    return (qibla + 360) % 360;
  };

  const requestOrientationPermission = async () => {
    try {
      // Check if the device supports DeviceOrientationEvent
      if (!window.DeviceOrientationEvent) {
        setError("Perangkat Anda tidak mendukung sensor orientasi.");
        return;
      }

      // iOS 13+ devices
      if (
        typeof (DeviceOrientationEvent as any).requestPermission === "function"
      ) {
        const response = await (
          DeviceOrientationEvent as any
        ).requestPermission();
        if (response === "granted") {
          setOrientationPermission("granted");
          window.addEventListener("deviceorientation", handleOrientation, true);
        } else {
          setOrientationPermission("denied");
          setError(
            "Izin kompas ditolak. Silakan aktifkan di pengaturan perangkat Anda."
          );
        }
      }
      // Android and other devices
      else {
        setOrientationPermission("granted");
        window.addEventListener("deviceorientation", handleOrientation, true);
      }

      // Test if the orientation event is actually working
      let orientationTestTimeout = setTimeout(() => {
        setError(
          "Sensor orientasi tidak merespon. Pastikan perangkat Anda mendukung dan mengizinkan akses kompas."
        );
      }, 3000);

      const testOrientation = (event: DeviceOrientationEvent) => {
        if (
          event.alpha !== null ||
          (event as any).webkitCompassHeading !== undefined
        ) {
          clearTimeout(orientationTestTimeout);
          window.removeEventListener("deviceorientation", testOrientation);
        }
      };

      window.addEventListener("deviceorientation", testOrientation, true);
    } catch (err) {
      console.error("Error requesting orientation permission:", err);
      setError(
        "Gagal meminta izin kompas. Pastikan Anda menggunakan HTTPS dan perangkat mendukung sensor orientasi."
      );
    }
  };

  const handleOrientation = (event: DeviceOrientationEvent) => {
    if (QIBLA_DEV_MODE) return; // Skip in dev mode

    let angle;
    if ("webkitCompassHeading" in event) {
      // iOS
      angle = (event as any).webkitCompassHeading;
    } else if (event.alpha) {
      // Android
      angle = 360 - event.alpha;
    } else {
      setError("Orientasi perangkat tidak tersedia");
      return;
    }
    setCompass(angle);
  };

  useEffect(() => {
    if (location) {
      setQiblaAngle(calculateQibla(location.latitude, location.longitude));
    }
  }, [location]);

  useEffect(() => {
    const mobileCheck = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    setIsMobile(mobileCheck);

    if (QIBLA_DEV_MODE) {
      setQiblaAngle(
        calculateQibla(DEV_COORDINATES.latitude, DEV_COORDINATES.longitude)
      );
    }

    return () => {
      window.removeEventListener("deviceorientation", handleOrientation);
    };
  }, []);

  const getDirection = () => {
    if (!location) return 0;
    return qiblaAngle - compass;
  };

  return (
    <main className="sm:container flex flex-col sm:gap-4 py-4">
      {!isMobile ? (
        <div className="min-h-screen bg-background p-4 flex flex-col items-center">
          <Alert variant="default">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Maaf</AlertTitle>
            <AlertDescription>
              Arah Kiblat hanya bisa diakses melalui mobile atau smartphone anda
            </AlertDescription>
          </Alert>
        </div>
      ) : (
        <div className="min-h-[300px] bg-background p-4 flex flex-col items-center justify-start">
          <Card className="w-full max-w-md border-none shadow-none">
            <CardHeader>
              <CardTitle className="text-center flex items-center justify-center gap-2">
                <Compass className="w-6 h-6" />
                Aplikasi Pencari Arah Kiblat
              </CardTitle>
            </CardHeader>
            <CardContent>
              {error && (
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Kesalahan</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <div className="flex flex-col items-center space-y-6">
                {!QIBLA_DEV_MODE && (
                  <>
                    <RequestLocation
                      isRequested={locationPermission === "granted"}
                      request={requestLocation}
                      caption="Kami memerlukan lokasi Anda untuk memberikan arah kiblat yang akurat."
                    />
                    <RequestOrientation
                      isRequested={orientationPermission === "granted"}
                      request={requestOrientationPermission}
                    />
                  </>
                )}

                {QIBLA_DEV_MODE ||
                (locationPermission === "granted" &&
                  orientationPermission === "granted") ? (
                  <>
                    <div className="relative w-80 h-80">
                      {/* Compass Rose */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          viewBox="0 0 200 200"
                          className="w-80 h-80"
                          style={{
                            transform: `rotate(${-compass}deg)`,
                            transition: "transform 0.5s ease-out",
                          }}
                        >
                          {/* Outer circle */}
                          <circle
                            cx="100"
                            cy="100"
                            r="98"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-muted-foreground/30"
                          />
                          {/* Inner circle */}
                          <circle
                            cx="100"
                            cy="100"
                            r="80"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1"
                            className="text-muted-foreground/20"
                          />
                          {/* Cardinal directions */}
                          {["N", "E", "S", "W"].map((dir, i) => (
                            <g
                              key={dir}
                              transform={`rotate(${i * 90} 100 100)`}
                            >
                              <line
                                x1="100"
                                y1="20"
                                x2="100"
                                y2="35"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="text-primary"
                              />
                              <text
                                x="100"
                                y="15"
                                textAnchor="middle"
                                fontSize="14"
                                fill="currentColor"
                                className="text-primary font-bold"
                              >
                                {dir}
                              </text>
                            </g>
                          ))}
                          {/* Intercardinal directions */}
                          {["NE", "SE", "SW", "NW"].map((dir, i) => (
                            <g
                              key={dir}
                              transform={`rotate(${45 + i * 90} 100 100)`}
                            >
                              <line
                                x1="100"
                                y1="20"
                                x2="100"
                                y2="30"
                                stroke="currentColor"
                                strokeWidth="1"
                                className="text-muted-foreground"
                              />
                              <text
                                x="100"
                                y="15"
                                textAnchor="middle"
                                fontSize="10"
                                fill="currentColor"
                                className="text-muted-foreground"
                              >
                                {dir}
                              </text>
                            </g>
                          ))}
                          {/* Degree markers */}
                          {Array.from({ length: 72 }, (_, i) => (
                            <line
                              key={i}
                              x1="100"
                              y1="22"
                              x2="100"
                              y2={i % 6 === 0 ? "28" : "25"}
                              stroke="currentColor"
                              strokeWidth="1"
                              className="text-muted-foreground/50"
                              transform={`rotate(${i * 5} 100 100)`}
                            />
                          ))}
                        </svg>
                      </div>

                      {/* Compass Needle (always pointing up) */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <svg
                          viewBox="0 0 100 100"
                          className={`w-40 h-40 ${
                            isNearMakkah(getDirection())
                              ? "text-green-600"
                              : "text-primary"
                          }`}
                        >
                          <defs>
                            <linearGradient
                              id="needleGradient"
                              x1="0%"
                              y1="0%"
                              x2="0%"
                              y2="100%"
                            >
                              <stop
                                offset="0%"
                                stopColor="currentColor"
                                stopOpacity="1"
                              />
                              <stop
                                offset="100%"
                                stopColor="currentColor"
                                stopOpacity="0.6"
                              />
                            </linearGradient>
                          </defs>
                          {/* Needle body */}
                          <path
                            d="M50,5 L60,50 L50,95 L40,50 Z"
                            fill="url(#needleGradient)"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                          {/* Needle point */}
                          <path d="M45,5 L50,0 L55,5 Z" fill="currentColor" />
                          {/* Center circle */}
                          <circle
                            cx="50"
                            cy="50"
                            r="5"
                            fill="white"
                            stroke="currentColor"
                            strokeWidth="1"
                          />
                        </svg>
                      </div>

                      {/* Qibla Direction Indicator */}

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div
                          style={{
                            transform: `rotate(${qiblaAngle - compass}deg)`,
                            transition: "transform 0.5s ease-out",
                            scale: "1.5",
                          }}
                        >
                          <svg width="200" height="200" viewBox="0 0 200 200">
                            <path
                              d="M100,10 L105,30 L100,25 L95,30 Z"
                              fill="#FFD700"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {location && (
                      <div className="text-center space-y-2">
                        {locationName && (
                          <div className="text-sm text-muted-foreground mt-2">
                            <MapPin className="inline-block mr-1" size={16} />
                            {locationName}
                          </div>
                        )}
                        <p className="text-lg font-semibold">
                          Kiblat berada {qiblaAngle.toFixed(1)}° dari Utara
                        </p>
                        {isNearMakkah(getDirection()) && (
                          <Alert className="mt-4 text-left text-primary">
                            <CheckCircle className="h-4 w-4" />
                            <AlertDescription>
                              Anda sekarang menghadap ke arah Kiblat!
                            </AlertDescription>
                          </Alert>
                        )}
                      </div>
                    )}
                  </>
                ) : null}
              </div>

              {QIBLA_DEV_MODE && (
                <div className="mt-4">
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={compass}
                    onChange={(e) => setCompass(Number(e.target.value))}
                    className="w-full"
                  />
                  <p>Dev Mode Compass: {compass}°</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </main>
  );
}
