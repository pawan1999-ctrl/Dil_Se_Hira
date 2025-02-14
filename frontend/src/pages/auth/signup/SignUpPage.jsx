import { Link } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdOutlineMail, MdPassword } from "react-icons/md";
import { FaUser } from "react-icons/fa";
import { MdDriveFileRenameOutline } from "react-icons/md";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  const queryClient = useQueryClient();

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: async ({ email, username, fullName, password }) => {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, username, fullName, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create account");

      return data;
    },
    onSuccess: () => {
      toast.success("Account created successfully!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      setFormData({
        email: "",
        username: "",
        fullName: "",
        password: "",
        confirmPassword: "",
      });
    },
    onError: () => {
      toast.error("Signup failed! Please try again.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, username, fullName, password, confirmPassword } = formData;

    if (!email || !username || !fullName || !password || !confirmPassword) {
      toast.error("All fields are required!");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters!");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    mutate({ email, username, fullName, password });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen w-full bg-transparent to-white flex items-center justify-center">
      <div className="max-w-lg w-full bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
        <div className="flex justify-center">
            <div className="w-32 md:w-36 lg:w-48 h-auto cover">
              <img src="/logo.png" alt="Logo" className="" />
            </div>
          </div>

          <h2 className="mt-2 text-center text-3xl font-extrabold text-gray-900">
            Sign up
          </h2>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              Icon={MdDriveFileRenameOutline}
              name="fullName"
              type="text"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleInputChange}
            />
            <InputField
              Icon={FaUser}
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
            />
            <InputField
              Icon={MdOutlineMail}
              name="email"
              type="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleInputChange}
            />
            <InputField
              Icon={MdPassword}
              name="password"
              type="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
            />
            <InputField
              Icon={MdPassword}
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
            />
          </div>

          <Button text="Sign Up" loading={isPending} />

          <div className="flex flex-col gap-2 mt-4">
            <p className="text-gray-700 text-lg text-center">
              Already have an account?
            </p>
            <Link to="/login">
              <button className="group relative w-full flex justify-center py-2 px-4 border border-red-600 text-red-600 text-sm font-medium rounded-md bg-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Sign in
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

// **Reusable Input Component**
const InputField = ({ Icon, name, type, placeholder, value, onChange }) => (
  <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
    <Icon className="text-gray-500 mr-2" />
    <input
      name={name}
      type={type}
      required
      value={value}
      onChange={onChange}
      className="w-full outline-none bg-transparent text-gray-900 placeholder-gray-500 sm:text-sm"
      placeholder={placeholder}
    />
  </div>
);

// **Reusable Button Component**
const Button = ({ text, loading }) => (
  <button
    type="submit"
    disabled={loading}
    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 ${
      loading ? "opacity-50 cursor-not-allowed" : ""
    }`}
  >
    {loading ? "Signing up..." : text}
  </button>
);
