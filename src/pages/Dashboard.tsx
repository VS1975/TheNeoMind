import { FiActivity, FiCheckCircle, FiClock, FiStar, FiTarget, FiCalendar } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();

  // Sample data - replace with actual data from your state/API
  const stats = [
    { name: 'Tasks Completed', value: '24', icon: FiCheckCircle, change: '+12%', changeType: 'increase' },
    { name: 'Productivity Score', value: '86', icon: FiActivity, change: '+8%', changeType: 'increase' },
    { name: 'Focus Time', value: '12h 45m', icon: FiClock, change: '+2h 15m', changeType: 'increase' },
  ];

  const recentActivities = [
    { id: 1, title: 'Completed morning routine', time: '2 hours ago', icon: FiCheckCircle },
    { id: 2, title: 'Added new goal: Learn React', time: '4 hours ago', icon: FiStar },
    { id: 3, title: 'Scheduled team meeting', time: '1 day ago', icon: FiClock },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, {currentUser?.displayName?.split(' ')[0] || 'User'} 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your productivity today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.name} className="rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.name}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <div className="rounded-lg p-3 bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
            </div>
            <div className="mt-4">
              <div className={`text-sm ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.change}
              </div>
              <p className="text-xs text-muted-foreground">vs yesterday</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className="rounded-full p-2 bg-primary/10">
                  <activity.icon className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center hover:bg-accent transition-colors">
              <div className="rounded-full bg-primary/10 p-3">
                <FiCheckCircle className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">New Task</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center hover:bg-accent transition-colors">
              <div className="rounded-full bg-primary/10 p-3">
                <FiTarget className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Set Goal</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center hover:bg-accent transition-colors">
              <div className="rounded-full bg-primary/10 p-3">
                <FiCalendar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Schedule</span>
            </button>
            <button className="flex flex-col items-center justify-center gap-2 rounded-lg border p-4 text-center hover:bg-accent transition-colors">
              <div className="rounded-full bg-primary/10 p-3">
                <FiStar className="h-5 w-5 text-primary" />
              </div>
              <span className="text-sm font-medium">Review</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
