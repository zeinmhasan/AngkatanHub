import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { Navigate } from 'react-router-dom';

const Admin: React.FC = () => {
  const { canManageAll, role } = usePermissions();

  if (!canManageAll()) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 dark:text-gray-200">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Manajemen Jadwal</h2>
          <p className="text-gray-600 dark:text-gray-300">Lihat, tambah, edit, dan hapus jadwal kelas</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Manajemen Tugas</h2>
          <p className="text-gray-600 dark:text-gray-300">Lihat, tambah, edit, dan hapus tugas</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Manajemen Kegiatan</h2>
          <p className="text-gray-600 dark:text-gray-300">Lihat, tambah, edit, dan hapus kegiatan</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Manajemen Info Eksternal</h2>
          <p className="text-gray-600 dark:text-gray-300">Lihat, tambah, edit, dan hapus info eksternal</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Manajemen Forum</h2>
          <p className="text-gray-600 dark:text-gray-300">Lihat dan moderasi postingan forum</p>
        </div>

        <div className="bg-white dark:bg-dark-800 rounded-lg shadow dark:shadow-dark-lg p-6">
          <h2 className="text-xl font-semibold mb-4 dark:text-gray-200">Statistik Pengguna</h2>
          <p className="text-gray-600 dark:text-gray-300">Lihat statistik aktivitas pengguna</p>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6 dark:bg-blue-900/20 dark:border-blue-800">
        <h3 className="text-lg font-medium text-blue-800 mb-2 dark:text-blue-300">Peran Anda: {role}</h3>
        <p className="text-blue-700 dark:text-blue-200">Anda memiliki akses penuh ke semua fitur admin.</p>
      </div>
    </div>
  );
};

export default Admin;