// src/components/Footer.jsx
import React from "react";
import { FaFacebook } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { FaLinkedin } from "react-icons/fa6";
import { FaDiscord } from "react-icons/fa";

function Footer() {
  const noop = (e: React.MouseEvent) => e.preventDefault();

  return (
    <footer className="flex flex-col w-full px-5 py-6 text-neutral-100 bg-neutral-800 gap-y-3 md:px-5 lg:px-25">
      <div className="flex flex-col items-center md:flex-row md:justify-between gap-y-4">
        {/* App info */}
        <div className="flex flex-col text-center items-center lg:items-start lg:text-start">
          <h1 className="text-2xl font-bold text-[#eb6f4b]">
            OpenWeather Forecast
          </h1>
          <p className="pl-1.5 text-sm lg:text-base text-neutral-200 w-3/4 lg:w-1/2">
            Get real-time weather data for any city, powered by the
            OpenWeatherMap API. Search for locations to see current temperature,
            humidity, wind speed, and 5-day forecasts—all in one place.
          </p>
        </div>

        {/* API & Support */}
        <div className="flex flex-col gap-y-1.5 text-center items-center lg:items-start lg:text-start">
          <h2 className="text-lg font-bold text-[#eb6f4b]">API & Support</h2>
          <ul className="flex flex-col gap-y-0.5 pl-1.5">
            {[
              { label: "openweathermap.org/api", key: "api" },
              {
                label: "github.com/openweather-app",
                key: "repo",
              },
              { label: "support@openweathermap.org", key: "contact" },
            ].map((item) => (
              <li
                key={item.key}
                className="text-sm md:text-base text-neutral-100"
              >
                <a
                  href="#"
                  onClick={noop}
                  className="text-xs md:text-sm text-neutral-100 hover:underline hover:text-[#eb6f4b] cursor-pointer"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Social Icons */}
      <div className="flex justify-center w-full md:justify-end gap-x-4">
        {[
          FaDiscord,
          FaGithub,
          FaFacebook,
          FaInstagram,
          FaLinkedin,
          FaXTwitter,
        ].map((Icon, i) => (
          <Icon
            key={i}
            className="
                text-2xl
                text-neutral-200
                transition duration-200 cursor-pointer
                hover:text-[#eb6f4b]
                hover:scale-105
              "
          />
        ))}
      </div>

      {/* Copyright */}
      <div className="text-center text-neutral-200">
        <p className="text-xs md:text-sm">
          © 2025 OpenWeather Forecast. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
