import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RedirectToTodos = () => {
  let navigate = useNavigate();
  useEffect(() => {
    setTimeout(() => {
      navigate('/todos/in-progress');
    }, 0);
  }, [navigate]);

  return null;
};

export default RedirectToTodos;