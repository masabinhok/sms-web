import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import Link from 'next/link'

export default function AdminDashboard() {
  return (
    <ProtectedRoute requiredRole="ADMIN">
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage your school management system</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {/* Quick Stats */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Students</h3>
              <p className="text-3xl font-bold text-blue-600">1,234</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Teachers</h3>
              <p className="text-3xl font-bold text-green-600">56</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Active Classes</h3>
              <p className="text-3xl font-bold text-purple-600">24</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Admin Privileges */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Access</h2>
              <p className="text-gray-600 mb-4">As an admin, you have access to all areas:</p>
              
              <div className="space-y-3">
                <Link 
                  href="/student" 
                  className="block p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <span className="font-medium text-blue-900">Student Dashboard</span>
                  <p className="text-sm text-blue-600">View student portal and manage student data</p>
                </Link>
                
                <Link 
                  href="/teacher" 
                  className="block p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <span className="font-medium text-green-900">Teacher Dashboard</span>
                  <p className="text-sm text-green-600">Access teacher tools and manage classes</p>
                </Link>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <span className="font-medium text-purple-900">Admin Panel</span>
                  <p className="text-sm text-purple-600">Full system administration (current)</p>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">Manage Users</span>
                  <p className="text-sm text-gray-600">Add, edit, or remove users</p>
                </button>
                
                <button className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">System Settings</span>
                  <p className="text-sm text-gray-600">Configure system preferences</p>
                </button>
                
                <button className="w-full p-3 text-left bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                  <span className="font-medium text-gray-900">Reports</span>
                  <p className="text-sm text-gray-600">Generate and view reports</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}