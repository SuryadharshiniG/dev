import logo from './logo.svg';
import './App.css';
import Header from './components/layouts/Header';
import Landing from './components/layouts/Landing';
import Footer from './components/layouts/Footer';
import Routers from './components/routers';
import { BrowserRouter } from 'react-router-dom';
import {useState} from "react";
function App() {
  const[appData,setAppData] = useState({appName: 'Devconnectors', });
 return(
  <>
  <BrowserRouter>
  <Header>appName={appData.appName}</Header>
  <Routers></Routers>
  <Footer></Footer>
  </BrowserRouter>
  
    </>
 )
 }
export default App; 
