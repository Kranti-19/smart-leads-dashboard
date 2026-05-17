import { useState } from "react";

import toast from "react-hot-toast";

import { loginUser } from "../services/auth.service";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      const response = await loginUser(formData);

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      toast.success(response.message);
      window.location.href = "/";

      console.log(response);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || "Login failed"
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-center text-blue-600">
          Login
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <input
            type="email"
            name="email"
            placeholder="Enter email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
          />

          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg outline-none"
          />

          <button
            type="submit"
            className="w-full py-3 text-white bg-blue-600 rounded-lg"
          >
            Login
          </button>

          <p className="mt-4 text-sm text-center">
            Don't have an account?{" "}
            
            <span
              onClick={() =>
                (window.location.href =
                  "/register")
              }
              className="font-medium text-blue-600 cursor-pointer hover:underline"
            >
              Register
            </span>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Login;