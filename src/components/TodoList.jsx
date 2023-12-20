import React, { useState, useEffect } from 'react';
import { Link, useParams } from "react-router-dom";
import { auth, db } from '../firebase-config';
import { addDoc, collection, query, where, doc, deleteDoc, setDoc, onSnapshot } from 'firebase/firestore';

const TodoList = () => {
  const { status } = useParams();
  let todoStatus = status;
  if (!status) {
    todoStatus = 'in-progress';
  }
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState({ id: null, task: '' });

  useEffect(() => {
    const fetchData = async () => { 
      const user = auth.currentUser;

      if (user) {
        let q = collection(db, 'todos');
        q = query(q, where('userId', '==', user.uid));

        if (todoStatus === 'done') {
          q = query(q, where('status', '==', 'Done'));
        } else {
          q = query(q, where('status', '==', 'In Progress'));
        }

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTodos(data);
        });

        return () => unsubscribe();
      }
    };
    
    fetchData();
  }, [db, todoStatus]);

  const addTodo = async () => {
    await addDoc(collection(db, 'todos'), {
      userId: auth.currentUser.uid,
      task,
      status: 'In Progress', 
    });
    setTask('');
  };

  const deleteTodo = async (id) => {
    await deleteDoc(doc(db, 'todos', id));
  };

  const startEdit = (id, currentTask) => {
    setEditTask({ id, task: currentTask });
  };

  const cancelEdit = () => {
    setEditTask({ id: null, task: '' });
  };

  const saveEdit = async () => {
    await setDoc(doc(db, 'todos', editTask.id), { task: editTask.task }, { merge: true });
    setEditTask({ id: null, task: '' });
  };

  const changeStatus = async (id, newStatus) => {
    await setDoc(doc(db, 'todos', id), { status: newStatus }, { merge: true });
  };

  const handleStatusChange = async (id, currentStatus) => {
    const newStatus = currentStatus === 'In Progress' ? 'Done' : 'In Progress';
    await changeStatus(id, newStatus);
  };

  return (
    <div className="todo-list">
      <div className="status-buttons">
        <Link to="/todos/done">
          <button className="status-btn">Done</button>
        </Link>
        <Link to="/todos/in-progress">
          <button className="status-btn">In Progress</button>
        </Link>
      </div>
      <ul className="todo-items">
        {todos.map((todo) => (
          <li key={todo.id}>
          {editTask.id === todo.id ? (
            <>
              <textarea
                value={editTask.task}
                onChange={(e) => setEditTask({ ...editTask, task: e.target.value })}
              />
              <button onClick={saveEdit}>Save</button>
              <button onClick={cancelEdit}>Cancel</button>
            </>
          ) : (
            <>
              {todo.task}
              <button onClick={() => deleteTodo(todo.id)}>Delete</button>
              <button onClick={() => startEdit(todo.id, todo.task)}>Edit</button>
              <button onClick={() => handleStatusChange(todo.id, todo.status)}>
                {todo.status === 'In Progress' ? 'Done' : 'In Progress'}
              </button>
            </>
          )}
        </li>
        ))}
      </ul>
      <footer className="todo-footer">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="todo-input"
        />
        <button onClick={addTodo} className="add-btn">Add Todo</button>
      </footer>
    </div>
  );
};

export default TodoList;