"use client";

import { useState, useEffect } from "react";
import { createOrder, getMyActiveCustomerOrders } from "../../lib/api";
import AuthGuard from "../../components/AuthGuard";
import AdminLayout from "../../components/AdminLayout";
import StatusBadge from "../../components/StatusBadge";

export default function CustomerPage() {
  const [pickupLat, setPickupLat] = useState("");
  const [pickupLng, setPickupLng] = useState("");
  const [dropoffLat, setDropoffLat] = useState("");
  const [dropoffLng, setDropoffLng] = useState("");
  const [vehicleType, setVehicleType] = useState("SMALL");

  //const [orders, setOrders] = useState<any[]>([]);
  const [activeOrders, setActiveOrders] = useState<any[]>([]);
  const [error, setError] = useState("");

  async function fetchOrders() {
    try {
      const data = await getMyActiveCustomerOrders();
      setActiveOrders(data);
    } catch (err) {
      setError("Failed to load orders");
    }
  }


  useEffect(() => {
    fetchOrders();
  }, []);

  async function handleCreate() {
    try {
      await createOrder({
        pickupLat: parseFloat(pickupLat),
        pickupLng: parseFloat(pickupLng),
        dropoffLat: parseFloat(dropoffLat),
        dropoffLng: parseFloat(dropoffLng),
        vehicleType
      });

      fetchOrders(); // 创建后刷新列表
    } catch (err) {
      setError("Create order failed");
    }
  }

  return (
    <AuthGuard allowedRole="CUSTOMER">
      <AdminLayout title="Customer Dashboard">

        <br /><br />

        <h2>Create Order</h2>

        <input placeholder="Pickup Lat"
          value={pickupLat}
          onChange={(e) => setPickupLat(e.target.value)}
        /><br /><br />

        <input placeholder="Pickup Lng"
          value={pickupLng}
          onChange={(e) => setPickupLng(e.target.value)}
        /><br /><br />

        <input placeholder="Dropoff Lat"
          value={dropoffLat}
          onChange={(e) => setDropoffLat(e.target.value)}
        /><br /><br />

        <input placeholder="Dropoff Lng"
          value={dropoffLng}
          onChange={(e) => setDropoffLng(e.target.value)}
        /><br /><br />

        <select
          value={vehicleType}
          onChange={(e) => setVehicleType(e.target.value)}
        >
          <option value="SMALL">SMALL</option>
          <option value="MEDIUM">MEDIUM</option>
          <option value="LARGE">LARGE</option>
        </select>

        <br /><br />

        <button onClick={handleCreate}>
          Create Order
        </button>

        <h2 style={{ marginTop: 40 }}>Active Orders</h2>

        {activeOrders.length === 0 && <p>No active orders</p>}

        {activeOrders.map((order) => (
          <div key={order.id} style={{ marginBottom: 12 }}>
            <p>ID: {order.id}</p>
            <div>
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
