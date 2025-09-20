const OPENAI_API_KEY = 'YOUR_OPENAI_API_KEY'; // IMPORTANT: Replace with your key, preferably from environment variables

export const summarizeText = async (text: string): Promise<string> => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
    console.warn('OpenAI API key not configured. Returning placeholder summary.');
    // Return a placeholder summary for UI development without a key
    return new Promise(resolve => setTimeout(() => resolve('This is a placeholder AI summary.'), 1000));
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an expert at summarizing text concisely. Provide a summary of the following note in one or two sentences.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        max_tokens: 60,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error summarizing text:', error);
    throw error;
  }
};

export const generateGoalRoadmap = async (goal: string): Promise<any[]> => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
    console.warn('OpenAI API key not configured. Returning placeholder roadmap.');
    // Return a placeholder roadmap for development without an API key
    return new Promise(resolve => setTimeout(() => resolve([
      { step: 1, title: 'Understand the Basics', description: 'This is a placeholder step to learn the fundamentals.' },
      { step: 2, title: 'Build a Simple Project', description: 'Apply your knowledge by building a small application.' },
      { step: 3, title: 'Deploy and Share', description: 'Share your project with the world.' },
    ]), 1000));
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: `You are a world-class productivity coach and project planner. A user will provide a goal, and you must break it down into a clear, actionable roadmap. Return the output as a JSON array of objects, where each object has 'step', 'title', and 'description' keys. The JSON should be clean and ready for parsing. Do not include any text outside of the JSON array.`
          },
          {
            role: 'user',
            content: goal
          }
        ],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    // Attempt to parse the JSON response from the AI
    return JSON.parse(content);

  } catch (error) {
    console.error('Error generating goal roadmap:', error);
    throw error;
  }
};

export const generateWeeklyReview = async (tasks: string, notes: string): Promise<string> => {
  if (!OPENAI_API_KEY || OPENAI_API_KEY === 'YOUR_OPENAI_API_KEY') {
    console.warn('OpenAI API key not configured. Returning placeholder review.');
    return new Promise(resolve => setTimeout(() => resolve(
`**Weekly Review Summary:**

**Accomplishments:**
- Placeholder Task 1
- Placeholder Task 2

**Key Insights:**
- Placeholder insight from notes.

**Plan for Next Week:**
- Focus on placeholder objective.`
    ), 1000));
  }

  const prompt = `
    Based on the following tasks and notes from the past week, generate a concise weekly review in markdown format.
    The review should have three sections:
    1. A summary of accomplishments.
    2. Key insights from the notes.
    3. A brief, actionable plan for the next week.

    Tasks: ${tasks}
    Notes: ${notes}
  `;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 400,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating weekly review:', error);
    throw error;
  }
};
