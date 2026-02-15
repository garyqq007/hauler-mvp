"use client";

import { useEffect, useState } from "react";
import { getOpenOrders,getMyOrders,acceptOrder,updateOrderStatus} from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";

export default function DriverPage() {
  const [openOrders, setOpenOrders] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function fetchAll() {
    try {
      const open = await getOpenOrders();
      const mine = await getMyOrders();
      setOpenOrders(open);
      setMyOrders(mine);
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

  return (
    <AuthGuard allowedRole="DRIVER">
    <div style={{ padding: 40 }}>
      <h1>Driver Dashboard</h1>
      <br /><br />
      <button
       onClick={() => {
       localStorage.removeItem("token");
       localStorage.removeItem("role");
       window.location.href = "/"; }
       }
       style={{ marginBottom: 20 }}
       >
       Logout
    </button>
     
    <br /><br />
      {error && <p style={{ color: "red" }}>{error}</p>}

      <h2>Open Orders</h2>
      {openOrders.length === 0 && <p>No open orders</p>}

      {openOrders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <p>ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Vehicle: {order.vehicleType}</p>
          <p>Price: ${order.priceCents / 100}</p>

          <button onClick={() => handleAccept(order.id)}>
            Accept
          </button>
        </div>
      ))}

      <h2 style={{ marginTop: 40 }}>My Orders</h2>
      {myOrders.length === 0 && <p>No active orders</p>}

      {myOrders.map((order) => (
        <div
          key={order.id}
          style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}
        >
          <p>ID: {order.id}</p>
          <p>Status: {order.status}</p>
          <p>Vehicle: {order.vehicleType}</p>
          <p>Price: ${order.priceCents / 100}</p>

          {order.status === "ACCEPTED" && (
            <button
              onClick={() => handleStatus(order.id, "ON_THE_WAY")}
            >
              Start Trip
            </button>
          )}

          {order.status === "ON_THE_WAY" && (
            <button
              onClick={() => handleStatus(order.id, "DELIVERED")}
            >
              Mark Delivered
            </button>
          )}
        </div>
      ))}
    </div>
    </AuthGuard>
  );
}
