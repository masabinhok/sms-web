import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

export default function TeacherDashboard() {
  return (
    <ProtectedRoute requiredRole="TEACHER">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-gray-600">Manage your classes and students</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">My Classes</h3>
              <p className="text-3xl font-bold text-blue-600">5</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-green-600">125</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Assignments</h3>
              <p className="text-3xl font-bold text-purple-600">8</p>
            </div>
          </div>

          <div className="mt-8 bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Teacher Tools</h2>
            <p className="text-gray-600">This is the teacher dashboard - only accessible by teachers and admins.</p>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}