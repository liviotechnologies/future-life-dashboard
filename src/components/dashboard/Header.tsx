import { motion } from 'framer-motion';
import { Plus, Bell, Zap, LogOut } from 'lucide-react';
import { AddGoalPopover } from './AddGoalPopover';
import { GoalCategory } from '@/types/goals';

interface HeaderProps {
  onAddGoal: (goal: { title: string; category: GoalCategory; priority: 'low' | 'medium' | 'high'; target?: number; unit?: string }) => void;
  totalGoals: number;
  completedGoals: number;
  onSignOut?: () => void;
}

export function Header({
  onAddGoal,
  totalGoals,
  completedGoals,
  onSignOut
}: HeaderProps) {
  const percentage = totalGoals > 0 ? Math.round(completedGoals / totalGoals * 100) : 0;
  
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
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                month: 'long',
                day: 'numeric'
              })}
            </p>
          </div>

          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-muted/50 rounded-full">
            <Zap className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">{percentage}% Complete</span>
            <span className="text-xs text-muted-foreground">({completedGoals}/{totalGoals})</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-muted rounded-lg transition-colors relative">
            <Bell className="w-5 h-5 text-muted-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full" />
          </button>

          <AddGoalPopover
            onAdd={onAddGoal}
            trigger={
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:glow-cyan transition-all duration-300">
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Goal</span>
              </button>
            }
          />

          {onSignOut && (
            <button
              onClick={onSignOut}
              className="p-2 hover:bg-destructive/10 rounded-lg transition-colors group"
              title="Sign out"
            >
              <LogOut className="w-5 h-5 text-muted-foreground group-hover:text-destructive transition-colors" />
            </button>
          )}
        </div>
      </div>
    </motion.header>
  );
}