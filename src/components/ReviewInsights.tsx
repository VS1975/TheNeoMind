import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiChevronDown, 
  FiChevronUp, 
  FiStar, 
  FiAward, 
  FiTrendingUp, 
  FiZap, 
  FiMessageSquare 
} from 'react-icons/fi';
import { useState } from 'react';

interface InsightCardProps {
  title: string;
  content: string;
  defaultOpen?: boolean;
  icon?: React.ReactNode;
}

export const InsightCard: React.FC<InsightCardProps> = ({
  title,
  content,
  defaultOpen = true,
  icon = <FiStar className="h-4 w-4 text-amber-500" />,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-accent/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {icon}
          <h3 className="font-medium">{title}</h3>
        </div>
        {isOpen ? (
          <FiChevronUp className="h-5 w-5 text-muted-foreground" />
        ) : (
          <FiChevronDown className="h-5 w-5 text-muted-foreground" />
        )}
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0">
              <div className="prose prose-sm prose-invert max-w-none">
                {content.split('\n').map((paragraph, i) => (
                  <p key={i} className="mb-3 last:mb-0">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ReviewInsightsProps {
  insights: Array<{
    id: string;
    title: string;
    content: string;
    type: 'achievement' | 'improvement' | 'suggestion' | 'quote';
  }>;
}

export const ReviewInsights: React.FC<ReviewInsightsProps> = ({ insights }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'achievement':
        return <FiAward className="h-4 w-4 text-green-500" />;
      case 'improvement':
        return <FiTrendingUp className="h-4 w-4 text-blue-500" />;
      case 'suggestion':
        return <FiZap className="h-4 w-4 text-purple-500" />;
      case 'quote':
        return <FiMessageSquare className="h-4 w-4 text-amber-500" />;
      default:
        return <FiStar className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <FiStar className="h-5 w-5 text-amber-500" />
        AI-Generated Insights
      </h3>
      
      <div className="space-y-3">
        {insights.map((insight) => (
          <InsightCard
            key={insight.id}
            title={insight.title}
            content={insight.content}
            icon={getIcon(insight.type)}
          />
        ))}
      </div>
    </div>
  );
};
