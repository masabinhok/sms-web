import Link from 'next/link'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex pt-40 justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          You don't have permission to access this page.
        </p>
        <Link 
          href="/"
          className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}