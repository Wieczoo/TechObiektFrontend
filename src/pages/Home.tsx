import React from 'react';
import { useNavigate } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import './Home.css';
import heightImage from '../images/height_image.jpeg';
import educationImage from '../images/education_image.jpg';
import prisonersImage from '../images/prisoners_image.jpg';
import vaccinationImage from '../images/vaccination_image.jpg';
import statisticsImage from '../images/statistics_image.png';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleHeightButtonClick = () => {
    navigate('/height');
  };

  const handleEducationButtonClick = () => {
    navigate('/education');
  };

  const handlePrisonersButtonClick = () => {
    navigate('/prisoners');
  };

  const handleVaccinationButtonClick = () => {
    navigate('/vaccination');
  };

  const handleStatisticsButtonClick = () => {
    window.location.href = 'https://stat.gov.pl'; 
  };

  return (
    <div>
      <AppBar position="fixed">
        <Toolbar>
          <span className="data-text">DATA</span>
        </Toolbar>
      </AppBar>
      <div className="button-container">
        <div className="button-column">
          <div className="button-item">
            <Button variant="contained" color="primary" onClick={handleHeightButtonClick}>
              Height
              <img src={heightImage} alt="Height" className="button-image" />
              <div className="button-info">Informacje: Wzrost osób w wieku 0-14 lat</div>
            </Button>
          </div>
          <div className="button-item">
            <Button variant="contained" color="primary" onClick={handleEducationButtonClick}>
              Education
              <img src={educationImage} alt="Education" className="button-image" />
              <div className="button-info">Informacje: Edukacja w Polsce</div>
            </Button>
          </div>
        </div>
        <div className="button-column">
          <div className="button-item">
            <Button variant="contained" color="primary" onClick={handlePrisonersButtonClick}>
              Prisoners
              <img src={prisonersImage} alt="Prisoners" className="button-image" />
              <div className="button-info">Informacje: Liczba więźniów w Polsce</div>
            </Button>
          </div>
          <div className="button-item">
            <Button variant="contained" color="primary" onClick={handleVaccinationButtonClick}>
              Vaccination
              <img src={vaccinationImage} alt="Vaccination" className="button-image" />
              <div className="button-info">Informacje: Szczepienia w Polsce</div>
            </Button>
          </div>
        </div>
      </div>
      <div className="statistics-button-container"> {/* Kontener dla przycisku z obrazkiem */}
        <Button variant="contained" color="primary" onClick={handleStatisticsButtonClick}>
          <img src={statisticsImage} alt="Statistics" className="statistics-button-image" />
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
