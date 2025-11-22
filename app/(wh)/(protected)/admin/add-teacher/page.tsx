"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherProfileSchema, TeacherProfileFormData } from "@/lib/validation/teacher-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
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
  School,
  Loader2
} from "lucide-react";
import { api } from "@/lib/api-client";
import { useMessage } from "@/store/messageStore";
import { useRouter } from "next/navigation";
import { getAllClasses, getAllSubjects, Class, Subject } from "@/lib/academics-api";

type GenderOption = "Male" | "Female" | "Other";

// InputField component moved outside to prevent recreation on every render
interface InputFieldProps {
  label: string;
  name: keyof TeacherProfileFormData;
  type?: string;
  placeholder?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  maxLength?: number;
  register: ReturnType<typeof useForm<TeacherProfileFormData>>['register'];
  errors: ReturnType<typeof useForm<TeacherProfileFormData>>['formState']['errors'];
  dirtyFields: ReturnType<typeof useForm<TeacherProfileFormData>>['formState']['dirtyFields'];
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
      <Label htmlFor={name} className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium-muted">
        {Icon && <Icon className="w-4 h-4 text-fg-premium-muted" />}
        {label} {required && <span className="text-red-400">*</span>}
      </Label>
      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          maxLength={maxLength}
          {...register(name)}
          className={`bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20 ${hasError ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/20' : ''} ${isValid ? 'border-green-500/50 focus:border-green-500 focus:ring-green-500/20' : 'focus:border-accent-primary focus:ring-accent-primary/20'}`}
        />
        {isValid && (
          <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-500" />
        )}
      </div>
      {hasError && (
        <div className="mt-1.5 flex items-center gap-1 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{hasError.message}</span>
        </div>
      )}
    </div>
  )
}

