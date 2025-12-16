import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, TrendingUp, CheckCircle2, Clock, 
  DollarSign, Dumbbell, MapPin, Users 
} from 'lucide-react';
import { Sidebar } from '@/components/dashboard/Sidebar';
import { Header } from '@/components/dashboard/Header';
import { MetricCard } from '@/components/dashboard/MetricCard';
import { CategorySection } from '@/components/dashboard/CategorySection';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { AddGoalDialog } from '@/components/dashboard/AddGoalDialog';
import { Goal, GoalCategory } from '@/types/goals';
import { categories, initialGoals } from '@/data/initialGoals';
import { cn } from '@/lib/utils';

export default function Index() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [activeCategory, setActiveCategory] = useState<GoalCategory | 'all'>('all');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [addDialogCategory, setAddDialogCategory] = useState<GoalCategory>('daily');

  const filteredGoals = useMemo(() => {
    if (activeCategory === 'all') return goals;
    return goals.filter(g => g.category === activeCategory);
  }, [goals, activeCategory]);

  const metrics = useMemo(() => {
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const highPriority = goals.filter(g => g.priority === 'high' && !g.completed).length;
    const financialProgress = goals
      .filter(g => g.category === 'financial' && g.target)
      .reduce((sum, g) => sum + (g.progress || 0), 0);
    
    return { total, completed, highPriority, financialProgress };
  }, [goals]);

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => 
      g.id === id ? { ...g, completed: !g.completed, progress: g.completed ? 0 : 100 } : g
    ));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const addGoal = (newGoal: { title: string; category: GoalCategory; priority: 'low' | 'medium' | 'high'; target?: number; unit?: string }) => {
    const goal: Goal = {
      id: Date.now().toString(),
      title: newGoal.title,
      category: newGoal.category,
      completed: false,
      progress: 0,
      target: newGoal.target,
      unit: newGoal.unit,
      priority: newGoal.priority,
      createdAt: new Date().toISOString(),
    };
    setGoals(prev => [goal, ...prev]);
  };

  const handleAddClick = (category?: string) => {
    if (category) setAddDialogCategory(category as GoalCategory);
    setIsAddDialogOpen(true);
  };

  const completedDates = useMemo(() => {
    return goals
      .filter(g => g.completed)
      .map(() => {
        const d = new Date();
        d.setDate(d.getDate() - Math.floor(Math.random() * 30));
        return d.toISOString().split('T')[0];
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main className={cn(
        "transition-all duration-300",
        sidebarCollapsed ? "ml-16" : "ml-64"
      )}>
        <Header
          onAddGoal={() => handleAddClick()}
          totalGoals={metrics.total}
          completedGoals={metrics.completed}
        />

        <div className="p-6 space-y-6">
          {/* Metrics Overview */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Goals"
              value={metrics.total}
              subtitle="Active missions"
              icon={Target}
              color="cyan"
              delay={0}
            />
            <MetricCard
              title="Completed"
              value={metrics.completed}
              subtitle={`${Math.round((metrics.completed / metrics.total) * 100) || 0}% success rate`}
              icon={CheckCircle2}
              color="green"
              trend={{ value: 12, isPositive: true }}
              delay={0.1}
            />
            <MetricCard
              title="High Priority"
              value={metrics.highPriority}
              subtitle="Urgent tasks"
              icon={Clock}
              color="magenta"
              delay={0.2}
            />
            <MetricCard
              title="Financial Progress"
              value={`$${metrics.financialProgress.toLocaleString()}`}
              subtitle="Towards goals"
              icon={DollarSign}
              color="amber"
              trend={{ value: 8, isPositive: true }}
              delay={0.3}
            />
          </section>

          {/* Main Content */}
          {activeCategory === 'all' ? (
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-5">
              <div className="xl:col-span-3 space-y-5">
                {/* Featured Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {categories.slice(0, 4).map(cat => (
                    <CategorySection
                      key={cat.id}
                      category={cat}
                      goals={goals.filter(g => g.category === cat.id)}
                      onToggle={toggleGoal}
                      onDelete={deleteGoal}
                      onAdd={handleAddClick}
                    />
                  ))}
                </div>

                {/* More Categories */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categories.slice(4).map(cat => (
                    <CategorySection
                      key={cat.id}
                      category={cat}
                      goals={goals.filter(g => g.category === cat.id)}
                      onToggle={toggleGoal}
                      onDelete={deleteGoal}
                      onAdd={handleAddClick}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar Widgets */}
              <div className="xl:col-span-1 space-y-4">
                <CalendarWidget completedDates={completedDates} />

                {/* Quick Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="glass-card cyber-border rounded-xl p-4"
                >
                  <h3 className="font-display font-semibold text-foreground text-sm mb-3">Quick Stats</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Dumbbell className="w-4 h-4 text-success" />
                        <span className="text-xs text-muted-foreground">Fitness</span>
                      </div>
                      <span className="text-xs font-medium text-success">75%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-warning" />
                        <span className="text-xs text-muted-foreground">Financial</span>
                      </div>
                      <span className="text-xs font-medium text-warning">70%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-secondary" />
                        <span className="text-xs text-muted-foreground">Bucket List</span>
                      </div>
                      <span className="text-xs font-medium text-secondary">50%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-xs text-muted-foreground">Customers</span>
                      </div>
                      <span className="text-xs font-medium text-primary">45%</span>
                    </div>
                  </div>
                </motion.div>

                {/* Streak */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="glass-card cyber-border rounded-xl p-4 text-center"
                >
                  <div className="text-4xl font-display font-bold text-primary glow-text-cyan mb-1">
                    7
                  </div>
                  <p className="text-sm text-muted-foreground">Day Streak 🔥</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Keep it up!</p>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl">
              {categories
                .filter(cat => cat.id === activeCategory)
                .map(cat => (
                  <CategorySection
                    key={cat.id}
                    category={cat}
                    goals={filteredGoals}
                    onToggle={toggleGoal}
                    onDelete={deleteGoal}
                    onAdd={handleAddClick}
                  />
                ))}
            </div>
          )}
        </div>
      </main>

      <AddGoalDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAdd={addGoal}
        defaultCategory={addDialogCategory}
      />
    </div>
  );
}
