// Mock AI Analysis Service
// In a real app, this would call a Cloud Function or backend API using OpenAI/Gemini

export const analyzeComplaint = async (text, image) => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const lowerText = text.toLowerCase();

    let result = {
        category: 'General',
        sentiment: 0, // -1 to 1
        urgency: 'Low',
        summary: text.substring(0, 50) + '...'
    };

    // Simple Keyword Matching to simulate AI
    if (lowerText.includes('pothole') || lowerText.includes('road')) {
        result.category = 'Roads & Infrastructure';
        result.urgency = 'Medium';
    } else if (lowerText.includes('garbage') || lowerText.includes('trash') || lowerText.includes('clean')) {
        result.category = 'Sanitation';
        result.urgency = 'Low';
    } else if (lowerText.includes('light') || lowerText.includes('electric')) {
        result.category = 'Electrical';
        result.urgency = 'Medium';
    } else if (lowerText.includes('water') || lowerText.includes('leak')) {
        result.category = 'Water Supply';
        result.urgency = 'High';
    }

    // Sentiment Analysis Mock
    if (lowerText.includes('urgent') || lowerText.includes('dangerous') || lowerText.includes('accident')) {
        result.sentiment = -0.8;
        result.urgency = 'Critical';
    } else if (lowerText.includes('please') || lowerText.includes('help')) {
        result.sentiment = -0.3;
    }

    return result;
};
