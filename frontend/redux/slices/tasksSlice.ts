import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getStorageItem } from '../../utils/storage';
import { Task } from '../../types';

interface TasksState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TasksState = {
  tasks: [],
  loading: false,
  error: null,
};

const getAuthHeaders = () => {
  const token = getStorageItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };
};

export const fetchTasks = createAsyncThunk('tasks/fetchTasks', async () => {
  const response = await fetch('http://localhost:8080/api/tasks', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch tasks');
  }

  return response.json();
});

export const createTask = createAsyncThunk('tasks/createTask', async (task: Task) => {
  const response = await fetch('http://localhost:8080/api/tasks', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to create task');
  }

  return response.json();
});

export const updateTask = createAsyncThunk('tasks/updateTask', async ({ id, task }: { id: number; task: Task }) => {
  const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(task),
  });

  if (!response.ok) {
    throw new Error('Failed to update task');
  }

  return response.json();
});

export const deleteTask = createAsyncThunk('tasks/deleteTask', async (id: number) => {
  const response = await fetch(`http://localhost:8080/api/tasks/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete task');
  }

  return id;
});

const tasksSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTaskFromWebSocket: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    updateTaskFromWebSocket: (state, action: PayloadAction<Task>) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    removeTaskFromWebSocket: (state, action: PayloadAction<number>) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch tasks';
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.tasks.push(action.payload);
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(task => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.tasks = state.tasks.filter(task => task.id !== action.payload);
      });
  },
});

export const { addTaskFromWebSocket, updateTaskFromWebSocket, removeTaskFromWebSocket } = tasksSlice.actions;
export default tasksSlice.reducer; 