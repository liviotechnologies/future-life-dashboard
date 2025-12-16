import { motion } from 'framer-motion';
import { Plus, Search, Bell, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onAddGoal: () => void;
  totalGoals: number;
  completedGoals: number;
}

export function Header({ onAddGoal, totalGoals, completedGoals }: HeaderProps) {
  const percentage = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 glass-card border-b border-border px-6 py-4"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">
              Command Center
            </h1>
            <p className="text-sm text-muted-foreground">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">{percentage}% Complete</span>
            <span className="text-xs text-muted-foreground">({completedGoals}/{totalGoals})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-lg">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search goals..."
              className="bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground w-40"
            />
          </div>

          <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          <button
            onClick={onAddGoal}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:glow-cyan transition-all duration-300"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Goal</span>
          </button>
        </div>
      </div>
    </motion.header>
  );
}
