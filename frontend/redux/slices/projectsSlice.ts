import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getStorageItem } from '../../utils/storage';
import { Project } from '../../types';

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  projects: [],
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

export const fetchProjects = createAsyncThunk('projects/fetchProjects', async () => {
  const response = await fetch('http://localhost:8080/api/projects', {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch projects');
  }

  return response.json();
});

export const createProject = createAsyncThunk('projects/createProject', async (project: Project) => {
  const response = await fetch('http://localhost:8080/api/projects', {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error('Failed to create project');
  }

  return response.json();
});

export const updateProject = createAsyncThunk('projects/updateProject', async ({ id, project }: { id: number; project: Project }) => {
  const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(project),
  });

  if (!response.ok) {
    throw new Error('Failed to update project');
  }

  return response.json();
});

export const deleteProject = createAsyncThunk('projects/deleteProject', async (id: number) => {
  const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to delete project');
  }

  return id;
});

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch projects';
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.projects.push(action.payload);
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        const index = state.projects.findIndex(project => project.id === action.payload.id);
        if (index !== -1) {
          state.projects[index] = action.payload;
        }
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.projects = state.projects.filter(project => project.id !== action.payload);
      });
  },
});

export default projectsSlice.reducer; 