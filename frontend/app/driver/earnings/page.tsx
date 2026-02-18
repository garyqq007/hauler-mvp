"use client";

import { useEffect, useState } from "react";
import { getMyHistoryOrders } from "../../../lib/api";
import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";

export default function EarningsPage() {

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function fetchData() {
      const data = await getMyHistoryOrders();
      setOrders(data);
    }
    fetchData();
  }, []);

  const total = orders.reduce(
    (sum, order) => sum + order.priceCents,
    0
  );

  return (
    <AuthGuard allowedRole="DRIVER">
      <AdminLayout title="Earnings">

        <h3>Total Completed Orders: {orders.length}</h3>
        <h2>Total Earnings: ${(total / 100).toFixed(2)}</h2>

      </AdminLayout>
    </AuthGuard>
  );
}
