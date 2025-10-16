import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import DashboardCard from '@/components/ui/DashboardCard'
import DashboardGrid from '@/components/ui/DashboardGrid'
import { BookOpen, Users, FileText, Settings } from 'lucide-react'

export default function TeacherDashboard() {
  return (
    <ProtectedRoute allowedRoles={["TEACHER"]}>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your classes, students and assignments</p>
          </div>

          <DashboardGrid>
            <DashboardCard title="My Classes" value={<span>5</span>} subtitle="Active this term" color="blue" icon={BookOpen} />
            <DashboardCard title="Total Students" value={<span>125</span>} subtitle="Across all your classes" color="green" icon={Users} />
            <DashboardCard title="Assignments" value={<span>8</span>} subtitle="Pending review" color="purple" icon={FileText} />
          </DashboardGrid>

          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
              <p className="text-gray-600">No recent activity yet — this panel can show recent submissions and announcements.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-3">
                <button className="w-full text-left px-4 py-2 bg-sky-50 text-sky-700 rounded hover:bg-sky-100">Create Assignment</button>
                <button className="w-full text-left px-4 py-2 bg-emerald-50 text-emerald-700 rounded hover:bg-emerald-100">View Students</button>
                <button className="w-full text-left px-4 py-2 bg-gray-50 text-gray-700 rounded hover:bg-gray-100">Settings</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}