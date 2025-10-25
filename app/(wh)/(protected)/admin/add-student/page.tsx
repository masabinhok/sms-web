"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentProfileSchema, StudentProfileFormData } from "@/lib/validation/student-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect } from "react";
import { 
  GraduationCap, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  Users,
  UserCircle,
  School,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useMessage } from "@/store/messageStore";
import { useRouter } from "next/navigation";
import { getAllClasses, Class } from "@/lib/academics-api";

type GenderOption = "Male" | "Female" | "Other";

// InputField component moved outside to prevent recreation on every render
interface InputFieldProps {
  label: string;
  name: keyof StudentProfileFormData;
  type?: string;
  placeholder?: string;
  icon?: any;
  required?: boolean;
  maxLength?: number;
  register: any;
  errors: any;
  dirtyFields: any;
}

const InputField = ({ 
  label, 
  name, 
  type = 'text', 
  placeholder, 
  icon: Icon, 
  required = false,
  maxLength,
  register,
  errors,
  dirtyFields
}: InputFieldProps) => {
  const hasError = errors[name]
  const isValid = dirtyFields[name] && !errors[name]

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
          maxLength={maxLength}
          {...register(name)}
          className={`${hasError ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''} ${isValid ? 'border-green-300 focus:border-green-500 focus:ring-green-500' : ''}`}
        />
        {isValid && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
      </div>
      {hasError && (
        <div className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="w-4 h-4" />
          <span>{hasError.message}</span>
        </div>
      )}
    </div>
  )
}

export default function CreateStudentProfileForm() {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingClasses, setLoadingClasses] = useState(true);
  const { addMessage } = useMessage();
  const router = useRouter();
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    setValue,
    reset,
    watch
  } = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
    mode: "onChange"
  });

  // Fetch classes on mount
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        setLoadingClasses(true);
        const data = await getAllClasses(undefined, true); // Get only active classes
        setClasses(data);
      } catch (error) {
        console.error("Failed to fetch classes:", error);
        addMessage("Failed to load classes. Please refresh the page.", 'error');
      } finally {
        setLoadingClasses(false);
      }
    };

    fetchClasses();
  }, [addMessage]);

  const onSubmit = async (data: StudentProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post<{message?: string}>('/students/create-profile', data);
      addMessage(response.message || "Student profile created successfully!", 'success');
      reset();
      // Optionally redirect to students list
      setTimeout(() => router.push('/admin/students'), 1500);
    } catch (err) {
      console.error(err);
      addMessage("Failed to create student profile. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const watchedFields = watch();
  const filledFieldsCount = Object.keys(dirtyFields).length;
  const totalRequiredFields = 7; // fullName, dob, email, classId, guardianName, guardianContact (address and gender are optional)
  const progress = Math.min((filledFieldsCount / totalRequiredFields) * 100, 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 shadow-lg">
                <GraduationCap className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Student Profile</h1>
                <p className="text-sm text-gray-600 mt-1">Add a new student to the system</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/students')}
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
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-gray-700">Form Progress</span>
              </div>
              <span className="text-sm font-semibold text-blue-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {filledFieldsCount} of {totalRequiredFields} required fields completed
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Full Name */}
              <div className="md:col-span-2">
                <InputField
                  label="Full Name"
                  name="fullName"
                  icon={User}
                  placeholder="Enter student's full name"
                  required
                  maxLength={100}
                  register={register}
                  errors={errors}
                  dirtyFields={dirtyFields}
                />
              </div>

              {/* Date of Birth */}
              <InputField
                label="Date of Birth"
                name="dob"
                type="date"
                icon={Calendar}
                required
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
              />

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <UserCircle className="h-4 w-4 text-gray-500" />
                  Gender
                </Label>
                <Select onValueChange={(val: GenderOption) => setValue("gender", val, { shouldDirty: true, shouldValidate: true })}>
                  <SelectTrigger className={errors.gender ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.gender.message}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <InputField
                  label="Email Address"
                  name="email"
                  type="email"
                  icon={Mail}
                  placeholder="student@school.com"
                  required
                  register={register}
                  errors={errors}
                  dirtyFields={dirtyFields}
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Home Address
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete home address"
                  rows={3}
                  maxLength={200}
                  {...register("address")}
                  className={errors.address ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
                />
                {errors.address && (
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address.message}</span>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  {(watchedFields.address?.length || 0)}/200 characters
                </p>
              </div>
            </div>
          </div>

          {/* Academic Information Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <School className="h-5 w-5 text-indigo-600" />
                Academic Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-5">
              {/* Class Selection */}
              <div>
                <Label htmlFor="classId" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <School className="h-4 w-4 text-gray-500" />
                  Class <span className="text-red-500">*</span>
                </Label>
                {loadingClasses ? (
                  <div className="flex items-center justify-center p-4 border rounded-lg">
                    <Loader2 className="w-5 h-5 animate-spin text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Loading classes...</span>
                  </div>
                ) : classes.length === 0 ? (
                  <div className="p-4 border border-amber-200 bg-amber-50 rounded-lg">
                    <p className="text-sm text-amber-800">No classes available. Please create a class first.</p>
                  </div>
                ) : (
                  <Select onValueChange={(val) => setValue("classId", val, { shouldDirty: true, shouldValidate: true })}>
                    <SelectTrigger className={errors.classId ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}>
                      <SelectValue placeholder="Select a class" />
                    </SelectTrigger>
                    <SelectContent>
                      {classes.map((classItem) => (
                        <SelectItem key={classItem.id} value={classItem.id}>
                          {classItem.name} {classItem.section ? `(Section ${classItem.section})` : ''} - {classItem.academicYear}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
                {errors.classId && (
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-red-600">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.classId.message}</span>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-gray-500">
                  Roll number will be automatically assigned
                </p>
              </div>
            </div>
          </div>

          {/* Guardian Information Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-teal-50 to-cyan-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <Users className="h-5 w-5 text-teal-600" />
                Guardian Information
              </h2>
            </div>
            
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              {/* Guardian Name */}
              <InputField
                label="Guardian Name"
                name="guardianName"
                icon={UserCircle}
                placeholder="Parent/Guardian full name"
                required
                maxLength={100}
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
              />

              {/* Guardian Contact */}
              <InputField
                label="Guardian Contact"
                name="guardianContact"
                type="tel"
                icon={Phone}
                placeholder="10-15 digit phone number"
                required
                maxLength={15}
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {isValid && filledFieldsCount >= totalRequiredFields && (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>All fields valid - Ready to submit!</span>
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
                  className="min-w-[160px] bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                >
                  {loading ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <GraduationCap className="w-4 h-4 mr-2" />
                      Create Profile
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}