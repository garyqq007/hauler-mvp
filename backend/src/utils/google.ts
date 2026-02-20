import axios from "axios";

export async function getDrivingDistanceKm(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<number> {

  const apiKey = process.env.GOOGLE_MAPS_KEY;

  if (!apiKey) {
    throw new Error("GOOGLE_MAPS_KEY not defined in environment");
  }

  try {
    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/directions/json",
      {
        params: {
          origin: `${originLat},${originLng}`,
          destination: `${destLat},${destLng}`,
          mode: "driving",
          key: apiKey
        }
      }
    );

    // 🔍 打印 Google 返回状态（调试用）
    console.log("Google Directions status:", response.data.status);

    if (response.data.status !== "OK") {
      console.error("Google Directions failed:", response.data.status);
      throw new Error("Directions API returned non-OK status");
    }

    const route = response.data.routes[0];

    if (!route) {
      throw new Error("No route found");
    }

    const meters = route.legs[0].distance.value;

    return meters / 1000;

  } catch (error: any) {
    console.error("Google Directions API Error:", error.message);
    throw error;
  }
}
