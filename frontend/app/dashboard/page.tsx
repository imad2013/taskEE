'use client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks } from '../../redux/slices/tasksSlice';
import { fetchProjects } from '../../redux/slices/projectsSlice';
import { AppDispatch, RootState } from '../../redux/store';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { tasks, loading: tasksLoading } = useSelector((state: RootState) => state.tasks);
  const { projects, loading: projectsLoading } = useSelector((state: RootState) => state.projects);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchTasks());
    dispatch(fetchProjects());
  }, [dispatch]);

  const getTaskStats = () => {
    const total = tasks.length;
    const completed = tasks.filter(task => task.status === 'COMPLETED').length;
    const inProgress = tasks.filter(task => task.status === 'IN_PROGRESS').length;
    const pending = tasks.filter(task => task.status === 'PENDING').length;
    
    return { total, completed, inProgress, pending };
  };

  const stats = getTaskStats();

  return (
    <div>
      <h2>Dashboard</h2>
      <p>Welcome, {user?.username}!</p>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 30 }}>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <h3>Total Tasks</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#007bff' }}>{stats.total}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <h3>Completed</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#28a745' }}>{stats.completed}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <h3>In Progress</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#ffc107' }}>{stats.inProgress}</p>
        </div>
        <div style={{ background: '#f8f9fa', padding: 20, borderRadius: 8, textAlign: 'center' }}>
          <h3>Pending</h3>
          <p style={{ fontSize: 24, fontWeight: 'bold', color: '#dc3545' }}>{stats.pending}</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div>
          <h3>Recent Tasks</h3>
          {tasksLoading ? (
            <p>Loading tasks...</p>
          ) : (
            <div style={{ background: '#f8f9fa', padding: 15, borderRadius: 8 }}>
              {tasks.slice(0, 5).map((task) => (
                <div key={task.id} style={{ marginBottom: 10, padding: 10, background: 'white', borderRadius: 4 }}>
                  <strong>{task.title}</strong>
                  <br />
                  <small>Status: {task.status}</small>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div>
          <h3>Projects</h3>
          {projectsLoading ? (
            <p>Loading projects...</p>
          ) : (
            <div style={{ background: '#f8f9fa', padding: 15, borderRadius: 8 }}>
              {projects.slice(0, 5).map((project) => (
                <div key={project.id} style={{ marginBottom: 10, padding: 10, background: 'white', borderRadius: 4 }}>
                  <strong>{project.name}</strong>
                  <br />
                  <small>{project.description}</small>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 