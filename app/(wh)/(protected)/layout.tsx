import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { WhiteNavbar } from "@/components/sections/WhiteNavbar";

export default function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <section>
        <WhiteNavbar />
        <div className=" bg-gray-50">
          {children}
        </div>
      </section>
    </ProtectedRoute>
  );
}