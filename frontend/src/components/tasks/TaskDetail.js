import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../utils/axiosConfig';
import { Container, Card, Button, Alert, Form } from 'react-bootstrap';

function TaskDetail() {
  const [task, setTask] = useState(null);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const response = await axios.get(`/api/tasks/${id}/`);
      setTask(response.data);
    } catch (err) {
      setError('Failed to fetch task details');
    }
  };

  const handleInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`/api/tasks/${id}/`, task);
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError('Failed to update task');
    }
  };

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  if (!task) {
    return <div>Loading...</div>;
  }

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  };

  return (
    <Container className="mt-4">
      <h1>Detalles de la Tarea</h1>
      <Card>
        <Card.Body>
          {isEditing ? (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>Título</Form.Label>
                <Form.Control
                  type="text"
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Descripción</Form.Label>
                <Form.Control
                  as="textarea"
                  name="description"
                  value={task.description}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Fecha de vencimiento</Form.Label>
                <Form.Control
                  type="date"
                  name="due_date"
                  value={task.due_date}
                  onChange={handleInputChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Prioridad</Form.Label>
                <Form.Select
                  name="priority"
                  value={task.priority}
                  onChange={handleInputChange}
                >
                  <option value="low">Bajo</option>
                  <option value="medium">Mediano</option>
                  <option value="high">Alto</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Estado</Form.Label>
                <Form.Select
                  name="status"
                  value={task.status}
                  onChange={handleInputChange}
                >
                  <option value="pending">Pendiente</option>
                  <option value="in_progress">En Progreso</option>
                  <option value="completed">Finalizado</option>
                </Form.Select>
              </Form.Group>
              <Button variant="primary" type="submit" className="me-2">
                Guardar Cambios
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancelar
              </Button>
            </Form>
          ) : (
            <>
              <Card.Title>{task.title}</Card.Title>
              <Card.Text>{task.description}</Card.Text>
              <Card.Text>Fecha de vencimiento: {task.due_date}</Card.Text>
              <Card.Text>
                Prioridad: <span className={`text-${priorityColors[task.priority]}`}>{task.priority}</span>
              </Card.Text>
              <Card.Text>Estado: {task.status}</Card.Text>
              <Button variant="primary" onClick={() => navigate('/tasks')} className="me-2">
                Volver a tareas
              </Button>
              <Button variant="warning" onClick={() => setIsEditing(true)}>
                Editar tarea
              </Button>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
}

export default TaskDetail;