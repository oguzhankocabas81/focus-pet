import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, CheckCircle, XCircle, Trash2, 
  Search, Filter, TrendingUp, Award, Flame
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskBadge } from '@/components/Common/TaskBadge';
import { useGameStore } from '@/store/gameStore';
import { LogbookEntry } from '@/types';
import { cn } from '@/lib/utils';
import { format, parseISO, isThisWeek, isThisMonth, formatDistanceToNow } from 'date-fns';

type FilterType = 'all' | 'completed' | 'expired' | 'thisWeek' | 'thisMonth';

export const Logbook = () => {
  const { logbook, deleteLogEntry } = useGameStore();
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(20);

  // Calculate stats
  const stats = {
    total: logbook.filter(e => e.result === 'completed').length,
    thisWeek: logbook.filter(e => 
      e.result === 'completed' && isThisWeek(parseISO(e.timestamp))
    ).length,
    weekTotal: logbook.filter(e => isThisWeek(parseISO(e.timestamp))).length,
    longestStreak: calculateLongestStreak(logbook),
  };

  const completionRate = stats.weekTotal > 0 
    ? Math.round((stats.thisWeek / stats.weekTotal) * 100) 
    : 0;

  // Filter entries
  const filteredEntries = logbook.filter((entry) => {
    // Search filter
    if (searchQuery && !entry.task.title.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Status/time filter
    switch (filter) {
      case 'completed':
        return entry.result === 'completed';
      case 'expired':
        return entry.result === 'expired';
      case 'thisWeek':
        return isThisWeek(parseISO(entry.timestamp));
      case 'thisMonth':
        return isThisMonth(parseISO(entry.timestamp));
      default:
        return true;
    }
  });

  // Group by date
  const groupedEntries = groupByDate(filteredEntries.slice(0, visibleCount));

  const handleDelete = (id: string) => {
    deleteLogEntry(id);
  };

  return (
    <div className="min-h-screen pb-24 px-4 pt-6">
      <div className="max-w-lg mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <h1 className="text-2xl font-bold text-foreground mb-4">Logbook</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            <Card className="p-3 text-center bg-gradient-to-br from-primary/10 to-primary/5">
              <Award className="w-5 h-5 mx-auto mb-1 text-primary" />
              <div className="text-xl font-bold text-foreground">{stats.total}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Completed</div>
            </Card>
            <Card className="p-3 text-center bg-gradient-to-br from-success/10 to-success/5">
              <TrendingUp className="w-5 h-5 mx-auto mb-1 text-success" />
              <div className="text-xl font-bold text-foreground">{completionRate}%</div>
              <div className="text-[10px] text-muted-foreground uppercase">This Week</div>
            </Card>
            <Card className="p-3 text-center bg-gradient-to-br from-warning/10 to-warning/5">
              <Flame className="w-5 h-5 mx-auto mb-1 text-warning" />
              <div className="text-xl font-bold text-foreground">{stats.longestStreak}</div>
              <div className="text-[10px] text-muted-foreground uppercase">Best Streak</div>
            </Card>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 h-10"
            />
          </div>
          <Select value={filter} onValueChange={(v) => setFilter(v as FilterType)}>
            <SelectTrigger className="w-32 h-10">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Time</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="expired">Expired</SelectItem>
              <SelectItem value="thisWeek">This Week</SelectItem>
              <SelectItem value="thisMonth">This Month</SelectItem>
            </SelectContent>
          </Select>
        </motion.div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {filteredEntries.length === 0 ? (
            <Card className="p-8 text-center">
              <div className="text-5xl mb-4">📖</div>
              <h3 className="font-semibold text-foreground mb-2">No entries yet</h3>
              <p className="text-sm text-muted-foreground">
                Complete tasks to see your history here
              </p>
            </Card>
          ) : (
            <div className="space-y-6">
              {Object.entries(groupedEntries).map(([date, entries]) => (
                <div key={date}>
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-primary" />
                    <h3 className="text-sm font-medium text-muted-foreground">
                      {date}
                    </h3>
                  </div>
                  <div className="relative pl-4 border-l-2 border-border space-y-3">
                    <AnimatePresence>
                      {entries.map((entry) => (
                        <LogEntryCard
                          key={entry.id}
                          entry={entry}
                          onDelete={() => handleDelete(entry.id)}
                        />
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              ))}

              {/* Load More */}
              {visibleCount < filteredEntries.length && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setVisibleCount((prev) => prev + 20)}
                >
                  Load More ({filteredEntries.length - visibleCount} remaining)
                </Button>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

// Log Entry Card Component
interface LogEntryCardProps {
  entry: LogbookEntry;
  onDelete: () => void;
}

const LogEntryCard = ({ entry, onDelete }: LogEntryCardProps) => {
  const isCompleted = entry.result === 'completed';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="relative"
    >
      {/* Timeline dot */}
      <div 
        className={cn(
          'absolute -left-[21px] top-3 w-3 h-3 rounded-full border-2 border-background',
          isCompleted ? 'bg-success' : 'bg-muted-foreground'
        )}
      />

      <Card className={cn(
        'p-4 transition-all',
        !isCompleted && 'opacity-60'
      )}>
        <div className="flex items-start gap-3">
          {/* Status Icon */}
          <div className={cn(
            'mt-0.5 w-6 h-6 rounded-full flex items-center justify-center',
            isCompleted ? 'bg-success/20' : 'bg-muted'
          )}>
            {isCompleted ? (
              <CheckCircle className="w-4 h-4 text-success" />
            ) : (
              <XCircle className="w-4 h-4 text-muted-foreground" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <TaskBadge type={entry.task.type} size="sm" />
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(parseISO(entry.timestamp), { addSuffix: true })}
              </span>
            </div>
            <h3 className="font-medium text-foreground">
              {entry.task.title}
            </h3>
            {isCompleted && (
              <span className="text-xs font-semibold text-xp">
                +{entry.pointsEarned} XP
              </span>
            )}
          </div>

          {/* Delete */}
          <Button
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
            onClick={onDelete}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
};

// Helper functions
function groupByDate(entries: LogbookEntry[]): Record<string, LogbookEntry[]> {
  const groups: Record<string, LogbookEntry[]> = {};

  entries.forEach((entry) => {
    const date = format(parseISO(entry.timestamp), 'EEEE, MMMM d');
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
  });

  return groups;
}

function calculateLongestStreak(entries: LogbookEntry[]): number {
  const completedDates = entries
    .filter(e => e.result === 'completed')
    .map(e => format(parseISO(e.timestamp), 'yyyy-MM-dd'))
    .filter((date, index, self) => self.indexOf(date) === index)
    .sort();

  if (completedDates.length === 0) return 0;

  let longestStreak = 1;
  let currentStreak = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prevDate = new Date(completedDates[i - 1]);
    const currDate = new Date(completedDates[i]);
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}