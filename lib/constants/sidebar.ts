const navSection = (title: string, items: { label: string; href: string }[]) => ({ title, items });

export const adminSections = [
    navSection('Admin', [
    { label: 'Dashboard', href: '/admin' },
    { label: 'Setup Guidelines', href: '/admin/guidelines' },
    { label: 'Settings', href: '/admin/settings' },
  ]),
  navSection('User Management', [
    { label: 'Student Management', href: '/admin/students' },
    { label: 'Teacher Management', href: '/admin/teachers' },
  ]),
  navSection('Class & Subject Management', [
    { label: 'Create/Assign Classes', href: '/admin/classes' },
    { label: 'Create/Assign Subjects', href: '/admin/subjects' },
  ]),
  navSection('Monitoring & Reports', [
    { label: 'View Reports', href: '/admin/reports' },
    { label: 'Activity Logs', href: '/admin/logs' },
  ]),
];

export const teacherSections = [
  navSection('Teacher', [
    { label: 'Dashboard', href: '/teacher' },
  ]),
  navSection('Class Management', [
    { label: 'My Classes', href: '/teacher/classes' },
    { label: 'My Subjects', href: '/teacher/subjects' },
  ]),
  navSection('Attendance', [
    { label: 'Daily Attendance', href: '/teacher/attendance' },
    { label: 'Attendance History', href: '/teacher/attendance-history' },
  ]),
  navSection('Grades/Assignments', [
    { label: 'Assignments', href: '/teacher/assignments' },
    { label: 'Grades', href: '/teacher/grades' },
    { label: 'Student Performance', href: '/teacher/student-performance' },
  ]),
  navSection('Communication', [
    { label: 'Messages', href: '/teacher/messages' },
    { label: 'Announcements', href: '/teacher/announcements' },
  ]),
];

export const studentSections = [
  navSection('Student', [
    { label: 'Dashboard', href: '/student' },
  ]),
  navSection('Class Info', [
    { label: 'Subjects', href: '/student/subjects' },
    { label: 'Assignments', href: '/student/assignments' },
  ]),
  navSection('Performance', [
    { label: 'Grades', href: '/student/grades' },
    { label: 'Attendance', href: '/student/attendance' },
  ]),
  navSection('Communication', [
    { label: 'Messages', href: '/student/messages' },
    { label: 'Announcements', href: '/student/announcements' },
  ]),
];

export const superAdminSections = [
    navSection('Super Admin', [
        { label: 'Dashboard', href: '/superadmin' },
        { label: 'Manage Admins', href: '/superadmin/admins' },
    ])
  ];