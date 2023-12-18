// import React, { useState, useEffect } from 'react';
// import { auth, db } from '../firebase-config'
// import { addDoc, setDoc, deleteDoc, doc, collection, query, where, onSnapshot } from 'firebase/firestore';

// const TodoList = () => {
//   const [todos, setTodos] = useState([]);
//   const [task, setTask] = useState('');
  

//   useEffect(() => {
//     const q = query(collection(db, 'todos'), where('userId', '==', auth.currentUser.uid));

//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
//       setTodos(data);
//     });

//     return () => unsubscribe();
//   }, [auth, db]);

//   const addTodo = async () => {
//     try {
//       const docRef = await addDoc(collection(db, 'todos'), {
//         userId: auth.currentUser.uid,
//         task,
//       });
//       console.log('Todo added with ID: ', docRef.id);
//       setTask('');
//     } catch (error) {
//       console.error('Error adding todo: ', error);
//     }
//   };

//   const deleteTodo = async (id) => {
//     try {
//       await deleteDoc(doc(db, 'todos', id));
//       console.log('Todo deleted successfully');
//     } catch (error) {
//       console.error('Error deleting todo: ', error);
//     }
//   };

  
  
  
  
  
  

//   return (
//     <div>
//       <ul>
//         {todos.map((todo) => (
//           <li key={todo.id}>
//             {todo.task}
//             <button onClick={() => deleteTodo(todo.id)}>Delete</button>
           
//           </li>
//         ))}
//       </ul>
//       <input type="text" value={task} onChange={(e) => setTask(e.target.value)} />
//       <button onClick={addTodo}>Add Todo</button>
//     </div>
//   );
// };

// export default TodoList;

// TodoList.jsx
import React, { useState, useEffect } from 'react';
import { auth, db } from '../firebase-config';
import { addDoc, collection, doc, deleteDoc, onSnapshot, setDoc } from 'firebase/firestore';

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [editTask, setEditTask] = useState({ id: null, task: '' });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'todos'), (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTodos(data);
    });

    return () => unsubscribe();
  }, [db]);

  const addTodo = async () => {
    await addDoc(collection(db, 'todos'), {
      userId: auth.currentUser.uid,
      task,
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

  return (
    <div>
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
