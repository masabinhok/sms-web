import { ProtectedRoute } from "@/components/auth/ProtectedRoute";


export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
        <div className=" bg-gray-50">
          {children}
        </div>
    </ProtectedRoute>
  );
}