"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { studentProfileSchema, StudentProfileFormData } from "@/lib/validation/student-profile-schema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState } from "react";
import { GraduationCap, User, Mail, Calendar, MapPin, Phone, Hash, Users } from "lucide-react";
import { api } from "@/lib/api-client";

type GenderOption = "Male" | "Female" | "Other";

export default function CreateStudentProfileForm() {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset
  } = useForm<StudentProfileFormData>({
    resolver: zodResolver(studentProfileSchema),
  });

  const onSubmit = async (data: StudentProfileFormData) => {
    setLoading(true);
    try {
      const response = await api.post('/student/create-profile', data);
      console.log("Response:", response)
      reset();
    } catch (err) {
      console.error(err);
      alert("Failed to create student profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100">
            <GraduationCap className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Create Student Profile</h1>
            <p className="text-sm text-gray-600">Add a new student to the system</p>
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
                placeholder="Enter student's full name"
                {...register("fullName")}
                className={errors.fullName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.fullName && (
                <p className="mt-1 text-sm text-red-600">{errors.fullName.message}</p>
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
                Gender
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

            {/* Email */}
            <div className="md:col-span-2">
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Mail className="h-4 w-4" />
                Email Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="student@school.com"
                {...register("email")}
                className={errors.email ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <Label htmlFor="address" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4" />
                Home Address
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

        {/* Academic Information Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <GraduationCap className="h-5 w-5 text-gray-600" />
            Academic Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Class */}
            <div>
              <Label htmlFor="class" className="mb-2 block text-sm font-medium text-gray-700">
                Class <span className="text-red-500">*</span>
              </Label>
              <Input
                id="class"
                placeholder="e.g., 10th Grade"
                {...register("class")}
                className={errors.class ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.class && (
                <p className="mt-1 text-sm text-red-600">{errors.class.message}</p>
              )}
            </div>

            {/* Section */}
            <div>
              <Label htmlFor="section" className="mb-2 block text-sm font-medium text-gray-700">
                Section <span className="text-red-500">*</span>
              </Label>
              <Input
                id="section"
                placeholder="e.g., A"
                maxLength={5}
                {...register("section")}
                className={errors.section ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.section && (
                <p className="mt-1 text-sm text-red-600">{errors.section.message}</p>
              )}
            </div>

            {/* Roll Number */}
            <div>
              <Label htmlFor="rollNumber" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Hash className="h-4 w-4" />
                Roll Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="rollNumber"
                placeholder="e.g., 15"
                {...register("rollNumber")}
                className={errors.rollNumber ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.rollNumber && (
                <p className="mt-1 text-sm text-red-600">{errors.rollNumber.message}</p>
              )}
            </div>
          </div>
        </div>

        {/* Guardian Information Section */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-6 flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Users className="h-5 w-5 text-gray-600" />
            Guardian Information
          </h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Guardian Name */}
            <div>
              <Label htmlFor="guardianName" className="mb-2 block text-sm font-medium text-gray-700">
                Guardian Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="guardianName"
                placeholder="Parent/Guardian full name"
                {...register("guardianName")}
                className={errors.guardianName ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.guardianName && (
                <p className="mt-1 text-sm text-red-600">{errors.guardianName.message}</p>
              )}
            </div>

            {/* Guardian Contact */}
            <div>
              <Label htmlFor="guardianContact" className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                <Phone className="h-4 w-4" />
                Guardian Contact <span className="text-red-500">*</span>
              </Label>
              <Input
                id="guardianContact"
                type="tel"
                placeholder="10-15 digit phone number"
                {...register("guardianContact")}
                className={errors.guardianContact ? "border-red-300 focus:border-red-500 focus:ring-red-500" : ""}
              />
              {errors.guardianContact && (
                <p className="mt-1 text-sm text-red-600">{errors.guardianContact.message}</p>
              )}
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
            className="min-w-[120px] bg-blue-600 hover:bg-blue-700"
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