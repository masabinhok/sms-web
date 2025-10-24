# Database Integration Guide

## Overview

The public website now uses school information from the database instead of hardcoded JSON constants. This allows for dynamic updates through the admin dashboard.

## Changes Made

### Backend Changes

1. **Made `/academics/school` endpoint public** (no authentication required)
   - File: `sms-api/apps/gateway/src/academics/academics.controller.ts`
   - The GET endpoint can now be accessed without login
   - The PATCH endpoint remains protected (Admin only)

### Frontend Changes

1. **Created API Client** - `sms-web/lib/school-api.ts`
   - `getSchoolInfo()`: Fetches school data from the database
   - `updateSchoolInfo()`: Updates school data (Admin only)

2. **Created Hook** - `sms-web/hooks/useSchoolInfo.ts`
   - Custom React hook to fetch and manage school data
   - Handles loading and error states

3. **Created Context Provider** - `sms-web/components/SchoolProvider.tsx`
   - Provides school data to all components
   - Prevents multiple API calls

4. **Updated Public Layout** - `sms-web/app/(public)/layout.tsx`
   - Wrapped with `SchoolProvider` to provide data to all pages

5. **Updated Components** to use database data:
   - `Navbar.tsx` - Uses school name, tagline, phone, email, address
   - `Hero.tsx` - Uses heroTitle, heroSubtitle, heroCTA, tagline
   - `About.tsx` - Uses name, description, mission, vision
   - `Footer.tsx` - Uses name, motto, address, city, phone, email, social media
   - `Contact.tsx` - Uses name, address, city, phone, email
   - `Testimonials.tsx` - Uses school name (testimonials still from constants)

## Database Schema

The `School` model in the academics database contains:

```prisma
model School {
  id String @id @default(uuid())
  
  // Basic Information
  name String
  tagline String
  motto String
  
  // Contact Information
  address String
  city String
  phone String
  email String
  
  // Social Media
  facebook String
  instagram String
  twitter String
  youtube String
  
  // About Information
  description String @db.Text
  mission String @db.Text
  vision String @db.Text
  
  // Hero Section
  heroTitle String
  heroSubtitle String
  heroCTA String
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## Setup Instructions

### 1. Initialize Database

If you haven't already, run the seed script to create default school data:

```bash
cd sms-api
npm run seed
```

This will create a school record with placeholder data.

### 2. Update School Information

You can update the school information in two ways:

#### Option A: Through Admin Dashboard (Recommended)
1. Login as admin
2. Navigate to Settings > School Information
3. Update all fields with your actual school information
4. Save changes

#### Option B: Directly via API
Use the PATCH endpoint:
```bash
POST http://localhost:3000/academics/update-school
Content-Type: application/json

{
  "id": "school-id-from-database",
  "name": "Your School Name",
  "tagline": "Your Tagline",
  // ... other fields
}
```

### 3. Verify Changes

Visit the public website homepage to see the updated information displayed dynamically.

## Important Notes

1. **First Load**: The seed script creates placeholder data. You MUST update it through the admin dashboard.

2. **Caching**: The API call uses `cache: 'no-store'` to ensure fresh data. You may want to implement caching later for production.

3. **Fallback Values**: Components display fallback text if data is not yet loaded or missing.

4. **Static Content**: The following still use constants (not from database):
   - Programs
   - Highlights/Features
   - Testimonials
   - Gallery images
   - Navigation menu structure

5. **Future Enhancements**: Consider moving programs, testimonials, and other content to the database as well.

## Troubleshooting

### School data not displaying
- Check if the seed script ran successfully
- Verify the API endpoint is accessible: `http://localhost:3000/academics/school`
- Check browser console for errors

### Changes not reflecting
- Clear browser cache
- Verify database was updated
- Check API response in network tab

### API Connection Issues
- Ensure `NEXT_PUBLIC_API_URL` is set correctly in `.env`
- Verify the backend server is running
- Check CORS configuration if needed

## API Endpoints

### Public Endpoints
- `GET /academics/school` - Fetch school information (no auth required)

### Protected Endpoints (Admin only)
- `PATCH /academics/update-school` - Update school information
