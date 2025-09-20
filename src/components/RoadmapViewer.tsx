import React from 'react';

interface RoadmapStep {
  step: number;
  title: string;
  description: string;
}

interface RoadmapViewerProps {
  roadmap: RoadmapStep[];
}

const RoadmapViewer: React.FC<RoadmapViewerProps> = ({ roadmap }) => {
  if (roadmap.length === 0) {
    return null;
  }

  return (
    <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-2xl font-bold mb-4 text-white">Your AI-Generated Roadmap</h3>
      <div className="space-y-4">
        {roadmap.map((item) => (
          <div key={item.step} className="p-4 bg-gray-700 rounded-lg">
            <h4 className="font-bold text-blue-400">Step {item.step}: {item.title}</h4>
            <p className="text-gray-300 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RoadmapViewer;
