import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 201) {
        navigate("/login");
      } else {
        const data = await res.json();
        setError(data.message || "Registration failed");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-950 transition-colors duration-300">
      <div className="w-full max-w-sm p-8 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-xl shadow-sm">
        <h1 className="mb-8 text-4xl font-logo text-center">
          <img
            src="/Instagram Logo.png"
            alt="Instagram Logo"
            className="mx-auto h-12 w-auto"
          />
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-red-500 dark:text-red-400 text-sm text-center">
              {error}
            </div>
          )}
          <Input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-200"
            required
            aria-label="Username"
          />
          <Input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-200"
            required
            autoComplete="email"
            aria-label="Email address"
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2.5 text-sm border border-gray-300 dark:border-zinc-700 rounded-xl focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent bg-gray-50 dark:bg-zinc-800 text-gray-900 dark:text-zinc-100 placeholder-gray-400 dark:placeholder-zinc-500 transition-all duration-200"
            required
            autoComplete="new-password"
            aria-label="Password"
          />
          <Button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white text-sm font-semibold rounded-xl shadow-md hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={loading}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
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
                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                  ></path>
                </svg>
                Registering...
              </span>
            ) : (
              "Register"
            )}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600 dark:text-zinc-400">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-500 dark:text-indigo-400 font-semibold hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;