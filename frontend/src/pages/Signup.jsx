import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Play,
  Mail,
  Lock,
  User,
  Loader,
  Image,
} from "lucide-react";
import Layout from "../components/Layout";
import { useUser } from "../context/userContext";
import toast, { Toaster } from "react-hot-toast";

const Signup = () => {
  const { signup } = useUser();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [coverImageFile, setCoverImageFile] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.agreeToTerms) {
      toast.error("You must agree to the terms and conditions.");
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("fullName", formData.fullName);  
      formDataToSend.append("username", formData.username);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("password", formData.password);

      if (avatarFile) formDataToSend.append("avatar", avatarFile);
      if (coverImageFile) formDataToSend.append("coverImage", coverImageFile);

      const result = await signup(formDataToSend);

      if (result.success) {
        toast.success("Account created successfully!");
        setFormData({
          fullName: "",
          username: "",
          email: "",
          password: "",
          agreeToTerms: false,
        });
        setAvatarFile(null);
        setCoverImageFile(null);

        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error(result.message || "Signup failed.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout showSidebar={false}>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: { background: "#333", color: "#fff" },
        }}
      />

      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gray-50 dark:bg-dark">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Play className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create your account
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Join VidTube and start sharing your videos
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            encType="multipart/form-data"
            className="mt-8 space-y-6"
          >
            {/* Full Name */}
            <div>
              <label className="text-sm font-medium text-black mb-2 block">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                disabled={loading}
                required
                placeholder="Your full name"
                className="w-full px-4 py-3 border rounded-xl bg-white dark:bg-dark-secondary text-black border-gray-300 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>

            {/* Username */}
            <div>
              <label className="text-sm font-medium text-black   mb-2 block">
                Username
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-medium">
                  @
                </span>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="username"
                  className="w-full pl-8 pr-4 py-3 border rounded-xl bg-white dark:bg-dark-secondary text-black border-gray-300 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="text-sm font-medium text-black   mb-2 block">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border rounded-xl bg-white dark:bg-dark-secondary text-black border-gray-300 dark:border-gray-600 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="text-sm font-medium text-gray-700   mb-2 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                  placeholder="Create a password"
                  className="w-full pl-10 pr-12 py-3 border rounded-xl bg-white dark:bg-dark-secondary text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              {/* Avatar */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  <User className="inline w-4 h-4 mr-1" />
                  Avatar (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setAvatarFile(e.target.files[0])}
                  disabled={loading}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900 dark:file:text-red-200"
                />
                {avatarFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Selected: {avatarFile.name}
                  </p>
                )}
              </div>

              {/* Cover Image */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  <Image className="inline w-4 h-4 mr-1" />
                  Cover Image (optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setCoverImageFile(e.target.files[0])}
                  disabled={loading}
                  className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:font-semibold file:bg-red-50 file:text-red-700 hover:file:bg-red-100 dark:file:bg-red-900 dark:file:text-red-200"
                />
                {coverImageFile && (
                  <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                    Selected: {coverImageFile.name}
                  </p>
                )}
              </div>

            </div>

            {/* Terms */}
            <div className="flex items-start">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleChange}
                required
                disabled={loading}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                I agree to the{" "}
                <Link to="/terms" className="text-red-600 hover:underline">
                  Terms & Conditions
                </Link>{" "}
                and{" "}
                <Link to="/privacy" className="text-red-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
            >
              {loading ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>

            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-red-600 hover:text-red-500"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Signup;
