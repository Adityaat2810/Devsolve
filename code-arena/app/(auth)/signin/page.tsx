"use client"

import { useState } from "react";
import Header from "@/components/home/header";

export default function AuthDemo() {
  const [activeTab, setActiveTab] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center">
      <Header>

      </Header>
      <div className="flex-grow flex flex-col items-center justify-center w-full px-4">

        <div className="w-full max-w-3xl">
          {/* Tabs */}
          <div className="flex" style={{width: "70%"}}>
            <button
              className={`py-3 px-12 text-center ${
                activeTab === "signup"
                  ? "bg-white text-black"
                  : "bg-slate-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("signup")}
              style={{width: "50%"}}
            >
              SIGN UP
            </button>
            <button
              className={`py-3 px-12 text-center ${
                activeTab === "login"
                  ? "bg-white text-black"
                  : "bg-slate-300 text-gray-700"
              }`}
              onClick={() => setActiveTab("login")}
              style={{width: "50%"}}
            >
              LOGIN
            </button>
          </div>

          {/* Content area - wider than the tabs */}
          <div className="bg-white p-8 shadow-sm">
            {activeTab === "login" && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700">Already have an account?</p>

                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2.5 px-4 hover:bg-gray-50 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="ml-2">Continue with Google</span>
                </button>

                <div className="flex items-center justify-center">
                  <div className="border-t border-gray-300 flex-grow"></div>
                  <div className="mx-4 text-gray-500">OR</div>
                  <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Username or Email: <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Password: <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded p-2 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                    LOGIN
                  </button>

                  <div className="text-center">
                    <a href="#" className="text-blue-500 hover:underline text-sm">
                      Forgot Password?
                    </a>
                  </div>

                  <div className="text-center text-sm text-gray-600 mt-4">
                    For any issues or assistance, email <a href="mailto:help@docxkrush.com" className="text-blue-500">help@docxkrush.com</a>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "signup" && (
              <div className="space-y-6">
                <p className="text-lg text-gray-700">Create your account</p>

                <button className="w-full flex items-center justify-center gap-2 border border-gray-300 rounded py-2.5 px-4 hover:bg-gray-50 transition">
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="ml-2">Sign up with Google</span>
                </button>

                <div className="flex items-center justify-center">
                  <div className="border-t border-gray-300 flex-grow"></div>
                  <div className="mx-4 text-gray-500">OR</div>
                  <div className="border-t border-gray-300 flex-grow"></div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm mb-1">Full Name: <span className="text-red-500">*</span></label>
                    <input type="text" className="w-full border border-gray-300 rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Email: <span className="text-red-500">*</span></label>
                    <input type="email" className="w-full border border-gray-300 rounded p-2" />
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Password: <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="w-full border border-gray-300 rounded p-2 pr-10"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1">Confirm Password: <span className="text-red-500">*</span></label>
                    <input
                      type={showPassword ? "text" : "password"}
                      className="w-full border border-gray-300 rounded p-2"
                    />
                  </div>

                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
                    SIGN UP
                  </button>

                  <div className="text-center text-sm text-gray-600 mt-4">
                    Need help? Email <a href="mailto:help@docxkrush.com" className="text-blue-500">help@docxkrush.com</a>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>

    </div>
  );
}