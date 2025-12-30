import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Filter, Check, Clock, Trash2, 
  Target, RotateCcw, Compass, Calendar,
  AlertCircle, ChevronDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskBadge } from '@/components/Common/TaskBadge';
import { useGameStore } from '@/store/gameStore';
import { Task, TaskType, UrgencyLevel, TaskStatus } from '@/types';
import { TASK_POINTS } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { format, parseISO, isToday, isTomorrow, isThisWeek, isBefore } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

type FilterType = 'all' | 'pending' | 'completed' | 'expired';

export const TaskManager = () => {
  const { tasks, addTask, updateTask, deleteTask, completeTask, startFocusTask, setCurrentTab } = useGameStore();
  const { toast } = useToast();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

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

  // Filter and group tasks
  const filteredTasks = tasks.filter((t) => {
    if (filter === 'all') return true;
    return t.status === filter;
  });

  const groupTasks = (taskList: Task[]) => {
    const groups: { [key: string]: Task[] } = {
      today: [],
      tomorrow: [],
      thisWeek: [],
      upcoming: [],
      completed: [],
      expired: [],
    };

    taskList.forEach((task) => {
      if (task.status === 'completed') {
        groups.completed.push(task);
      } else if (task.status === 'expired') {
        groups.expired.push(task);
      } else {
        const date = parseISO(task.dueDate);
        if (isToday(date)) {
          groups.today.push(task);
        } else if (isTomorrow(date)) {
          groups.tomorrow.push(task);
        } else if (isThisWeek(date)) {
          groups.thisWeek.push(task);
        } else {
          groups.upcoming.push(task);
        }
      }
    });

    return groups;
  };

  const groupedTasks = groupTasks(filteredTasks);

  const taskTypeOptions = [
    { value: 'focus', label: 'Focus', icon: Target, points: 50, color: 'text-focus' },
    { value: 'habit', label: 'Habit', icon: RotateCcw, points: 25, color: 'text-habit' },
    { value: 'quest', label: 'Quest', icon: Compass, points: 25, color: 'text-quest' },
  ];

  const renderTaskGroup = (label: string, taskList: Task[], icon?: React.ReactNode) => {
    if (taskList.length === 0) return null;

    return (
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          {icon}
          <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
            {label}
          </h3>
          <span className="text-xs bg-muted px-2 py-0.5 rounded-full">
            {taskList.length}
          </span>
        </div>
        <div className="space-y-2">
          {taskList.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={() => openModal(task)}
              onDelete={() => handleDelete(task.id)}
              onComplete={() => handleComplete(task)}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground">Tasks</h1>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
              <SelectTrigger className="w-32 h-9">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Task List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {filteredTasks.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="font-semibold text-foreground mb-2">No tasks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first task and start earning XP!
              </p>
              <Button onClick={() => openModal()}>
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </Card>
          ) : (
            <>
              {renderTaskGroup('Today', groupedTasks.today, <Calendar className="w-4 h-4 text-primary" />)}
              {renderTaskGroup('Tomorrow', groupedTasks.tomorrow)}
              {renderTaskGroup('This Week', groupedTasks.thisWeek)}
              {renderTaskGroup('Upcoming', groupedTasks.upcoming)}
              {renderTaskGroup('Completed', groupedTasks.completed, <Check className="w-4 h-4 text-success" />)}
              {renderTaskGroup('Expired', groupedTasks.expired, <AlertCircle className="w-4 h-4 text-destructive" />)}
            </>
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
            className="w-14 h-14 rounded-full shadow-lg"
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
                className="h-12"
                maxLength={100}
              />

              {/* Description */}
              <Textarea
                placeholder="Add details (optional)"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
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
                    className="h-11"
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
                    className="h-11"
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
                        'p-2 rounded-lg border-2 transition-all capitalize text-sm',
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
                className="w-full h-12"
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

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <Card 
        className={cn(
          'p-4 transition-all cursor-pointer hover:shadow-md',
          task.urgencyLevel === 'high' && !isCompleted && 'urgency-high',
          task.urgencyLevel === 'medium' && !isCompleted && 'urgency-medium',
          task.urgencyLevel === 'low' && !isCompleted && 'urgency-low',
          isCompleted && 'opacity-60',
          isExpired && 'opacity-50 bg-muted',
        )}
        onClick={onEdit}
      >
        <div className="flex items-start gap-3">
          {/* Checkbox/Complete button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (!isCompleted && !isExpired) onComplete();
            }}
            disabled={isCompleted || isExpired}
            className={cn(
              'mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all',
              isCompleted 
                ? 'bg-success border-success' 
                : 'border-border hover:border-primary'
            )}
          >
            {isCompleted && <Check className="w-4 h-4 text-success-foreground" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TaskBadge type={task.type} size="sm" />
              {task.dueTime && (
                <span className="text-xs text-muted-foreground flex items-center gap-0.5">
                  <Clock className="w-3 h-3" />
                  {task.dueTime}
                </span>
              )}
            </div>
            <h3 className={cn(
              'font-medium text-foreground',
              isCompleted && 'line-through'
            )}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-muted-foreground mt-0.5 line-clamp-1">
                {task.description}
              </p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {!isCompleted && !isExpired && (
              <span className="text-xs font-semibold text-xp mr-2">
                +{task.points}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};
