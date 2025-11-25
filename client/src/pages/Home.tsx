import { useState, useEffect } from "react";
import { Clock, Calendar, MessageSquare, Users, FileText } from "lucide-react";
import { ScheduleItem, Assignment, Activity, ForumPost } from "../types";
import { useAuth } from "../context/AuthContext";
import {
  scheduleAPI,
  assignmentAPI,
  activityAPI,
  forumAPI,
} from "../services/api";

const Home: React.FC = () => {
  const { user } = useAuth(); // Get the current user's information
  const [dailyAffirmation, setDailyAffirmation] = useState<string>("");
  const [todaySchedule, setTodaySchedule] = useState<ScheduleItem[]>([]);
  const [upcomingAssignments, setUpcomingAssignments] = useState<Assignment[]>(
    []
  );
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [quickStats, setQuickStats] = useState({
    totalAssignments: 0,
    upcomingEvents: 0,
    forumPosts: 0,
  });

  // Fetch data based on user's class
  useEffect(() => {
    // Define async function inside useEffect
    const fetchData = async () => {
      try {
        // Fetch daily affirmation
        const getDailyAffirmation = async () => {
          // In real app, this would come from an API
          const quotes = [
            "Konsistensi kecil membawa hasil besar",
            "Belajar hari ini untuk sukses besok",
            "Progress sekecil apapun tetap progress",
            "Semangat menjalani hari ini!",
            "Kamu mampu menggapai impianmu!",
          ];
          setDailyAffirmation(
            quotes[Math.floor(Math.random() * quotes.length)]
          );
        };

        // Fetch real data from API based on user's class
        const userClassName = user?.className || "A"; // Default to class A if no user

        // Make API calls to fetch real data based on user's class
        const [schedules, assignments, activities, forumPosts] =
          await Promise.allSettled([
            scheduleAPI.get(),
            assignmentAPI.get(),
            activityAPI.get(),
            forumAPI.get(),
          ]);

        // Process schedule data
        let scheduleData: ScheduleItem[] = [];
        if (schedules.status === "fulfilled") {
          scheduleData = schedules.value.filter(
            (s: ScheduleItem) => s.className === userClassName
          );
        } else {
          // Fallback to mock data if API fails
          const mockSchedules: ScheduleItem[] = [
            {
              _id: "1",
              className: "A",
              course: "Matematika Diskrit",
              day: "Monday",
              startTime: "08:00",
              endTime: "10:00",
              room: "A101",
              lecturer: "Dr. Andi",
              notes: "Bawa laptop",
              createdBy: "system",
            },
            {
              _id: "2",
              className: "A",
              course: "Pemrograman Web",
              day: "Monday",
              startTime: "13:00",
              endTime: "15:00",
              room: "Lab 2",
              lecturer: "Dr. Sari",
              notes: "Praktikum",
              createdBy: "system",
            },
            {
              _id: "3",
              className: "B",
              course: "Algoritma dan Struktur Data",
              day: "Tuesday",
              startTime: "09:00",
              endTime: "11:00",
              room: "B201",
              lecturer: "Dr. Joko",
              notes: "Tugas besar",
              createdBy: "system",
            },
            {
              _id: "4",
              className: "C",
              course: "Sistem Operasi",
              day: "Wednesday",
              startTime: "10:00",
              endTime: "12:00",
              room: "C301",
              lecturer: "Dr. Rina",
              notes: "Review materi",
              createdBy: "system",
            },
          ];
          scheduleData = mockSchedules.filter(
            (s) => s.className === userClassName
          );
        }

        // Process assignment data
        let assignmentData: Assignment[] = [];
        if (assignments.status === "fulfilled") {
          assignmentData = assignments.value.filter(
            (a: Assignment) => a.className === userClassName
          );
        } else {
          // Fallback to mock data if API fails
          const mockAssignments: Assignment[] = [
            {
              _id: "1",
              title: "Tugas Pemrograman Web",
              description: "Buat website sederhana menggunakan React",
              className: "A",
              dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
              priority: "high",
              completed: false,
            },
            {
              _id: "2",
              title: "Tugas Matematika Diskrit",
              description: "Kerjakan soal latihan bab 3",
              className: "A",
              dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
              priority: "medium",
              completed: false,
            },
            {
              _id: "3",
              title: "Tugas Algoritma",
              description: "Implementasi algoritma sorting",
              className: "B",
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              priority: "high",
              completed: false,
            },
            {
              _id: "4",
              title: "Tugas Sistem Operasi",
              description: "Analisis proses dan thread",
              className: "C",
              dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
              priority: "medium",
              completed: false,
            },
          ];
          assignmentData = mockAssignments.filter(
            (a) => a.className === userClassName
          );
        }

        // Process activity data
        let activityData: Activity[] = [];
        if (activities.status === "fulfilled") {
          activityData = activities.value.filter(
            (a: Activity) => a.type === "kumpul" || a.type === "lainnya"
          );
        } else {
          // Fallback to mock data if API fails
          const mockActivities: Activity[] = [
            {
              _id: "1",
              title: "Kumpul Angkatan",
              description: "Pertemuan rutin angkatan 2023",
              date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
              location: "Gedung A",
              organizer: "BEM",
              participants: [],
              type: "kumpul",
            },
            {
              _id: "2",
              title: "Seminar Teknologi",
              description: "Seminar tentang perkembangan AI",
              date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
              location: "Auditorium",
              organizer: "Himatif",
              participants: [],
              type: "lainnya",
            },
            {
              _id: "3",
              title: "Workshop Algoritma",
              description: "Workshop implementasi struktur data",
              date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
              location: "Lab 3",
              organizer: "Himatif",
              participants: [],
              type: "lainnya",
            },
          ];
          activityData = mockActivities.filter(
            (a) => a.type === "kumpul" || a.type === "lainnya"
          );
        }

        // Process forum post data for stats
        let forumCount = 0;
        if (forumPosts.status === "fulfilled") {
          // forumPosts.value should be an array of ForumPost objects
          forumCount = Array.isArray(forumPosts.value)
            ? forumPosts.value.length
            : 24;
        } else {
          forumCount = 24; // Default to 24 if API fails
        }

        // Update state with the real data
        setTodaySchedule(scheduleData);
        setUpcomingAssignments(assignmentData);
        setRecentActivities(activityData);

        // Update stats with real counts
        setQuickStats({
          totalAssignments: assignmentData.length,
          upcomingEvents: activityData.length,
          forumPosts: forumCount,
        });

        await getDailyAffirmation();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // Call the async function
    fetchData();
  }, [user]); // Dependency on user to re-fetch if user changes

  // Handler functions for admin actions on schedule cards
  const handleEditSchedule = (id: string) => {
    // For now, just show an alert; in a real app this would open an edit form
    alert(`Edit jadwal dengan ID: ${id}`);
  };

  const handleDeleteSchedule = (id: string) => {
    if (window.confirm(`Yakin ingin menghapus jadwal dengan ID: ${id}?`)) {
      // In a real app, this would make an API call to delete the schedule
      setTodaySchedule((prev) =>
        prev.filter((schedule) => schedule._id !== id)
      );
    }
  };

  const handleAddSchedule = () => {
    // For now, just show an alert; in a real app this would open a form modal
    alert(
      "Tambah jadwal baru: Fungsi akan diimplementasikan untuk menambah jadwal baru"
    );
  };

  return (
    <div className="w-full px-2 sm:px-4 md:px-0">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        {/* Daily Affirmation Card */}
        <div className="bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8 shadow-lg">
          <h1 className="text-xl sm:text-2xl font-bold mb-2">
            Afirmasi Harian
          </h1>
          <p className="text-base sm:text-xl italic">"{dailyAffirmation}"</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Today's Schedule */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-center mb-4">
                <Calendar className="text-primary-600 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                  Jadwal Hari Ini
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {todaySchedule.length > 0 ? (
                  todaySchedule.map((item) => (
                    <div
                      key={item._id}
                      className="border-l-4 border-primary-500 pl-3 sm:pl-4 py-2 bg-gray-50 dark:bg-dark-700 rounded-r"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                        <h3 className="font-semibold text-sm sm:text-lg text-gray-900 dark:text-gray-100">
                          {item.course}
                        </h3>
                        <span className="bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm w-fit">
                          {item.className}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        {item.lecturer} • {item.room}
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm flex items-center">
                        <Clock className="mr-1" size={12} /> {item.startTime} -{" "}
                        {item.endTime}
                      </p>
                      {item.notes && (
                        <p className="text-gray-700 dark:text-gray-300 mt-1 text-xs sm:text-sm">
                          {item.notes}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada jadwal hari ini
                  </p>
                )}
              </div>
            </div>

            {/* Upcoming Assignments */}
            <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <FileText className="text-primary-600 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                  Tugas Mendatang
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {upcomingAssignments.length > 0 ? (
                  upcomingAssignments.map((assignment) => (
                    <div
                      key={assignment._id}
                      className="border border-gray-200 dark:border-dark-700 dark:bg-dark-700 rounded-lg p-3 sm:p-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                        <div className="flex-1">
                          <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                            {assignment.title}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                            {assignment.description}
                          </p>
                        </div>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                            assignment.priority === "high"
                              ? "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200"
                              : assignment.priority === "medium"
                              ? "bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200"
                              : "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                          }`}
                        >
                          {assignment.priority}
                        </span>
                      </div>
                      <div className="flex items-center mt-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1" size={14} />
                        <span>
                          Deadline:{" "}
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada tugas mendatang
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Quick Stats and Recent Activities */}
          <div>
            {/* Quick Stats */}
            <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6 mb-6 sm:mb-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                Statistik Cepat
              </h2>
              <div className="space-y-2 sm:space-y-3">
                <div className="flex justify-between items-center p-2 sm:p-3 bg-primary-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText
                      className="text-primary-600 dark:text-primary-400 flex-shrink-0"
                      size={18}
                    />
                    <span className="font-medium text-xs sm:text-sm truncate text-gray-700 dark:text-gray-300">
                      Total Tugas
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-primary-600 dark:text-primary-400 flex-shrink-0">
                    {quickStats.totalAssignments}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-secondary-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <Calendar
                      className="text-secondary-600 dark:text-secondary-400 flex-shrink-0"
                      size={18}
                    />
                    <span className="font-medium text-xs sm:text-sm truncate text-gray-700 dark:text-gray-300">
                      Event Mendatang
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-secondary-600 dark:text-secondary-400 flex-shrink-0">
                    {quickStats.upcomingEvents}
                  </span>
                </div>
                <div className="flex justify-between items-center p-2 sm:p-3 bg-accent-50 dark:bg-dark-700 rounded-lg">
                  <div className="flex items-center gap-2 min-w-0">
                    <MessageSquare
                      className="text-accent-600 dark:text-accent-400 flex-shrink-0"
                      size={18}
                    />
                    <span className="font-medium text-xs sm:text-sm truncate text-gray-700 dark:text-gray-300">
                      Forum
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-accent-600 dark:text-accent-400 flex-shrink-0">
                    {quickStats.forumPosts}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <Users className="text-primary-600 mr-2" size={20} />
                <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100">
                  Aktivitas Terbaru
                </h2>
              </div>
              <div className="space-y-3 sm:space-y-4">
                {recentActivities.length > 0 ? (
                  recentActivities.map((activity) => (
                    <div
                      key={activity._id}
                      className="border-l-4 border-accent-500 pl-3 sm:pl-4 py-2 dark:bg-dark-700 rounded"
                    >
                      <h3 className="font-semibold text-sm sm:text-base text-gray-900 dark:text-gray-100">
                        {activity.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 text-xs sm:text-sm">
                        {activity.description}
                      </p>
                      <div className="flex items-center mt-1 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                        <Calendar className="mr-1" size={12} />
                        <span>
                          {new Date(activity.date).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`mt-2 inline-block px-2 py-1 rounded text-xs ${
                          activity.type === "kumpul"
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : activity.type === "suporteran"
                            ? "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
                            : "bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200"
                        }`}
                      >
                        {activity.type}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Tidak ada aktivitas terbaru
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
