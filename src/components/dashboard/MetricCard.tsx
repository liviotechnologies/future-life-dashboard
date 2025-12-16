import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'cyan' | 'magenta' | 'green' | 'amber';
  trend?: { value: number; isPositive: boolean };
  delay?: number;
}

const colorClasses = {
  cyan: 'text-primary glow-text-cyan',
  magenta: 'text-secondary glow-text-magenta',
  green: 'text-success',
  amber: 'text-warning',
};

const bgClasses = {
  cyan: 'bg-primary/10',
  magenta: 'bg-secondary/10',
  green: 'bg-success/10',
  amber: 'bg-warning/10',
};

export function MetricCard({ title, value, subtitle, icon: Icon, color, trend, delay = 0 }: MetricCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="glass-card cyber-border rounded-lg p-5 hover:glow-cyan transition-all duration-300"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={cn("p-2.5 rounded-lg", bgClasses[color])}>
          <Icon className={cn("w-5 h-5", colorClasses[color])} />
        </div>
        <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
      </div>
      <div className="space-y-1">
        <p className={cn("text-3xl font-display font-bold", colorClasses[color])}>{value}</p>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
        {trend && (
          <p className={cn("text-sm font-medium", trend.isPositive ? "text-success" : "text-destructive")}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
          </p>
        )}
      </div>
    </motion.div>
  );
}
