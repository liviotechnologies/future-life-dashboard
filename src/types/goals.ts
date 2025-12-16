export type GoalCategory = 
  | 'daily'
  | 'fitness'
  | 'financial'
  | 'bucket-list'
  | 'business'
  | 'family'
  | 'marketing'
  | 'customer'
  | 'life';

export interface Goal {
  id: string;
  title: string;
  category: GoalCategory;
  completed: boolean;
  progress: number;
  target?: number;
  unit?: string;
  dueDate?: string;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

export interface CategoryInfo {
  id: GoalCategory;
  label: string;
  icon: string;
  color: 'cyan' | 'magenta' | 'green' | 'amber';
  description: string;
}
