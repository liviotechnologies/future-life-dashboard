import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { GoalCategory } from '@/types/goals';
import { categories } from '@/data/initialGoals';
import { cn } from '@/lib/utils';

interface AddGoalDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (goal: { title: string; category: GoalCategory; priority: 'low' | 'medium' | 'high'; target?: number; unit?: string }) => void;
  defaultCategory?: GoalCategory;
}

export function AddGoalDialog({ isOpen, onClose, onAdd, defaultCategory = 'daily' }: AddGoalDialogProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>(defaultCategory);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasTarget, setHasTarget] = useState(false);
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    onAdd({
      title: title.trim(),
      category,
      priority,
      ...(hasTarget && target ? { target: Number(target), unit } : {}),
    });
    
    setTitle('');
    setTarget('');
    setUnit('');
    setHasTarget(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card cyber-border rounded-xl p-6 z-50"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-display font-bold text-foreground glow-text-cyan">New Goal</h2>
              <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Goal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your goal..."
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">Priority</label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all",
                        priority === p
                          ? p === 'high' ? 'bg-destructive/20 border-destructive text-destructive'
                          : p === 'medium' ? 'bg-warning/20 border-warning text-warning'
                          : 'bg-success/20 border-success text-success'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      )}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasTarget}
                    onChange={(e) => setHasTarget(e.target.checked)}
                    className="w-4 h-4 rounded border-border bg-muted accent-primary"
                  />
                  <span className="text-sm text-muted-foreground">Has numeric target</span>
                </label>
              </div>

              {hasTarget && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="Target value"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="Unit (e.g., $, steps)"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-display font-semibold rounded-lg hover:glow-cyan transition-all duration-300"
              >
                Create Goal
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
