import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { Goal } from '@/types/goals';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface UpdateProgressPopoverProps {
  goal: Goal;
  onUpdate: (id: string, newProgress: number) => void;
  trigger: React.ReactNode;
}

export function UpdateProgressPopover({ goal, onUpdate, trigger }: UpdateProgressPopoverProps) {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [mode, setMode] = useState<'add' | 'set'>('add');

  const currentProgress = goal.progress || 0;
  const target = goal.target || 100;
  const remaining = Math.max(0, target - currentProgress);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const value = parseFloat(amount);
    if (isNaN(value) || value <= 0) return;

    let newProgress: number;
    if (mode === 'add') {
      newProgress = currentProgress + value;
    } else {
      newProgress = value;
    }

    // Cap at target
    newProgress = Math.min(newProgress, target);
    
    onUpdate(goal.id, newProgress);
    setAmount('');
    setOpen(false);
  };

  const handleQuickAdd = (value: number) => {
    const newProgress = Math.min(currentProgress + value, target);
    onUpdate(goal.id, newProgress);
    setOpen(false);
  };

  const progressPercent = Math.min(Math.round((currentProgress / target) * 100), 100);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger}
      </PopoverTrigger>
      <PopoverContent 
        className="w-72 glass-card cyber-border p-4 z-[101]" 
        align="end"
        sideOffset={8}
      >
        <div className="space-y-4">
          <div>
            <h4 className="font-display font-semibold text-foreground text-sm mb-1">Update Progress</h4>
            <p className="text-xs text-muted-foreground truncate">{goal.title}</p>
          </div>

          {/* Progress Display */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Current</span>
              <span className="font-medium text-foreground">
                {currentProgress.toLocaleString()} / {target.toLocaleString()} {goal.unit}
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-300",
                  progressPercent >= 100 ? "bg-success" : progressPercent >= 50 ? "bg-primary" : "bg-warning"
                )}
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{progressPercent}% complete</span>
              <span className="text-primary">{remaining.toLocaleString()} {goal.unit} remaining</span>
            </div>
          </div>

          {/* Quick Add Buttons */}
          {goal.unit === '$' && (
            <div className="flex gap-2">
              {[10, 50, 100, 500].map(val => (
                <button
                  key={val}
                  onClick={() => handleQuickAdd(val)}
                  className="flex-1 py-1.5 px-2 text-xs font-medium bg-muted/50 hover:bg-muted border border-border rounded-lg transition-colors"
                >
                  +${val}
                </button>
              ))}
            </div>
          )}

          {/* Mode Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => setMode('add')}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all flex items-center justify-center gap-1",
                mode === 'add'
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              <Plus className="w-3 h-3" />
              Add to
            </button>
            <button
              onClick={() => setMode('set')}
              className={cn(
                "flex-1 py-2 px-3 rounded-lg border text-xs font-medium transition-all",
                mode === 'set'
                  ? 'bg-primary/20 border-primary text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50'
              )}
            >
              Set to
            </button>
          </div>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="flex gap-2">
            <div className="relative flex-1">
              {goal.unit === '$' && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
              )}
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={mode === 'add' ? 'Amount to add' : 'New value'}
                min="0"
                step="any"
                className={cn(
                  "w-full py-2 bg-muted/50 border border-border rounded-lg text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all",
                  goal.unit === '$' ? "pl-7 pr-3" : "px-3"
                )}
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground font-medium text-sm rounded-lg hover:glow-cyan transition-all"
            >
              Update
            </button>
          </form>
        </div>
      </PopoverContent>
    </Popover>
  );
}
