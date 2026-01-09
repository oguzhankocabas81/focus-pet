import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Check, Clock, Trash2, 
  Target, RotateCcw, Compass, ChevronDown, Calendar, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskBadge } from '@/components/Common/TaskBadge';
import { useGameStore } from '@/store/gameStore';
import { Task, TaskType, UrgencyLevel } from '@/types';
import { TASK_POINTS } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { format, parseISO, isToday, isTomorrow, isThisWeek } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type FilterType = 'all' | 'habit' | 'quest';

export const TaskManager = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask, startFocusTask, setCurrentTab } = useGameStore();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCompleted, setShowCompleted] = useState(false);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [taskType, setTaskType] = useState<TaskType>('focus');
  const [dueDate, setDueDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [dueTime, setDueTime] = useState('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('medium');

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setTaskType('focus');
    setDueDate(format(new Date(), 'yyyy-MM-dd'));
    setDueTime('');
    setUrgency('medium');
    setEditingTask(null);
  };

  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task);
      setTitle(task.title);
      setDescription(task.description || '');
      setTaskType(task.type);
      setDueDate(task.dueDate);
      setDueTime(task.dueTime || '');
      setUrgency(task.urgencyLevel);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const handleSubmit = () => {
    if (title.trim().length < 3) {
      toast({
        title: "Title too short",
        description: "Task title must be at least 3 characters",
        variant: "destructive",
      });
      return;
    }

    if (editingTask) {
      updateTask(editingTask.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        type: taskType,
        dueDate,
        dueTime: dueTime || undefined,
        urgencyLevel: urgency,
        points: TASK_POINTS[taskType],
      });
      toast({ title: "Task updated!" });
    } else {
      addTask({
        title: title.trim(),
        description: description.trim() || undefined,
        type: taskType,
        dueDate,
        dueTime: dueTime || undefined,
        urgencyLevel: urgency,
      });
      toast({ title: "Task created!", description: `+${TASK_POINTS[taskType]} XP when completed` });
    }

    setIsModalOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
    toast({ title: "Task deleted" });
  };

  const handleComplete = (task: Task) => {
    if (task.type === 'focus') {
      startFocusTask(task.id);
      setCurrentTab('timer');
    } else {
      completeTask(task.id);
      toast({ 
        title: "Task completed! 🎉", 
        description: `+${task.points} XP earned` 
      });
    }
  };

  // Filter tasks by type
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return t.status !== 'completed' && t.status !== 'expired';
    return t.type === filter && t.status !== 'completed' && t.status !== 'expired';
  });

  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Group tasks for Today's Focus section
  const todayFocus = filteredTasks.filter(t => {
    const date = parseISO(t.dueDate);
    return isToday(date);
  });

  const taskTypeOptions = [
    { value: 'focus', label: 'Focus', icon: Target, points: 50, color: 'text-focus' },
    { value: 'habit', label: 'Habit', icon: RotateCcw, points: 25, color: 'text-habit' },
    { value: 'quest', label: 'Quest', icon: Compass, points: 25, color: 'text-quest' },
  ];

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'habit', label: 'Habits' },
    { id: 'quest', label: 'Quests' },
  ];

  return (
    <div className="min-h-screen pb-24 px-4 pt-6 bg-background">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">Tasks</h1>
          
          {/* Filter Tabs */}
          <div className="flex bg-secondary rounded-full p-1">
            {filterTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterType)}
                className={cn(
                  'flex-1 py-2 px-4 rounded-full text-sm font-medium transition-all',
                  filter === tab.id 
                    ? 'bg-card text-foreground shadow-sm' 
                    : 'text-muted-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Today's Focus Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-foreground mb-3">Today's Focus</h2>
          
          {todayFocus.length === 0 ? (
            <Card className="p-6 text-center rounded-2xl border-0 shadow-sm bg-card mb-6">
              <div className="text-4xl mb-2">📋</div>
              <p className="text-sm text-muted-foreground mb-4">No tasks for today</p>
              <Button onClick={() => openModal()} className="rounded-full">
                <Plus className="w-4 h-4 mr-2" />
                Add Task
              </Button>
            </Card>
          ) : (
            <div className="space-y-2 mb-6">
              {todayFocus.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={() => openModal(task)}
                  onDelete={() => handleDelete(task.id)}
                  onComplete={() => handleComplete(task)}
                />
              ))}
            </div>
          )}

          {/* Completed Section */}
          {completedTasks.length > 0 && (
            <div className="mt-6">
              <button
                onClick={() => setShowCompleted(!showCompleted)}
                className="flex items-center gap-2 text-muted-foreground mb-3"
              >
                <span className="font-medium">Completed ({completedTasks.length})</span>
                <ChevronDown className={cn(
                  "w-4 h-4 transition-transform",
                  showCompleted && "rotate-180"
                )} />
              </button>
              
              <AnimatePresence>
                {showCompleted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2"
                  >
                    {completedTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        onEdit={() => openModal(task)}
                        onDelete={() => handleDelete(task.id)}
                        onComplete={() => {}}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* FAB */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="fixed bottom-24 right-4 z-40"
        >
          <Button
            size="lg"
            className="w-14 h-14 rounded-full shadow-lg bg-foreground text-background hover:bg-foreground/90"
            onClick={() => openModal()}
          >
            <Plus className="w-6 h-6" />
          </Button>
        </motion.div>

        {/* Create/Edit Modal */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-md mx-4 rounded-3xl">
            <DialogHeader>
              <DialogTitle>
                {editingTask ? 'Edit Task' : 'New Task'}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* Title */}
              <Input
                placeholder="What needs to be done?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="h-12 rounded-xl"
                maxLength={100}
              />

              {/* Description */}
              <Textarea
                placeholder="Add details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none rounded-xl"
                rows={2}
              />

              {/* Task Type */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Task Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {taskTypeOptions.map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setTaskType(option.value as TaskType)}
                        className={cn(
                          'p-3 rounded-xl border-2 transition-all text-center',
                          taskType === option.value
                            ? 'border-primary bg-primary/10'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <Icon className={cn('w-5 h-5 mx-auto mb-1', option.color)} />
                        <div className="text-xs font-medium">{option.label}</div>
                        <div className="text-[10px] text-muted-foreground">
                          +{option.points} XP
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Due Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Due Date
                  </label>
                  <Input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Due Time
                  </label>
                  <Input
                    type="time"
                    value={dueTime}
                    onChange={(e) => setDueTime(e.target.value)}
                    className="h-11 rounded-xl"
                  />
                </div>
              </div>

              {/* Urgency */}
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Urgency
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as UrgencyLevel[]).map((level) => (
                    <button
                      key={level}
                      onClick={() => setUrgency(level)}
                      className={cn(
                        'p-2 rounded-xl border-2 transition-all capitalize text-sm',
                        urgency === level
                          ? level === 'high' 
                            ? 'border-destructive bg-destructive/10 text-destructive'
                            : level === 'medium'
                              ? 'border-warning bg-warning/10 text-warning'
                              : 'border-muted-foreground bg-muted text-muted-foreground'
                          : 'border-border hover:border-primary/50'
                      )}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <Button 
                className="w-full h-12 rounded-full bg-foreground text-background hover:bg-foreground/90"
                onClick={handleSubmit}
              >
                {editingTask ? 'Save Changes' : 'Create Task'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

// Task Card Component
interface TaskCardProps {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onComplete: () => void;
}

const TaskCard = ({ task, onEdit, onDelete, onComplete }: TaskCardProps) => {
  const isCompleted = task.status === 'completed';
  const isExpired = task.status === 'expired';

  const getTypeIcon = () => {
    switch (task.type) {
      case 'habit':
        return <RotateCcw className="w-4 h-4 text-habit" />;
      case 'quest':
        return <Compass className="w-4 h-4 text-quest" />;
      default:
        return <Target className="w-4 h-4 text-focus" />;
    }
  };

  const getTypeLabel = () => {
    switch (task.type) {
      case 'habit':
        return 'Habit';
      case 'quest':
        return 'Quest';
      default:
        return 'Focus';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Card 
        className={cn(
          'p-4 transition-all cursor-pointer hover:shadow-md rounded-2xl border-0 shadow-sm bg-card',
          isCompleted && 'opacity-60',
          isExpired && 'opacity-50',
        )}
        onClick={onEdit}
      >
        <div className="flex items-center gap-3">
          {/* Icon */}
          <div className={cn(
            'w-10 h-10 rounded-xl flex items-center justify-center',
            task.type === 'habit' && 'bg-habit/10',
            task.type === 'quest' && 'bg-quest/10',
            task.type === 'focus' && 'bg-focus/10',
          )}>
            {getTypeIcon()}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground">{getTypeLabel()}</p>
            <h3 className={cn(
              'font-medium text-foreground',
              isCompleted && 'line-through'
            )}>
              {task.title}
            </h3>
          </div>

          {/* Checkbox */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCompleted && !isExpired) onComplete();
            }}
            disabled={isCompleted || isExpired}
            className={cn(
              'w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all',
              isCompleted 
                ? 'bg-success border-success' 
                : 'border-muted-foreground/30 hover:border-primary'
            )}
          >
            {isCompleted && <Check className="w-4 h-4 text-success-foreground" />}
          </button>
        </div>
      </Card>
    </motion.div>
  );
};