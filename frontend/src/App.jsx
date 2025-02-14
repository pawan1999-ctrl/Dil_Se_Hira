import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/login/LoginPage";
import SignUpPage from "./pages/auth/signup/SignUpPage";
import NotificationPage from "./pages/notification/NotificationPage";
import ProfilePage from "./pages/profile/ProfilePage";

import Sidebar from "./components/common/Sidebar";
import NoAuthSidebar from "./components/common/NoAuthSidebar";
import RightPanel from "./components/common/RightPanel";
import NoAuthHome from "./components/common/NoAuthHome";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/common/Navbar";

function App() {
  const location = useLocation();

  const {
    data: authUser,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.error) return null;
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });

  // Hide sidebar on login and signup pages
  const hideSidebar =
    location.pathname === "/login" || location.pathname === "/signup";

  // Logout function that forces refetching
  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" }); // Adjust based on your API
    refetch(); // Force re-fetch user authentication status
  };

  if (isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('/bgimg.jpg')" }}>
      {authUser && <Navbar />}
      <div className="flex max-w-6xl mx-auto">
        {/* Conditionally render Sidebar or NoAuthSidebar based on authentication, but hide for login & signup */}

        {!hideSidebar &&
          (authUser ? <Sidebar onLogout={handleLogout} /> : <NoAuthSidebar />)}

        <Routes>
          <Route path="/" element={authUser ? <HomePage /> : <NoAuthHome />} />
          <Route
            path="/login"
            element={!authUser ? <LoginPage /> : <Navigate to="/" />}
          />
          <Route
            path="/signup"
            element={!authUser ? <SignUpPage /> : <Navigate to="/" />}
          />
          <Route
            path="/notifications"
            element={authUser ? <NotificationPage /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile/:username"
            element={authUser ? <ProfilePage /> : <Navigate to="/login" />}
          />
        </Routes>

        {/* Show RightPanel only if user is authenticated */}
        {authUser && <RightPanel />}

        <Toaster />
      </div>
    </div>
  );
}

export default App;
