import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

function TaskForm({ addTask }) {
  const [task, setTask] = useState({
    title: '',
    description: '',
    due_date: '',
    priority: 'medium',
    status: 'pending'
  });

  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!task.title.trim()) {
      setError('El título es requerido');
      return;
    }

    try {
      await addTask(task);
      setTask({
        title: '',
        description: '',
        due_date: '',
        priority: 'medium',
        status: 'pending'
      });
    } catch (err) {
      setError('Error al crear la tarea. Por favor, intenta de nuevo.');
      console.error('Error details:', err);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      {error && <Alert variant="danger">{error}</Alert>}
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
          <option value="medium">Medio</option>
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
          <option value="in_progress">En progreso</option>
          <option value="completed">Completado</option>
        </Form.Select>
      </Form.Group>
      <Button variant="primary" type="submit">Agregar tarea</Button>
    </Form>
  );
}

export default TaskForm;