"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { teacherProfileSchema, TeacherProfileFormData, Subject, Class } from "@/lib/validation/teacher-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { Users, User, Mail, Calendar, MapPin, Phone, BookOpen, GraduationCap } from "lucide-react";
import { api } from "@/lib/api-client";
import { useMessage } from "@/store/messageStore";

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

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<TeacherProfileFormData>({
    resolver: zodResolver(teacherProfileSchema),
  });

  const onSubmit = async (data: TeacherProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post<{message?: string}>('/teacher/create-profile', data);
      addMessage(response.message || "Teacher profile created successfully!", 'success');
      reset();
      setSelectedSubjects([]);
      setSelectedClasses([]);
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
    setValue("subjects", updated as any);
  };

  const toggleClass = (classValue: string) => {
    const updated = selectedClasses.includes(classValue)
      ? selectedClasses.filter(c => c !== classValue)
      : [...selectedClasses, classValue];
    setSelectedClasses(updated);
    setValue("classes", updated as any);
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100">
            <Users className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Teacher Profile</h1>
            <p className="text-sm text-gray-600">Add a new teacher to the system</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Personal Information Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <User className="h-5 w-5 text-gray-600" />
            Personal Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Full Name */}
            <div className="md:col-span-2">
              <Label htmlFor="fullName" className="mb-2 block text-sm font-medium text-gray-700">
                Full Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="Enter teacher's full name"
                {...register("fullName")}
                className={errors.fullName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
              )}
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
                placeholder="teacher@school.com"
                {...register("email")}
                className={errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Phone Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="10-15 digit phone number"
                {...register("phone")}
                className={errors.phone ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <Label htmlFor="dob" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Calendar className="h-4 w-4" />
                Date of Birth <span className="text-red-500">*</span>
              </Label>
              <Input
                id="dob"
                type="date"
                {...register("dob")}
                className={errors.dob ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.dob && (
                <p className="mt-1 text-sm text-red-600">{errors.dob.message}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <Label htmlFor="gender" className="mb-2 block text-sm font-medium text-gray-700">
                Gender <span className="text-red-500">*</span>
              </Label>
              <Select onValueChange={(val: GenderOption) => setValue("gender", val)}>
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
                <p className="mt-1 text-sm text-red-600">{errors.gender.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Home Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="address"
                placeholder="123 Main Street, City, State, ZIP"
                {...register("address")}
                className={errors.address ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Teaching Subjects Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <BookOpen className="h-5 w-5 text-gray-600" />
            Teaching Subjects
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select the subjects this teacher can teach (optional)</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {SUBJECTS.map((subject) => (
                <button
                  key={subject.value}
                  type="button"
                  onClick={() => toggleSubject(subject.value)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                    selectedSubjects.includes(subject.value)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {subject.label}
                </button>
              ))}
            </div>
            {selectedSubjects.length > 0 && (
              <p className="text-sm text-green-600">
                Selected: {selectedSubjects.length} subject{selectedSubjects.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Teaching Classes Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <GraduationCap className="h-5 w-5 text-gray-600" />
            Teaching Classes
          </h2>
          
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select the classes this teacher can teach (optional)</p>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
              {CLASSES.map((classItem) => (
                <button
                  key={classItem.value}
                  type="button"
                  onClick={() => toggleClass(classItem.value)}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                    selectedClasses.includes(classItem.value)
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-50'
                  }`}
                >
                  {classItem.label}
                </button>
              ))}
            </div>
            {selectedClasses.length > 0 && (
              <p className="text-sm text-green-600">
                Selected: {selectedClasses.length} class{selectedClasses.length !== 1 ? 'es' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 rounded-xl border border-gray-200 bg-gray-50 p-6">
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
            Reset Form
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="min-w-[120px] bg-green-600 hover:bg-green-700"
          >
            {loading ? (
              <>
                <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                Creating...
              </>
            ) : (
              "Create Profile"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}