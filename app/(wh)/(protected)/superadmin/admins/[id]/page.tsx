'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { adminApi, Admin } from '@/lib/admin-api'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Edit, Trash2 } from 'lucide-react'
import { useMessage } from '@/store/messageStore'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'

export default function AdminDetail() {
  const router = useRouter()
  const params = useParams()
  const { addMessage } = useMessage()
  const id = params.id as string

  const [admin, setAdmin] = useState<Admin | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [deleteDialog, setDeleteDialog] = useState(false)

  useEffect(() => { if (id) fetchAdmin() }, [id])

  const fetchAdmin = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getById(id)
      setAdmin(data)
    } catch (err) {
      console.error(err)
      addMessage('Failed to load admin', 'error')
      router.push('/superadmin/admins')
    } finally { setLoading(false) }
  }

  const handleDelete = async () => {
    if (!admin) return
    setDeleting(true)
    try {
      await adminApi.delete(admin.id)
      addMessage('Admin deleted', 'success')
      router.push('/superadmin/admins')
    } catch (err) {
      console.error(err)
      addMessage('Failed to delete admin', 'error')
      setDeleting(false)
    }
  }

  if (loading) return <div className="p-6">Loading admin...</div>
  if (!admin) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={() => router.push('/superadmin/admins')}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{admin.username}</h1>
            <p className="text-sm text-gray-600">{admin.email ?? '—'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => router.push(`/superadmin/admins/${admin.id}/edit`)} className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
            <Edit className="w-4 h-4" /> Edit
          </Button>
          <Button variant="destructive" onClick={() => setDeleteDialog(true)}>
            <Trash2 className="w-4 h-4" /> Delete
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-lg border p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase">Username</p>
            <p className="font-semibold">{admin.username}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase">Email</p>
            <p className="font-semibold">{admin.email ?? '—'}</p>
          </div>
        </div>
      </div>

      <Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Admin</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>{deleting ? 'Deleting...' : 'Delete'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
