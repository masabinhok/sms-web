import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import DashboardCard from '@/components/ui/DashboardCard'
import DashboardGrid from '@/components/ui/DashboardGrid'
import { BookOpen, FileText, Star } from 'lucide-react'

export default function StudentDashboard() {
  return (
    <ProtectedRoute requiredRole="STUDENT">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">Overview of your courses, assignments and progress</p>
          </div>

          <DashboardGrid>
            <DashboardCard title="Enrolled Courses" value={<span>4</span>} subtitle="Active this semester" color="blue" icon={BookOpen} />
            <DashboardCard title="Pending Assignments" value={<span>2</span>} subtitle="Due soon" color="green" icon={FileText} />
            <DashboardCard title="GPA" value={<span>3.8</span>} subtitle="Current average" color="purple" icon={Star} />
          </DashboardGrid>

          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Tools</h2>
            <p className="text-gray-600">Quick links and recent items will appear here.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
