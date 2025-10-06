# Constants Folder Organization

This folder contains all the configuration constants for the school website, organized into logical modules for better maintainability and reusability.

## 📁 File Structure

```
lib/constants/
├── index.ts           # Central export point, backward compatibility
├── school-info.ts     # School basic information and contact details
├── navigation.ts      # Navigation menu configuration
├── programs.ts        # Academic programs and curriculum
├── features.ts        # School features, highlights, and facilities
├── testimonials.ts    # Student, parent, and alumni testimonials
├── media.ts          # Gallery images and video assets
└── README.md         # This file
```

## 🎯 Usage

### Import from Main Constants File (Recommended for Backward Compatibility)

```typescript
import { SCHOOL_CONFIG, CURRENT_YEAR } from '@/lib/constants';
```

### Import Specific Constants (Recommended for New Code)

```typescript
// School information
import { SCHOOL_INFO } from '@/lib/constants/school-info';

// Navigation
import { NAVIGATION_MENU, SIMPLE_NAVIGATION } from '@/lib/constants/navigation';

// Programs
import { PROGRAMS } from '@/lib/constants/programs';

// Features
import { HIGHLIGHTS, FACILITIES } from '@/lib/constants/features';

// Testimonials
import { TESTIMONIALS } from '@/lib/constants/testimonials';

// Media
import { GALLERY_IMAGES, VIDEOS } from '@/lib/constants/media';
```

### Import Everything

```typescript
import * as Constants from '@/lib/constants';
```

## 📝 Customization Guide

### 1. School Information (`school-info.ts`)

Replace all `{{PLACEHOLDER}}` values with your actual school information:

```typescript
export const SCHOOL_INFO = {
  name: "Sunrise International School",  // Replace {{SCHOOL_NAME}}
  tagline: "Excellence in Education",     // Replace {{TAGLINE}}
  contact: {
    address: "123 Education Lane",        // Replace {{CONTACT_ADDRESS}}
    city: "Springfield",                  // Replace {{CITY}}
    phone: "+1 (555) 123-4567",          // Replace {{PHONE_NUMBER}}
    email: "info@school.com",            // Replace {{EMAIL_ADDRESS}}
    // ... etc
  }
}
```

### 2. Navigation Menu (`navigation.ts`)

Customize the navigation structure:

```typescript
export const NAVIGATION_MENU = [
  {
    title: "About",
    href: "#about",
    icon: Building,
    description: "Discover our heritage",
    items: [
      { title: "Our Story", href: "#story", /* ... */ }
    ]
  },
  // Add or modify menu items...
]
```

### 3. Programs (`programs.ts`)

Add or modify academic programs:

```typescript
export const PROGRAMS = [
  {
    id: "early-years",
    title: "Early Years",
    description: "Building foundations...",
    features: ["Feature 1", "Feature 2"],
    curriculum: ["Subject 1", "Subject 2"]
  },
  // Add more programs...
]
```

### 4. Features & Highlights (`features.ts`)

Customize school highlights:

```typescript
export const HIGHLIGHTS = [
  {
    title: "Smart Classrooms",
    description: "Modern technology-enabled learning",
    icon: "Monitor",
    color: "blue"
  },
  // Add more highlights...
]
```

### 5. Testimonials (`testimonials.ts`)

Add real testimonials from your community:

```typescript
export const TESTIMONIALS = [
  {
    name: "John Doe",
    role: "Parent",
    content: "Great school!",
    image: "/images/john.jpg",
    rating: 5
  },
  // Add more testimonials...
]
```

### 6. Media Assets (`media.ts`)

Update image and video paths:

```typescript
export const GALLERY_IMAGES = [
  {
    src: "/images/campus-1.jpg",
    alt: "Main building",
    category: "campus"
  },
  // Add more images...
]
```

## 🔄 Migration from Old Structure

The old `SCHOOL_CONFIG` object is still available for backward compatibility. However, for new code, use the individual exports:

### Before (Old Way)
```typescript
import { SCHOOL_CONFIG } from '@/lib/constants';

const schoolName = SCHOOL_CONFIG.SCHOOL_NAME;
const programs = SCHOOL_CONFIG.PROGRAMS;
```

### After (New Way)
```typescript
import { SCHOOL_INFO } from '@/lib/constants/school-info';
import { PROGRAMS } from '@/lib/constants/programs';

const schoolName = SCHOOL_INFO.name;
const programs = PROGRAMS;
```

## 💡 Benefits of New Structure

1. **Better Organization**: Each constant type in its own file
2. **Easier Maintenance**: Find and update specific constants quickly
3. **Type Safety**: Better TypeScript support with typed constants
4. **Selective Imports**: Import only what you need
5. **Scalability**: Easy to add new constant types
6. **Documentation**: Each file can have its own documentation

## 🔍 Type Definitions

All constants are typed with TypeScript `as const` assertion for maximum type safety:

```typescript
export const PROGRAMS = [
  // ...
] as const;

// This gives you:
// - Literal types for string values
// - Readonly arrays and objects
// - IntelliSense support in your IDE
```

## 📋 Checklist for Customization

- [ ] Update `school-info.ts` with your school details
- [ ] Customize `navigation.ts` menu structure
- [ ] Add your programs to `programs.ts`
- [ ] Update features in `features.ts`
- [ ] Add real testimonials to `testimonials.ts`
- [ ] Update image paths in `media.ts`
- [ ] Test all pages to ensure constants are working
- [ ] Remove placeholder `{{VARIABLES}}` from all files

## 🚀 Quick Start

1. Open each file in the `constants` folder
2. Search for `{{` to find all placeholders
3. Replace with your actual data
4. Save and test!

## 📚 Additional Resources

- See `TEMPLATE_SUMMARY.md` in root for overall customization guide
- Check component files to see how constants are used
- TypeScript will help catch any missing or incorrect references

---

**Need Help?** Check the main README.md or create an issue in your repository.
