import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Goal, CategoryInfo } from '@/types/goals';
import { GoalCard } from './GoalCard';
import { cn } from '@/lib/utils';

interface CategorySectionProps {
  category: CategoryInfo;
  goals: Goal[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onAdd: (category: string) => void;
}

const colorClasses = {
  cyan: 'text-primary',
  magenta: 'text-secondary',
  green: 'text-success',
  amber: 'text-warning',
};

const bgClasses = {
  cyan: 'bg-primary/10 hover:bg-primary/20',
  magenta: 'bg-secondary/10 hover:bg-secondary/20',
  green: 'bg-success/10 hover:bg-success/20',
  amber: 'bg-warning/10 hover:bg-warning/20',
};

export function CategorySection({ category, goals, onToggle, onDelete, onAdd }: CategorySectionProps) {
  const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;
  const completedCount = goals.filter(g => g.completed).length;
  const progress = goals.length > 0 ? Math.round((completedCount / goals.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card cyber-border rounded-xl p-4 flex flex-col h-full min-h-[280px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className={cn("p-2 rounded-lg shrink-0", bgClasses[category.color])}>
            {IconComponent && <IconComponent className={cn("w-4 h-4", colorClasses[category.color])} />}
          </div>
          <div className="min-w-0">
            <h3 className="font-display font-semibold text-foreground text-sm truncate">{category.label}</h3>
            <p className="text-xs text-muted-foreground">{completedCount}/{goals.length} completed</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className={cn("text-lg font-display font-bold", colorClasses[category.color])}>{progress}%</span>
          <button
            onClick={() => onAdd(category.id)}
            className={cn(
              "p-1.5 rounded-lg transition-all duration-300 shrink-0",
              bgClasses[category.color]
            )}
          >
            <Plus className={cn("w-3.5 h-3.5", colorClasses[category.color])} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-muted rounded-full overflow-hidden mb-3">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8 }}
          className={cn(
            "h-full rounded-full",
            category.color === 'cyan' && "bg-primary",
            category.color === 'magenta' && "bg-secondary",
            category.color === 'green' && "bg-success",
            category.color === 'amber' && "bg-warning"
          )}
        />
      </div>

      {/* Goals list */}
      <div className="flex-1 space-y-2 overflow-y-auto pr-1 scrollbar-thin">
        <AnimatePresence>
          {goals.map((goal, index) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              onToggle={onToggle}
              onDelete={onDelete}
              delay={index * 0.05}
            />
          ))}
        </AnimatePresence>
        {goals.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <p className="text-center text-muted-foreground text-sm">No goals yet</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
