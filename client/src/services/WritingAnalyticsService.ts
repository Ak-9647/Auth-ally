import React from 'react';
import { useUser } from '@clerk/clerk-react';
import { Document } from './ConvexStorageService';

// Types
export interface WritingSession {
  documentId: string;
  startTime: number;
  endTime: number;
  wordsWritten: number;
}

export interface WritingGoal {
  id: string;
  type: 'daily' | 'weekly' | 'project';
  target: number; // Target word count
  current: number; // Current word count
  documentId?: string; // If specific to a document
  startDate: number;
  endDate?: number; // For project deadlines
  completed: boolean;
  streak: number; // Days in a row the goal was met
}

export interface WritingStats {
  totalSessions: number;
  totalTimeSpent: number; // in milliseconds
  totalWordsWritten: number;
  averageWordsPerMinute: number;
  mostProductiveTimeOfDay: string; // e.g., 'morning', 'afternoon', 'evening'
  mostProductiveDay: string; // e.g., 'Monday', 'Tuesday', etc.
  longestSession: number; // in milliseconds
  currentStreak: number; // days in a row with writing
}

// Hooks for tracking writing sessions
export const useWritingSessions = () => {
  const { user } = useUser();
  const [sessions, setSessions] = React.useState<WritingSession[]>([]);

  React.useEffect(() => {
    if (user) {
      const storedSessions = localStorage.getItem(`writingSessions_${user.id}`);
      if (storedSessions) {
        setSessions(JSON.parse(storedSessions));
      }
    }
  }, [user]);

  return sessions;
};

export const useRecordWritingSession = () => {
  const { user } = useUser();

  return async (session: Omit<WritingSession, 'endTime' | 'wordsWritten'>, initialWords: number) => {
    if (!user) throw new Error('User not authenticated');

    // Create a new session with start time
    const newSession: WritingSession = {
      ...session,
      endTime: Date.now(),
      wordsWritten: 0, // Will be updated when session ends
    };

    // Store session start in localStorage
    localStorage.setItem(`currentSession_${user.id}`, JSON.stringify({
      session: newSession,
      initialWords
    }));

    return newSession;
  };
};

export const useEndWritingSession = () => {
  const { user } = useUser();

  return async (finalWords: number) => {
    if (!user) throw new Error('User not authenticated');

    // Get the current session from localStorage
    const sessionData = localStorage.getItem(`currentSession_${user.id}`);
    if (!sessionData) return null;

    const { session, initialWords } = JSON.parse(sessionData);
    
    // Update session with end time and words written
    const completedSession: WritingSession = {
      ...session,
      endTime: Date.now(),
      wordsWritten: Math.max(0, finalWords - initialWords) // Ensure positive value
    };

    // Get existing sessions
    const storedSessions = localStorage.getItem(`writingSessions_${user.id}`);
    const sessions = storedSessions ? JSON.parse(storedSessions) as WritingSession[] : [];
    
    // Add new session
    sessions.push(completedSession);
    
    // Save back to localStorage
    localStorage.setItem(`writingSessions_${user.id}`, JSON.stringify(sessions));
    
    // Clear current session
    localStorage.removeItem(`currentSession_${user.id}`);

    // Update goals
    updateGoalsFromSession(user.id, completedSession);
    
    return completedSession;
  };
};

// Hooks for managing writing goals
export const useWritingGoals = () => {
  const { user } = useUser();
  const [goals, setGoals] = React.useState<WritingGoal[]>([]);

  React.useEffect(() => {
    if (user) {
      const storedGoals = localStorage.getItem(`writingGoals_${user.id}`);
      if (storedGoals) {
        setGoals(JSON.parse(storedGoals));
      }
    }
  }, [user]);

  return goals;
};

