
import Sidebar from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";

export default function AdminLayout({children}: {children: ReactNode}){
    return (
        <div className="flex min-h-screen bg-bg-premium">
            <Sidebar role="admin"/>
            <main className="flex-1 overflow-auto relative z-0">
                {children}
            </main>
        </div>
    )
}