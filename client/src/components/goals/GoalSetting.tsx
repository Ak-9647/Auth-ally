import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { useWritingGoals, useCreateGoal, useUpdateGoal, useDeleteGoal, WritingGoal } from '../../services/WritingAnalyticsService';
import { useDocuments, Document } from '../../services/ConvexStorageService';

interface GoalSettingProps {
  onGoalUpdated?: () => void;
}

const GoalSetting: React.FC<GoalSettingProps> = ({ onGoalUpdated }) => {
  const { isSignedIn } = useUser();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [goalType, setGoalType] = useState<'daily' | 'weekly' | 'project'>('daily');
  const [targetWords, setTargetWords] = useState<number>(500);
  const [documentId, setDocumentId] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedGoal, setSelectedGoal] = useState<WritingGoal | null>(null);
  
  const goals = useWritingGoals();
  const documents = useDocuments() as Document[];
  const createGoal = useCreateGoal();
  const updateGoal = useUpdateGoal();
  const deleteGoal = useDeleteGoal();

  // Format date for input field
  const formatDateForInput = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toISOString().split('T')[0];
  };

  // Calculate progress percentage
  const calculateProgress = (goal: WritingGoal): number => {
    if (goal.target === 0) return 0;
    return Math.min(Math.round((goal.current / goal.target) * 100), 100);
  };

  // Format date for display
  const formatDate = (timestamp: number): string => {
    return new Date(timestamp).toLocaleDateString();
  };

  // Handle opening the edit form for a goal
  const handleEditGoal = (goal: WritingGoal) => {
    setSelectedGoal(goal);
    setGoalType(goal.type);
    setTargetWords(goal.target);
    if (goal.documentId) {
      setDocumentId(goal.documentId);
    }
    if (goal.endDate) {
      setEndDate(formatDateForInput(goal.endDate));
    }
    setIsFormOpen(true);
  };

  // Handle goal creation
  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (selectedGoal) {
        // Update existing goal
        await updateGoal(selectedGoal.id, {
          type: goalType,
          target: targetWords,
          documentId: goalType === 'project' ? documentId : undefined,
          endDate: endDate ? new Date(endDate).getTime() : undefined
        });
      } else {
        // Create new goal
        await createGoal({
          type: goalType,
          target: targetWords,
          documentId: goalType === 'project' ? documentId : undefined,
          startDate: Date.now(),
          endDate: endDate ? new Date(endDate).getTime() : undefined
        });
      }
      
      // Reset form
      resetForm();
      
      // Notify parent component
      if (onGoalUpdated) {
        onGoalUpdated();
      }
    } catch (error) {
      console.error('Error creating/updating goal:', error);
    }
  };

  // Handle goal deletion
  const handleDeleteGoal = async (goalId: string) => {
    if (window.confirm('Are you sure you want to delete this goal?')) {
      try {
        await deleteGoal(goalId);
        
        // Notify parent component
        if (onGoalUpdated) {
          onGoalUpdated();
        }
      } catch (error) {
        console.error('Error deleting goal:', error);
      }
    }
  };

  // Reset form state
  const resetForm = () => {
    setSelectedGoal(null);
    setGoalType('daily');
    setTargetWords(500);
    setDocumentId('');
    setEndDate('');
    setIsFormOpen(false);
  };

  // Filter active goals
  const activeGoals = goals.filter(g => !g.completed);
  // Filter completed goals
  const completedGoals = goals.filter(g => g.completed);

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Writing Goals</h2>
        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-1 px-3 rounded-lg text-sm transition duration-300"
        >
          {isFormOpen ? 'Cancel' : '+ Add Goal'}
        </button>
      </div>

      {/* Goal creation/edit form */}
      {isFormOpen && (
        <form onSubmit={handleCreateGoal} className="mb-6 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Goal Type
              </label>
              <select
                value={goalType}
                onChange={(e) => setGoalType(e.target.value as 'daily' | 'weekly' | 'project')}
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              >
                <option value="daily">Daily Word Count</option>
                <option value="weekly">Weekly Word Count</option>
                <option value="project">Project Deadline</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Target Words
              </label>
              <input
                type="number"
                value={targetWords}
                onChange={(e) => setTargetWords(parseInt(e.target.value))}
                min="1"
                className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
            
            {goalType === 'project' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project
                </label>
                <select
                  value={documentId}
                  onChange={(e) => setDocumentId(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required
                >
                  <option value="">Select a document</option>
                  {documents.map((doc) => (
                    <option key={doc._id.id} value={doc._id.id}>
                      {doc.title || 'Untitled Document'}
                    </option>
                  ))}
                </select>
              </div>
            )}
            
            {goalType !== 'daily' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  required={goalType !== 'daily'}
                />
              </div>
            )}
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              type="button"
              onClick={resetForm}
              className="mr-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
            >
              {selectedGoal ? 'Update Goal' : 'Create Goal'}
            </button>
          </div>
        </form>
      )}

      {/* Active goals */}
      {activeGoals.length > 0 && (
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Active Goals</h3>
          <div className="space-y-4">
            {activeGoals.map((goal) => (
              <div key={goal.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {goal.type === 'daily' && 'Daily Goal'}
                      {goal.type === 'weekly' && 'Weekly Goal'}
                      {goal.type === 'project' && 'Project Goal'}
                      {goal.type === 'project' && goal.documentId && ': ' + 
                        (documents.find(d => d._id.id === goal.documentId)?.title || 'Untitled')}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {goal.current} / {goal.target} words 
                      {goal.endDate && ` • Due ${formatDate(goal.endDate)}`}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEditGoal(goal)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      title="Edit goal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      title="Delete goal"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                
                {/* Progress bar */}
                <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${calculateProgress(goal)}%` }}
                  ></div>
                </div>
                <p className="text-xs text-right mt-1 text-gray-600 dark:text-gray-400">
                  {calculateProgress(goal)}% complete
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Completed goals */}
      {completedGoals.length > 0 && (
        <div>
          <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-3">Completed Goals</h3>
          <div className="space-y-2">
            {completedGoals.map((goal) => (
              <div 
                key={goal.id} 
                className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 flex justify-between items-center"
              >
                <div>
                  <h4 className="font-medium text-gray-700 dark:text-gray-300">
                    {goal.type === 'daily' && 'Daily Goal'}
                    {goal.type === 'weekly' && 'Weekly Goal'}
                    {goal.type === 'project' && 'Project Goal'}
                    {goal.type === 'project' && goal.documentId && ': ' + 
                      (documents.find(d => d._id.id === goal.documentId)?.title || 'Untitled')}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-500">
                    {goal.target} words • Completed on {formatDate(goal.updatedAt || goal.startDate)}
                  </p>
                </div>
                <div className="flex items-center">
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs font-medium px-2.5 py-0.5 rounded-full flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Completed
                  </span>
                  <button
                    onClick={() => handleDeleteGoal(goal.id)}
                    className="ml-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    title="Remove goal"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 && (
        <div className="text-center py-6">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 mx-auto text-gray-400 dark:text-gray-600 mb-3"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 mb-3">You haven't set any writing goals yet.</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-300"
          >
            Create Your First Goal
          </button>
        </div>
      )}
    </div>
  );
};

export default GoalSetting; 