import React, {useState, useRef} from 'react';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from 'react-router-dom';

import Navbar from './components/Navbar';
import IssueCred from './components/Issuer/IssueCred';
import IssuerLanding from './components/Issuer/IssuerLanding';
import Profile from './components/User/Profile';
import ExampleVerifyCred from './components/Verifier/ExampleVerifyCred';
import NonIssuer from './components/Issuer/NonIssuer';

function App() { 
  return (
    <Router>
    <Navbar/>
      <Routes>
          <Route exact path='/issuer/issuecred/:address' element={< IssueCred />}></Route>
          <Route exact path='/issuer' element={< IssuerLanding />}></Route>
          <Route exact path='/issuer/404' element={< NonIssuer />}></Route>
          <Route exact path='/user' element={< Profile />}></Route>
          <Route exact path='/verifier' element={< ExampleVerifyCred />}></Route>
      </Routes>
    </Router>
  );
}
export default App;
