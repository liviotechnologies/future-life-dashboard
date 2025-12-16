import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';
import { LayoutDashboard, Target, Settings, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories } from '@/data/initialGoals';
import { GoalCategory } from '@/types/goals';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeCategory: GoalCategory | 'all';
  onCategoryChange: (category: GoalCategory | 'all') => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
}

const colorClasses = {
  cyan: 'text-primary',
  magenta: 'text-secondary',
  green: 'text-success',
  amber: 'text-warning',
};

export function Sidebar({ activeCategory, onCategoryChange, collapsed, onToggleCollapse }: SidebarProps) {
  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={cn(
        "fixed left-0 top-0 h-screen bg-sidebar border-r border-sidebar-border z-40 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!collapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-2"
              >
                <Target className="w-8 h-8 text-primary glow-text-cyan" />
                <span className="font-display font-bold text-xl text-foreground">NEXUS</span>
              </motion.div>
            )}
            {collapsed && <Target className="w-8 h-8 text-primary mx-auto" />}
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          <button
            onClick={() => onCategoryChange('all')}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              activeCategory === 'all'
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="font-medium">Dashboard</span>}
          </button>

          {!collapsed && (
            <div className="pt-4 pb-2">
              <p className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Categories</p>
            </div>
          )}

          {categories.map(cat => {
            const IconComponent = Icons[cat.icon as keyof typeof Icons] as React.ElementType;
            return (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                  activeCategory === cat.id
                    ? cn("bg-muted", colorClasses[cat.color])
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {IconComponent && <IconComponent className="w-5 h-5 flex-shrink-0" />}
                {!collapsed && <span className="font-medium truncate">{cat.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <button
            onClick={onToggleCollapse}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
          >
            {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!collapsed && <span className="font-medium">Collapse</span>}
          </button>
        </div>
      </div>
    </motion.aside>
  );
}
