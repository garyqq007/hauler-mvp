"use client";

import { useEffect, useState } from "react";
//import { getOpenOrders, getMyOrders, acceptOrder, updateOrderStatus } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";
import { getOpenOrders, getMyActiveOrders, getMyHistoryOrders, acceptOrder, updateOrderStatus } from "../../lib/api";




export default function DriverPage() {
  const [openOrders, setOpenOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [historyOrders, setHistoryOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function fetchAll() {
    try {
      const open = await getOpenOrders();
      const active = await getMyActiveOrders();
      const history = await getMyHistoryOrders();
      setOpenOrders(open);
      setActiveOrders(active);
      setHistoryOrders(history);
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
      <AdminLayout title="Driver Dashboard">
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
            <div style={{ marginBottom: 6 }}>
              Status: <StatusBadge status={order.status} />
            </div>
            <p>Vehicle: {order.vehicleType}</p>
            <p>Price: ${order.priceCents / 100}</p>

            <button onClick={() => handleAccept(order.id)}>
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
            <p>ID: {order.id}</p>

            <div style={{ marginBottom: 6 }}>
              Status: <StatusBadge status={order.status} />
            </div>

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

        <h2 style={{ marginTop: 40 }}>Completed Orders</h2>
        {historyOrders.length === 0 && <p>No completed orders</p>}

        {historyOrders.map((order) => (
          <div key={order.id} style={{ border: "1px solid #ccc", padding: 10, marginBottom: 10 }}>
            <p>ID: {order.id}</p>
            <div style={{ marginBottom: 6 }}>
              Status: <StatusBadge status={order.status} />
            </div>
            <p>Vehicle: {order.vehicleType}</p>
            <p>Price: ${order.priceCents / 100}</p>
          </div>
        ))}

      </AdminLayout>
    </AuthGuard>
  );
}
