import { useState, useEffect } from "react";
import { User, Mail, Lock, GraduationCap, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [className, setClassName] = useState<"A" | "B" | "C">("A");
  const [adminCode, setAdminCode] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  // Check for saved theme preference on component mount
  useEffect(() => {
    const isDark = localStorage.getItem("darkMode") === "true";
    setDarkMode(isDark);
    if (isDark) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", String(newDarkMode));

    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!name || !email || !password) {
      setError("Semua field harus diisi");
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Email tidak valid");
      return;
    }

    // Check if admin code is provided and valid
    const isAdmin = adminCode === "zein_ganteng";

    // Call register function from AuthContext
    const result = await register({
      name,
      email,
      className,
      password,
      isAdmin,
    });

    if (result.success) {
      setSuccess(true);
      setError("");

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      setError(result.error || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-900 flex items-center justify-center">
      {/* Dark Mode Toggle Button */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 p-3 rounded-full bg-gray-200 dark:bg-dark-700 text-gray-700 dark:text-yellow-300 hover:bg-gray-300 dark:hover:bg-dark-600 transition-all duration-200 shadow-md"
        aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
      >
        {darkMode ? <Sun size={20} /> : <Moon size={20} />}
      </button>

      <div className="max-w-md w-full bg-white dark:bg-dark-800 p-8 rounded-xl shadow-lg">
        <div className="text-center mb-8">
          <div className="mx-auto bg-primary-100 dark:bg-primary-900 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <GraduationCap
              className="text-primary-600 dark:text-primary-400"
              size={32}
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Daftar Akun Baru
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Buat akun untuk mengakses AngkatanHub
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-lg">
            Registrasi berhasil! Anda akan diarahkan ke dashboard...
          </div>
        )}

        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="name"
            >
              Nama Lengkap
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 dark:text-gray-400" />
              </div>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-dark-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Nama Anda"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-400 dark:text-gray-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="email@example.com"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-400 dark:text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 dark:text-white dark:placeholder-gray-400"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="class"
            >
              Kelas
            </label>
            <select
              id="class"
              value={className}
              onChange={(e) => setClassName(e.target.value as "A" | "B" | "C")}
              className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white"
            >
              <option value="A">Kelas A</option>
              <option value="B">Kelas B</option>
              <option value="C">Kelas C</option>
            </select>
          </div>

          <div className="mb-6">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="adminCode"
            >
              Kode Admin (opsional)
            </label>
            <div className="relative">
              <input
                id="adminCode"
                type="password"
                value={adminCode}
                onChange={(e) => setAdminCode(e.target.value)}
                className="w-full border border-gray-300 dark:border-dark-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-dark-700 dark:text-white dark:placeholder-gray-400"
                placeholder="Masukkan kode untuk menjadi admin"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition"
            disabled={success}
          >
            Daftar
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Sudah punya akun?{" "}
            <Link
              to="/login"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