export const useCreateGoal = () => {
  const { user } = useUser();

  return async (goal: Omit<WritingGoal, 'id' | 'current' | 'completed' | 'streak'>) => {
    if (!user) throw new Error('User not authenticated');

    const newGoal: WritingGoal = {
      id: `goal_${Date.now()}`,
      ...goal,
      current: 0,
      completed: false,
      streak: 0
    };

    // Get existing goals
    const storedGoals = localStorage.getItem(`writingGoals_${user.id}`);
    const goals = storedGoals ? JSON.parse(storedGoals) as WritingGoal[] : [];
    
    // Add new goal
    goals.push(newGoal);
    
    // Save back to localStorage
    localStorage.setItem(`writingGoals_${user.id}`, JSON.stringify(goals));
    
    return newGoal;
  };
};

export const useUpdateGoal = () => {
  const { user } = useUser();

  return async (id: string, updates: Partial<WritingGoal>) => {
    if (!user) throw new Error('User not authenticated');

    // Get existing goals
    const storedGoals = localStorage.getItem(`writingGoals_${user.id}`);
    if (!storedGoals) return false;

    const goals = JSON.parse(storedGoals) as WritingGoal[];
    const goalIndex = goals.findIndex(g => g.id === id);

    if (goalIndex === -1) return false;

    // Update goal
    goals[goalIndex] = {
      ...goals[goalIndex],
      ...updates
    };

    // If goal is completed, update streak
    if (updates.completed && !goals[goalIndex].completed) {
      goals[goalIndex].streak += 1;
    }

    // Save back to localStorage
    localStorage.setItem(`writingGoals_${user.id}`, JSON.stringify(goals));

    return true;
  };
};

export const useDeleteGoal = () => {
  const { user } = useUser();

  return async (id: string) => {
    if (!user) throw new Error('User not authenticated');

    // Get existing goals
    const storedGoals = localStorage.getItem(`writingGoals_${user.id}`);
    if (!storedGoals) return false;

    const goals = JSON.parse(storedGoals) as WritingGoal[];
    const filteredGoals = goals.filter(g => g.id !== id);

    // Save back to localStorage
    localStorage.setItem(`writingGoals_${user.id}`, JSON.stringify(filteredGoals));

    return true;
  };
};

// Helper function to update goals when a writing session is completed
const updateGoalsFromSession = (userId: string, session: WritingSession) => {
  const storedGoals = localStorage.getItem(`writingGoals_${userId}`);
  if (!storedGoals) return;

  const goals = JSON.parse(storedGoals) as WritingGoal[];
  let updated = false;

  // Update goals that match this document or are daily/weekly goals
  const updatedGoals = goals.map(goal => {
    // For project goals, check if they match the document
    if (goal.type === 'project' && goal.documentId === session.documentId) {
      updated = true;
      return {
        ...goal,
        current: goal.current + session.wordsWritten,
        completed: goal.current + session.wordsWritten >= goal.target
      };
    }

    // For daily goals, check if today
    if (goal.type === 'daily') {
      const today = new Date().setHours(0, 0, 0, 0);
      const goalDate = new Date(goal.startDate).setHours(0, 0, 0, 0);
      
      if (today === goalDate) {
        updated = true;
        return {
          ...goal,
          current: goal.current + session.wordsWritten,
          completed: goal.current + session.wordsWritten >= goal.target
        };
      }
    }

    // For weekly goals, check if this week
    if (goal.type === 'weekly') {
      const sessionDate = new Date(session.endTime);
      const goalStartDate = new Date(goal.startDate);
      
      // Check if session is within 7 days of goal start
      const diffTime = Math.abs(sessionDate.getTime() - goalStartDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays <= 7) {
        updated = true;
        return {
          ...goal,
          current: goal.current + session.wordsWritten,
          completed: goal.current + session.wordsWritten >= goal.target
        };
      }
    }

    return goal;
  });

  if (updated) {
    localStorage.setItem(`writingGoals_${userId}`, JSON.stringify(updatedGoals));
  }
};

