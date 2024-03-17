import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import './Home.css';


const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/height');
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <span className="data-text">DATA</span>
        </Toolbar>
      </AppBar>
      <div style={{ marginTop: '350px', textAlign: 'center' }}>
        <Button variant="contained" color="primary" onClick={handleButtonClick}>
          Height
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
