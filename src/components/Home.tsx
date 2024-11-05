import React, { useState } from 'react';
import { Button, Modal, List, Input } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../app/store'; // Ensure this is the correct path to your store
import { addTodoAsync, removeTodoAsync, toggleTodoAsync } from '../app/TodoSlice';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons'; // Import icons

const Home: React.FC = () => {
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = (id: string) => {
    dispatch(removeTodoAsync(id) as any); // Dispatch the removeTodo action with the given ID
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTodoAsync(id) as any); // Dispatch the toggleTodo action with the given ID
  };

  const todos = useSelector((state: RootState) => state.todo.todos); // Get todos from the Redux store

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    const newTodo = {
      title: newTodoTitle,
      completed: false,
    };
    dispatch(addTodoAsync(newTodo) as any); // Dispatch the action to add the todo
    setNewTodoTitle(''); // Reset the input to an empty string
    setIsModalOpen(false); // Close the modal
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setNewTodoTitle('');
  };

  return (
    <>
      <Button type="primary" size='large' onClick={showModal} style={{ marginBottom: '16px', backgroundColor: 'black' }}>
        Add Todo
      </Button>
      <Modal title="Add Todo" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <Input
          showCount
          maxLength={20}
          value={newTodoTitle}
          onChange={(e) => setNewTodoTitle(e.target.value)}
          placeholder="Enter your todo"
        />
      </Modal>

      <List
        style={{
          width: '50%',
          margin: '0 auto',
          borderRadius: '8px',
          overflow: 'hidden',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          backgroundColor: '#f9f9f9',
        }}
        header={
          <div
            style={{
              fontFamily: 'fantasy',
              fontSize: '30px',
              textAlign: 'center',
              padding: '16px 0',
              backgroundColor: 'Black',
              color: '#fff',
              borderBottom: '1px solid #e0e0e0',
            }}
          >
            Todo List
          </div>
        }
        bordered
        dataSource={todos}
        renderItem={(todo) => (
          <List.Item
            style={{
              justifyContent: 'space-between',
              padding: '16px',
              borderBottom: '1px solid #e0e0e0',
              backgroundColor: todo.completed ? '#dff0d8' : '#fff',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f1f1f1';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = todo.completed ? '#dff0d8' : '#fff';
            }}
          >
            <span style={{ fontSize: '18px', fontWeight: '500', width: '200px' }}>{todo.title}</span>
            <span style={{ color: '#6c757d' }}>{todo.completed ? '(Completed)' : ''}</span>
            <span>
              {todo.completed ? (
                <CheckCircleOutlined
                  style={{ color: 'green', fontSize: '24px', cursor: 'pointer' }}
                  onClick={() => handleToggle(todo.id)}
                />
              ) : (
                <CloseCircleOutlined
                  style={{ color: 'red', fontSize: '24px', cursor: 'pointer' }}
                  onClick={() => handleToggle(todo.id)}
                />
              )}
            </span>
            <span>
              <Button
                type='primary'
                danger
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </Button>
            </span>
          </List.Item>
        )}
      />
    </>
  );
};

export default Home;
