import axios from "axios";

export async function getDrivingDistanceKm(
  originLat: number,
  originLng: number,
  destLat: number,
  destLng: number
): Promise<number> {

  const apiKey = process.env.GOOGLE_MAPS_KEY;

  const url = `https://maps.googleapis.com/maps/api/directions/json`;

  const response = await axios.get(url, {
    params: {
      origin: `${originLat},${originLng}`,
      destination: `${destLat},${destLng}`,
      mode: "driving",
      key: apiKey
    }
  });

  const route = response.data.routes[0];

  if (!route) {
    throw new Error("No route found");
  }

  const meters = route.legs[0].distance.value;

  return meters / 1000; // 转换为 km
}
