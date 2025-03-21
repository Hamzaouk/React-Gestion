import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import img from '../assets/man-factory.jpg';
import Projects from './Projects'; 

function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="relative w-full h-[calc(100vh-100px)] overflow-hidden">
        <img 
          src={img} 
          alt="Workers"
          className="w-full h-full object-cover" 
        />

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2">
          <button 
            onClick={() => navigate('/about-us')} 
            className="bg-red-500 hover:bg-red-600 text-white py-3 px-6 rounded-full text-lg"
          >
            Discover More
          </button>
        </div>
      </div>
      
      <Projects />
    </div>
  );
}

export default Home;