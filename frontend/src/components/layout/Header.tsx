"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userName, setUserName] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("access_token");
    if (token) {
      setIsAuthenticated(true);
      // Get user name from localStorage or a stored user object
      const userInfo = localStorage.getItem("user_info");
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          setUserName(user.username || user.email || "User");
        } catch (e) {
          setUserName("User");
        }
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_info");
    setIsAuthenticated(false);
    setUserName("");
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg"></div>
              <span className="text-xl font-bold text-gray-900 hidden sm:inline">
                Open Challenges
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Home
            </Link>
            <Link
              href="/challenges"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              Leaderboard
            </Link>
            <a
              href="#"
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
            >
              About
            </a>
          </div>

          {/* Right side - Authenticated or Guest */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <svg
                    className="w-6 h-6 text-gray-700"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span className="text-gray-700 font-medium">{userName}</span>
                </button>

                {/* Dropdown menu */}
                {isUserMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-50">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm text-gray-600">Signed in as</p>
                      <p className="font-semibold text-gray-900">{userName}</p>
                    </div>
                    <Link
                      href="/challenges"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      My Challenges
                    </Link>
                    <Link
                      href="/leaderboard"
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-sm"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Leaderboard
                    </Link>
                    <div className="px-4 py-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left text-red-600 hover:text-red-700 font-medium text-sm py-2"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-blue-600 font-medium"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Join Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <Link
              href="/"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/challenges"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Challenges
            </Link>
            <Link
              href="/leaderboard"
              className="block py-2 text-gray-700 hover:text-blue-600"
            >
              Leaderboard
            </Link>
            <div className="border-t border-gray-200 my-2 pt-2">
              {isAuthenticated ? (
                <>
                  <p className="px-2 py-2 text-sm text-gray-600">Signed in as</p>
                  <p className="px-2 text-gray-900 font-semibold">{userName}</p>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-2 py-2 mt-2 text-red-600 hover:text-red-700 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="block py-2 text-gray-700 hover:text-blue-600"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="block py-2 bg-blue-600 text-white rounded-lg mt-2"
                  >
                    Join Now
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
