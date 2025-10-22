'use client'

import { useEffect, useState } from 'react'
import { adminApi, Admin } from '@/lib/admin-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { useMessage } from '@/store/messageStore'
import { Trash2, Plus, Search, Edit } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SuperAdminAdminsPage() {
  const router = useRouter()
  const { addMessage } = useMessage()

  const [admins, setAdmins] = useState<Admin[]>([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState('')
  const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; admin: Admin | null }>({ open: false, admin: null })
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchAdmins = async () => {
    setLoading(true)
    try {
      const res = await adminApi.getAll({ page, limit, search: search || undefined })
      setAdmins(res.data)
      setTotal(res.meta.total)
    } catch (err) {
      console.error(err)
      addMessage('Failed to load admins', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAdmins() }, [page])

  useEffect(() => {
    const t = setTimeout(() => { setPage(1); fetchAdmins() }, 400)
    return () => clearTimeout(t)
  }, [search])

  const confirmDelete = async () => {
    if (!deleteDialog.admin) return
    setDeleting(deleteDialog.admin.id)
    try {
      await adminApi.delete(deleteDialog.admin.id)
      addMessage('Admin deleted', 'success')
      setDeleteDialog({ open: false, admin: null })
      fetchAdmins()
    } catch (err) {
      console.error(err)
      addMessage('Failed to delete admin', 'error')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Manage Admins</h1>
          <p className="text-sm text-gray-600">Create and manage administrative accounts</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input className="pl-10" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Button onClick={() => router.push('/superadmin/add-admin')} className="flex items-center gap-2">
            <Plus className="w-4 h-4" /> Add Admin
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Username</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Full Name</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Email</th>
                <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Created</th>
                <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500">Loading admins...</td></tr>
              ) : admins.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-gray-500">No admins found</td></tr>
              ) : (
                admins.map((a) => (
                  <tr
                    key={a.id}
                    className="hover:bg-gray-50 cursor-pointer focus:outline-none focus-visible:bg-gray-100"
                    role="button"
                    tabIndex={0}
                    onClick={() => router.push(`/superadmin/admins/${a.id}`)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        router.push(`/superadmin/admins/${a.id}`)
                      }
                    }}
                  >
                    <td className="px-6 py-4">{a.username}</td>
                    <td className="px-6 py-4">{a.fullName ?? '—'}</td>
                    <td className="px-6 py-4">{a.email ?? '—'}</td>
                    <td className="px-6 py-4">{a.createdAt ? new Date(a.createdAt).toLocaleString() : '—'}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={(e) => { e.stopPropagation(); router.push(`/superadmin/admins/${a.id}/edit`) }}
                          className="text-green-600 hover:text-green-800 p-1 rounded"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={(e) => { e.stopPropagation(); setDeleteDialog({ open: true, admin: a }) }}
                          className="text-red-600 hover:text-red-800 p-1 rounded"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, admin: null })}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this admin? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialog({ open: false, admin: null })}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={!!deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
