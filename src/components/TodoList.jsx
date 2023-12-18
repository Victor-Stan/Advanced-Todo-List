import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { addDoc, collection, query, where, doc, deleteDoc, onSnapshot, setDoc } from 'firebase/firestore';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState({ id: null, task: '' });
  const [statusFilter, setStatusFilter] = useState(null);

  useEffect(() => {
    const fetchData = async () => { 
      const user = auth.currentUser;

      if (user) {
        const q = query(
          collection(db, 'todos'),
          where('userId', '==', user.uid),
          statusFilter ? where('status', '==', statusFilter) : null
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
          setTodos(data);
        });

        return () => unsubscribe();
      }
    };

    fetchData();
  }, [db, statusFilter]);

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
    <div>
      <div>
        <button onClick={() => setStatusFilter('Done')}>Done</button>
        <button onClick={() => setStatusFilter('In Progress')}>In Progress</button>
        
      </div>
      <ul>
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
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button onClick={addTodo}>Add Todo</button>
    </div>
  );
};

export default TodoList;
