import { useState, useEffect } from 'react';
import { FiRefreshCw, FiAward } from 'react-icons/fi';
import { generateWeeklyReview } from '../utils/gptUtils';
import { ReviewSummaryCard } from '../components/ReviewSummaryCard';
import { ReviewInsights } from '../components/ReviewInsights';

// Mock data - in a real app, this would come from your database/API
const MOCK_TASKS = [
  { id: '1', title: 'Project proposal', completed: true, date: '2025-08-10' },
  { id: '2', title: 'Team meeting', completed: true, date: '2025-08-11' },
  { id: '3', title: 'Code review', completed: true, date: '2025-08-12' },
  { id: '4', title: 'Deploy v1.1', completed: true, date: '2025-08-13' },
  { id: '5', title: 'Write documentation', completed: false, date: '2025-08-14' },
];

const MOCK_GOALS = [
  { id: 'g1', title: 'Complete project milestone', achieved: true },
  { id: 'g2', title: 'Improve test coverage', achieved: true },
  { id: 'g3', title: 'Update dependencies', achieved: false },
];

type InsightType = 'achievement' | 'improvement' | 'suggestion' | 'quote';

interface Insight {
  id: string;
  title: string;
  content: string;
  type: InsightType;
}

const MOCK_INSIGHTS: Insight[] = [
  {
    id: 'i1',
    title: 'Consistent Performance',
    content: 'You completed 4 out of 5 tasks this week, maintaining an 80% completion rate. Your consistency in meeting deadlines is impressive!',
    type: 'achievement',
  },
  {
    id: 'i2',
    title: 'Focus Area',
    content: 'Documentation was pushed to next week. Consider blocking time for documentation to avoid technical debt.',
    type: 'improvement',
  },
  {
    id: 'i3',
    title: 'Weekly Tip',
    content: 'Try time-blocking your calendar for deep work sessions to tackle complex tasks more effectively.',
    type: 'suggestion',
  },
  {
    id: 'i4',
    title: 'Quote of the Week',
    content: '\"The secret of getting ahead is getting started.\" - Mark Twain',
    type: 'quote',
  },
];

const Review = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [insights] = useState(MOCK_INSIGHTS);
  const [showFullReview, setShowFullReview] = useState(false);
  const [aiReview, setAiReview] = useState('');

  // Calculate metrics
  const completedTasks = MOCK_TASKS.filter(task => task.completed).length;
  const totalTasks = MOCK_TASKS.length;
  const goalsAchieved = MOCK_GOALS.filter(goal => goal.achieved).length;
  const totalGoals = MOCK_GOALS.length;
  const productivityScore = Math.min(10, Math.round((completedTasks / totalTasks) * 10));

  // Get current week number and date range
  const now = new Date();
  const weekNumber = Math.ceil((now.getDate() + new Date(now.getFullYear(), 0, 1).getDay()) / 7);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  
  const weekDates = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

  function formatDate(date: Date) {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  const generateAIReview = async () => {
    setIsLoading(true);
    try {
      // In a real app, you would pass actual tasks and notes
      const review = await generateWeeklyReview(
        MOCK_TASKS.map(t => `- [${t.completed ? 'x' : ' '}] ${t.title}`).join('\n'),
        MOCK_GOALS.map(g => `- ${g.achieved ? '✅' : '❌'} ${g.title}`).join('\n')
      );
      setAiReview(review);
    } catch (error) {
      console.error('Error generating review:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate AI review on component mount
  useEffect(() => {
    generateAIReview();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Weekly Review</h1>
        <p className="text-muted-foreground">Reflect on your progress and plan for the week ahead</p>
      </header>

      <div className="space-y-8">
        {/* Summary Cards */}
        <ReviewSummaryCard
          completedTasks={completedTasks}
          totalTasks={totalTasks}
          goalsAchieved={goalsAchieved}
          totalGoals={totalGoals}
          productivityScore={productivityScore}
          weekNumber={weekNumber}
          weekDates={weekDates}
        />

        {/* AI Insights */}
        <ReviewInsights insights={insights} />

        {/* Full AI Review */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FiAward className="h-5 w-5 text-amber-500" />
              AI-Powered Weekly Review
            </h3>
            <button
              onClick={generateAIReview}
              disabled={isLoading}
              className="text-sm text-primary hover:underline flex items-center gap-1 disabled:opacity-50"
            >
              <FiRefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
              Regenerate
            </button>
          </div>
          
          {isLoading ? (
            <div className="h-32 flex items-center justify-center">
              <div className="animate-pulse flex flex-col items-center gap-2">
                <FiRefreshCw className="h-6 w-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Generating your weekly insights...</p>
              </div>
            </div>
          ) : aiReview ? (
            <div className="bg-card border rounded-xl overflow-hidden">
              <div className="p-6">
                <div className="prose prose-invert max-w-none">
                  {showFullReview ? (
                    <div dangerouslySetInnerHTML={{ __html: aiReview.replace(/\n/g, '<br/>') }} />
                  ) : (
                    <div>
                      {aiReview.split('\n').slice(0, 3).join('\n')}
                      {aiReview.split('\n').length > 3 && (
                        <button
                          onClick={() => setShowFullReview(true)}
                          className="text-primary hover:underline mt-2 text-sm font-medium"
                        >
                          Read more...
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
              <div className="bg-muted/50 px-6 py-3 border-t flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  AI-generated insights based on your weekly activity
                </p>
                {showFullReview && (
                  <button
                    onClick={() => setShowFullReview(false)}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Show less
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed rounded-xl p-8 text-center">
              <p className="text-muted-foreground mb-4">No review generated yet</p>
              <button
                onClick={generateAIReview}
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary/50 disabled:opacity-50"
              >
                Generate Weekly Review
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Review;
