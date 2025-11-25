// api.ts
const API_BASE_URL = 'http://localhost:5000/api';

// Function to get the token from localStorage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Generic function to make API requests with authentication
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<any> => {
  const token = getToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Try to get error details from the response body
    let errorMessage = `API request failed: ${response.statusText}`;
    try {
      const errorBody = await response.json();
      if (errorBody.message) {
        errorMessage = `${errorMessage} - ${errorBody.message}`;
      }
    } catch (e) {
      // If response is not JSON, use the status text
    }
    throw new Error(errorMessage);
  }

  return response.json();
};

// Specific API functions for each resource
export const scheduleAPI = {
  get: async () => {
    const data = await apiRequest('/schedule');
    // Map server field names to frontend field names
    return data.map((item: any) => ({
      ...item,
      courseName: item.course, // Map course to courseName
      day: item.day ? item.day.toLowerCase() : item.day // Convert day back to lowercase for frontend
    }));
  },
  create: async (data: any) => {
    // Map field names and format to match the server model expectations
    const formattedData = {
      ...data,
      course: data.courseName, // Map courseName to course
      day: data.day ? capitalizeFirstLetter(data.day) : data.day, // Capitalize day name
      createdBy: 'system' // In a real app, this would be the logged-in user's ID
    };
    // Remove the original courseName field to avoid confusion
    delete formattedData.courseName;
    const result = await apiRequest('/schedule', { method: 'POST', body: JSON.stringify(formattedData) });
    // Map server field names to frontend field names in the response
    return {
      ...result,
      courseName: result.course, // Map course to courseName
      day: result.day ? result.day.toLowerCase() : result.day // Convert day back to lowercase for frontend
    };
  },
  update: async (id: string, data: any) => {
    // Map field names and format for updates as well
    const formattedData = {
      ...data,
      course: data.courseName, // Map courseName to course
      day: data.day ? capitalizeFirstLetter(data.day) : data.day, // Capitalize day name
    };
    // Remove the original courseName field to avoid confusion
    if (formattedData.courseName) {
      delete formattedData.courseName;
    }
    const result = await apiRequest(`/schedule/${id}`, { method: 'PUT', body: JSON.stringify(formattedData) });
    // Map server field names to frontend field names in the response
    return {
      ...result,
      courseName: result.course, // Map course to courseName
      day: result.day ? result.day.toLowerCase() : result.day // Convert day back to lowercase for frontend
    };
  },
  delete: (id: string) => apiRequest(`/schedule/${id}`, { method: 'DELETE' }),
};

// Helper function to capitalize first letter of each word
function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const assignmentAPI = {
  get: () => apiRequest('/assignments'),
  create: (data: any) => {
    // Include createdBy in the request
    const dataWithCreator = {
      ...data,
      createdBy: 'system' // In a real app, this would be the logged-in user's ID
    };
    return apiRequest('/assignments', { method: 'POST', body: JSON.stringify(dataWithCreator) });
  },
  update: (id: string, data: any) => apiRequest(`/assignments/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleCompletion: (id: string, completed: boolean) => apiRequest(`/assignments/${id}/complete`, { method: 'PATCH', body: JSON.stringify({ completed }) }),
  delete: (id: string) => apiRequest(`/assignments/${id}`, { method: 'DELETE' }),
};

export const activityAPI = {
  get: () => apiRequest('/activities'),
  create: (data: any) => {
    // Include createdBy in the request
    const dataWithCreator = {
      ...data,
      createdBy: 'system' // In a real app, this would be the logged-in user's ID
    };
    return apiRequest('/activities', { method: 'POST', body: JSON.stringify(dataWithCreator) });
  },
  update: (id: string, data: any) => apiRequest(`/activities/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/activities/${id}`, { method: 'DELETE' }),
  register: (id: string, data: any) => apiRequest(`/activities/${id}/register`, { method: 'POST', body: JSON.stringify(data) }),
};

export const externalInfoAPI = {
  get: () => apiRequest('/external-info'),
  create: (data: any) => {
    // Include postedBy in the request (which corresponds to createdBy in the model)
    const dataWithCreator = {
      ...data,
      postedBy: 'system' // In a real app, this would be the logged-in user's ID
    };
    return apiRequest('/external-info', { method: 'POST', body: JSON.stringify(dataWithCreator) });
  },
  update: (id: string, data: any) => apiRequest(`/external-info/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/external-info/${id}`, { method: 'DELETE' }),
};

export const forumAPI = {
  get: () => apiRequest('/forum/posts'),
  create: (data: any) => {
    // In a real app, this would include the logged-in user's ID
    return apiRequest('/forum/posts', { method: 'POST', body: JSON.stringify(data) });
  },
  update: (id: string, data: any) => apiRequest(`/forum/posts/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  delete: (id: string) => apiRequest(`/forum/posts/${id}`, { method: 'DELETE' }),
  addComment: (id: string, comment: any) => apiRequest(`/forum/posts/${id}/comments`, { method: 'POST', body: JSON.stringify(comment) }),
  toggleLike: (id: string) => apiRequest(`/forum/posts/${id}/upvote`, { method: 'PUT' }),
};