"use client"
import { useState, useEffect } from 'react';
import { FaBullseye, FaRegCircleCheck , FaRegCircle, FaRegCircleDot  } from "react-icons/fa6";
import { IconType } from 'react-icons';
import axios from 'axios';
import Task from './task';

// Define the Task type
interface TaskType {
  _id: string;
  name: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

// Props for the TaskList component
interface TaskListProps {
  apiUrl?: string; // Optional API URL, could have a default in a real app
}

export default function TaskList({ apiUrl = 'api/tasks' }: TaskListProps) {
  const [tasks, setTasks] = useState<TaskType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to determine which icon to use based on status
  const getIconForStatus = (status: string): IconType => {
    switch (status) {
      case 'Completed':
        return FaRegCircleCheck ;
        // return FaBullseye;
      case 'Not Started':
        return FaRegCircle ;
      case 'In Progress':
        // return FaBullseye ;
      default:
        return FaBullseye;
    }
  };

  // Function to determine icon color based on status
  const getColorForStatus = (status: string): string => {
    switch (status) {
      case 'Completed':
        return 'text-green-500';
      case 'Not Started':
        return 'text-amber-500';
      case 'In Progress':
        // return 'text-blue-500';
      default:
        return 'text-blue-500';
    }
  };

  // Function to refresh the task list
  const refreshTasks = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        
        // Using axios to fetch data from the API
        const response = await axios.get<TaskType[]>(apiUrl);
        // console.log('Fetched tasks:', response.data);
        setTasks(response.data);
        setLoading(false);
        
      } catch (err) {
        console.error('Error fetching tasks:', err);
        setError(
          axios.isAxiosError(err) 
            ? err.response?.data?.message || err.message 
            : 'An unknown error occurred'
        );
        setLoading(false);
        
        // Fallback to mock data in development for easier testing
        if (process.env.NODE_ENV === 'development') {
          console.log('Using mock data as fallback in development');
          const mockData: TaskType[] = [
            {
              _id: '1',
              name: 'Complete Project Setup',
              description: 'Initialize Next.js project with Tailwind CSS and React Icons',
              status: 'Completed'
            },
            {
              _id: '2',
              name: 'Design Task Component',
              description: 'Create a reusable component for displaying tasks with customizable icons',
              status: 'In Progress'
            },
            {
              _id: '3',
              name: 'Implement Authentication',
              description: 'Add user authentication and authorization to the application',
              status: 'Not Started'
            }
          ];
          setTasks(mockData);
          setLoading(false);
        }
      }
    };

    fetchTasks();
  }, [apiUrl, refreshTrigger]);

  const retryFetch = () => {
    setError(null);
    setLoading(true);
    // Re-trigger the effect
    refreshTasks();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 my-4">
        <p className="text-red-700 dark:text-red-400">Error loading tasks: {error}</p>
        <button 
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 underline"
          onClick={retryFetch}
        >
          Try again
        </button>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-gray-500 dark:text-gray-400">No tasks found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6">
      {tasks.map((task, index) => (
        <Task
          key={task._id || `task-${index}`}
          id={task._id} // Pass id as a separate prop
          name={task.name || 'Unnamed Task'}
          description={task.description || 'No description'}
          status={task.status || 'In Progress'}
          icon={getIconForStatus(task.status)}
          iconColor={getColorForStatus(task.status)}
          onUpdate={refreshTasks} // Pass the refresh function to each Task
        />
      ))}
    </div>
  );
}