import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import axios from '../../utils/axiosConfig';
import TaskList from '../tasks/TaskList';

const Dashboard = () => {
  const [taskStats, setTaskStats] = useState({
    total: 0,
    pending: 0,
    in_progress: 0,
    completed: 0
  });
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const TASK_STATES = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Finalizado'
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks/');
      setTasks(response.data);
      updateTaskStats(response.data);
    } catch (error) {
      console.error('Error al obtener tareas:', error);
      setError('No se pudieron obtener las tareas');
    }
  };

  const updateTaskStats = (tasks) => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(task => task.status === 'pending').length,
      in_progress: tasks.filter(task => task.status === 'in_progress').length,
      completed: tasks.filter(task => task.status === 'completed').length
    };
    setTaskStats(stats);
  };

  const updateTask = async (updatedTask) => {
    try {
      await axios.put(`/api/tasks/${updatedTask.id}/`, updatedTask);
      const updatedTasks = tasks.map(task => task.id === updatedTask.id ? updatedTask : task);
      setTasks(updatedTasks);
      updateTaskStats(updatedTasks);
      setSuccess('Tarea actualizada exitosamente');
      setError('');
    } catch (err) {
      setError('Error al actualizar la tarea');
      setSuccess('');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}/`);
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      setTasks(updatedTasks);
      updateTaskStats(updatedTasks);
      setSuccess('Tarea eliminada exitosamente');
      setError('');
    } catch (err) {
      setError('Error al eliminar la tarea');
      setSuccess('');
    }
  };

  const changeTaskStatus = async (taskId, newStatus) => {
    try {
      const taskToUpdate = tasks.find(task => task.id === taskId);
      if (taskToUpdate) {
        const updatedTask = { ...taskToUpdate, status: newStatus };
        await updateTask(updatedTask);
      }
    } catch (err) {
      setError('Error al cambiar el estado de la tarea');
      setSuccess('');
    }
  };

  const pendingTasks = tasks.filter(task => task.status === 'pending');
  const inProgressTasks = tasks.filter(task => task.status === 'in_progress');
  const completedTasks = tasks.filter(task => task.status === 'completed');

  return (
    <Container className="mt-4">
      <Row className="mb-4">
        <Col>
          <h1>Bienvenido</h1>
        </Col>
      </Row>
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}
      <Row>
        <Col md={3}>
          <Card className="mb-4 text-center">
            <Card.Body>
              <Card.Title>Total de tareas</Card.Title>
              <Card.Text as="h2">{taskStats.total}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center bg-info text-white">
            <Card.Body>
              <Card.Title>Pendientes</Card.Title>
              <Card.Text as="h2">{taskStats.pending}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center bg-warning text-white">
            <Card.Body>
              <Card.Title>En progreso</Card.Title>
              <Card.Text as="h2">{taskStats.in_progress}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="mb-4 text-center bg-success text-white">
            <Card.Body>
              <Card.Title>Finalizado</Card.Title>
              <Card.Text as="h2">{taskStats.completed}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Pendiente</Card.Header>
            <Card.Body>
              <TaskList
                tasks={pendingTasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                changeTaskStatus={changeTaskStatus}
                currentStatus="pending"
                allStatuses={TASK_STATES}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">En Progreso</Card.Header>
            <Card.Body>
              <TaskList
                tasks={inProgressTasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                changeTaskStatus={changeTaskStatus}
                currentStatus="in_progress"
                allStatuses={TASK_STATES}
              />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card>
            <Card.Header as="h5">Finalizado</Card.Header>
            <Card.Body>
              <TaskList
                tasks={completedTasks}
                updateTask={updateTask}
                deleteTask={deleteTask}
                changeTaskStatus={changeTaskStatus}
                currentStatus="completed"
                allStatuses={TASK_STATES}
              />
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Dashboard;