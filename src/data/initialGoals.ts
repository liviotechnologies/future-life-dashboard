import { Goal, CategoryInfo } from '@/types/goals';

export const categories: CategoryInfo[] = [
  { id: 'daily', label: 'Daily Tasks', icon: 'Calendar', color: 'cyan', description: 'Your everyday missions' },
  { id: 'fitness', label: 'Fitness', icon: 'Dumbbell', color: 'green', description: 'Physical achievements' },
  { id: 'financial', label: 'Financial', icon: 'DollarSign', color: 'amber', description: 'Money & revenue goals' },
  { id: 'bucket-list', label: 'Bucket List', icon: 'MapPin', color: 'magenta', description: 'Places & experiences' },
  { id: 'business', label: 'Business', icon: 'Briefcase', color: 'cyan', description: 'Professional milestones' },
  { id: 'family', label: 'Family', icon: 'Heart', color: 'magenta', description: 'Family objectives' },
  { id: 'marketing', label: 'Marketing', icon: 'Megaphone', color: 'amber', description: 'Growth & outreach' },
  { id: 'customer', label: 'Customers', icon: 'Users', color: 'green', description: 'Acquisition targets' },
  { id: 'life', label: 'Life Goals', icon: 'Star', color: 'magenta', description: 'Major achievements' },
];

export const initialGoals: Goal[] = [
  { id: '1', title: 'Morning meditation', category: 'daily', completed: true, progress: 100, priority: 'high', createdAt: new Date().toISOString() },
  { id: '2', title: 'Review project roadmap', category: 'daily', completed: false, progress: 0, priority: 'medium', createdAt: new Date().toISOString() },
  { id: '3', title: 'Complete 10,000 steps', category: 'fitness', completed: false, progress: 7500, target: 10000, unit: 'steps', priority: 'high', createdAt: new Date().toISOString() },
  { id: '4', title: 'Bench press 225 lbs', category: 'fitness', completed: false, progress: 185, target: 225, unit: 'lbs', priority: 'medium', createdAt: new Date().toISOString() },
  { id: '5', title: 'Save $50,000 emergency fund', category: 'financial', completed: false, progress: 35000, target: 50000, unit: '$', priority: 'high', createdAt: new Date().toISOString() },
  { id: '6', title: 'Monthly revenue $10K', category: 'financial', completed: false, progress: 7500, target: 10000, unit: '$', priority: 'high', createdAt: new Date().toISOString() },
  { id: '7', title: 'Visit Tokyo', category: 'bucket-list', completed: true, progress: 100, priority: 'medium', createdAt: new Date().toISOString() },
  { id: '8', title: 'Northern Lights in Iceland', category: 'bucket-list', completed: false, progress: 0, priority: 'low', createdAt: new Date().toISOString() },
  { id: '9', title: 'Launch MVP product', category: 'business', completed: false, progress: 75, priority: 'high', createdAt: new Date().toISOString() },
  { id: '10', title: 'Weekly family dinner', category: 'family', completed: true, progress: 100, priority: 'high', createdAt: new Date().toISOString() },
  { id: '11', title: 'Reach 1000 followers', category: 'marketing', completed: false, progress: 650, target: 1000, unit: 'followers', priority: 'medium', createdAt: new Date().toISOString() },
  { id: '12', title: 'Acquire 100 customers', category: 'customer', completed: false, progress: 45, target: 100, unit: 'customers', priority: 'high', createdAt: new Date().toISOString() },
  { id: '13', title: 'Learn a new language', category: 'life', completed: false, progress: 30, priority: 'low', createdAt: new Date().toISOString() },
];
