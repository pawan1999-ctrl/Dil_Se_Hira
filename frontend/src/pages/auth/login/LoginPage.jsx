import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { MdOutlineMail, MdPassword } from "react-icons/md";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");

      return data;
    },
    onSuccess: () => {
      toast.success("Login successful!");
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Login failed! Please check your credentials.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      toast.error("Username and Password are required!");
      return;
    }
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="h-screen w-full bg-transparent flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-2xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-32 md:w-36 lg:w-48 h-auto cover">
              <img src="/logo.png" alt="Logo" className="" />
            </div>
          </div>

          <h2 className="mt-2 text-3xl font-extrabold text-gray-900">
            Welcome Back!
          </h2>
        </div>

        {isError && (
          <p className="text-red-500 text-sm text-center">{error.message}</p>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <InputField
              Icon={MdOutlineMail}
              name="username"
              type="text"
              placeholder="Username"
              value={formData.username}
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
          </div>

          <Button text="Login" loading={isPending} />

          <div className="flex flex-col gap-2 mt-4">
            <p className="text-gray-700 text-lg text-center">
              Don’t have an account?
            </p>
            <Link to="/signup">
              <button className="group relative w-full flex justify-center py-2 px-4 border border-red-600 text-red-600 text-sm font-medium rounded-md bg-white hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                Sign up
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
    {loading ? "Logging in..." : text}
  </button>
);
