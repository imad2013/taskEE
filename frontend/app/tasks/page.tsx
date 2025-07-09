'use client';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, createTask, updateTask, deleteTask } from '../../redux/slices/tasksSlice';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { AppDispatch, RootState } from '../../redux/store';
import { Task, Project, TaskForm } from '../../types';

export default function TasksPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading } = useSelector((state: RootState) => state.tasks);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);
  
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [formData, setFormData] = useState<TaskForm>({
    title: '',
    description: '',
    status: 'PENDING',
  });

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingTask && editingTask.id) {
      await dispatch(updateTask({ id: editingTask.id, task: formData }));
      setEditingTask(null);
    } else {
      await dispatch(createTask(formData));
    }
    setFormData({ title: '', description: '', status: 'PENDING' });
    setShowForm(false);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      status: task.status,
      projectId: task.project?.id,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this task?')) {
      await dispatch(deleteTask(id));
    }
  };

  const canEdit = user?.roles?.includes('MANAGER') || user?.roles?.includes('ADMIN');
  const canDelete = user?.roles?.includes('ADMIN');

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Tasks</h2>
        {canEdit && (
          <button
            onClick={() => setShowForm(true)}
            style={{
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
            }}
          >
            Add Task
          </button>
        )}
      </div>

      {showForm && (
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
          <h3>{editingTask ? 'Edit Task' : 'Add Task'}</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                style={{ width: '100%', padding: 8, border: '1px solid #ccc' }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc', height: 100 }}
              />
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc' }}
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5 }}>Project</label>
              <select
                value={formData.projectId || ''}
                onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) || undefined })}
                style={{ width: '100%', padding: 8, border: '1px solid #ccc' }}
              >
                <option value="">Select Project</option>
                {projects.map((project: Project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                type="submit"
                style={{
                  padding: '10px 20px',
                  background: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                {editingTask ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingTask(null);
                  setFormData({ title: '', description: '', status: 'PENDING' });
                }}
                style={{
                  padding: '10px 20px',
                  background: '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 4,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <div style={{ display: 'grid', gap: 15 }}>
          {tasks.map((task: Task) => (
            <div
              key={task.id}
              style={{
                background: 'white',
                border: '1px solid #ddd',
                borderRadius: 8,
                padding: 15,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <h4 style={{ margin: '0 0 5px 0' }}>{task.title}</h4>
                <p style={{ margin: '0 0 5px 0', color: '#666' }}>{task.description}</p>
                <div style={{ display: 'flex', gap: 15, fontSize: '14px' }}>
                  <span>Status: {task.status}</span>
                  {task.project && <span>Project: {task.project.name}</span>}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                {canEdit && (
                  <button
                    onClick={() => handleEdit(task)}
                    style={{
                      padding: '5px 10px',
                      background: '#ffc107',
                      color: 'black',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Edit
                  </button>
                )}
                {canDelete && task.id && (
                  <button
                    onClick={() => handleDelete(task.id!)}
                    style={{
                      padding: '5px 10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: 4,
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 