import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Card from './components/Card/Card';
import Sidebar from './components/header/Header';
import CreateListing from './CreateListing';
import Home from './Home/Home';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <BrowserRouter>
      <Home/>
      <Toaster/>
    </BrowserRouter>
  );
}

export default App;
