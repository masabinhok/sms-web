/**
 * Media Assets Configuration
 * 
 * Gallery images, videos, and other media assets
 * Replace paths with your actual image/video URLs
 */

export const HERO_IMAGE = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1920&q=80";
export const ABOUT_IMAGE = "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80";
export const PATTERN_IMAGE = "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1920&q=80";

export const GALLERY_IMAGES = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
    alt: "Modern school campus building",
    category: "campus",
    title: "Main Campus Building"
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    alt: "Students in science laboratory",
    category: "academics",
    title: "Science Laboratory"
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    alt: "Students playing sports",
    category: "sports",
    title: "Sports Activities"
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    alt: "Students in computer lab",
    category: "facilities",
    title: "Computer Laboratory"
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?auto=format&fit=crop&w=800&q=80",
    alt: "Annual day celebration",
    category: "events",
    title: "Annual Day Celebration"
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=800&q=80",
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
    thumbnail: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80",
    videoUrl: "{{CAMPUS_TOUR_VIDEO_URL}}",
    duration: "5:30"
  },
  {
    id: 2,
    title: "Annual Day Highlights",
    description: "Highlights from our annual day celebration",
    thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    videoUrl: "{{ANNUAL_DAY_VIDEO_URL}}",
    duration: "3:45"
  }
] as const;
