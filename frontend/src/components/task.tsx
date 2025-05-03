import { useState } from "react";
import { FaBullseye, FaRegPenToSquare, FaFloppyDisk, FaX, FaTrash } from "react-icons/fa6";
import { IconType } from "react-icons";
import axios from "axios";

interface TaskProps {
  id?: string;
  name: string;
  description: string;
  status: string;
  icon?: IconType;
  iconColor?: string;
  onUpdate?: () => void; // Callback for when a task is updated
}

export default function Task({
  id,
  name,
  description,
  status,
  icon: Icon = FaBullseye,
  iconColor = "text-blue-500",
  onUpdate
}: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name,
    description,
    status
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setEditData(prev => ({
      ...prev,
      [name]: value
    }));
    // console.log(`Updated ${name} to ${value}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    // console.log(id);
    e.preventDefault();
    if (!id) return;
    
    setIsSubmitting(true);
    setError(null);

    try {
      // Use a query parameter instead of a path parameter
      await axios.patch(`/api/tasks?id=${id}`, editData);
      console.log(`Sent PATCH request for task ${id}`);
      
      // Exit edit mode and trigger refresh
      setIsEditing(false);
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error updating task:', err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : 'An unknown error occurred'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this task?')) return;
    
    setIsDeleting(true);
    setError(null);

    try {
      // Use a query parameter instead of a path parameter
      await axios.delete(`/api/tasks?id=${id}`);
      console.log(`Sent DELETE request for task ${id}`);
      
      // Trigger refresh to update the task list
      if (onUpdate) {
        onUpdate();
      }
    } catch (err) {
      console.error('Error deleting task:', err);
      setError(
        axios.isAxiosError(err)
          ? err.response?.data?.message || err.message
          : 'An unknown error occurred'
      );
      setIsDeleting(false);
    }
  };

  const cancelEdit = () => {
    setEditData({ name, description, status });
    setIsEditing(false);
    setError(null);
  };

  // Get status color
  const getStatusColor = () => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300';
      case 'In Progress':
        return 'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300';
      case 'Not Started':
      default:
        return 'bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300';
    }
  };

  if (isEditing) {
    return (
      <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-2 mb-3">
            <p className="text-red-700 dark:text-red-400 text-xs">{error}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="block text-xs font-medium mb-1">
              Task Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={editData.name}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="description" className="block text-xs font-medium mb-1">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={editData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-3">
            <label htmlFor="status" className="block text-xs font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={editData.status}
              onChange={handleChange}
              className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={cancelEdit}
              className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md flex items-center"
              disabled={isSubmitting}
            >
              <FaX className="mr-1" /> Cancel
            </button>
            <button
              type="submit"
              className="px-3 py-1 text-xs text-white bg-blue-500 hover:bg-blue-600 rounded-md flex items-center"
              disabled={isSubmitting}
            >
              <FaFloppyDisk className="mr-1" /> {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 group hover:shadow-lg transition-shadow">
      <div className="flex items-start">
        {/* Icon column */}
        <div className="mr-1 mt-1">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700">
            <Icon className={`h-4 w-4 ${iconColor}`} />
          </div>
        </div>
        
        {/* Content column */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-lg">{name}</h4>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsEditing(true)}
                className="text-gray-400 hover:text-blue-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Edit task"
              >
                <FaRegPenToSquare size={14} />
              </button>
              <button 
                onClick={handleDelete}
                className="text-gray-400 hover:text-red-500 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Delete task"
                disabled={isDeleting}
              >
                <FaTrash size={14} />
              </button>
            </div>
          </div>
          
          <div className="mt-2">
            {description && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{description}</p>
            )}
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusColor()}`}>
              {status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}