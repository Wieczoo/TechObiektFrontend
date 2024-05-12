import React, { useState, useEffect } from 'react';
import statisticsImage from '../images/statistics_image.png';
import Button from '@mui/material/Button';
import '../components/css/footer.css';

const Footer: React.FC = () => {

    const handleStatisticsButtonClick = () => {
        window.location.href = 'https://stat.gov.pl'; 
      };


    return (
        <div className='footer'>
            <>
            <span>
                <p>Żródło danych:</p>
            </span>
            <Button variant="contained" className='dataSourceImage' onClick={handleStatisticsButtonClick}>
                <img src={statisticsImage} alt="Statistics" className="statistics-button-image" />
            </Button>
            </>
             <div className='projectCreators'>
                Technologie Objektowe 1ID22A, Partyk Żołowicz, Piotr Wieczorek
             </div>
        </div>
       
    )
}

export default Footer;