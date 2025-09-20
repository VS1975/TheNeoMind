import React, { useState } from 'react';

interface GoalPlannerProps {
  onGoalSubmit: (goal: string) => void;
  loading: boolean;
}

const GoalPlanner: React.FC<GoalPlannerProps> = ({ onGoalSubmit, loading }) => {
  const [goal, setGoal] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goal.trim()) return;
    onGoalSubmit(goal);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4 text-white">What's your next big goal?</h2>
        <textarea
          className="w-full p-4 bg-gray-700 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          placeholder="e.g., Learn to build a full-stack web application in 3 months..."
          rows={3}
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button
          type="submit"
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 disabled:bg-gray-500"
          disabled={loading || !goal.trim()}
        >
          {loading ? 'Generating Roadmap...' : 'Create AI-Powered Roadmap'}
        </button>
      </form>
    </div>
  );
};

export default GoalPlanner;
