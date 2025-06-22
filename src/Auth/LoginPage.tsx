// src/pages/Auth/LoginPage.tsx

import { Formik, Form, Field, ErrorMessage } from "formik";
import type { FormikHelpers } from "formik";
import { Link } from "react-router";
import { toast, ToastContainer } from "react-toastify";
import { useTitle } from "../hooks/useTitle";
import { useAuth } from "../contexts/AuthContext";
import type { SignInDTO } from "../models/Auth.model";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  useTitle("Login | OpenWeatherApi");
  const { login } = useAuth();
  const initialValues: SignInDTO = { email: "", password: "" };

  const validate = (values: SignInDTO) => {
    const errors: Partial<Record<keyof SignInDTO, string>> = {};
    if (!values.email) {
      errors.email = "Required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
      errors.email = "Invalid email address";
    }
    if (!values.password) {
      errors.password = "Required";
    }
    return errors;
  };

  const onSubmit = async (
    values: SignInDTO,
    { setSubmitting }: FormikHelpers<SignInDTO>
  ) => {
    try {
      await login(values);
      toast.success("Logged in! Redirecting…");
    } catch {
      // error toast shown in context
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/background.svg')] bg-cover bg-center p-6">
      <ToastContainer position="top-center" />
      <div className="bg-neutral-800 shadow-lg rounded-3xl max-w-md w-full p-8">
        <div className="p-0.5 rounded flex items-center justify-center mb-6">
          <img
            src="/openWeather.png"
            alt="Logo"
            className="w-35 object-cover"
          />
        </div>
        <h2 className="text-3xl font-bold text-[#eb6f4b] mb-6 text-center">
          Log In
        </h2>
        <Formik
          initialValues={initialValues}
          validate={validate}
          onSubmit={onSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-neutral-100 font-medium mb-1"
                >
                  Email Address
                </label>
                <Field
                  type="email"
                  id="email"
                  name="email"
                  placeholder="you@example.edu.sa"
                  className="w-full px-4 py-2 bg-neutral-100 text-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6f4b]"
                />
                <ErrorMessage
                  name="email"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-neutral-100 font-medium mb-1"
                >
                  Password
                </label>
                <Field
                  type="password"
                  id="password"
                  name="password"
                  placeholder="********"
                  className="w-full px-4 py-2 bg-neutral-100 text-neutral-800 border border-neutral-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#eb6f4b]"
                />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 rounded-lg font-semibold transition ${
                  isSubmitting
                    ? "opacity-50 bg-[#eb6f4b] text-neutral-100"
                    : "bg-[#eb6f4b] text-neutral-100 hover:bg-opacity-90"
                }`}
              >
                {isSubmitting ? "Logging In..." : "Log In"}
              </button>

              <Link
                to="/"
                className="w-full block text-center mt-4 py-2 bg-neutral-100 text-neutral-800 font-semibold rounded-lg hover:bg-neutral-200 transition"
              >
                Home
              </Link>

              <p className="text-neutral-100 text-center mt-4">
                Don’t have an account?{" "}
                <Link
                  to="/register"
                  className="text-[#eb6f4b] hover:underline font-medium"
                >
                  Register
                </Link>
              </p>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}
