import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { auth, db, provider } from './firebase-config';
import { signInWithPopup } from 'firebase/auth';
import TodoList from './components/TodoList';
import RedirectToTodos from "./components/RedirectToTodos";
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleLogout = () => {
    auth.signOut();
  };

  return (
    <div className="app">
      {user ? (
        <Router>
          <header className="app-header">
            <h1>Welcome, {user.email}!</h1>
            <p>{new Date().toDateString()}</p>
            <button onClick={handleLogout}>Logout</button>
          </header>
          <Routes>
           <Route path="/todos/:status" element={<TodoList db={db} auth={auth} />} />
           <Route path="*" element={<RedirectToTodos />} />
         </Routes>
        </Router>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default App;