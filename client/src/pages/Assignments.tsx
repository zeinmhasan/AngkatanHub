import { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Circle,
} from "lucide-react";
import { Assignment } from "../types";
import { usePermissions } from "../hooks/usePermissions";
import { useNavigate } from "react-router-dom";
import { assignmentAPI } from "../services/api";

const Assignments: React.FC = () => {
  const { canManageAssignments, canRead } = usePermissions();
  const navigate = useNavigate();

  // Redirect users without read permission
  if (!canRead()) {
    navigate("/");
    return null;
  }

  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [filterClass, setFilterClass] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [currentAssignment, setCurrentAssignment] = useState<
    Partial<Assignment>
  >({});

  useEffect(() => {
    const fetchAssignmentsData = async () => {
      try {
        const data = await assignmentAPI.get();
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching assignments data:", error);
        // For now, use mock data as fallback
        setAssignments([
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
            title: "Tugas Basis Data",
            description: "Desain database untuk sistem informasi",
            className: "A",
            dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
            priority: "medium",
            completed: false,
          },
          {
            _id: "3",
            title: "Tugas Algoritma",
            description: "Implementasi sorting algorithms",
            className: "B",
            dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            priority: "high",
            completed: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchAssignmentsData();
  }, []);

  // Filter assignments based on selected filters
  const filteredAssignments = assignments.filter((assignment) => {
    const classMatch =
      filterClass === "all" || assignment.className === filterClass;
    const statusMatch =
      filterStatus === "all" ||
      (filterStatus === "completed" && assignment.completed) ||
      (filterStatus === "pending" && !assignment.completed);
    const priorityMatch =
      filterPriority === "all" || assignment.priority === filterPriority;

    return classMatch && statusMatch && priorityMatch;
  });

  // Handler functions for admin actions
  const handleAddAssignment = () => {
    setCurrentAssignment({});
    setShowAddModal(true);
  };

  const handleEditAssignment = async (id: string) => {
    const assignment = assignments.find((a) => a._id === id);
    if (assignment) {
      setCurrentAssignment(assignment);
      setShowEditModal(true);
    }
  };

  const handleDeleteAssignment = async (id: string) => {
    if (window.confirm(`Yakin ingin menghapus tugas dengan ID: ${id}?`)) {
      try {
        await assignmentAPI.delete(id);
        // Refresh the assignments data after deletion
        const updatedAssignments = await assignmentAPI.get();
        setAssignments(updatedAssignments);
      } catch (error) {
        console.error("Error deleting assignment:", error);
        alert("Gagal menghapus tugas. Silakan coba lagi.");
      }
    }
  };

  // Handle form submission for adding new assignment
  const handleCreateAssignment = async () => {
    try {
      await assignmentAPI.create(currentAssignment);
      // Refresh the assignments data
      const updatedAssignments = await assignmentAPI.get();
      setAssignments(updatedAssignments);
      setShowAddModal(false);
      setCurrentAssignment({});
    } catch (error) {
      console.error("Error creating assignment:", error);
      alert("Gagal menambahkan tugas. Silakan coba lagi.");
    }
  };

  // Handle form submission for updating assignment
  const handleUpdateAssignment = async () => {
    if (!currentAssignment._id) return;

    try {
      await assignmentAPI.update(currentAssignment._id, currentAssignment);
      // Refresh the assignments data
      const updatedAssignments = await assignmentAPI.get();
      setAssignments(updatedAssignments);
      setShowEditModal(false);
      setCurrentAssignment({});
    } catch (error) {
      console.error("Error updating assignment:", error);
      alert("Gagal memperbarui tugas. Silakan coba lagi.");
    }
  };

  // Handle form input changes
  const handleAssignmentInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCurrentAssignment((prev) => ({
      ...prev,
      [name]: name === "dueDate" ? new Date(value) : value,
    }));
  };

  const toggleCompletion = async (id: string) => {
    console.log("Toggling completion for assignment:", id);

    // Get current assignment first
    const currentAssignment = assignments.find((a) => a._id === id);
    if (!currentAssignment) {
      console.log("Assignment not found");
      return;
    }

    const updatedStatus = !currentAssignment.completed;

    // Optimistically update the UI
    setAssignments((prevAssignments) =>
      prevAssignments.map((a) =>
        a._id === id ? { ...a, completed: updatedStatus } : a
      )
    );

    try {
      // Update completion status in the backend using the dedicated endpoint
      await assignmentAPI.toggleCompletion(id, updatedStatus);
      console.log("Update successful");
    } catch (error) {
      console.error("Error updating assignment completion:", error);

      // Rollback on error
      setAssignments((prevAssignments) =>
        prevAssignments.map((a) =>
          a._id === id ? { ...a, completed: !updatedStatus } : a
        )
      );

      alert("Gagal memperbarui status tugas. Silakan coba lagi.");
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
    <div className="w-full px-2 sm:px-4 md:px-0">
      <div className="max-w-7xl mx-auto py-6 sm:py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white flex items-center gap-2 sm:gap-3">
              <FileText className="text-primary-600 flex-shrink-0" size={28} />
              Manajemen Tugas
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2 text-sm sm:text-base">
              Kelola dan lacak tugas-tugasmu
            </p>
          </div>

          {canManageAssignments() && (
            <button
              className="w-full md:w-auto bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center justify-center gap-2 transition text-sm sm:text-base"
              onClick={handleAddAssignment}
            >
              <Plus size={18} />
              Tambah Tugas
            </button>
          )}
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-3 sm:p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mb-6 flex-wrap">
            <div className="flex items-center">
              <Filter
                className="text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0"
                size={18}
              />
              <select
                value={filterClass}
                onChange={(e) => setFilterClass(e.target.value)}
                className="border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
              >
                <option value="all">Semua Kelas</option>
                <option value="A">Kelas A</option>
                <option value="B">Kelas B</option>
                <option value="C">Kelas C</option>
              </select>
            </div>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Belum Selesai</option>
              <option value="completed">Selesai</option>
            </select>

            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
            >
              <option value="all">Semua Prioritas</option>
              <option value="low">Rendah</option>
              <option value="medium">Sedang</option>
              <option value="high">Tinggi</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-700">
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-800 dark:text-gray-200">
                    Judul
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold hidden sm:table-cell text-gray-800 dark:text-gray-200">
                    Deskripsi
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-800 dark:text-gray-200">
                    Kelas
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-800 dark:text-gray-200">
                    Deadline
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-800 dark:text-gray-200">
                    Prioritas
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-800 dark:text-gray-200">
                    Status
                  </th>
                  <th className="py-2 sm:py-3 px-2 sm:px-4 text-left font-semibold text-gray-800 dark:text-gray-200">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length > 0 ? (
                  filteredAssignments.map((assignment) => (
                    <tr
                      key={assignment._id}
                      className="border-b border-gray-100 hover:bg-gray-50 dark:border-dark-700 dark:hover:bg-dark-700"
                    >
                      <td className="py-2 sm:py-3 px-2 sm:px-4 font-medium text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        {assignment.title}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4 text-gray-600 hidden sm:table-cell text-xs sm:text-sm line-clamp-1 dark:text-gray-300">
                        {assignment.description}
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-xs dark:bg-primary-900 dark:text-primary-200">
                          {assignment.className}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex items-center text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                          <Calendar
                            className="mr-1 text-gray-500 dark:text-gray-400 flex-shrink-0"
                            size={14}
                          />
                          <span className="hidden sm:inline">
                            {new Date(assignment.dueDate).toLocaleDateString(
                              "id-ID"
                            )}
                          </span>
                          <span className="sm:hidden">
                            {new Date(assignment.dueDate).toLocaleDateString(
                              "id-ID",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <span
                          className={`px-2 py-1 rounded text-xs ${
                            assignment.priority === "high"
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : assignment.priority === "medium"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }`}
                        >
                          {assignment.priority}
                        </span>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <button
                          onClick={() => toggleCompletion(assignment._id)}
                          className="flex items-center cursor-pointer text-xs sm:text-sm w-full text-left"
                        >
                          {assignment.completed ? (
                            <>
                              <CheckCircle
                                className="text-green-600 mr-1 flex-shrink-0 dark:text-green-400"
                                size={16}
                              />
                              <span className="hidden sm:inline text-green-600 dark:text-green-400">
                                Selesai
                              </span>
                              <span className="sm:hidden text-green-600 dark:text-green-400">
                                Selesai
                              </span>
                            </>
                          ) : (
                            <>
                              <Circle
                                className="text-gray-400 mr-1 flex-shrink-0 dark:text-gray-500"
                                size={16}
                              />
                              <span className="hidden sm:inline text-gray-500 dark:text-gray-400">
                                Belum
                              </span>
                              <span className="sm:hidden text-gray-500 dark:text-gray-400">
                                Belum
                              </span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-2 sm:py-3 px-2 sm:px-4">
                        <div className="flex space-x-1 sm:space-x-2">
                          <button className="text-blue-600 hover:text-blue-800 p-1 dark:text-blue-400 dark:hover:text-blue-300">
                            <Eye size={16} />
                          </button>
                          {canManageAssignments() && (
                            <>
                              <button
                                className="text-green-600 hover:text-green-800 p-1 dark:text-green-400 dark:hover:text-green-300"
                                onClick={() =>
                                  handleEditAssignment(assignment._id)
                                }
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="text-red-600 hover:text-red-800 p-1 dark:text-red-400 dark:hover:text-red-300"
                                onClick={() =>
                                  handleDeleteAssignment(assignment._id)
                                }
                              >
                                <Trash2 size={16} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="py-8 sm:py-12 text-center text-gray-500 dark:text-gray-400 text-sm"
                    >
                      Tidak ada tugas yang ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">
            Ringkasan Tugas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-3 sm:p-4 text-center dark:bg-dark-700">
              <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                {assignments.length}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-1">
                Total Tugas
              </p>
            </div>
            <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-3 sm:p-4 text-center dark:bg-dark-700">
              <p className="text-2xl sm:text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                {assignments.filter((a) => a.completed).length}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-1">
                Tugas Selesai
              </p>
            </div>
            <div className="border border-gray-200 dark:border-dark-700 rounded-lg p-3 sm:p-4 text-center dark:bg-dark-700">
              <p className="text-2xl sm:text-3xl font-bold text-accent-600 dark:text-accent-400">
                {assignments.filter((a) => !a.completed).length}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm mt-1">
                Tugas Belum Selesai
              </p>
            </div>
          </div>
        </div>

        {canManageAssignments() && (
          <div className="mt-8 flex justify-center">
            <button
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg flex items-center gap-2 transition text-sm sm:text-base"
              onClick={handleAddAssignment}
            >
              <Plus size={18} />
              Tambah Tugas Baru
            </button>
          </div>
        )}

        {/* Add Assignment Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">
                Tambah Tugas Baru
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Judul Tugas
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentAssignment.title || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                    placeholder="Judul tugas"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={currentAssignment.description || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                    placeholder="Deskripsi tugas"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Kelas
                  </label>
                  <select
                    name="className"
                    value={currentAssignment.className || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih kelas</option>
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={
                      currentAssignment.dueDate
                        ? new Date(currentAssignment.dueDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Prioritas
                  </label>
                  <select
                    name="priority"
                    value={currentAssignment.priority || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih prioritas</option>
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  onClick={handleCreateAssignment}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
                >
                  Simpan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit Assignment Modal */}
        {showEditModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-dark-800 rounded-lg p-4 sm:p-6 w-full max-w-md max-h-screen overflow-y-auto">
              <h2 className="text-xl sm:text-2xl font-bold mb-4 dark:text-white">
                Edit Tugas
              </h2>

              <div className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Judul Tugas
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={currentAssignment.title || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                    placeholder="Judul tugas"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={currentAssignment.description || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                    placeholder="Deskripsi tugas"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Kelas
                  </label>
                  <select
                    name="className"
                    value={currentAssignment.className || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih kelas</option>
                    <option value="A">Kelas A</option>
                    <option value="B">Kelas B</option>
                    <option value="C">Kelas C</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Deadline
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={
                      currentAssignment.dueDate
                        ? new Date(currentAssignment.dueDate)
                            .toISOString()
                            .split("T")[0]
                        : ""
                    }
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 dark:text-gray-300 mb-1 text-sm">
                    Prioritas
                  </label>
                  <select
                    name="priority"
                    value={currentAssignment.priority || ""}
                    onChange={handleAssignmentInputChange}
                    className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:text-white"
                  >
                    <option value="">Pilih prioritas</option>
                    <option value="low">Rendah</option>
                    <option value="medium">Sedang</option>
                    <option value="high">Tinggi</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end mt-6">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-700 transition text-sm sm:text-base"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpdateAssignment}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition text-sm sm:text-base"
                >
                  Simpan Perubahan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Assignments;
