"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherProfileSchema, TeacherProfileFormData, Subject, Class } from "@/lib/validation/teacher-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { 
  Users, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Phone, 
  BookOpen, 
  GraduationCap,
  UserCircle,
  AlertCircle,
  CheckCircle,
  X,
  Sparkles,
  School
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useMessage } from "@/store/messageStore";
import { useRouter } from "next/navigation";

type GenderOption = "Male" | "Female" | "Other";

const SUBJECTS = [
  { value: 'MATH', label: 'Mathematics' },
  { value: 'SCIENCE', label: 'Science' },
  { value: 'ENGLISH', label: 'English' },
  { value: 'COMPUTER_SCIENCE', label: 'Computer Science' },
  { value: 'PHYSICS', label: 'Physics' },
  { value: 'CHEMISTRY', label: 'Chemistry' },
  { value: 'BIOLOGY', label: 'Biology' },
  { value: 'MUSIC', label: 'Music' },
  { value: 'DANCE', label: 'Dance' },
  { value: 'ART', label: 'Art' },
  { value: 'SOCIAL_STUDIES', label: 'Social Studies' },
];

const CLASSES = [
  { value: 'NURSERY', label: 'Nursery' },
  { value: 'LKG', label: 'LKG' },
  { value: 'UKG', label: 'UKG' },
  { value: 'FIRST', label: '1st' },
  { value: 'SECOND', label: '2nd' },
  { value: 'THIRD', label: '3rd' },
  { value: 'FOURTH', label: '4th' },
  { value: 'FIFTH', label: '5th' },
  { value: 'SIXTH', label: '6th' },
  { value: 'SEVENTH', label: '7th' },
  { value: 'EIGHTH', label: '8th' },
  { value: 'NINTH', label: '9th' },
  { value: 'TENTH', label: '10th' },
  { value: 'ELEVENTH', label: '11th' },
  { value: 'TWELFTH', label: '12th' },
];

export default function CreateTeacherProfileForm() {
  const [loading, setLoading] = useState(false);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);

  const { addMessage } = useMessage();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid, dirtyFields },
    setValue,
    reset,
    watch
  } = useForm<TeacherProfileFormData>({
    resolver: zodResolver(teacherProfileSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: TeacherProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post<{message?: string}>('/teacher/create-profile', data);
      addMessage(response.message || "Teacher profile created successfully!", 'success');
      reset();
      setSelectedSubjects([]);
      setSelectedClasses([]);
      // Optionally redirect
      setTimeout(() => router.push('/admin/teachers'), 1500);
    } catch (err) {
      console.error(err);
      addMessage("Failed to create teacher profile. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subject: string) => {
    const updated = selectedSubjects.includes(subject)
      ? selectedSubjects.filter(s => s !== subject)
      : [...selectedSubjects, subject];
    setSelectedSubjects(updated);
    setValue("subjects", updated as any, { shouldDirty: true, shouldValidate: true });
  };

  const toggleClass = (classValue: string) => {
    const updated = selectedClasses.includes(classValue)
      ? selectedClasses.filter(c => c !== classValue)
      : [...selectedClasses, classValue];
    setSelectedClasses(updated);
    setValue("classes", updated as any, { shouldDirty: true, shouldValidate: true });
  };

  const watchedFields = watch();
  const filledFieldsCount = Object.keys(dirtyFields).length;
  const totalRequiredFields = 6; // fullName, email, phone, dob, gender, address
  const progress = Math.min((filledFieldsCount / totalRequiredFields) * 100, 100);

  const InputField = ({ 
    label, 
    name, 
    type = 'text', 
    placeholder, 
    icon: Icon, 
    required = false,
    maxLength
  }: { 
    label: string
    name: keyof TeacherProfileFormData
    type?: string
    placeholder?: string
    icon?: any
    required?: boolean
    maxLength?: number
  }) => {
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50/30 to-emerald-50/30">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-green-600 to-emerald-600 shadow-lg">
                <Users className="h-7 w-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Create Teacher Profile</h1>
                <p className="text-sm text-gray-600 mt-1">Add a new teacher to the system</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/teachers')}
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
                <Sparkles className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-gray-700">Form Progress</span>
              </div>
              <span className="text-sm font-semibold text-green-600">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-green-600 to-emerald-600 h-2.5 rounded-full transition-all duration-300"
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
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <User className="h-5 w-5 text-green-600" />
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
                  placeholder="Enter teacher's full name"
                  required
                  maxLength={100}
                />
              </div>

              {/* Email */}
              <InputField
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                placeholder="teacher@school.com"
                required
              />

              {/* Phone */}
              <InputField
                label="Phone Number"
                name="phone"
                type="tel"
                icon={Phone}
                placeholder="10-15 digit phone number"
                required
                maxLength={15}
              />

              {/* Date of Birth */}
              <InputField
                label="Date of Birth"
                name="dob"
                type="date"
                icon={Calendar}
                required
              />

              {/* Gender */}
              <div>
                <Label htmlFor="gender" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <UserCircle className="h-4 w-4 text-gray-500" />
                  Gender <span className="text-red-500">*</span>
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

              {/* Address */}
              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  Home Address <span className="text-red-500">*</span>
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

          {/* Teaching Subjects Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <BookOpen className="h-5 w-5 text-blue-600" />
                Teaching Subjects
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select the subjects this teacher can teach (optional but recommended)</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {SUBJECTS.map((subject) => (
                  <button
                    key={subject.value}
                    type="button"
                    onClick={() => toggleSubject(subject.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all transform hover:scale-105 ${
                      selectedSubjects.includes(subject.value)
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-emerald-50 text-green-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50/50'
                    }`}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
              {selectedSubjects.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-green-600 bg-green-50 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4" />
                  <span>Selected: {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Teaching Classes Section */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                <GraduationCap className="h-5 w-5 text-purple-600" />
                Teaching Classes
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select the classes this teacher can teach (optional but recommended)</p>
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
                {CLASSES.map((classItem) => (
                  <button
                    key={classItem.value}
                    type="button"
                    onClick={() => toggleClass(classItem.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all transform hover:scale-105 ${
                      selectedClasses.includes(classItem.value)
                        ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50 text-purple-700 shadow-md'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50'
                    }`}
                  >
                    {classItem.label}
                  </button>
                ))}
              </div>
              {selectedClasses.length > 0 && (
                <div className="flex items-center gap-2 text-sm text-purple-600 bg-purple-50 rounded-lg p-3">
                  <CheckCircle className="w-4 h-4" />
                  <span>Selected: {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 bg-white rounded-xl border border-gray-200 shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {isValid && filledFieldsCount >= totalRequiredFields && (
                  <div className="flex items-center gap-1.5 text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    <span>All required fields valid - Ready to submit!</span>
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
                  onClick={() => {
                    reset();
                    setSelectedSubjects([]);
                    setSelectedClasses([]);
                  }}
                  disabled={loading}
                  className="min-w-[120px]"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="min-w-[160px] bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                >
                  {loading ? (
                    <>
                      <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Users className="w-4 h-4 mr-2" />
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