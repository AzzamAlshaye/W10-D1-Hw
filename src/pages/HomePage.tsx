// src/pages/HomeScreen.jsx
import { Link } from "react-router";

export default function HomeScreen() {
  const token = localStorage.getItem("token");
  const isAuth = Boolean(token);
  const weatherPath = "/weather";

  return (
    <div className="relative min-h-screen overflow-hidden bg-neutral-100 px-6 flex flex-col">
      {/* Decorative blobs */}
      <div className="hidden lg:block absolute top-[-10%] left-[-10%] w-72 h-72 bg-[#eb6f4b] opacity-10 rounded-full animate-pulse" />
      <div className="hidden lg:block absolute bottom-[-15%] right-[-15%] w-96 h-96 bg-[#eb6f4b] opacity-10 rounded-full animate-spin-slow" />
      <div className="hidden lg:block absolute top-1/2 right-20 w-56 h-56 bg-[#eb6f4b] opacity-5 rounded-full" />

      {/* Logo */}
      <div className="pt-12 lg:pt-16 flex justify-center z-10">
        <img
          src="/darkOpenWeather.png"
          alt="OpenWeather Logo"
          className="h-32 lg:h-52"
        />
      </div>

      {/* Hero */}
      <div className="flex-grow flex items-center justify-center z-10">
        <div className="text-center max-w-xl">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#eb6f4b] drop-shadow-xs">
            OpenWeather API Explorer
          </h1>
          <p className="mt-4 text-[#eb6f4b]/90 text-base sm:text-lg md:text-xl">
            Instantly fetch current weather, forecasts, and air quality data for
            any city worldwide. Powered by OpenWeather’s comprehensive API.
          </p>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            {isAuth ? (
              <Link
                to={weatherPath}
                className="
                  inline-block px-8 py-3
                  bg-[#eb6f4b] text-neutral-100
                  font-semibold rounded-full shadow-lg
                  transform transition hover:scale-105 hover:bg-opacity-90
                "
              >
                Search Weather
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="
                    inline-block px-8 py-3
                    bg-[#eb6f4b] text-neutral-100
                    font-semibold rounded-full shadow-lg
                    transform transition hover:scale-105 hover:bg-opacity-90
                  "
                >
                  Register
                </Link>
                <Link
                  to="/login"
                  className="
                    inline-block px-8 py-3
                    bg-neutral-800 text-neutral-100
                    font-semibold rounded-full shadow-lg
                    transform transition hover:scale-105 hover:bg-neutral-700
                  "
                >
                  Login
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
