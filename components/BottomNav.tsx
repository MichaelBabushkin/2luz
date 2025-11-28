import Link from "next/link";
import { Home, ListTodo, User } from "lucide-react";
import { Logo } from "./Logo";

export function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-2 pb-6 flex justify-around items-center z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      <Link href="/" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
        <Home className="w-6 h-6" />
        <span className="text-[10px] font-medium">Home</span>
      </Link>
      <Link href="/tasks" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
        <ListTodo className="w-6 h-6" />
        <span className="text-[10px] font-medium">Tasks</span>
      </Link>
      <div className="relative -top-5">
        <Link href="/add" className="flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:scale-105 transition-transform">
          <Logo size={28} />
        </Link>
      </div>
      <Link href="/rewards" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
        <Logo size={24} />
        <span className="text-[10px] font-medium">Rewards</span>
      </Link>
      <Link href="/profile" className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-primary transition-colors">
        <User className="w-6 h-6" />
        <span className="text-[10px] font-medium">Profile</span>
      </Link>
    </div>
  );
}
