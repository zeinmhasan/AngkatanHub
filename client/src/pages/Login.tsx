import { useState, useEffect } from "react";
import { User, Lock, GraduationCap, Sun, Moon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const { login } = useAuth();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const result = await login(email, password);

    if (result.success) {
      navigate("/");
    } else {
      setError(result.error || "Login gagal");
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
            AngkatanHub
          </h1>
          <p className="text-gray-600 dark:text-gray-300">Masuk ke akun Anda</p>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 dark:text-gray-300 mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={18} className="text-gray-400 dark:text-gray-400" />
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

          <div className="mb-6">
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
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Gunakan password apapun untuk login
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            Masuk
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>
            Belum punya akun?{" "}
            <Link
              to="/register"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
