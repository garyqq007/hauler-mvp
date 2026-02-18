"use client";
import AuthGuard from "../../../components/AuthGuard";
import AdminLayout from "../../../components/AdminLayout";

export default function ProfilePage() {
  return (
    <AuthGuard allowedRole="CUSTOMER">
      <AdminLayout title="Profile">
        <p>Profile page coming soon...</p>
      </AdminLayout>
    </AuthGuard>
  );
}
