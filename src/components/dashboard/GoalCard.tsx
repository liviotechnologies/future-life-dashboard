import { motion } from 'framer-motion';
import { Check, Circle, Trash2 } from 'lucide-react';
import { Goal } from '@/types/goals';
import { cn } from '@/lib/utils';

interface GoalCardProps {
  goal: Goal;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  delay?: number;
}

const priorityColors = {
  high: 'border-l-destructive',
  medium: 'border-l-warning',
  low: 'border-l-success',
};

export function GoalCard({ goal, onToggle, onDelete, delay = 0 }: GoalCardProps) {
  const progress = goal.target ? Math.round((goal.progress / goal.target) * 100) : goal.progress;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3, delay }}
      className={cn(
        "glass-card rounded-lg p-4 border-l-4 group hover:bg-muted/30 transition-all duration-300",
        priorityColors[goal.priority],
        goal.completed && "opacity-60"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          onClick={() => onToggle(goal.id)}
          className={cn(
            "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
            goal.completed
              ? "bg-primary border-primary glow-cyan"
              : "border-muted-foreground hover:border-primary"
          )}
        >
          {goal.completed && <Check className="w-3 h-3 text-primary-foreground" />}
        </button>

        <div className="flex-1 min-w-0">
          <p className={cn(
            "font-semibold text-foreground transition-all duration-300",
            goal.completed && "line-through text-muted-foreground"
          )}>
            {goal.title}
          </p>

          {goal.target && (
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{goal.progress.toLocaleString()} {goal.unit}</span>
                <span>{goal.target.toLocaleString()} {goal.unit}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progress, 100)}%` }}
                  transition={{ duration: 0.8, delay: delay + 0.2 }}
                  className={cn(
                    "h-full rounded-full",
                    progress >= 100 ? "bg-success" : progress >= 50 ? "bg-primary" : "bg-warning"
                  )}
                />
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() => onDelete(goal.id)}
          className="opacity-0 group-hover:opacity-100 p-1 text-muted-foreground hover:text-destructive transition-all duration-300"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
