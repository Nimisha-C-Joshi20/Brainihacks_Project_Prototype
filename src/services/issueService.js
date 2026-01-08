// Mock Issue Service using LocalStorage

const STORAGE_KEY = 'civic_issues_data';

const initialIssues = [
    {
        id: 1,
        title: 'Deep Pothole on Main St',
        description: 'Large pothole causing traffic slowdowns.',
        status: 'Pending',
        date: '2023-10-24',
        urgency: 'High',
        category: 'Roads',
        location: { address: 'Main St & 5th' }
    },
    {
        id: 2,
        title: 'Street Light Broken',
        description: 'Light flickering constantly.',
        status: 'Resolved',
        date: '2023-10-20',
        urgency: 'Medium',
        category: 'Electrical',
        location: { address: 'Oak Avenue' }
    }
];

export const getIssues = () => {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialIssues));
        return initialIssues;
    }
    return JSON.parse(data);
};

export const addIssue = (issue) => {
    const issues = getIssues();
    const newIssue = {
        ...issue,
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        status: 'Pending'
    };
    issues.unshift(newIssue);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    return newIssue;
};

export const updateIssueStatus = (id, status) => {
    const issues = getIssues();
    const index = issues.findIndex(i => i.id === id);
    if (index !== -1) {
        issues[index].status = status;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(issues));
    }
};
