"use client";

import { BottomNav } from "@/components/BottomNav";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Logo size={48} className="mx-auto mb-4" />
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect via useEffect
  }

  // Mock data for now
  const tasks = [
    { id: 1, title: "Buy groceries", description: "Milk, eggs, bread", status: 'pending', points: 10, assignedTo: "Partner" },
    { id: 2, title: "Walk the dog", status: 'completed', points: 15, assignedTo: "Me" },
    { id: 3, title: "Plan date night", description: "Friday 8pm", status: 'pending', points: 20 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="bg-white p-6 rounded-b-[2rem] shadow-sm mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Hi, {user?.name}! 👋</h1>
            <p className="text-sm text-gray-500">You & Partner are doing great!</p>
          </div>
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
            <Logo size={24} />
          </div>
        </div>

        {/* Progress Card */}
        <div className="bg-gradient-to-r from-primary to-purple-400 rounded-2xl p-4 text-white shadow-lg">
          <div className="flex justify-between items-end mb-2">
            <div>
              <p className="text-xs opacity-90 font-medium">Couple Level 5</p>
              <h2 className="text-3xl font-bold">1,240 pts</h2>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Next Reward</p>
              <p className="font-bold text-sm">Movie Night 🎬</p>
            </div>
          </div>
          <div className="w-full bg-black/20 rounded-full h-2 mt-2">
            <div className="bg-white rounded-full h-2 w-[70%]"></div>
          </div>
        </div>
      </header>

      {/* Today's Tasks */}
      <div className="px-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg text-gray-800">Today's Tasks</h2>
          <Button variant="ghost" size="sm" className="text-primary">View All</Button>
        </div>

        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              description={task.description}
              status={task.status as 'pending' | 'completed'}
              points={task.points}
              assignedTo={task.assignedTo}
              onToggle={() => {}}
            />
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