// Analytics hooks
export const useWritingStats = (): WritingStats => {
  const { user } = useUser();
  const sessions = useWritingSessions();
  const [stats, setStats] = React.useState<WritingStats>({
    totalSessions: 0,
    totalTimeSpent: 0,
    totalWordsWritten: 0,
    averageWordsPerMinute: 0,
    mostProductiveTimeOfDay: 'unknown',
    mostProductiveDay: 'unknown',
    longestSession: 0,
    currentStreak: 0
  });

  React.useEffect(() => {
    if (user && sessions.length > 0) {
      // Calculate basic stats
      const totalSessions = sessions.length;
      const totalTimeSpent = sessions.reduce((total, session) => total + (session.endTime - session.startTime), 0);
      const totalWordsWritten = sessions.reduce((total, session) => total + session.wordsWritten, 0);
      
      // Calculate words per minute (only count sessions with words)
      const sessionsWithWords = sessions.filter(s => s.wordsWritten > 0);
      const totalMinutes = sessionsWithWords.reduce(
        (total, session) => total + (session.endTime - session.startTime) / 60000, 0
      );
      const averageWordsPerMinute = totalMinutes > 0 
        ? Math.round(totalWordsWritten / totalMinutes) 
        : 0;
      
      // Find longest session
      const longestSession = sessions.reduce(
        (longest, session) => Math.max(longest, session.endTime - session.startTime), 0
      );
      
      // Analyze most productive time of day
      const timeOfDayCounts = {
        morning: 0, // 5am-12pm
        afternoon: 0, // 12pm-5pm
        evening: 0, // 5pm-10pm
        night: 0 // 10pm-5am
      };
      
      sessions.forEach(session => {
        const hour = new Date(session.startTime).getHours();
        
        if (hour >= 5 && hour < 12) {
          timeOfDayCounts.morning += session.wordsWritten;
        } else if (hour >= 12 && hour < 17) {
          timeOfDayCounts.afternoon += session.wordsWritten;
        } else if (hour >= 17 && hour < 22) {
          timeOfDayCounts.evening += session.wordsWritten;
        } else {
          timeOfDayCounts.night += session.wordsWritten;
        }
      });
      
      const mostProductiveTimeOfDay = Object.entries(timeOfDayCounts)
        .reduce((most, [time, count]) => count > most.count ? { time, count } : most, { time: 'unknown', count: 0 })
        .time;
      
      // Analyze most productive day of week
      const dayOfWeekCounts = {
        Sunday: 0, Monday: 0, Tuesday: 0, Wednesday: 0, Thursday: 0, Friday: 0, Saturday: 0
      };
      
      sessions.forEach(session => {
        const day = new Date(session.startTime).toLocaleDateString('en-US', { weekday: 'long' });
        dayOfWeekCounts[day as keyof typeof dayOfWeekCounts] += session.wordsWritten;
      });
      
      const mostProductiveDay = Object.entries(dayOfWeekCounts)
        .reduce((most, [day, count]) => count > most.count ? { day, count } : most, { day: 'unknown', count: 0 })
        .day;
      
      // Calculate current streak
      const currentStreak = calculateCurrentStreak(sessions);
      
      setStats({
        totalSessions,
        totalTimeSpent,
        totalWordsWritten,
        averageWordsPerMinute,
        mostProductiveTimeOfDay,
        mostProductiveDay,
        longestSession,
        currentStreak
      });
    }
  }, [user, sessions]);

  return stats;
};

// Helper function to calculate current writing streak
const calculateCurrentStreak = (sessions: WritingSession[]): number => {
  if (sessions.length === 0) return 0;
  
  // Sort sessions by date (newest first)
  const sortedSessions = [...sessions].sort((a, b) => b.endTime - a.endTime);
  
  // Get unique days where writing happened
  const uniqueDays = new Set<string>();
  sortedSessions.forEach(session => {
    const day = new Date(session.endTime).toISOString().split('T')[0];
    uniqueDays.add(day);
  });
  
  const days = Array.from(uniqueDays).sort().reverse(); // newest first
  
  if (days.length === 0) return 0;
  
  // Check if today is included
  const today = new Date().toISOString().split('T')[0];
  if (days[0] !== today) return 0; // Streak broken if no writing today
  
  // Count consecutive days
  let streak = 1;
  for (let i = 0; i < days.length - 1; i++) {
    const current = new Date(days[i]);
    const prev = new Date(days[i + 1]);
    
    // Check if days are consecutive
    const diffTime = current.getTime() - prev.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
    } else {
      break; // Streak broken
    }
  }
  
  return streak;
}; 