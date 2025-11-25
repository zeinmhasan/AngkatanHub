import { useState, useEffect } from "react";
import {
  ExternalLink,
  Calendar,
  User,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { ExternalInfo } from "../types";
import { usePermissions } from "../hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { externalInfoAPI } from "../services/api";

const ExternalInfoPage: React.FC = () => {
  const { canManageExternalInfo, canRead } = usePermissions();
  const navigate = useNavigate();

  // Redirect users without read permission
  if (!canRead()) {
    navigate("/");
    return null;
  }

  const [externalInfo, setExternalInfo] = useState<ExternalInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentInfo, setCurrentInfo] = useState<Partial<ExternalInfo>>({});
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [selectedInfo, setSelectedInfo] = useState<ExternalInfo | null>(null);

  useEffect(() => {
    const fetchExternalInfo = async () => {
      try {
        const data = await externalInfoAPI.get();
        setExternalInfo(data);
      } catch (error) {
        console.error("Error fetching external info:", error);
        // Fallback to mock data
        setExternalInfo([
          {
            _id: "1",
            title: "Open Recruitment BEM",
            description: "Pendaftaran calon pengurus BEM periode 2024/2025",
            category: "oprec",
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
            organizer: "BEM Kampus",
            link: "https://bem-kampus.ac.id/oprec",
            postedBy: {
              _id: "1",
              email: "admin@bem.ac.id",
              name: "Admin BEM",
              className: "A",
              role: "admin",
              createdAt: new Date(),
            },
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          },
          {
            _id: "2",
            title: "Lomba Programming Nasional 2024",
            description:
              "Kompetisi pemrograman tingkat nasional untuk mahasiswa",
            category: "lomba",
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
            organizer: "Dikti",
            link: "https://lombaprogramming.com",
            postedBy: {
              _id: "2",
              email: "info@dikti.ac.id",
              name: "Info Dikti",
              className: "A",
              role: "admin",
              createdAt: new Date(),
            },
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          },
          {
            _id: "3",
            title: "Beasiswa Unggulan 2024",
            description: "Program beasiswa untuk mahasiswa berprestasi",
            category: "beasiswa",
            deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            organizer: "Kementerian Pendidikan",
            link: "https://beasiswaunggulan.kemdikbud.go.id",
            postedBy: {
              _id: "3",
              email: "beasiswa@kemdikbud.go.id",
              name: "Admin Beasiswa",
              className: "A",
              role: "admin",
              createdAt: new Date(),
            },
            createdAt: new Date(),
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchExternalInfo();
  }, []);

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterDate, setFilterDate] = useState<string>("all");

  // Filter external info based on selected filters
  const filteredInfo = externalInfo.filter((info) => {
    const categoryMatch =
      filterCategory === "all" || info.category === filterCategory;
    const dateMatch =
      filterDate === "all" ||
      (filterDate === "upcoming" &&
        info.deadline &&
        new Date(info.deadline) >= new Date()) ||
      (filterDate === "past" &&
        info.deadline &&
        new Date(info.deadline) < new Date());

    return categoryMatch && dateMatch;
  });

  // Handler functions for admin actions
  const handleAddInfo = () => {
    setCurrentInfo({
      title: "",
      description: "",
      category: "oprec",
      deadline: new Date(),
      organizer: "",
      link: "",
    });
    setShowAddModal(true);
  };

  const handleEditInfo = async (id: string) => {
    const info = externalInfo.find((i) => i._id === id);
    if (info) {
      setCurrentInfo(info);
      setShowEditModal(true);
    }
  };

  const handleDeleteInfo = async (id: string) => {
    if (
      window.confirm(`Yakin ingin menghapus info eksternal dengan ID: ${id}?`)
    ) {
      try {
        await externalInfoAPI.delete(id);
        // Refresh the external info data after deletion
        const updatedInfo = await externalInfoAPI.get();
        setExternalInfo(updatedInfo);
      } catch (error) {
        console.error("Error deleting info:", error);
        alert("Gagal menghapus info eksternal. Silakan coba lagi.");
      }
    }
  };

  // Handle form submission for adding new info
  const handleCreateInfo = async () => {
    try {
      if (
        !currentInfo.title ||
        !currentInfo.category ||
        !currentInfo.organizer ||
        !currentInfo.link
      ) {
        alert("Harap lengkapi semua field wajib");
        return;
      }

      await externalInfoAPI.create(currentInfo);
      // Refresh the external info data after creation
      const updatedInfo = await externalInfoAPI.get();
      setExternalInfo(updatedInfo);
      setShowAddModal(false);
      setCurrentInfo({});
    } catch (error) {
      console.error("Error creating info:", error);
      alert("Gagal menambahkan info eksternal. Silakan coba lagi.");
    }
  };

  // Handle form submission for updating info
  const handleUpdateInfo = async () => {
    if (!currentInfo._id) return;

    try {
      await externalInfoAPI.update(currentInfo._id, currentInfo);
      // Refresh the external info data after update
      const updatedInfo = await externalInfoAPI.get();
      setExternalInfo(updatedInfo);
      setShowEditModal(false);
      setCurrentInfo({});
    } catch (error) {
      console.error("Error updating info:", error);
      alert("Gagal memperbarui info eksternal. Silakan coba lagi.");
    }
  };

  // Handle form input changes
  const handleInfoInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentInfo((prev) => ({
      ...prev,
      [name]: name === "deadline" ? new Date(value) : value,
    }));
  };

  // View info details
  const viewInfoDetails = (info: ExternalInfo) => {
    setSelectedInfo(info);
    setShowDetailModal(true);
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
            <ExternalLink className="mr-3 text-primary-600" size={32} />
            Info Eksternal
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Informasi dari luar kampus: oprec, lomba, beasiswa, dll
          </p>
        </div>

        {canManageExternalInfo() && (
          <button
            className="mt-4 md:mt-0 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center transition"
            onClick={handleAddInfo}
          >
            <Plus className="mr-2" size={20} />
            Tambah Info
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-dark-800 rounded-xl shadow-md dark:shadow-dark-lg p-6 mb-8">
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center">
            <Filter className="text-gray-500 dark:text-gray-400 mr-2" size={20} />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="all">Semua Kategori</option>
              <option value="oprec">Open Recruitment</option>
              <option value="lomba">Lomba</option>
              <option value="seminar">Seminar</option>
              <option value="beasiswa">Beasiswa</option>
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

        <div className="space-y-6">
          {filteredInfo.length > 0 ? (
            filteredInfo.map((info) => (
              <div
                key={info._id}
                className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition dark:border-dark-700 dark:bg-dark-700"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2 dark:text-gray-200">
                      {info.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-3 dark:text-gray-400">
                      <User className="mr-2" size={16} />
                      <span className="mr-4">
                        Diposting oleh: {info.postedBy.name}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          info.category === "oprec"
                            ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                            : info.category === "lomba"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : info.category === "seminar"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : info.category === "beasiswa"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-gray-300"
                        }`}
                      >
                        {info.category}
                      </span>
                    </div>
                  </div>
                  {info.deadline && (
                    <div className="flex items-center text-gray-500 dark:text-gray-400">
                      <Calendar className="mr-1" size={16} />
                      <span className="text-sm">
                        Deadline:{" "}
                        {new Date(info.deadline).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  )}
                </div>

                <p className="text-gray-700 mb-4 dark:text-gray-300">{info.description}</p>

                <div className="flex flex-wrap gap-4 mb-4">
                  <div>
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      Penyelenggara:
                    </span>
                    <span className="ml-2 text-gray-600 dark:text-gray-400">{info.organizer}</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-gray-100 dark:border-dark-600">
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    Diposting:{" "}
                    {new Date(info.createdAt).toLocaleDateString("id-ID")}
                  </div>

                  <div className="flex space-x-2">
                    {canManageExternalInfo() && (
                      <>
                        <button
                          className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                          onClick={() => handleEditInfo(info._id)}
                        >
                          <Edit size={20} />
                        </button>
                        <button
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          onClick={() => handleDeleteInfo(info._id)}
                        >
                          <Trash2 size={20} />
                        </button>
                        <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
                      </>
                    )}
                    <button
                      onClick={() => viewInfoDetails(info)}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition"
                    >
                      <ExternalLink className="mr-2" size={16} />
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">
                Tidak ada informasi eksternal yang ditemukan
              </p>
            </div>
          )}
        </div>
      </div>

      {canManageExternalInfo() && (
        <div className="mt-8 flex justify-center">
          <button
            className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg flex items-center"
            onClick={handleAddInfo}
          >
            <Plus className="mr-2" size={20} />
            Tambah Info Eksternal
          </button>
        </div>
      )}

      {/* Add External Info Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">
              Tambah Info Eksternal Baru
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={currentInfo.title || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Judul info eksternal"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={currentInfo.description || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Deskripsi info eksternal"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={currentInfo.category || "oprec"}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="oprec">Open Recruitment</option>
                    <option value="lomba">Lomba</option>
                    <option value="seminar">Seminar</option>
                    <option value="beasiswa">Beasiswa</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={
                      currentInfo.deadline
                        ? new Date(currentInfo.deadline)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={currentInfo.organizer || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama penyelenggara"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Link</label>
                <input
                  type="url"
                  name="link"
                  value={currentInfo.link || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="https://example.com"
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
                onClick={handleCreateInfo}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit External Info Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Edit Info Eksternal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Judul</label>
                <input
                  type="text"
                  name="title"
                  value={currentInfo.title || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Judul info eksternal"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Deskripsi</label>
                <textarea
                  name="description"
                  value={currentInfo.description || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Deskripsi info eksternal"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Kategori</label>
                  <select
                    name="category"
                    value={currentInfo.category || "oprec"}
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  >
                    <option value="oprec">Open Recruitment</option>
                    <option value="lomba">Lomba</option>
                    <option value="seminar">Seminar</option>
                    <option value="beasiswa">Beasiswa</option>
                    <option value="lainnya">Lainnya</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1">Deadline</label>
                  <input
                    type="date"
                    name="deadline"
                    value={
                      currentInfo.deadline
                        ? new Date(currentInfo.deadline)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleInfoInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">
                  Penyelenggara
                </label>
                <input
                  type="text"
                  name="organizer"
                  value={currentInfo.organizer || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="Nama penyelenggara"
                />
              </div>

              <div>
                <label className="block text-gray-700 dark:text-gray-300 mb-1">Link</label>
                <input
                  type="url"
                  name="link"
                  value={currentInfo.link || ""}
                  onChange={handleInfoInputChange}
                  className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
                  placeholder="https://example.com"
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
                onClick={handleUpdateInfo}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Info Detail Modal */}
      {showDetailModal && selectedInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-800 rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-xl font-bold dark:text-white">{selectedInfo.title}</h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Deskripsi</h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedInfo.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Kategori</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      selectedInfo.category === "oprec"
                        ? "bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200"
                        : selectedInfo.category === "lomba"
                        ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                        : selectedInfo.category === "seminar"
                        ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        : selectedInfo.category === "beasiswa"
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        : "bg-gray-100 text-gray-800 dark:bg-dark-600 dark:text-gray-300"
                    }`}
                  >
                    {selectedInfo.category}
                  </span>
                </div>

                {selectedInfo.deadline && (
                  <div>
                    <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">Deadline</h3>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Calendar className="mr-1" size={14} />
                      <span>
                        {new Date(selectedInfo.deadline).toLocaleDateString(
                          "id-ID"
                        )}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Penyelenggara
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedInfo.organizer}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Diposting oleh
                </h3>
                <p className="text-gray-600 dark:text-gray-400">{selectedInfo.postedBy?.name}</p>
              </div>

              <div>
                <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tanggal Diposting
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {new Date(selectedInfo.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="pt-4">
                <a
                  href={selectedInfo.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center transition"
                >
                  <ExternalLink className="mr-2" size={16} />
                  Kunjungi Situs
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExternalInfoPage;