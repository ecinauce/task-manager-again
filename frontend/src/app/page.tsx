"use client"
import { useState } from "react";
import TaskList from "../components/tasklist";
import TaskReg from "../components/taskreg";

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Function to trigger a refresh of the task list
  const refreshTasks = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-10">Task Management</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Task Registration Form */}
          <div className="flex justify-center">
            <TaskReg onTaskAdded={refreshTasks} />
          </div>
          
          {/* Task List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-6">Your Tasks</h2>
            <TaskList key={refreshTrigger} />
          </div>
        </div>
      </div>
    </div>
  );
}