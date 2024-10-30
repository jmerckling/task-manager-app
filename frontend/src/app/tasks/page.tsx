'use client';
import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'axios';
import styles from './Tasks.module.css'; // Import CSS module

interface Task {
  id: number;
  title: string;
  description: string;
  status: boolean;
  due_date: string;
  isEditing?: boolean;
}

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState({ title: '', description: '', due_date: '' });
  const [originalTask, setOriginalTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    axios.get('http://localhost:8000/tasks/')
      .then(response => setTasks(response.data))
      .catch(error => console.error('Error fetching tasks:', error));
  };

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    taskId?: number
  ) => {
    const { name, value } = e.target;

    if (taskId !== undefined) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...task, [name]: value } : task
      ));
    } else {
      setNewTask({ ...newTask, [name]: value });
    }
  };

  const addTask = () => {
    axios.post('http://localhost:8000/tasks/', { ...newTask, status: false })
      .then(response => {
        setTasks([...tasks, response.data]);
        setNewTask({ title: '', description: '', due_date: '' });
      })
      .catch(error => console.error(error));
  };

  const toggleEditMode = (taskId: number) => {
    const taskToEdit = tasks.find(task => task.id === taskId);
    if (taskToEdit) setOriginalTask({ ...taskToEdit });

    setTasks(tasks.map(task =>
      task.id === taskId ? { ...task, isEditing: !task.isEditing } : task
    ));
  };

  const cancelEdit = (taskId: number) => {
    if (originalTask) {
      setTasks(tasks.map(task =>
        task.id === taskId ? { ...originalTask, isEditing: false } : task
      ));
    }
    setOriginalTask(null);
  };

  const saveTask = (taskId: number) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    axios.put(`http://localhost:8000/tasks/${taskId}`, taskToUpdate)
      .then(response => {
        setTasks(tasks.map(task => (task.id === taskId ? response.data : task)));
        toggleEditMode(taskId);
      })
      .catch(error => console.error('Error updating task:', error));
  };

  const toggleTaskStatus = (taskId: number) => {
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedTask = { ...taskToUpdate, status: !taskToUpdate.status };

    axios.put(`http://localhost:8000/tasks/${taskId}`, updatedTask)
      .then(response => {
        setTasks(tasks.map(task => (task.id === taskId ? response.data : task)));
      })
      .catch(error => console.error('Error updating task status:', error));
  };

  const deleteTask = (taskId: number) => {
    axios.delete(`http://localhost:8000/tasks/${taskId}`)
      .then(() => {
        setTasks(tasks.filter(task => task.id !== taskId));
      })
      .catch(error => console.error('Error deleting task:', error));
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Task Manager</h1>
      <div className={styles.inputContainer}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newTask.title}
          onChange={(e) => handleInputChange(e)}
          className={styles.input}
        />
        <input
          name="description"
          type="text"
          placeholder="Description"
          value={newTask.description}
          onChange={(e) => handleInputChange(e)}
          className={styles.input}
        />
        <input
          type="date"
          name="due_date"
          value={newTask.due_date}
          onChange={(e) => handleInputChange(e)}
          className={styles.input}
        />
        <button onClick={addTask} className={styles.addButton}>Add Task</button>
      </div>
      <div className={styles.taskListContainer}>
        <ul className={styles.taskList}>
          {tasks.map(task => (
            <li key={task.id} className={styles.taskItem}>
              {task.isEditing ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={(e) => handleInputChange(e, task.id)}
                    className={styles.input}
                  />
                  <input
                    name="description"
                    type="text"
                    value={task.description}
                    onChange={(e) => handleInputChange(e, task.id)}
                    className={styles.input}
                  />
                  <input
                    type="date"
                    name="due_date"
                    value={task.due_date}
                    onChange={(e) => handleInputChange(e, task.id)}
                    className={styles.input}
                  />
                  <button onClick={() => saveTask(task.id)} className={styles.saveButton}>Save</button>
                  <button onClick={() => cancelEdit(task.id)} className={styles.cancelButton}>Cancel</button>
                </>
              ) : (
                <>
                  <input
                    type="checkbox"
                    checked={task.status}
                    onChange={() => toggleTaskStatus(task.id)}
                    className={styles.checkbox}
                  />
                  {`${task.title} - ${task.description} (Due: ${task.due_date})`}
                  <button onClick={() => toggleEditMode(task.id)} className={styles.updateButton}>Update</button>
                  <button onClick={() => deleteTask(task.id)} className={styles.deleteButton}>Delete</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Tasks;
