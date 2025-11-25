// User types
export interface User {
  _id: string;
  email: string;
  name: string;
  className: 'A' | 'B' | 'C';
  role: 'admin' | 'class_rep' | 'user';
  avatar?: string;
  createdAt: Date;
}

// Schedule types
export interface ScheduleItem {
  _id: string;
  className: string;
  course: string;
  day: string; // 'Monday', 'Tuesday', etc.
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
  notes?: string;
  createdBy: string; // User ID
}

// Assignment types
export interface Assignment {
  _id: string;
  title: string;
  description: string;
  className: string;
  dueDate: Date;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  attachments?: string[];
}

// Activity types
export interface Activity {
  _id: string;
  title: string;
  description: string;
  date: Date;
  location: string;
  organizer: string;
  participants: string[];
  maxParticipants?: number;
  type: 'kumpul' | 'suporteran' | 'lainnya';
}

// Forum types
export interface ForumPost {
  _id: string;
  title: string;
  content: string;
  author: User;
  className: string;
  tags: string[];
  createdAt: Date;
  comments: Comment[];
  upvotes: number;
}

export interface Comment {
  _id: string;
  content: string;
  author: User;
  createdAt: Date;
}

// External Info types
export interface ExternalInfo {
  _id: string;
  title: string;
  description: string;
  category: 'oprec' | 'lomba' | 'seminar' | 'beasiswa' | 'lainnya';
  deadline?: Date;
  organizer: string;
  link: string;
  postedBy: User;
  createdAt: Date;
}

// Homepage types
export interface HomePageProps {
  dailyAffirmation: string;
  todaySchedule: ScheduleItem[];
  upcomingAssignments: Assignment[];
  recentActivities: Activity[];
  quickStats: {
    totalAssignments: number;
    upcomingEvents: number;
    forumPosts: number;
  };
}

export interface SchedulePageState {
  selectedClass: 'A' | 'B' | 'C' | 'all';
  weekView: boolean;
  scheduleData: ScheduleItem[];
}