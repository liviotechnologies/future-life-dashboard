import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { GoalCategory } from '@/types/goals';
import { categories } from '@/data/initialGoals';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface AddGoalPopoverProps {
  trigger: React.ReactNode;
  onAdd: (goal: { title: string; category: GoalCategory; priority: 'low' | 'medium' | 'high'; target?: number; unit?: string }) => void;
  defaultCategory?: GoalCategory;
}

export function AddGoalPopover({ trigger, onAdd, defaultCategory = 'daily' }: AddGoalPopoverProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>(defaultCategory);
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [hasTarget, setHasTarget] = useState(false);
  const [target, setTarget] = useState('');
  const [unit, setUnit] = useState('');

  useEffect(() => {
    if (open) {
      setCategory(defaultCategory);
    }
  }, [open, defaultCategory]);

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
    setOpen(false);
  };

  const resetForm = () => {
    setTitle('');
    setTarget('');
    setUnit('');
    setHasTarget(false);
    setPriority('medium');
  };

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetForm();
    }}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-80 glass-card cyber-border p-4 z-[101]" 
        align="end"
        sideOffset={8}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-display font-semibold text-foreground">New Goal</h3>
          <button 
            onClick={() => setOpen(false)} 
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What's your goal?"
              autoFocus
              className="w-full px-3 py-2.5 bg-muted/50 border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as GoalCategory)}
              className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all appearance-none cursor-pointer"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1.5">Priority</label>
            <div className="flex gap-2">
              {(['low', 'medium', 'high'] as const).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={cn(
                    "flex-1 py-2 px-2 rounded-lg border text-xs font-medium transition-all",
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

          <div>
            <label className="flex items-center gap-2 cursor-pointer group">
              <input
                type="checkbox"
                checked={hasTarget}
                onChange={(e) => setHasTarget(e.target.checked)}
                className="w-4 h-4 rounded border-border bg-muted accent-primary cursor-pointer"
              />
              <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">Has numeric target</span>
            </label>
          </div>

          {hasTarget && (
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="Target"
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="Unit"
                className="w-full px-3 py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:glow-cyan transition-all duration-300"
          >
            Create Goal
          </button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
