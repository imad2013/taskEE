export interface User {
  id?: number;
  username: string;
  roles: string;
}

export interface Project {
  id?: number;
  name: string;
  description?: string;
}

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: string;
  assignedTo?: User;
  project?: Project;
}

export interface TaskForm {
  title: string;
  description: string;
  status: string;
  projectId?: number;
} 