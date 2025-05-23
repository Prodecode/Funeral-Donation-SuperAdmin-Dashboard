import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import { FiKey, FiUser, FiEye, FiEyeOff, FiShield } from "react-icons/fi";
import adminIllustration from "../assets/admin-security.svg";

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
    const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError("");

  try {
    const response = await fetch(
      "https://funeral-donation-backend-production.up.railway.app/super_admins/login",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          super_admin: {
            email: username, // Assuming `username` is the email
            password: password,
            password_confirmation: password,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid credentials. Please try again.");
    }

    const FuneralToken = response.headers.get("Authorization");

    if (!FuneralToken) {
      throw new Error("No authentication token received.");
    }

    localStorage.setItem("FuneralToken", FuneralToken);

    navigate("/dashboard");

  } catch (err) {
    setError(err.message);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="container mx-auto flex flex-col lg:flex-row items-center justify-center gap-12 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 hidden lg:flex justify-center"
        >
          <div className="relative max-w-xl">
            <motion.img
              src={adminIllustration}
              alt="SuperAdmin Security Illustration"
              className="w-full h-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            />
            
            {[1, 2, 3].map((i) => (
              <motion.div
                key={i}
                className="absolute bg-gray-800 bg-opacity-80 p-3 rounded-full border border-blue-500 border-opacity-50"
                style={{
                  top: `${Math.random() * 60 + 20}%`,
                  left: `${Math.random() * 80 + 10}%`,
                }}
                animate={{
                  y: [0, -10, 0],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{
                  duration: 3 + Math.random() * 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5,
                }}
              >
                <FiShield className="w-5 h-5 text-blue-400" />
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <div className="bg-gray-800 p-8 rounded-xl border border-gray-700 shadow-2xl">
            <div className="text-center mb-8">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="inline-block mb-4"
              >
                <div className="bg-blue-600 p-3 rounded-full inline-flex items-center justify-center">
                  <FiShield className="h-8 w-8 text-white" />
                </div>
              </motion.div>
              <h2 className="text-2xl font-bold text-white mb-2">
                SuperAdmin Portal
              </h2>
              <p className="text-sm text-gray-400">
                Restricted access to system administration
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-900 bg-opacity-50 border border-red-700 rounded-lg text-red-200 text-sm"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username Field */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Username
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiUser className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin_username"
                    className="block w-full pl-10 pr-3 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    required
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-300">
                    Master Password
                  </label>
                  <a
                    href="#"
                    className="text-xs text-blue-400 hover:text-blue-300 hover:underline"
                  >
                    Forgot password?
                  </a>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiKey className="h-5 w-5 text-gray-500" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="block w-full pl-10 pr-10 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400 hover:text-gray-300" />
                    )}
                  </button>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`w-full py-3 px-4 rounded-lg shadow transition-all duration-300 ${
                    isLoading
                      ? "bg-blue-700 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-500"
                  } text-white font-medium flex items-center justify-center`}
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Authenticating...
                    </>
                  ) : (
                    "Access Dashboard"
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-6 pt-6 border-t border-gray-700 text-center text-xs text-gray-500"
            >
              <div className="mb-2">
                <span className="inline-block px-2 py-1 bg-gray-900 rounded-md text-gray-400">
                  v2.5.1 | Secure Access Only
                </span>
              </div>
              <p>
                Unauthorized access to this system is prohibited and may be subject to legal action.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;