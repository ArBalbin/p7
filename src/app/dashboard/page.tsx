"use client";
import { getToken } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface JwtPayload {
  sub: number; 
  username: string; 
  role: string; 
  exp: number; 
  iat: number;
}

export default function DashboardHome() {
  const [showToken, setShowToken] = useState(false);
  const [username, setUsername] = useState('Guest');
  const [role, setRole] = useState('');
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const currentToken = getToken();
    if (!currentToken) return;

    const tokenParts = currentToken.split('.');
    if (tokenParts.length !== 3) {
      console.error("Invalid token format: token must have 3 parts");
      setToken(null);
      return;
    }

    setToken(currentToken);

    try {
      const decoded = jwtDecode<JwtPayload>(currentToken);

      if (decoded.username) setUsername(decoded.username);
      if (decoded.role) setRole(decoded.role);

    } catch (e) {
      console.error("Token decoding failed:", e);
      setToken(null);
      setUsername('Guest');
      setRole('');
    }
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-6 text-white">
        <h1 className="text-2xl font-bold">Welcome, Guest! 👋</h1>
      </div>
    );
  }

  // Fallback copy function
  const fallbackCopy = (text: string) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    alert("Token copied!");
  };

  // Copy with fallback
  const copyToken = () => {
    if (!token) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(token)
        .then(() => alert("Token copied!"))
        .catch(() => fallbackCopy(token));
    } else {
      fallbackCopy(token);
    }
  };

  return (
    <div className="space-y-6 text-white w-full max-w-full">

      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-2xl p-8 shadow-lg w-full">
        <h1 className="text-3xl font-bold mb-2">Welcome, {username}! 👋</h1>
        <p className="text-gray-300">Here's your account information..</p>
      </div>

      {/* Main Content */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-full">

        {/* User Info */}
        <Card className="bg-gray-900 border-gray-700 shadow-md w-full">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor">
                <path strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
              </svg>
              User Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex justify-between py-3 border-b border-gray-700">
              <span className="text-sm text-gray-400">Username</span>
              <span className="font-semibold text-white">{username}</span>
            </div>

            {role && (
              <div className="flex justify-between py-3 border-b border-gray-700">
                <span className="text-sm text-gray-400">Role</span>
                <span className="px-3 py-1 rounded-full text-sm bg-blue-900 text-blue-300 capitalize">
                  {role}
                </span>
              </div>
            )}

            <div className="flex justify-between py-3">
              <span className="text-sm text-gray-400">Account Status</span>
              <span className="px-3 py-1 rounded-full text-sm bg-green-900 text-green-300">
                Active
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Token */}
        {token && (
          <Card className="bg-gray-900 border-gray-700 shadow-md w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor">
                  <path strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                Access Token
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-3">
              <p className="text-sm text-gray-400">Your authentication token</p>

              <Button
                variant="outline"
                onClick={() => setShowToken(!showToken)}
                className="
                  w-full 
                  bg-gray-800 
                  hover:bg-gray-700
                  border-gray-600 
                  text-white
                "
              >
                {showToken ? "Hide Token" : "Show Token"}
              </Button>

              {showToken && (
                <>
                  <pre className="p-4 bg-gray-800 text-xs text-gray-200 rounded-lg border border-gray-700 overflow-x-auto">
                    {token}
                  </pre>

                  <Button
                    variant="secondary"
                    onClick={copyToken}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white"
                  >
                    Copy to Clipboard
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  );
}
