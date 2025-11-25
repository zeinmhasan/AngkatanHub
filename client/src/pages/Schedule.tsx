import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Filter,
  Plus,
  Edit,
  Trash2,
} from "lucide-react";
import { usePermissions } from "../hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { scheduleAPI } from "../services/api";

// Define Schedule type locally since it's not exported from ../types
interface Schedule {
  _id: string;
  courseName: string;
  className: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  lecturer: string;
}

const SchedulePage: React.FC = () => {
  const { canManageSchedules, canRead } = usePermissions();
  const navigate = useNavigate();

  // Redirect users without read permission
  if (!canRead()) {
    navigate("/");
    return null;
  }

  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentSchedule, setCurrentSchedule] = useState<Partial<Schedule>>({});
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterDay, setFilterDay] = useState<string>("all");

  useEffect(() => {
    const fetchSchedulesData = async () => {
      try {
        const data = await scheduleAPI.get();
        setSchedules(data);
      } catch (error) {
        console.error("Error fetching schedules data:", error);
        // For now, use mock data as fallback
        setSchedules([
          {
            _id: "1",
            courseName: "Pemrograman Web",
            className: "A",
            day: "monday",
            startTime: "08:00",
            endTime: "10:00",
            room: "Lab. Komputer 1",
            lecturer: "Dr. Ahmad, M.Kom",
          },
          {
            _id: "2",
            courseName: "Basis Data",
            className: "A",
            day: "tuesday",
            startTime: "10:00",
            endTime: "12:00",
            room: "Lab. Komputer 2",
            lecturer: "Dr. Sari, M.T.I",
          },
          {
            _id: "3",
            courseName: "Algoritma dan Struktur Data",
            className: "B",
            day: "wednesday",
            startTime: "13:00",
            endTime: "15:00",
            room: "Ruang 301",
            lecturer: "Prof. Budi, Ph.D",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchSchedulesData();
  }, []);

  // Filter schedules based on selected filters
  const filteredSchedules = schedules.filter((schedule) => {
    const classMatch = filterClass === "all" || schedule.className === filterClass;
    const dayMatch = filterDay === "all" || schedule.day === filterDay;

    return classMatch && dayMatch;
  });

  // Handler functions for admin actions
  const handleAddSchedule = () => {
    setCurrentSchedule({});
    setShowAddModal(true);
  };

  const handleEditSchedule = async (id: string) => {
    const schedule = schedules.find((s) => s._id === id);
    if (schedule) {
      setCurrentSchedule(schedule);
      setShowEditModal(true);
    }
  };

  const handleDeleteSchedule = async (id: string) => {
    if (window.confirm(`Yakin ingin menghapus jadwal dengan ID: ${id}?`)) {
      try {
        await scheduleAPI.delete(id);
        // Refresh the schedules data after deletion
        const updatedSchedules = await scheduleAPI.get();
        setSchedules(updatedSchedules);
      } catch (error) {
        console.error("Error deleting schedule:", error);
        alert("Gagal menghapus jadwal. Silakan coba lagi.");
      }
    }
  };

  // Handle form submission for adding new schedule
  const handleCreateSchedule = async () => {
    try {
      await scheduleAPI.create(currentSchedule);
      // Refresh the schedules data
      const updatedSchedules = await scheduleAPI.get();
      setSchedules(updatedSchedules);
      setShowAddModal(false);
      setCurrentSchedule({});
    } catch (error) {
      console.error("Error creating schedule:", error);
      alert("Gagal menambahkan jadwal. Silakan coba lagi.");
    }
  };

  // Handle form submission for updating schedule
  const handleUpdateSchedule = async () => {
    if (!currentSchedule._id) return;

    try {
      await scheduleAPI.update(currentSchedule._id, currentSchedule);
      // Refresh the schedules data
      const updatedSchedules = await scheduleAPI.get();
      setSchedules(updatedSchedules);
      setShowEditModal(false);
      setCurrentSchedule({});
    } catch (error) {
      console.error("Error updating schedule:", error);
      alert("Gagal memperbarui jadwal. Silakan coba lagi.");
    }
  };

  // Handle form input changes
  const handleScheduleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentSchedule((prev: Partial<Schedule>) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get day name in Indonesian
  const getDayName = (day: string) => {
    const days: { [key: string]: string } = {
      monday: "Senin",
      tuesday: "Selasa",
      wednesday: "Rabu",
      thursday: "Kamis",
      friday: "Jumat",
      saturday: "Sabtu",
      sunday: "Minggu",
    };
    return days[day] || day;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
            <Calendar className="text-primary-600 flex-shrink-0" size={28} />
            Jadwal Kuliah
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
            Jadwal kuliah untuk semua kelas
          </p>
        </div>

        {canManageSchedules() && (
          <button
            className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base"
            onClick={handleAddSchedule}
          >
            <Plus size={18} />
            Tambah Jadwal
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md dark:shadow-dark-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Filter className="text-gray-500 dark:text-gray-400 mr-2" size={20} />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="all">Semua Kelas</option>
              <option value="A">Kelas A</option>
              <option value="B">Kelas B</option>
              <option value="C">Kelas C</option>
            </select>
          </div>

          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
          >
            <option value="all">Semua Hari</option>
            <option value="monday">Senin</option>
            <option value="tuesday">Selasa</option>
            <option value="wednesday">Rabu</option>
            <option value="thursday">Kamis</option>
            <option value="friday">Jumat</option>
            <option value="saturday">Sabtu</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule._id}
              className="bg-white dark:bg-dark-700 border border-gray-200 dark:border-dark-600 rounded-xl p-6 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {schedule.courseName}
                  </h3>
                  <div className="flex items-center">
                    <Users className="text-gray-500 dark:text-gray-400 mr-2" size={16} />
                    <span className="bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200 px-2 py-1 rounded-full text-xs">
                      {schedule.className}
                    </span>
                  </div>
                </div>
                <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  {getDayName(schedule.day)}
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Clock className="mr-2" size={16} />
                  <span>
                    {schedule.startTime} - {schedule.endTime}
                  </span>
                </div>

                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="mr-2" size={16} />
                  <span>{schedule.room}</span>
                </div>

                <div className="text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Dosen:</span> {schedule.lecturer}
                </div>
              </div>

              {canManageSchedules() && (
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100 dark:border-dark-600">
                  <button
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                    onClick={() => handleEditSchedule(schedule._id)}
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                    onClick={() => handleDeleteSchedule(schedule._id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredSchedules.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              Tidak ada jadwal yang ditemukan
            </p>
          </div>
        )}
      </div>

      {canManageSchedules() && (
        <div className="mt-8 flex justify-center">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center"
            onClick={handleAddSchedule}
          >
            <Plus className="mr-2" size={20} />
            Tambah Jadwal Baru
          </button>
        </div>
      )}

      {/* Add Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Tambah Jadwal Baru</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={currentSchedule.courseName || ""}
                  onChange={handleScheduleInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama mata kuliah"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                  <select
                    name="className"
                    value={currentSchedule.className || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Hari</label>
                  <select
                    name="day"
                    value={currentSchedule.day || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih Hari</option>
                    <option value="monday">Senin</option>
                    <option value="tuesday">Selasa</option>
                    <option value="wednesday">Rabu</option>
                    <option value="thursday">Kamis</option>
                    <option value="friday">Jumat</option>
                    <option value="saturday">Sabtu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={currentSchedule.startTime || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={currentSchedule.endTime || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Ruangan</label>
                <input
                  type="text"
                  name="room"
                  value={currentSchedule.room || ""}
                  onChange={handleScheduleInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama ruangan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Dosen</label>
                <input
                  type="text"
                  name="lecturer"
                  value={currentSchedule.lecturer || ""}
                  onChange={handleScheduleInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama dosen"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Batal
              </button>
              <button
                onClick={handleCreateSchedule}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Schedule Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Jadwal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Nama Mata Kuliah
                </label>
                <input
                  type="text"
                  name="courseName"
                  value={currentSchedule.courseName || ""}
                  onChange={handleScheduleInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama mata kuliah"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Kelas</label>
                  <select
                    name="className"
                    value={currentSchedule.className || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih Kelas</option>
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Hari</label>
                  <select
                    name="day"
                    value={currentSchedule.day || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih Hari</option>
                    <option value="monday">Senin</option>
                    <option value="tuesday">Selasa</option>
                    <option value="wednesday">Rabu</option>
                    <option value="thursday">Kamis</option>
                    <option value="friday">Jumat</option>
                    <option value="saturday">Sabtu</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Waktu Mulai
                  </label>
                  <input
                    type="time"
                    name="startTime"
                    value={currentSchedule.startTime || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">
                    Waktu Selesai
                  </label>
                  <input
                    type="time"
                    name="endTime"
                    value={currentSchedule.endTime || ""}
                    onChange={handleScheduleInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Ruangan</label>
                <input
                  type="text"
                  name="room"
                  value={currentSchedule.room || ""}
                  onChange={handleScheduleInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama ruangan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Dosen</label>
                <input
                  type="text"
                  name="lecturer"
                  value={currentSchedule.lecturer || ""}
                  onChange={handleScheduleInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama dosen"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateSchedule}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SchedulePage;