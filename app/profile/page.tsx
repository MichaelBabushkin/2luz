"use client";

import { BottomNav } from "@/components/BottomNav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { User, LogOut, Check, X, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Logo } from "@/components/Logo";

interface PartnerRequest {
  id: string;
  from?: {
    id: string;
    name: string;
    email: string;
  };
  to?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [partnerCode, setPartnerCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [incomingRequests, setIncomingRequests] = useState<PartnerRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<PartnerRequest[]>([]);
  const [partnerInfo, setPartnerInfo] = useState<any>(null);

  useEffect(() => {
    fetchRequests();
    fetchPartnerInfo();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch("/api/partner/requests");
      const data = await res.json();
      if (res.ok) {
        setIncomingRequests(data.incoming || []);
        setOutgoingRequests(data.outgoing || []);
      }
    } catch (err) {
      console.error("Failed to fetch requests:", err);
    }
  };

  const fetchPartnerInfo = async () => {
    // TODO: Implement API to get partner info if linked
    // For now, we'll just check if user has partnerId
  };

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/partner/send-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ partnerCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to send request");
        return;
      }

      setMessage(`Request sent to ${data.request.partnerName}!`);
      setPartnerCode("");
      fetchRequests(); // Refresh requests
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'approve' | 'reject') => {
    try {
      const res = await fetch("/api/partner/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, action }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message);
        fetchRequests(); // Refresh requests
        if (action === 'approve') {
          // Refresh page to show linked partner
          window.location.reload();
        }
      } else {
        setError(data.error || "Failed to respond to request");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
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

        {/* Messages */}
        {message && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
            {message}
          </div>
        )}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Incoming Partner Requests */}
        {incomingRequests.length > 0 && (
          <Card className="border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Pending Requests
              </CardTitle>
              <CardDescription>Someone wants to link with you!</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {incomingRequests.map((request) => (
                <div key={request.id} className="p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{request.from?.name}</p>
                      <p className="text-sm text-gray-500">{request.from?.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleRespondToRequest(request.id, 'approve')}
                        className="bg-green-500 hover:bg-green-600"
                      >
                        <Check className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRespondToRequest(request.id, 'reject')}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Outgoing Requests */}
        {outgoingRequests.length > 0 && (
          <Card className="border-gray-200 shadow-md">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Waiting for Response</CardTitle>
            </CardHeader>
            <CardContent>
              {outgoingRequests.map((request) => (
                <div key={request.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
                  <span className="text-sm">Request sent to <strong>{request.to?.name}</strong></span>
                  <Clock className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Partner Linking */}
        <Card className="border-primary/20 shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Logo size={20} />
              Link Partner
            </CardTitle>
            <CardDescription>Enter your partner's code to send a link request</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSendRequest} className="space-y-4">
              <div className="flex gap-2">
                <Input 
                  placeholder="Enter code (e.g. A1B2C3)" 
                  value={partnerCode}
                  onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                  disabled={loading}
                  maxLength={6}
                />
                <Button type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Request"}
                </Button>
              </div>
            </form>
            <div className="mt-4 p-3 bg-secondary/30 rounded-lg text-center">
              <p className="text-xs text-gray-600">Your Code:</p>
              <p className="text-lg font-mono font-bold tracking-widest text-primary">
                {user?.partnerCode || "LOADING"}
              </p>
              <p className="text-xs text-gray-500 mt-1">Share this code with your partner</p>
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
