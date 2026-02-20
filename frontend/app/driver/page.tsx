"use client";

import { useEffect, useState } from "react";
//import { getOpenOrders, getMyOrders, acceptOrder, updateOrderStatus } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { getOpenOrders, getMyActiveOrders, getMyHistoryOrders, acceptOrder, updateOrderStatus } from "../../lib/api";
import OrderMap from "../../components/OrderMap";

const startButton: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 16px",
  background: "#7c3aed",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(124,58,237,0.3)",
  transition: "all 0.2s ease"
};

const deliverButton: React.CSSProperties = {
  marginTop: 14,
  padding: "10px 16px",
  background: "#16a34a",
  color: "white",
  border: "none",
  borderRadius: 8,
  cursor: "pointer",
  fontWeight: 600,
  boxShadow: "0 4px 10px rgba(22,163,74,0.3)",
  transition: "all 0.2s ease"
};



export default function DriverPage() {
  const [openOrders, setOpenOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  //const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [error, setError] = useState("");
  
  async function fetchAll() {
    try {
      const open = await getOpenOrders();
      const active = await getMyActiveOrders();
      //const history = await getMyHistoryOrders();
      setOpenOrders(open);
      setActiveOrders(active);
      //setHistoryOrders(history);
    } catch (err) {
      setError("Failed to load orders");
    }
  }

  useEffect(() => {
    fetchAll();
  }, []);

  async function handleAccept(id: string) {
    try {
      await acceptOrder(id);
      fetchAll();
    } catch (err) {
      setError("Accept failed");
    }
  }

  async function handleStatus(id: string, status: string) {
    try {
      await updateOrderStatus(id, status);
      fetchAll();
    } catch (err) {
      setError("Status update failed");
    }
  }

  //open navigation in google by order type (pickup or dropoff) 
  function openNavigation(order: any, type: "pickup" | "dropoff") {

    const destination =
      type === "pickup"
        ? `${order.pickupLat},${order.pickupLng}`
        : `${order.dropoffLat},${order.dropoffLng}`;

    const url = `https://www.google.com/maps/dir/?api=1&destination=${destination}&travelmode=driving`;

    window.open(url, "_blank");
  }


  return (
    <AuthGuard allowedRole="DRIVER">
      <AdminLayout title="Driver Dashboard">
        <br /><br />
        {error && <p style={{ color: "red" }}>{error}</p>}

        <h2>Open Orders</h2>
        {openOrders.length === 0 && <p>No open orders</p>}

        {openOrders.map((order) => (
          <div
            key={order.id}
            style={{
              background: "#ffffff",
              padding: 20,
              borderRadius: 12,
              boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
              marginBottom: 20,
              borderLeft: "6px solid #9ca3af"
            }}
          >
            <div style={{ marginBottom: 8, fontWeight: 600 }}>
              Order #{order.id.slice(0, 8).toUpperCase()}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Pickup:</strong> {order.pickupAddress}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Dropoff:</strong> {order.dropoffAddress}
            </div>

            <div style={{ marginBottom: 6 }}>
              Distance: {order.distanceKm?.toFixed(1)} km
            </div>

            <div style={{ marginBottom: 6 }}>
              Price: ${(order.priceCents / 100).toFixed(2)}
            </div>

            <button
              onClick={() => handleAccept(order.id)}
              style={{
                marginTop: 10,
                padding: "8px 14px",
                background: "#2563eb",
                color: "white",
                border: "none",
                borderRadius: 6,
                cursor: "pointer"
              }}
            >
              Accept
            </button>
          </div>
        ))}

        <h2 style={{ marginTop: 40 }}>Active Orders</h2>
        {activeOrders.length === 0 && <p>No active orders</p>}

        {activeOrders.map((order) => (
          <div
            key={order.id}
            style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
          >
            <p> Order #{order.id.slice(0, 8).toUpperCase()} </p>

            <div style={{ marginBottom: 6 }}>
              <strong>Pickup:</strong> {order.pickupAddress}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Dropoff:</strong> {order.dropoffAddress}
            </div>

            <button
              onClick={() =>
                setExpandedId(expandedId === order.id ? null : order.id)
              }
              style={{
                marginTop: 10,
                background: "transparent",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                fontWeight: 500
              }}
            >
              {expandedId === order.id ? "Hide Map" : "View Map"}
            </button>

            {expandedId === order.id && (
              <OrderMap
                pickupLat={order.pickupLat}
                pickupLng={order.pickupLng}
                dropoffLat={order.dropoffLat}
                dropoffLng={order.dropoffLng}
              />
            )}

            <div style={{ marginBottom: 6 }}>
              Status: <StatusBadge status={order.status} />
            </div>

            <p>Vehicle: {order.vehicleType}</p>
            <p>Price: ${order.priceCents / 100}</p>

            {order.status === "ACCEPTED" && (
              <button
                onClick={() => handleStatus(order.id, "EN_ROUTE_TO_PICKUP")}
                style={startButton}
              >
                🚚 Head to Pickup
              </button>
            )}

            {order.status === "EN_ROUTE_TO_PICKUP" && (
              <>
                <button
                  onClick={() => openNavigation(order, "pickup")}
                  style={startButton}
                >
                  🚗 Navigate to Pickup
                </button>
                <br></br>
                <button
                  onClick={() => handleStatus(order.id, "EN_ROUTE_TO_DROPOFF")}
                  style={startButton}
                >
                  📦 Picked Up – Go to Dropoff
                </button>
              </>
            )}

            {order.status === "EN_ROUTE_TO_DROPOFF" && (
              <>
                <button
                  onClick={() => openNavigation(order, "dropoff")}
                  style={startButton}
                >
                  🚗 Navigate to Dropoff
                </button>
                <br></br>
                <button
                  onClick={() => handleStatus(order.id, "DELIVERED")}
                  style={deliverButton}
                >
                  ✅ Mark Delivered
                </button>
              </>
            )}
          </div>
        ))}
      </AdminLayout>
    </AuthGuard>
  );
}
