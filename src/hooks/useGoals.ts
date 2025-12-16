import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Goal, GoalCategory } from '@/types/goals';
import { toast } from 'sonner';

export function useGoals() {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchGoals = useCallback(async () => {
    if (!user) {
      setGoals([]);
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const mappedGoals: Goal[] = (data || []).map(g => ({
        id: g.id,
        title: g.title,
        category: g.category as GoalCategory,
        completed: g.completed,
        progress: g.progress,
        target: g.target ?? undefined,
        unit: g.unit ?? undefined,
        priority: g.priority as 'low' | 'medium' | 'high',
        createdAt: g.created_at,
      }));

      setGoals(mappedGoals);
    } catch (error) {
      console.error('Error fetching goals:', error);
      toast.error('Failed to load goals');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchGoals();
  }, [fetchGoals]);

  const addGoal = async (newGoal: { title: string; category: GoalCategory; priority: 'low' | 'medium' | 'high'; target?: number; unit?: string }) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert({
          user_id: user.id,
          title: newGoal.title,
          category: newGoal.category,
          priority: newGoal.priority,
          target: newGoal.target,
          unit: newGoal.unit,
          completed: false,
          progress: 0,
        })
        .select()
        .single();

      if (error) throw error;

      const mappedGoal: Goal = {
        id: data.id,
        title: data.title,
        category: data.category as GoalCategory,
        completed: data.completed,
        progress: data.progress,
        target: data.target ?? undefined,
        unit: data.unit ?? undefined,
        priority: data.priority as 'low' | 'medium' | 'high',
        createdAt: data.created_at,
      };

      setGoals(prev => [mappedGoal, ...prev]);
      toast.success('Goal created!');
    } catch (error) {
      console.error('Error adding goal:', error);
      toast.error('Failed to create goal');
    }
  };

  const toggleGoal = async (id: string) => {
    const goal = goals.find(g => g.id === id);
    if (!goal) return;

    const newCompleted = !goal.completed;
    const newProgress = newCompleted ? (goal.target || 100) : 0;

    try {
      const { error } = await supabase
        .from('goals')
        .update({ 
          completed: newCompleted, 
          progress: newProgress 
        })
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.map(g => 
        g.id === id ? { ...g, completed: newCompleted, progress: newProgress } : g
      ));
    } catch (error) {
      console.error('Error toggling goal:', error);
      toast.error('Failed to update goal');
    }
  };

  const deleteGoal = async (id: string) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setGoals(prev => prev.filter(g => g.id !== id));
      toast.success('Goal deleted');
    } catch (error) {
      console.error('Error deleting goal:', error);
      toast.error('Failed to delete goal');
    }
  };

  return {
    goals,
    loading,
    addGoal,
    toggleGoal,
    deleteGoal,
    refetch: fetchGoals,
  };
}
