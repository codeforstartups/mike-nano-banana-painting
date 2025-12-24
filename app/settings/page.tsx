"use client";

import { useState } from "react";

export default function SettingsPage() {
  const [paintingPrompt, setPaintingPrompt] = useState(
    "Transform this photograph into a beautiful watercolor painting. Maintain the exact core composition, subject matter, and scene from the original image. Apply professional watercolor techniques with soft, flowing colors and translucent layers."
  );
  const [emailPrompt, setEmailPrompt] = useState(
    "You are a professional email agent. Write clear, concise, and professional emails that are appropriate for business communication."
  );
  const [callingPrompt, setCallingPrompt] = useState(
    "You are a professional calling agent. Be polite, clear, and helpful during phone conversations. Listen actively and respond appropriately to customer inquiries."
  );
  const [userProfile, setUserProfile] = useState({
    name: "User",
    email: "user@example.com",
    role: "Admin",
  });

  const handleSave = (type: string) => {
    // In a real app, this would save to a database or API
    alert(`${type} saved successfully!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-2">
            Settings
          </h1>
          <p className="text-gray-600">Configure prompts and user profile</p>
        </div>

        <div className="space-y-6">
          {/* Painting Agent Prompt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Painting Agent Prompt
            </h2>
            <textarea
              value={paintingPrompt}
              onChange={(e) => setPaintingPrompt(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter painting agent prompt..."
            />
            <button
              onClick={() => handleSave("Painting Agent Prompt")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>

          {/* Email Agent Prompt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Email Agent Prompt
            </h2>
            <textarea
              value={emailPrompt}
              onChange={(e) => setEmailPrompt(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter email agent prompt..."
            />
            <button
              onClick={() => handleSave("Email Agent Prompt")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>

          {/* Calling Agent Prompt */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Calling Agent Prompt
            </h2>
            <textarea
              value={callingPrompt}
              onChange={(e) => setCallingPrompt(e.target.value)}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter calling agent prompt..."
            />
            <button
              onClick={() => handleSave("Calling Agent Prompt")}
              className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save
            </button>
          </div>

          {/* User Profile */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              User Profile
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, email: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role
                </label>
                <input
                  type="text"
                  value={userProfile.role}
                  onChange={(e) =>
                    setUserProfile({ ...userProfile, role: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleSave("User Profile")}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

