"use client";
import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";

export default function SupportPage() {
  return (
    <AuthGuard allowedRole="CUSTOMER">
      <AdminLayout title="Support">
        <p>Support page coming soon...</p>
      </AdminLayout>
    </AuthGuard>
  );
}
