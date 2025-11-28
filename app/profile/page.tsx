"use client";

import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, LogOut } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [partnerCode, setPartnerCode] = useState("");

  const handleLinkPartner = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Linking partner with code:", partnerCode);
    // TODO: Implement linking logic
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">Profile</h1>

        {/* User Info */}
        <Card className="border-none shadow-md">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold">{user?.name}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* Partner Linking */}
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Logo size={20} />
              Link Partner
            </CardTitle>
            <CardDescription>Enter your partner's code to connect!</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLinkPartner} className="flex gap-2">
              <Input 
                placeholder="Enter code (e.g. A1B2C3)" 
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value)}
              />
              <Button type="submit">Link</Button>
            </form>
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg text-center">
              <p className="text-xs text-gray-600">Your Code:</p>
              <p className="text-lg font-mono font-bold tracking-widest text-primary">X9Y8Z7</p>
            </div>
          </CardContent>
        </Card>

        <Button variant="destructive" className="w-full" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          Log Out
        </Button>
      </div>
      <BottomNav />
    </main>
  );
}
