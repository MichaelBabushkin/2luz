"use client";

import { BottomNav } from "@/components/BottomNav";
import { TaskCard } from "@/components/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function TasksPage() {
  const tasks = [
    { id: 1, title: "Buy groceries", description: "Milk, eggs, bread", status: 'pending', points: 10, assignedTo: "Partner" },
    { id: 2, title: "Walk the dog", status: 'completed', points: 15, assignedTo: "Me" },
    { id: 3, title: "Plan date night", description: "Friday 8pm", status: 'pending', points: 20 },
    { id: 4, title: "Clean the kitchen", status: 'pending', points: 10, assignedTo: "Me" },
    { id: 5, title: "Book flight tickets", description: "For summer vacation", status: 'pending', points: 50 },
  ];

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">All Tasks</h1>
          <Button size="icon" className="rounded-full shadow-md">
            <Plus className="w-6 h-6" />
          </Button>
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
