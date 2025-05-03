import { NextResponse } from 'next/server';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    const taskData = await request.json();
    
    console.log(`Updating task ${taskId} with data:`, taskData);
    
    // Forward the PATCH request to your backend
    const response = await fetch(`http://localhost:8000/update/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error from backend: ${response.status}`, errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to update task' },
        { status: response.status }
      );
    }
    
    // Return the response from the backend
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

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const taskId = params.id;
    
    console.log(`Deleting task ${taskId}`);
    
    // Forward the DELETE request to your backend
    const response = await fetch(`http://localhost:8000/delete/${taskId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error(`Error from backend: ${response.status}`, errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to delete task' },
        { status: response.status }
      );
    }
    
    // Return success response
    return NextResponse.json({ success: true, message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json(
      { message: 'Failed to delete task' },
      { status: 500 }
    );
  }
}