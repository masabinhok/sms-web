/**
 * Programs Configuration
 * 
 * Academic programs offered by the school
 * Customize the details for each program level
 */

export const PROGRAMS = [
  {
    id: "early-years",
    title: "Early Years (Nursery - Class 2)",
    shortTitle: "Early Years",
    description: "Building strong foundations through play-based learning and creativity.",
    icon: "Baby",
    grades: "Nursery - Grade 2",
    ageGroup: "3-7 years",
    features: [
      "Play-based Learning",
      "Creative Arts",
      "Language Development",
      "Motor Skills",
      "Social Skills"
    ],
    curriculum: [
      "Phonics & Early Reading",
      "Basic Mathematics",
      "Arts & Crafts",
      "Music & Movement",
      "Outdoor Activities"
    ],
    color: "blue"
  },
  {
    id: "primary",
    title: "Primary Level (Class 3 - 5)",
    shortTitle: "Primary Level",
    description: "Developing core academic skills and critical thinking abilities.",
    icon: "BookOpen",
    grades: "Grade 3 - 5",
    ageGroup: "8-10 years",
    features: [
      "Core Subjects",
      "STEAM Learning",
      "Character Building",
      "Sports & Activities",
      "Digital Literacy"
    ],
    curriculum: [
      "English Language",
      "Mathematics",
      "Science",
      "Social Studies",
      "Computer Science"
    ],
    color: "green"
  },
  {
    id: "secondary",
    title: "Secondary Level (Class 6 - 10)",
    shortTitle: "Secondary Level",
    description: "Comprehensive education preparing students for higher studies.",
    icon: "GraduationCap",
    grades: "Grade 6 - 10",
    ageGroup: "11-15 years",
    features: [
      "Academic Excellence",
      "Skill Development",
      "Career Guidance",
      "Leadership Training",
      "Research Projects"
    ],
    curriculum: [
      "Advanced Mathematics",
      "Physics, Chemistry, Biology",
      "English & Literature",
      "Social Sciences",
      "Optional Subjects"
    ],
    color: "purple"
  },
  {
    id: "higher-secondary",
    title: "Higher Secondary (+2)",
    shortTitle: "Higher Secondary",
    description: "Specialized programs in Science, Management, and Humanities.",
    icon: "Trophy",
    grades: "Grade 11 - 12",
    ageGroup: "16-18 years",
    features: [
      "Specialized Streams",
      "College Preparation",
      "Industry Connect",
      "Entrance Exam Coaching",
      "Internship Opportunities"
    ],
    curriculum: [
      "Science (Physics, Chemistry, Biology/Math)",
      "Management (Accountancy, Business Studies)",
      "Humanities (History, Sociology, Psychology)",
      "Computer Science",
      "English Communication"
    ],
    streams: [
      {
        name: "Science",
        subjects: ["Physics", "Chemistry", "Biology/Mathematics", "English"]
      },
      {
        name: "Management",
        subjects: ["Accountancy", "Business Studies", "Economics", "English"]
      },
      {
        name: "Humanities",
        subjects: ["History", "Sociology", "Psychology", "English"]
      }
    ],
    color: "yellow"
  }
] as const;
