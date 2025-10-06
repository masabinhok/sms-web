/**
 * Features & Highlights Configuration
 * 
 * Key features and highlights that make the school unique
 * Customize these to match your school's strengths
 */

export const HIGHLIGHTS = [
  {
    id: "steam-learning",
    title: "STEAM Learning",
    description: "Science, Technology, Engineering, Arts & Mathematics integrated curriculum",
    icon: "Microscope",
    color: "blue"
  },
  {
    id: "smart-classrooms",
    title: "Smart Classrooms",
    description: "Modern technology-enabled learning environments with interactive boards",
    icon: "Monitor",
    color: "purple"
  },
  {
    id: "qualified-teachers",
    title: "Qualified Teachers",
    description: "Experienced and dedicated faculty members with international certifications",
    icon: "Users",
    color: "green"
  },
  {
    id: "sports-arts",
    title: "Sports & Arts",
    description: "Comprehensive co-curricular activities program for holistic development",
    icon: "Palette",
    color: "pink"
  },
  {
    id: "global-standards",
    title: "Global Standards",
    description: "International curriculum and teaching methodologies aligned with best practices",
    icon: "Globe",
    color: "indigo"
  },
  {
    id: "safe-environment",
    title: "Safe Environment",
    description: "Secure and nurturing campus with CCTV surveillance and safety protocols",
    icon: "Shield",
    color: "red"
  }
] as const;

// Additional facilities
export const FACILITIES = [
  {
    id: "library",
    name: "Library",
    description: "Well-stocked library with thousands of books and digital resources",
    icon: "BookOpen"
  },
  {
    id: "laboratories",
    name: "Science Labs",
    description: "State-of-the-art physics, chemistry, and biology laboratories",
    icon: "Microscope"
  },
  {
    id: "computer-labs",
    name: "Computer Labs",
    description: "Modern computer labs with latest hardware and software",
    icon: "Monitor"
  },
  {
    id: "sports-complex",
    name: "Sports Complex",
    description: "Indoor and outdoor sports facilities for various games",
    icon: "Trophy"
  },
  {
    id: "auditorium",
    name: "Auditorium",
    description: "Spacious auditorium for events, assemblies, and performances",
    icon: "Building"
  },
  {
    id: "cafeteria",
    name: "Cafeteria",
    description: "Hygienic cafeteria serving nutritious meals and snacks",
    icon: "Users"
  },
  {
    id: "medical-room",
    name: "Medical Room",
    description: "Well-equipped medical room with qualified nurse",
    icon: "Heart"
  },
  {
    id: "transportation",
    name: "Transportation",
    description: "Safe and reliable school bus service with GPS tracking",
    icon: "Bus"
  }
] as const;
