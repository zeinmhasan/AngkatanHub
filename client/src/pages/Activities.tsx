import { useState, useEffect } from "react";
import {
  Users,
  Calendar,
  MapPin,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Activity } from "../types";
import { usePermissions } from "../hooks/usePermissions";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { activityAPI } from "../services/api";

const Activities: React.FC = () => {
  const { user } = useAuth();
  const { canManageActivities, canRead } = usePermissions();
  const navigate = useNavigate();

  // Redirect users without read permission
  if (!canRead()) {
    navigate("/");
    return null;
  }

  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentActivity, setCurrentActivity] = useState<Partial<Activity>>({});

  const [filterType, setFilterType] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");

  useEffect(() => {
    const fetchActivitiesData = async () => {
      try {
        const data = await activityAPI.get();
        setActivities(data);
      } catch (error) {
        console.error("Error fetching activities data:", error);
        // For now, use mock data as fallback
        setActivities([
          {
            _id: "1",
            title: "Kumpul Angkatan",
            description: "Pertemuan rutin angkatan 2023",
            date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000), // Tomorrow
            location: "Gedung A",
            organizer: "BEM",
            participants: [],
            maxParticipants: 100,
            type: "kumpul",
          },
          {
            _id: "2",
            title: "Seminar Teknologi",
            description: "Seminar tentang perkembangan AI dan Machine Learning",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
            location: "Auditorium",
            organizer: "Himatif",
            participants: [],
            maxParticipants: 200,
            type: "lainnya",
          },
          {
            _id: "3",
            title: "Suporteran Basket",
            description: "Dukung tim basket kampus kita",
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            location: "Gor Kampus",
            organizer: "UKM Olahraga",
            participants: [],
            type: "suporteran",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchActivitiesData();
  }, []);

  // Filter activities based on selected filters
  const filteredActivities = activities.filter((activity) => {
    const typeMatch = filterType === "all" || activity.type === filterType;
    const dateMatch =
      filterDate === "all" ||
      (filterDate === "upcoming" && new Date(activity.date) >= new Date()) ||
      (filterDate === "past" && new Date(activity.date) < new Date());

    return typeMatch && dateMatch;
  });

  // Handler functions for admin actions
  const handleAddActivity = () => {
    setCurrentActivity({});
    setShowAddModal(true);
  };

  const handleEditActivity = async (id: string) => {
    const activity = activities.find((a) => a._id === id);
    if (activity) {
      setCurrentActivity(activity);
      setShowEditModal(true);
    }
  };

  const handleDeleteActivity = async (id: string) => {
    if (window.confirm(`Yakin ingin menghapus kegiatan dengan ID: ${id}?`)) {
      try {
        await activityAPI.delete(id);
        // Refresh the activities data after deletion
        const updatedActivities = await activityAPI.get();
        setActivities(updatedActivities);
      } catch (error) {
        console.error("Error deleting activity:", error);
        alert("Gagal menghapus kegiatan. Silakan coba lagi.");
      }
    }
  };

  // Handle form submission for adding new activity
  const handleCreateActivity = async () => {
    try {
      await activityAPI.create(currentActivity);
      // Refresh the activities data
      const updatedActivities = await activityAPI.get();
      setActivities(updatedActivities);
      setShowAddModal(false);
      setCurrentActivity({});
    } catch (error) {
      console.error("Error creating activity:", error);
      alert("Gagal menambahkan kegiatan. Silakan coba lagi.");
    }
  };

  // Handle form submission for updating activity
  const handleUpdateActivity = async () => {
    if (!currentActivity._id) return;

    try {
      await activityAPI.update(currentActivity._id, currentActivity);
      // Refresh the activities data
      const updatedActivities = await activityAPI.get();
      setActivities(updatedActivities);
      setShowEditModal(false);
      setCurrentActivity({});
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("Gagal memperbarui kegiatan. Silakan coba lagi.");
    }
  };

  // Handle form input changes
  const handleActivityInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentActivity((prev) => ({
      ...prev,
      [name]: name === "date" ? new Date(value) : value,
    }));
  };

  // Handle registration for activity
  const handleRegisterForActivity = async (id: string) => {
    try {
      // Get the current user ID from the auth context
      if (!user) {
        alert("Anda harus login untuk mendaftar kegiatan");
        return;
      }

      const userId = user._id;

      // Register for the activity
      const result = await activityAPI.register(id, { userId });

      // Show success message
      alert("Berhasil mendaftar kegiatan!");

      // Refresh the activities to reflect updated participant count
      const updatedActivities = await activityAPI.get();
      setActivities(updatedActivities);
    } catch (error) {
      console.error("Error registering for activity:", error);
      alert("Gagal mendaftar kegiatan. Silakan coba lagi.");
    }
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
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white flex items-center">
            <Users className="mr-3 text-primary-600" size={32} />
            Kegiatan Angkatan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Daftar kegiatan dan acara angkatan
          </p>
        </div>

        {canManageActivities() && (
          <button
            className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center transition"
            onClick={handleAddActivity}
          >
            <Plus className="mr-2" size={20} />
            Tambah Kegiatan
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md dark:shadow-dark-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Filter className="text-gray-500 dark:text-gray-400 mr-2" size={20} />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="all">Semua Jenis</option>
              <option value="kumpul">Kumpul</option>
              <option value="suporteran">Suporteran</option>
              <option value="lainnya">Lainnya</option>
            </select>
          </div>

          <select
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
          >
            <option value="all">Semua Tanggal</option>
            <option value="upcoming">Akan Datang</option>
            <option value="past">Sudah Lewat</option>
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredActivities.map((activity) => (
            <div
              key={activity._id}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition dark:border-dark-700 dark:bg-dark-700"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-200">
                    {activity.title}
                  </h3>
                  <p className="text-gray-600 mb-4 dark:text-gray-300">{activity.description}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    activity.type === "kumpul"
                      ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                      : activity.type === "suporteran"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                  }`}
                >
                  {activity.type}
                </span>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <Calendar className="mr-2" size={16} />
                  <span>
                    {new Date(activity.date).toLocaleDateString("id-ID")}
                  </span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <MapPin className="mr-2" size={16} />
                  <span>{activity.location}</span>
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                  <span className="font-medium">Penyelenggara:</span>
                  <span className="ml-2">{activity.organizer}</span>
                </div>
              </div>

              {activity.maxParticipants && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1 dark:text-gray-400">
                    <span>Peserta Terdaftar</span>
                    <span>
                      {activity.participants.length}/{activity.maxParticipants}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-dark-600">
                    <div
                      className="bg-primary-600 h-2 rounded-full"
                      style={{
                        width: `${
                          (activity.participants.length /
                            activity.maxParticipants) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 rounded-lg flex items-center justify-center"
                  onClick={() => handleRegisterForActivity(activity._id)}
                >
                  <Users className="mr-2" size={16} />
                  Daftar
                </button>
                <button className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">
                  <Eye size={20} />
                </button>
                {canManageActivities() && (
                  <>
                    <button
                      className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      onClick={() => handleEditActivity(activity._id)}
                    >
                      <Edit size={20} />
                    </button>
                    <button
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      onClick={() => handleDeleteActivity(activity._id)}
                    >
                      <Trash2 size={20} />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {filteredActivities.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Tidak ada kegiatan yang ditemukan</p>
          </div>
        )}
      </div>

      {canManageActivities() && (
        <div className="mt-8 flex justify-center">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center"
            onClick={handleAddActivity}
          >
            <Plus className="mr-2" size={20} />
            Tambah Kegiatan Baru
          </button>
        </div>
      )}

      {/* Add Activity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Tambah Kegiatan Baru</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Judul Kegiatan
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentActivity.title || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Judul kegiatan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={currentActivity.description || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Deskripsi kegiatan"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={
                    currentActivity.date
                      ? new Date(currentActivity.date as any)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Lokasi</label>
                <input
                  type="text"
                  name="location"
                  value={currentActivity.location || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Lokasi kegiatan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={currentActivity.organizer || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama penyelenggara"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Kegiatan
                </label>
                <select
                  name="type"
                  value={currentActivity.type || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Pilih jenis kegiatan</option>
                  <option value="kumpul">Kumpul</option>
                  <option value="suporteran">Suporteran</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Maksimum Peserta (opsional)
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={currentActivity.maxParticipants || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Jumlah maksimum peserta"
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
                onClick={handleCreateActivity}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Activity Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Kegiatan</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Judul Kegiatan
                </label>
                <input
                  type="text"
                  name="title"
                  value={currentActivity.title || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Judul kegiatan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={currentActivity.description || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Deskripsi kegiatan"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Tanggal</label>
                <input
                  type="date"
                  name="date"
                  value={
                    currentActivity.date
                      ? new Date(currentActivity.date as any)
                          .toISOString()
                          .split("T")[0]
                      : ""
                  }
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Lokasi</label>
                <input
                  type="text"
                  name="location"
                  value={currentActivity.location || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Lokasi kegiatan"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={currentActivity.organizer || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama penyelenggara"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Jenis Kegiatan
                </label>
                <select
                  name="type"
                  value={currentActivity.type || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                >
                  <option value="">Pilih jenis kegiatan</option>
                  <option value="kumpul">Kumpul</option>
                  <option value="suporteran">Suporteran</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Maksimum Peserta (opsional)
                </label>
                <input
                  type="number"
                  name="maxParticipants"
                  value={currentActivity.maxParticipants || ""}
                  onChange={handleActivityInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Jumlah maksimum peserta"
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
                onClick={handleUpdateActivity}
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

export default Activities;