"use client";

import { useEffect, useRef } from "react";

export default function OrderMap({
  pickupLat,
  pickupLng,
  dropoffLat,
  dropoffLng
}: {
  pickupLat: number;
  pickupLng: number;
  dropoffLat: number;
  dropoffLng: number;
}) {

  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.google || !mapRef.current) return;

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 10,
      center: { lat: pickupLat, lng: pickupLng }
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();

    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: { lat: pickupLat, lng: pickupLng },
        destination: { lat: dropoffLat, lng: dropoffLng },
        travelMode: window.google.maps.TravelMode.DRIVING
      },
      (result: any, status: any) => {
        if (status === "OK") {
          directionsRenderer.setDirections(result);
        }
      }
    );

  }, [pickupLat, pickupLng, dropoffLat, dropoffLng]);

  return (
    <div
      ref={mapRef}
      style={{
        width: "100%",
        height: 250,
        borderRadius: 10,
        marginTop: 12
      }}
    />
  );
}
