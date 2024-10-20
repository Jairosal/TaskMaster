import React from 'react';
import TaskItem from './TaskItem';
import { Dropdown } from 'react-bootstrap';

const TaskList = ({ tasks, updateTask, deleteTask, changeTaskStatus, currentStatus, allStatuses }) => {
  return (
    <div>
      {tasks.map(task => (
        <div key={task.id} className="mb-3">
          <TaskItem
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
          {changeTaskStatus && allStatuses && (
            <Dropdown className="mt-2">
              <Dropdown.Toggle variant="primary" size="sm">
                Cambiar Estado
              </Dropdown.Toggle>
              <Dropdown.Menu>
                {Object.entries(allStatuses).map(([key, value]) => (
                  key !== currentStatus && (
                    <Dropdown.Item 
                      key={key} 
                      onClick={() => changeTaskStatus(task.id, key)}
                    >
                      Mover a {value}
                    </Dropdown.Item>
                  )
                ))}
              </Dropdown.Menu>
            </Dropdown>
          )}
        </div>
      ))}
    </div>
  );
};

export default TaskList;