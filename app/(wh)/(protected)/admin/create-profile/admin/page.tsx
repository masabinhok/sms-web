"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminProfileSchema, AdminProfileFormData } from "@/lib/validation/admin-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { ShieldCheck, User, Mail, AlertCircle, CheckCircle2 } from "lucide-react";
import { api } from "@/lib/api-client";
import { useMessage } from "@/store/messageStore";

export default function CreateAdminProfilePage() {
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessage();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
  });

  const onSubmit = async (data: AdminProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post<{ message?: string }>('/auth/create-admin', data);
      addMessage(response.message! || "Admin profile created successfully!", 'success');
      reset();
    } catch (err) {
      console.error(err);
      addMessage("Failed to create admin profile. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100">
            <ShieldCheck className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Admin Profile</h1>
            <p className="text-sm text-gray-600">Add a new administrator to the system</p>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="mb-6 rounded-xl border border-purple-200 bg-purple-50 p-4">
        <div className="flex gap-3">
          <AlertCircle className="h-5 w-5 text-purple-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-purple-900 mb-1">Administrator Privileges</h3>
            <p className="text-sm text-purple-700">
              Admins have full access to the system including creating students, teachers, and other admins. 
              Please ensure you trust the person you're granting admin access to.
            </p>
          </div>
        </div>
      </div>

   
      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Admin Information Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <User className="h-5 w-5 text-gray-600" />
            Administrator Information
          </h2>
          
          <div className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                placeholder="Enter administrator's full name"
                {...register("name")}
                className={errors.name ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                The full name of the person who will have administrator access
              </p>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@school.com"
                {...register("email")}
                className={errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">
                Login credentials will be sent to this email address
              </p>
            </div>
          </div>
        </div>

        {/* Permissions Overview */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <ShieldCheck className="h-5 w-5 text-gray-600" />
            Administrator Permissions
          </h2>
          
          <p className="mb-4 text-sm text-gray-600">
            This administrator will have access to:
          </p>

          <div className="space-y-3">
            {[
              'Create, edit, and delete student profiles',
              'Create, edit, and delete teacher profiles',
              'Create additional administrator accounts',
              'View and manage all system data',
              'Access system settings and configurations',
              'Generate reports and analytics',
            ].map((permission, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-700">{permission}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Note */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-900 mb-1">Security Notice</h3>
              <p className="text-sm text-amber-700">
                A temporary password will be generated and sent to the provided email address. 
                The new administrator will be required to change their password upon first login.
              </p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => reset()}
            disabled={loading}
            className="min-w-[120px]"
          >
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px] bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Creating...
              </>
            ) : (
              <>
                <ShieldCheck className="mr-2 h-4 w-4" />
                Create Admin
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}