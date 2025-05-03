import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('http://localhost:8000/', {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error proxying request:', error);
    return NextResponse.json(
      { message: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    // Extract the task data from the request body
    const taskData = await request.json();
    
    // Forward the POST request to your backend
    const response = await fetch('http://localhost:8000/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Failed to create task' },
        { status: response.status }
      );
    }
    
    // Return the response from the backend
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating task:', error);
    return NextResponse.json(
      { message: 'Failed to create task' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    // Get the URL from the request
    const url = new URL(request.url);
    // Extract the task ID from the query parameter
    const taskId = url.searchParams.get('id');
    
    if (!taskId) {
      return NextResponse.json(
        { message: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    // Extract task data from request body
    const taskData = await request.json();
    
    console.log(`Updating task ${taskId} with data:`, taskData);
    
    // Forward the request to your backend
    const response = await fetch(`http://localhost:8000/update/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Failed to update task' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error updating task:', error);
    return NextResponse.json(
      { message: 'Failed to update task' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    // Get the URL from the request
    const url = new URL(request.url);
    // Extract the task ID from the query parameter
    const taskId = url.searchParams.get('id');
    
    if (!taskId) {
      return NextResponse.json(
        { message: 'Task ID is required' },
        { status: 400 }
      );
    }
    
    console.log(`Deleting task ${taskId}`);
    
    // Forward the request to your backend
    const response = await fetch(`http://localhost:8000/delete/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { message: errorData.message || 'Failed to delete task' },
        { status: response.status }
      );
    }
    
    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}