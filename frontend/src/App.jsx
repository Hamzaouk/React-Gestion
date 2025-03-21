import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Projects from './components/Projects';
import AboutUs from './components/AboutUs';
import Footer from './components/Footer';
import Tasks from './components/Tasks';
import Resources from './components/Resources';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/tasks" element={<Tasks />} />
          <Route path="/resources" element={<Resources />} />
        </Routes>
      </div>
      {/* <Footer /> */}
    </Router>
  );
}

export default App;