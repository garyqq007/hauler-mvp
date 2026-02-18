"use client";

import { useState, useEffect, useRef } from "react";
import { createOrder, getMyActiveCustomerOrders } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";

export default function CustomerPage() {

  const pickupRef = useRef<HTMLInputElement>(null);
  const dropoffRef = useRef<HTMLInputElement>(null);

  const [pickupLat, setPickupLat] = useState<number | null>(null);
  const [pickupLng, setPickupLng] = useState<number | null>(null);
  const [dropoffLat, setDropoffLat] = useState<number | null>(null);
  const [dropoffLng, setDropoffLng] = useState<number | null>(null);

  const [vehicleType, setVehicleType] = useState("SMALL");
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  // 🔵 初始化 Google Autocomplete
  useEffect(() => {
    if (!window.google) return;

    const pickupAutocomplete = new window.google.maps.places.Autocomplete(
      pickupRef.current!,
      {
        componentRestrictions: { country: "au" }
      }
    );

    pickupAutocomplete.addListener("place_changed", () => {
      const place = pickupAutocomplete.getPlace();
      const location = place.geometry?.location;

      if (location) {
        setPickupLat(location.lat());
        setPickupLng(location.lng());
      }
    });

    const dropoffAutocomplete = new window.google.maps.places.Autocomplete(
      dropoffRef.current!,
      {
        componentRestrictions: { country: "au" }
      }
    );

    dropoffAutocomplete.addListener("place_changed", () => {
      const place = dropoffAutocomplete.getPlace();
      const location = place.geometry?.location;

      if (location) {
        setDropoffLat(location.lat());
        setDropoffLng(location.lng());
      }
    });

  }, []);

  // 🔵 获取 Active 订单
  async function fetchOrders() {
    try {
      const data = await getMyActiveCustomerOrders();
      setActiveOrders(data);
    } catch {
      setError("Failed to load orders");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔵 创建订单
  async function handleCreate() {
    setError("");

    if (!pickupLat || !dropoffLat) {
      setError("Please select valid addresses from dropdown");
      return;
    }

    try {
      await createOrder({
        pickupLat,
        pickupLng,
        dropoffLat,
        dropoffLng,
        vehicleType
      });

      fetchOrders();
    } catch {
      setError("Create order failed");
    }
  }

  return (
    <AuthGuard allowedRole="CUSTOMER">
      <AdminLayout title="Customer Dashboard">

        <h2>Create Order</h2>

        <input
          ref={pickupRef}
          placeholder="Pickup Address"
          style={inputStyle}
        />

        <input
          ref={dropoffRef}
          placeholder="Dropoff Address"
          style={inputStyle}
        />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
          style={inputStyle}
        >
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>

        <button onClick={handleCreate} style={buttonStyle}>
          Create Order
        </button>

        {error && <p style={{ color: "red" }}>{error}</p>}

        <h2 style={{ marginTop: 40 }}>Active Orders</h2>

        {activeOrders.length === 0 && <p>No active orders</p>}

        {activeOrders.map((order) => (
          <div key={order.id} style={{ marginBottom: 16 }}>
            <p>ID: {order.id}</p>
            <div>
              Status: <StatusBadge status={order.status} />
            </div>
            <p>Vehicle: {order.vehicleType}</p>
            <p>Price: ${(order.priceCents / 100).toFixed(2)}</p>
          </div>
        ))}

      </AdminLayout>
    </AuthGuard>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  marginBottom: 16,
  borderRadius: 8,
  border: "1px solid #d1d5db",
  fontSize: 14
};

const buttonStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  marginBottom: 20
};
