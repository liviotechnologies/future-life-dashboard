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
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-lg glass-card cyber-border rounded-2xl p-8 z-[101] max-h-[85vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-display font-bold text-foreground glow-text-cyan">New Goal</h2>
              <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Goal Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What do you want to achieve?"
                  autoFocus
                  className="w-full px-4 py-4 bg-muted/50 border border-border rounded-xl text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as GoalCategory)}
                  className="w-full px-4 py-4 bg-muted/50 border border-border rounded-xl text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-3">Priority</label>
                <div className="flex gap-3">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-3 px-4 rounded-xl border text-sm font-semibold transition-all",
                        priority === p
                          ? p === 'high' ? 'bg-destructive/20 border-destructive text-destructive'
                          : p === 'medium' ? 'bg-warning/20 border-warning text-warning'
                          : 'bg-success/20 border-success text-success'
                          : 'border-border text-muted-foreground hover:border-primary/50 hover:bg-muted/50'
                      )}
                    >
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="py-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={hasTarget}
                    onChange={(e) => setHasTarget(e.target.checked)}
                    className="w-5 h-5 rounded border-border bg-muted accent-primary cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">Has numeric target</span>
                </label>
              </div>

              {hasTarget && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2 gap-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Target Value</label>
                    <input
                      type="number"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      placeholder="e.g., 10000"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-muted-foreground mb-2">Unit</label>
                    <input
                      type="text"
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                      placeholder="e.g., $, steps, lbs"
                      className="w-full px-4 py-3 bg-muted/50 border border-border rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                    />
                  </div>
                </motion.div>
              )}

              <button
                type="submit"
                className="w-full py-4 mt-4 bg-primary text-primary-foreground font-display font-semibold text-base rounded-xl hover:glow-cyan transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
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