export default function CreateTeacherProfileForm() {
  const [loading, setLoading] = useState(false);
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedClassIds, setSelectedClassIds] = useState<string[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
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
  } = useForm<TeacherProfileFormData>({
    resolver: zodResolver(teacherProfileSchema),
    mode: "onChange"
  });

  // Fetch subjects and classes on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingSubjects(true);
        setLoadingClasses(true);
        
        const [subjectsData, classesData] = await Promise.all([
          getAllSubjects(undefined, true), // Get only active subjects
          getAllClasses(undefined, true)   // Get only active classes
        ]);
        
        setSubjects(subjectsData);
        setClasses(classesData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        addMessage("Failed to load classes and subjects. Please refresh the page.", 'error');
      } finally {
        setLoadingSubjects(false);
        setLoadingClasses(false);
      }
    };

    fetchData();
  }, [addMessage]);

  const onSubmit = async (data: TeacherProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post<{message?: string}>('/teacher/create-profile', data);
      addMessage(response.message || "Teacher profile created successfully!", 'success');
      reset();
      setSelectedSubjectIds([]);
      setSelectedClassIds([]);
      // Optionally redirect
      setTimeout(() => router.push('/admin/teachers'), 1500);
    } catch (err) {
      console.error(err);
      addMessage("Failed to create teacher profile. Please try again.", 'error');
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (subjectId: string) => {
    const updated = selectedSubjectIds.includes(subjectId)
      ? selectedSubjectIds.filter(id => id !== subjectId)
      : [...selectedSubjectIds, subjectId];
    setSelectedSubjectIds(updated);
    setValue("subjectIds", updated, { shouldDirty: true, shouldValidate: true });
  };

  const toggleClass = (classId: string) => {
    const updated = selectedClassIds.includes(classId)
      ? selectedClassIds.filter(id => id !== classId)
      : [...selectedClassIds, classId];
    setSelectedClassIds(updated);
    setValue("classIds", updated, { shouldDirty: true, shouldValidate: true });
  };

  const watchedFields = watch();
  const filledFieldsCount = Object.keys(dirtyFields).length;
  const totalRequiredFields = 6; // fullName, email, phone, dob, gender, address
  const progress = Math.min((filledFieldsCount / totalRequiredFields) * 100, 100);

  return (
    <div className="min-h-screen bg-bg-premium text-fg-premium">
      <div className="mx-auto max-w-5xl p-4 md:p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-primary/20 border border-accent-primary/30 shadow-lg shadow-accent-primary/10">
                <Users className="h-7 w-7 text-accent-primary" />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-fg-premium">Create Teacher Profile</h1>
                <p className="text-sm text-fg-premium-muted mt-1">Add a new teacher to the system</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => router.push('/admin/teachers')}
              className="w-fit border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white"
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>

          {/* Progress Bar */}
          <div className="glass-panel rounded-xl p-4 border border-white/10 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-accent-primary" />
                <span className="text-sm font-medium text-fg-premium">Form Progress</span>
              </div>
              <span className="text-sm font-semibold text-accent-primary">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2.5">
              <div 
                className="bg-gradient-to-r from-accent-primary to-accent-secondary h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-fg-premium-muted mt-2">
              {filledFieldsCount} of {totalRequiredFields} required fields completed
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information Section */}
          <div className="glass-panel rounded-xl border border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-white/10 bg-white/5 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-fg-premium">
                <User className="h-5 w-5 text-accent-primary" />
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
                  register={register}
                  errors={errors}
                  dirtyFields={dirtyFields}
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
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
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
                register={register}
                errors={errors}
                dirtyFields={dirtyFields}
              />

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
                <Label htmlFor="gender" className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium-muted">
                  <UserCircle className="h-4 w-4 text-fg-premium-muted" />
                  Gender <span className="text-red-400">*</span>
                </Label>
                <Select onValueChange={(val: GenderOption) => setValue("gender", val, { shouldDirty: true, shouldValidate: true })}>
                  <SelectTrigger className={`bg-white/5 border-white/10 text-fg-premium ${errors.gender ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "focus:border-accent-primary focus:ring-accent-primary/20"}`}>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-white/10 text-fg-premium">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {errors.gender && (
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.gender.message}</span>
                  </div>
                )}
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-fg-premium-muted">
                  <MapPin className="h-4 w-4 text-fg-premium-muted" />
                  Home Address <span className="text-red-400">*</span>
                </Label>
                <Textarea
                  id="address"
                  placeholder="Enter complete home address"
                  rows={3}
                  maxLength={200}
                  {...register("address")}
                  className={`bg-white/5 border-white/10 text-fg-premium placeholder:text-white/20 ${errors.address ? "border-red-500/50 focus:border-red-500 focus:ring-red-500/20" : "focus:border-accent-primary focus:ring-accent-primary/20"}`}
                />
                {errors.address && (
                  <div className="mt-1.5 flex items-center gap-1 text-sm text-red-400">
                    <AlertCircle className="w-4 h-4" />
                    <span>{errors.address.message}</span>
                  </div>
                )}
                <p className="mt-1.5 text-xs text-fg-premium-muted">
                  {(watchedFields.address?.length || 0)}/200 characters
                </p>
              </div>
            </div>
          </div>

          {/* Teaching Subjects Section */}
          <div className="glass-panel rounded-xl border border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-white/10 bg-white/5 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-fg-premium">
                <BookOpen className="h-5 w-5 text-accent-secondary" />
                Teaching Subjects
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-fg-premium-muted">Select the subjects this teacher can teach (optional but recommended)</p>
              {loadingSubjects ? (
                <div className="flex items-center justify-center p-8 border border-white/10 rounded-lg bg-white/5">
                  <Loader2 className="w-6 h-6 animate-spin text-fg-premium-muted mr-2" />
                  <span className="text-sm text-fg-premium-muted">Loading subjects...</span>
                </div>
              ) : subjects.length === 0 ? (
                <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg">
                  <p className="text-sm text-amber-400">No subjects available. Please create subjects first.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {subjects.map((subject) => (
                      <button
                        key={subject.id}
                        type="button"
                        onClick={() => toggleSubject(subject.id)}
                        className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all transform hover:scale-105 ${
                          selectedSubjectIds.includes(subject.id)
                            ? 'border-accent-primary bg-accent-primary/20 text-accent-primary shadow-md'
                            : 'border-white/10 bg-white/5 text-fg-premium hover:border-accent-primary/50 hover:bg-accent-primary/10'
                        }`}
                      >
                        {subject.name}
                      </button>
                    ))}
                  </div>
                  {selectedSubjectIds.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-accent-primary bg-accent-primary/10 rounded-lg p-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected: {selectedSubjectIds.length} subject{selectedSubjectIds.length !== 1 ? 's' : ''}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Teaching Classes Section */}
          <div className="glass-panel rounded-xl border border-white/10 p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="mb-6 pb-4 border-b border-white/10 bg-white/5 -m-6 p-6 rounded-t-xl">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-fg-premium">
                <GraduationCap className="h-5 w-5 text-accent-secondary" />
                Teaching Classes
              </h2>
            </div>
            
            <div className="space-y-4">
              <p className="text-sm text-fg-premium-muted">Select the classes this teacher can teach (optional but recommended)</p>
              {loadingClasses ? (
                <div className="flex items-center justify-center p-8 border border-white/10 rounded-lg bg-white/5">
                  <Loader2 className="w-6 h-6 animate-spin text-fg-premium-muted mr-2" />
                  <span className="text-sm text-fg-premium-muted">Loading classes...</span>
                </div>
              ) : classes.length === 0 ? (
                <div className="p-4 border border-amber-500/30 bg-amber-500/10 rounded-lg">
                  <p className="text-sm text-amber-400">No classes available. Please create classes first.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {classes.map((classItem) => (
                      <button
                        key={classItem.id}
                        type="button"
                        onClick={() => toggleClass(classItem.id)}
                        className={`rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all transform hover:scale-105 ${
                          selectedClassIds.includes(classItem.id)
                            ? 'border-accent-secondary bg-accent-secondary/20 text-accent-secondary shadow-md'
                            : 'border-white/10 bg-white/5 text-fg-premium hover:border-accent-secondary/50 hover:bg-accent-secondary/10'
                        }`}
                      >
                        {classItem.name} {classItem.section ? `(${classItem.section})` : ''}
                      </button>
                    ))}
                  </div>
                  {selectedClassIds.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-accent-secondary bg-accent-secondary/10 rounded-lg p-3">
                      <CheckCircle className="w-4 h-4" />
                      <span>Selected: {selectedClassIds.length} class{selectedClassIds.length !== 1 ? 'es' : ''}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="sticky bottom-0 glass-panel rounded-xl border border-white/10 shadow-lg p-6 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                {isValid && filledFieldsCount >= totalRequiredFields && (
                  <div className="flex items-center gap-1.5 text-green-400">
                    <CheckCircle className="w-4 h-4" />
                    <span>All required fields valid - Ready to submit!</span>
                  </div>
                )}
                {Object.keys(errors).length > 0 && (
                  <div className="flex items-center gap-1.5 text-red-400">
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
                    setSelectedSubjectIds([]);
                    setSelectedClassIds([]);
                  }}
                  disabled={loading}
                  className="min-w-[120px] border-white/10 bg-white/5 text-fg-premium hover:bg-white/10 hover:text-white"
                >
                  <X className="w-4 h-4 mr-2" />
                  Reset Form
                </Button>
                <Button
                  type="submit"
                  disabled={loading || !isValid}
                  className="min-w-[160px] bg-gradient-to-r from-accent-primary to-accent-secondary hover:opacity-90 text-white border-0"
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