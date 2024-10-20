import React, { useState } from 'react';
import { Card, Button, Form, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function TaskItem({ task, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTask, setEditedTask] = useState(task);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleInputChange = (e) => {
    setEditedTask({ ...editedTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateTask(editedTask);
    setIsEditing(false);
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    deleteTask(task.id);
    setShowDeleteModal(false);
  };

  const priorityColors = {
    low: 'success',
    medium: 'warning',
    high: 'danger'
  };

  if (isEditing) {
    return (
      <Card className="mb-3">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Titulo</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={editedTask.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Descripción</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={editedTask.description}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fecha de vencimiento</Form.Label>
              <Form.Control
                type="date"
                name="due_date"
                value={editedTask.due_date}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Prioridad</Form.Label>
              <Form.Select
                name="priority"
                value={editedTask.priority}
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
                value={editedTask.status}
                onChange={handleInputChange}
              >
                <option value="pending">Pendiente</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Finalizado</option>
              </Form.Select>
            </Form.Group>
            <Button variant="primary" type="submit" className="me-2">Guardar</Button>
            <Button variant="secondary" onClick={() => setIsEditing(false)}>Cancelar</Button>
          </Form>
        </Card.Body>
      </Card>
    );
  }

  return (
    <>
      <Card className="mb-3">
        <Card.Body>
          <Card.Title>{task.title}</Card.Title>
          <Card.Text>{task.description}</Card.Text>
          <Card.Text>Fecha de vencimimiento: {task.due_date}</Card.Text>
          <Card.Text>
            Prioridad: <span className={`text-${priorityColors[task.priority]}`}>{task.priority}</span>
          </Card.Text>
          <Card.Text>Estado: {task.status}</Card.Text>
          <Link to={`/tasks/${task.id}`} className="btn btn-info btn-sm me-2">Ver</Link>
          <Button variant="warning" size="sm" className="me-2" onClick={() => setIsEditing(true)}>Editar</Button>
          <Button variant="danger" size="sm" onClick={handleDelete}>Eliminar</Button>
        </Card.Body>
      </Card>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmar eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>¿Estás seguro de que quieres eliminar esta tarea?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default TaskItem;