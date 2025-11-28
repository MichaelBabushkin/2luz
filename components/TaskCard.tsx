"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Circle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  title: string;
  description?: string;
  status: 'pending' | 'completed';
  points: number;
  assignedTo?: string; // Name or Avatar URL
  onToggle: () => void;
}

export function TaskCard({ title, description, status, points, assignedTo, onToggle }: TaskCardProps) {
  return (
    <Card className={cn("mb-4 transition-all duration-300 border-2", 
      status === 'completed' ? "bg-green-50 border-green-200 opacity-80" : "bg-white border-primary/20 hover:border-primary/50 hover:shadow-md"
    )}>
      <CardContent className="p-4 flex items-center gap-4">
        <button onClick={onToggle} className="text-primary hover:scale-110 transition-transform">
          {status === 'completed' ? (
            <CheckCircle2 className="w-8 h-8 text-green-500" />
          ) : (
            <Circle className="w-8 h-8 text-primary/50" />
          )}
        </button>
        
        <div className="flex-1">
          <h3 className={cn("font-bold text-lg", status === 'completed' && "line-through text-gray-400")}>
            {title}
          </h3>
          {description && <p className="text-sm text-gray-500">{description}</p>}
        </div>

        <div className="flex flex-col items-end gap-1">
          <span className="text-xs font-bold bg-yellow-100 text-yellow-600 px-2 py-1 rounded-full">
            +{points} pts
          </span>
          {assignedTo && (
            <div className="w-6 h-6 rounded-full bg-secondary flex items-center justify-center text-xs text-secondary-foreground" title={`Assigned to ${assignedTo}`}>
              <User className="w-4 h-4" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
