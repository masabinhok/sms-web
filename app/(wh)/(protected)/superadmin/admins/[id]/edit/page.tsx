'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { adminProfileSchema, AdminProfileFormData } from '@/lib/validation/admin-profile-schema'
import { adminApi } from '@/lib/admin-api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useMessage } from '@/store/messageStore'

export default function EditAdminPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const { addMessage } = useMessage()

  const [loading, setLoading] = useState(true)

  const { register, handleSubmit, reset, formState: { errors, isValid, dirtyFields } } = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
    mode: 'onChange'
  })

  useEffect(() => { if (id) fetchAdmin() }, [id])

  const fetchAdmin = async () => {
    setLoading(true)
    try {
      const data = await adminApi.getById(id)
      reset({ name: data.username, email: data.email ?? '' })
    } catch (err) {
      console.error(err)
      addMessage('Failed to load admin', 'error')
      router.push('/superadmin/admins')
    } finally { setLoading(false) }
  }

  const onSubmit = async (data: AdminProfileFormData) => {
    setLoading(true)
    try {
      await adminApi.update(id, { email: data.email })
      addMessage('Admin updated', 'success')
      router.push(`/superadmin/admins/${id}`)
    } catch (err) {
      console.error(err)
      addMessage('Failed to update admin', 'error')
    } finally { setLoading(false) }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Edit Admin</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 bg-white p-6 rounded-lg border">
        <div>
          <Label>Username</Label>
          <Input {...register('name')} disabled />
        </div>

        <div>
          <Label>Email</Label>
          <Input {...register('email')} />
          {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>}
        </div>

        <div className="flex items-center justify-end gap-2">
          <Button variant="outline" onClick={() => router.push(`/superadmin/admins/${id}`)}>Cancel</Button>
          <Button type="submit" disabled={!isValid}>Save</Button>
        </div>
      </form>
    </div>
  )
}
