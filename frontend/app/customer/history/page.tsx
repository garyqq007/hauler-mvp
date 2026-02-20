"use client";

import { useEffect, useState } from "react";
import { getMyHistoryCustomerOrders } from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";
import StatusBadge from "../../../components/StatusBadge";

export default function HistoryPage() {

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getMyHistoryCustomerOrders();
      setOrders(data);
    }
    fetchData();
  }, []);

  return (
    <AuthGuard allowedRole="CUSTOMER">
      <AdminLayout title="History Orders">

        {orders.length === 0 && <p>No completed orders</p>}

        {orders.map((order) => (
          <div key={order.id} style={{ marginBottom: 16 }}>
            <p>ID: {order.id}</p>
            <div>
              Status: <StatusBadge status={order.status} />
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Pickup:</strong> {order.pickupAddress}
            </div>

            <div style={{ marginBottom: 6 }}>
              <strong>Dropoff:</strong> {order.dropoffAddress}
            </div>

            <p>Vehicle: {order.vehicleType}</p>
            <p>Distance: {order.distanceKm?.toFixed(2)} km</p>
            <p>Total: ${(order.priceCents / 100).toFixed(2)}</p>
          </div>
        ))}

      </AdminLayout>
    </AuthGuard>
  );
}
