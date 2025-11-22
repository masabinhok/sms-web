"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { adminProfileSchema, AdminProfileFormData } from "@/lib/validation/admin-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { 
  ShieldCheck, 
  User, 
  Mail, 
  AlertCircle, 
  CheckCircle,
  X,
  Sparkles,
  Lock,
  Shield,
  UserCog
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useAuth } from '@/store/authStore'
import { useMessage } from "@/store/messageStore";
import { useRouter } from "next/navigation";

// InputField component moved outside to prevent recreation on every render
interface InputFieldProps {
  label: string;
  name: keyof AdminProfileFormData;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  helpText?: string;
  register: ReturnType<typeof useForm<AdminProfileFormData>>['register'];
  errors: ReturnType<typeof useForm<AdminProfileFormData>>['formState']['errors'];
  dirtyFields: ReturnType<typeof useForm<AdminProfileFormData>>['formState']['dirtyFields'];
}

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  required = false,
  helpText,
  register,
  errors,
  dirtyFields
}: InputFieldProps) => {
  const hasError = errors[name]
  const isFieldValid = dirtyFields[name] && !errors[name]

  return (
    <div>
      <Label htmlFor={name} className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
        {Icon && <Icon className="w-4 h-4 text-gray-500" />}
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className={`${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${isFieldValid ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}`}
        />
        {isFieldValid && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
      </div>
      {hasError && (
        <div className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{hasError.message}</span>
        </div>
      )}
      {helpText && !hasError && (
        <p className="mt-1.5 text-xs text-gray-500">{helpText}</p>
      )}
    </div>
  )
}

export default function CreateAdminProfilePage() {
  const [loading, setLoading] = useState(false);
  const { addMessage } = useMessage();
  const router = useRouter();
  const { user } = useAuth();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    reset,
    watch
  } = useForm<AdminProfileFormData>({
    resolver: zodResolver(adminProfileSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: AdminProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post<{ message?: string }>('/auth/create-admin', data);
      addMessage(response.message! || "Admin profile created successfully!", 'success');
      reset();
      // Optionally redirect
      setTimeout(() => router.push('/superadmin'), 1500);
    } catch (err) {
      console.error(err);
      addMessage("Failed to create admin profile. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const watchedFields = watch();
  const filledFieldsCount = Object.keys(dirtyFields).length;
  const totalRequiredFields = 2; // name, email
  const progress = Math.min((filledFieldsCount / totalRequiredFields) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50/30 to-indigo-50/30">
      {!user || user.role !== 'SUPERADMIN' ? (
        <div className="mx-auto max-w-4xl p-8">
          <div className="bg-white rounded-xl border border-red-200 p-8 text-center">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Unauthorized</h2>
            <p className="text-sm text-gray-600">Only SUPERADMIN users can create administrator accounts.</p>
            <div className="mt-6">
              <Button variant="outline" onClick={() => router.push('/')}>
                Go Home
              </Button>
            </div>
          </div>
        </div>
      ) : (
      <div className="mx-auto max-w-4xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-purple-600 to-indigo-600 shadow-lg">
                <ShieldCheck className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Admin Profile</h1>
                <p className="text-sm text-gray-600 mt-1">Add a new administrator to the system</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/superadmin')}
              className="w-fit"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-medium text-gray-700">Form Progress</span>
              </div>
              <span className="text-sm font-semibold text-purple-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-purple-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {filledFieldsCount} of {totalRequiredFields} required fields completed
            </p>
          </div>
        </div>

        {/* Info Banner */}
        <div className="mb-6 rounded-xl border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50 p-5 shadow-sm">
          <div className="flex gap-3">
            <Shield className="h-6 w-6 text-purple-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-purple-900 mb-2 flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Administrator Privileges
              </h3>
              <p className="text-sm text-purple-700 leading-relaxed">
                Admins have full access to the system including creating students, teachers, and other admins. 
                Please ensure you trust the person you&apos;re granting administrator access to. This action cannot be undone easily.
              </p>
            </div>
          </div>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Admin Information Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-indigo-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5 text-purple-600" />
                Administrator Information
              </h2>
            </div>
            
            <div className="space-y-5">
              {/* Name */}
              <InputField
                label="Full Name"
                name="name"
                icon={UserCog}
                placeholder="Enter administrator's full name"
                required
                helpText="The full name of the person who will have administrator access"
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
              />

              {/* Email */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                placeholder="admin@school.com"
                required
                helpText="Login credentials will be sent to this email address"
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
              />
            </div>
          </div>

          {/* Permissions Overview */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-5 pb-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-cyan-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <ShieldCheck className="h-5 w-5 text-blue-600" />
                Administrator Permissions
              </h2>
            </div>
            
            <p className="mb-5 text-sm text-gray-600 font-medium">
              This administrator will have access to:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                'Create, edit, and delete student profiles',
                'Create, edit, and delete teacher profiles',
                'Create additional administrator accounts (SUPERADMIN only)',
                'View and manage all system data',
                'Access system settings and configurations',
                'Generate reports and analytics',
              ].map((permission, index) => (
                <div key={index} className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-100">
                  <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-gray-700 font-medium">{permission}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Security Note */}
          <div className="rounded-xl border-2 border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 shadow-sm">
            <div className="flex gap-3">
              <Lock className="h-6 w-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Security Notice
                </h3>
                <p className="text-sm text-amber-700 leading-relaxed">
                  A temporary password will be generated and sent to the provided email address. 
                  The new administrator will be required to change their password upon first login for security purposes.
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {isValid && filledFieldsCount >= totalRequiredFields && (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>All fields valid - Ready to create admin!</span>
                  </div>
                )}
                {Object.keys(errors).length > 0 && (
                  <div className="flex items-center gap-1.5 text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{Object.keys(errors).length} validation error{Object.keys(errors).length !== 1 ? 's' : ''}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => reset()}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="min-w-[160px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
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
            </div>
          </div>
        </form>
      </div>
      )}
      </div>
  );
}