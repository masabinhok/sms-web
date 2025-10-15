import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function StudentDashboard() {
  return (
    <ProtectedRoute requiredRole="STUDENT">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
            <p className="text-gray-600">View your courses, assignments and progress</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enrolled Courses</h3>
              <p className="text-3xl font-bold text-blue-600">4</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Pending Assignments</h3>
              <p className="text-3xl font-bold text-green-600">2</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">GPA</h3>
              <p className="text-3xl font-bold text-purple-600">3.8</p>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Student Tools</h2>
            <p className="text-gray-600">This area can contain links to resources and quick actions.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}
