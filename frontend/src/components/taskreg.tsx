"use client"
import { useState } from 'react';
import axios from 'axios';
import { FaPlus } from 'react-icons/fa6';

interface TaskFormData {
  name: string;
  description: string;
  status: 'Completed' | 'In Progress' | 'Not Started';
}

interface TaskRegProps {
  apiUrl?: string;
  onTaskAdded?: () => void; // Callback for when a task is successfully added
}

export default function TaskReg({ 
  apiUrl = 'api/tasks', 
  onTaskAdded 
}: TaskRegProps) {
  const [formData, setFormData] = useState<TaskFormData>({
    name: '',
    description: '',
    status: 'Not Started'
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate form data
      if (!formData.name.trim()) {
        throw new Error('Task name is required');
      }

      // Send POST request to API
      await axios.post(apiUrl, formData);
      
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        status: 'Not Started'
      });
      
      setSuccess('Task added successfully!');
      
      // Call the callback if provided
      if (onTaskAdded) {
        onTaskAdded();
      }
    } catch (err) {
      console.error('Error adding task:', err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : err instanceof Error 
            ? err.message 
            : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-md w-full">
      <h2 className="text-xl font-bold mb-4 flex items-center">
        <FaPlus className="mr-2 text-blue-500" />
        Register New Task
      </h2>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}
      
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4">
          <p className="text-green-700 text-sm">{success}</p>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Task Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task name"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter task description"
          />
        </div>
        
        <div className="mb-6">
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isSubmitting 
              ? 'bg-blue-300 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Adding Task...' : 'Add Task'}
        </button>
      </form>
    </div>
  );
}