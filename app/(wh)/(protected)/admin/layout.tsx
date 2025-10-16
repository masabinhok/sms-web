
import Sidebar from "@/components/sidebar/Sidebar";
import { ReactNode } from "react";

export default function AdminLayout({children}: {children: ReactNode}){
    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar role="admin"/>
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    )
}