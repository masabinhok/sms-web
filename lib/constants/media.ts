/**
 * Media Assets Configuration
 * 
 * Gallery images, videos, and other media assets
 * Replace paths with your actual image/video URLs
 */

export const GALLERY_IMAGES = [
  {
    id: 1,
    src: "/images/gallery-1.jpg",
    alt: "Modern school campus building",
    category: "campus",
    title: "Main Campus Building"
  },
  {
    id: 2,
    src: "/images/gallery-2.jpg",
    alt: "Students in science laboratory",
    category: "academics",
    title: "Science Laboratory"
  },
  {
    id: 3,
    src: "/images/gallery-3.jpg",
    alt: "Students playing sports",
    category: "sports",
    title: "Sports Activities"
  },
  {
    id: 4,
    src: "/images/gallery-4.jpg",
    alt: "Students in computer lab",
    category: "facilities",
    title: "Computer Laboratory"
  },
  {
    id: 5,
    src: "/images/gallery-5.jpg",
    alt: "Annual day celebration",
    category: "events",
    title: "Annual Day Celebration"
  },
  {
    id: 6,
    src: "/images/gallery-6.jpg",
    alt: "Library with students reading",
    category: "facilities",
    title: "School Library"
  }
] as const;

// Simple array for backward compatibility
export const GALLERY_IMAGE_URLS = GALLERY_IMAGES.map(img => img.src);

// Gallery categories for filtering
export const GALLERY_CATEGORIES = [
  { id: "all", label: "All Photos" },
  { id: "campus", label: "Campus" },
  { id: "academics", label: "Academics" },
  { id: "sports", label: "Sports" },
  { id: "facilities", label: "Facilities" },
  { id: "events", label: "Events" }
] as const;

// Video gallery (if applicable)
export const VIDEOS = [
  {
    id: 1,
    title: "Virtual Campus Tour",
    description: "Take a virtual tour of our beautiful campus",
    thumbnail: "/images/video-thumb-1.jpg",
    videoUrl: "{{CAMPUS_TOUR_VIDEO_URL}}",
    duration: "5:30"
  },
  {
    id: 2,
    title: "Annual Day Highlights",
    description: "Highlights from our annual day celebration",
    thumbnail: "/images/video-thumb-2.jpg",
    videoUrl: "{{ANNUAL_DAY_VIDEO_URL}}",
    duration: "3:45"
  }
] as const;
