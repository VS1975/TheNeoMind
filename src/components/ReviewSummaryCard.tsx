import { motion } from 'framer-motion';
import { FiTrendingUp, FiTarget, FiBarChart2, FiCheck } from 'react-icons/fi';

type MetricCardProps = {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
  description?: string;
};

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color, description }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`p-5 rounded-xl border bg-card ${color} transition-all hover:shadow-lg`}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {description && <p className="text-xs mt-1 opacity-80">{description}</p>}
      </div>
      <div className="p-2 rounded-lg bg-black/10">
        {icon}
      </div>
    </div>
  </motion.div>
);

interface ReviewSummaryCardProps {
  completedTasks: number;
  totalTasks: number;
  goalsAchieved: number;
  totalGoals: number;
  productivityScore: number;
  weekNumber: number;
  weekDates: string;
}

export const ReviewSummaryCard: React.FC<ReviewSummaryCardProps> = ({
  completedTasks,
  totalTasks,
  goalsAchieved,
  totalGoals,
  productivityScore,
  weekNumber,
  weekDates,
}) => {
  const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const goalAchievementRate = totalGoals > 0 ? Math.round((goalsAchieved / totalGoals) * 100) : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Week {weekNumber} Review</h2>
        <p className="text-muted-foreground">{weekDates}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Tasks Completed"
          value={`${completedTasks}/${totalTasks}`}
          description={`${taskCompletionRate}% completion`}
          icon={<FiCheck className="h-5 w-5" />}
          color="bg-blue-500/10 text-blue-500 border-blue-500/20"
        />
        
        <MetricCard
          title="Goals Achieved"
          value={`${goalsAchieved}/${totalGoals}`}
          description={`${goalAchievementRate}% of goals`}
          icon={<FiTarget className="h-5 w-5" />}
          color="bg-green-500/10 text-green-500 border-green-500/20"
        />
        
        <MetricCard
          title="Productivity"
          value={`${productivityScore}/10`}
          description="This week's score"
          icon={<FiTrendingUp className="h-5 w-5" />}
          color="bg-purple-500/10 text-purple-500 border-purple-500/20"
        />
        
        <MetricCard
          title="Weekly Trend"
          value={productivityScore > 7 ? "Excellent" : productivityScore > 5 ? "Good" : "Needs Improvement"}
          description="Performance"
          icon={<FiBarChart2 className="h-5 w-5" />}
          color="bg-amber-500/10 text-amber-500 border-amber-500/20"
        />
      </div>
    </div>
  );
};
