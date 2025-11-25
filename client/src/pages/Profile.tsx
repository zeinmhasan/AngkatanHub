import React, { useState } from "react";
import {
  User,
  Mail,
  GraduationCap,
  Calendar,
  Edit3,
  Save,
  X,
} from "lucide-react";
import { User as UserType } from "../types";
import { useAuth } from "../context/AuthContext";

const Profile: React.FC = () => {
  const { user: authenticatedUser } = useAuth();
  const [user, setUser] = useState<UserType | null>(authenticatedUser);
  const [isEditing, setIsEditing] = useState(false);
  const [editUser, setEditUser] = useState<UserType | null>(authenticatedUser);

  const handleEdit = () => {
    if (user) {
      setIsEditing(true);
      setEditUser({ ...user });
    }
  };

  const handleSave = () => {
    if (editUser) {
      setUser({ ...editUser });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditUser(authenticatedUser);
    setIsEditing(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    if (editUser) {
      const { name, value } = e.target;
      setEditUser((prev) => ({
        ...prev!,
        [name]: name === "className" ? (value as "A" | "B" | "C") : value,
      }));
    }
  };

  if (!user) {
    return (
      <div className="w-full px-2 sm:px-4 md:px-0">
        <div className="max-w-4xl mx-auto py-6 sm:py-8">
          <div className="text-center py-12">
            <User size={40} className="mx-auto text-gray-400 mb-4 dark:text-gray-500" />
            <h2 className="text-lg sm:text-xl font-medium text-gray-700 dark:text-gray-300">
              Tidak ada data pengguna
            </h2>
            <p className="text-gray-500 text-sm sm:text-base dark:text-gray-400">
              Silakan login terlebih dahulu
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-2 sm:px-4 md:px-0">
      <div className="max-w-4xl mx-auto py-6 sm:py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 sm:mb-8 dark:text-gray-200">
          Profil Pengguna
        </h1>

        <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 md:gap-8">
            <div className="flex-shrink-0">
              <div className="bg-gray-200 border-2 border-dashed rounded-lg sm:rounded-xl w-24 sm:w-32 h-24 sm:h-32 flex items-center justify-center text-gray-500 flex-shrink-0 dark:bg-dark-700 dark:border-dark-600">
                <User size={40} className="sm:w-12 sm:h-12 dark:text-gray-400" />
              </div>
            </div>

            <div className="flex-grow w-full">
              {isEditing ? (
                <div className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-gray-700 mb-1 text-sm dark:text-gray-300">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={editUser?.name || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm dark:text-gray-300">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={editUser?.email || ""}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-1 text-sm dark:text-gray-300">
                      Kelas
                    </label>
                    <select
                      name="className"
                      value={editUser?.className || "A"}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm dark:bg-dark-700 dark:border-dark-600 dark:text-white"
                    >
                      <option value="A">Kelas A</option>
                      <option value="B">Kelas B</option>
                      <option value="C">Kelas C</option>
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 dark:text-gray-200">
                    {user.name}
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex items-center text-gray-600 text-sm sm:text-base gap-2 dark:text-gray-400">
                      <Mail className="flex-shrink-0" size={18} />
                      <span className="truncate">{user.email}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm sm:text-base gap-2 dark:text-gray-400">
                      <GraduationCap className="flex-shrink-0" size={18} />
                      <span>Kelas: {user.className}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm sm:text-base gap-2 dark:text-gray-400">
                      <Calendar className="flex-shrink-0" size={18} />
                      <span>
                        Angkatan: {new Date(user.createdAt).getFullYear()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : user.role === "class_rep"
                            ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        }`}
                      >
                        {user.role === "admin"
                          ? "Admin"
                          : user.role === "class_rep"
                          ? "Perwakilan Kelas"
                          : "User"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-4 sm:mt-6 flex flex-col-reverse sm:flex-row gap-2 sm:gap-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleCancel}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm dark:bg-gray-600 dark:hover:bg-gray-700"
                    >
                      <X size={16} />
                      Batal
                    </button>
                    <button
                      onClick={handleSave}
                      className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm"
                    >
                      <Save size={16} />
                      Simpan
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition text-sm"
                  >
                    <Edit3 size={16} />
                    Edit Profil
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Card */}
        <div className="bg-white dark:bg-dark-800 rounded-lg sm:rounded-xl shadow-md dark:shadow-dark-lg p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 dark:text-gray-200">
            Statistik Aktivitas
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 text-center dark:border-dark-700 dark:bg-dark-700">
              <p className="text-2xl sm:text-3xl font-bold text-primary-600 dark:text-primary-400">
                24
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 dark:text-gray-400">
                Postingan Forum
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 text-center dark:border-dark-700 dark:bg-dark-700">
              <p className="text-2xl sm:text-3xl font-bold text-secondary-600 dark:text-secondary-400">
                12
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 dark:text-gray-400">Komentar</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-3 sm:p-4 text-center dark:border-dark-700 dark:bg-dark-700">
              <p className="text-2xl sm:text-3xl font-bold text-accent-600 dark:text-accent-400">
                8
              </p>
              <p className="text-gray-600 text-xs sm:text-sm mt-1 dark:text-gray-400">
                Kegiatan Diikuti
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
