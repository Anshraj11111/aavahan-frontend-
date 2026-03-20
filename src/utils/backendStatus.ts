import { API_BASE_URL } from '../constants';

export const checkBackendStatus = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.ok;
  } catch (error) {
    console.warn('Backend server is not running:', error);
    return false;
  }
};

export const getBackendStatusMessage = async (): Promise<string> => {
  const isRunning = await checkBackendStatus();
  
  if (isRunning) {
    return 'Backend server is running';
  } else {
    return 'Backend server is not running. Please start it with: cd backend && npm run dev';
  }
};