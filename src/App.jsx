import React, { useState, useEffect } from 'react';
import { auth, db, provider } from './firebase-config'; 
import { signInWithPopup } from 'firebase/auth'
import TodoList from './components/TodoList';


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
    <div>
      {user ? (
        <>
          <p>Welcome, {user.email}!</p>
          <button onClick={handleLogout}>Logout</button>
          <TodoList db={db} auth={auth} />
         
        </>
      ) : (
        <button onClick={handleLogin}>Login with Google</button>
      )}
    </div>
  );
};

export default App;
