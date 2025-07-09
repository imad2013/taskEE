import { store } from '../redux/store';
import { addTaskFromWebSocket, updateTaskFromWebSocket, removeTaskFromWebSocket } from '../redux/slices/tasksSlice';

let socket: WebSocket | null = null;

export function connectTaskWebSocket() {
  if (socket && socket.readyState === WebSocket.OPEN) {
    return;
  }

  socket = new WebSocket('ws://localhost:8080/ws/tasks');

  socket.onopen = () => {
    console.log('WebSocket connected');
  };

  socket.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      handleWebSocketMessage(data);
    } catch (error) {
      console.error('Error parsing WebSocket message:', error);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected');
    // Attempt to reconnect after 5 seconds
    setTimeout(() => {
      connectTaskWebSocket();
    }, 5000);
  };

  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
}

function handleWebSocketMessage(data: any) {
  switch (data.type) {
    case 'TASK_CREATED':
      store.dispatch(addTaskFromWebSocket(data.task));
      break;
    case 'TASK_UPDATED':
      store.dispatch(updateTaskFromWebSocket(data.task));
      break;
    case 'TASK_DELETED':
      store.dispatch(removeTaskFromWebSocket(data.taskId));
      break;
    default:
      console.log('Unknown WebSocket message type:', data.type);
  }
}

export function disconnectTaskWebSocket() {
  if (socket) {
    socket.close();
    socket = null;
  }
}

export function sendTaskUpdate(data: any) {
  if (socket && socket.readyState === WebSocket.OPEN) {
    socket.send(JSON.stringify(data));
  }
} 