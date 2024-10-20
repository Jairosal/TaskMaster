import React, { useState, useEffect } from 'react';
import axios from '../../utils/axiosConfig';
import TaskList from './TaskList';
import TaskForm from './TaskForm';
import { Container, Row, Col, Alert, Button } from 'react-bootstrap';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks/');
      setTasks(response.data);
    } catch (err) {
      setError('No se pudieron obtener las tareas');
      console.error('Error fetching tasks:', err);
    }
  };

  const addTask = async (task) => {
    try {
      const response = await axios.post('/api/tasks/', task);
      setTasks([...tasks, response.data]);
      setSuccess('Tarea agregada exitosamente');
      setError('');
      setShowForm(false);
    } catch (err) {
      console.error('Error adding task:', err);
      if (err.response && err.response.data) {
        setError(`Error al agregar tarea: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Error al agregar tarea. Por favor, intenta de nuevo.');
      }
      setSuccess('');
    }
  };

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`/api/tasks/${updatedTask.id}/`, updatedTask);
      setTasks(tasks.map(task => task.id === updatedTask.id ? updatedTask : task));
      setSuccess('Tarea actualizada exitosamente');
      setError('');
    } catch (err) {
      setError('Error al actualizar tarea');
      console.error('Error updating task:', err);
      setSuccess('');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}/`);
      setTasks(tasks.filter(task => task.id !== taskId));
      setSuccess('Tarea eliminada exitosamente');
      setError('');
    } catch (err) {
      setError('No se pudo eliminar la tarea');
      console.error('Error deleting task:', err);
      setSuccess('');
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <Container className="mt-4">
      <h1>Tarea nueva</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Button className="mb-3" onClick={() => setShowForm(!showForm)}>
        {showForm ? 'Ocultar formulario' : 'Agregar tarea'}
      </Button>
      {showForm && <TaskForm addTask={addTask} />}
      <Row>
        <Col md={4}>
          <h2>Pendiente</h2>
          <TaskList
            tasks={pendingTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        </Col>
        <Col md={4}>
          <h2>En progreso</h2>
          <TaskList
            tasks={inProgressTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        </Col>
        <Col md={4}>
          <h2>Finalizado</h2>
          <TaskList
            tasks={completedTasks}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default TaskManager;