import React from 'react';
import MappingClient from './components/MakeRepere';
import { Switch, Route } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <Switch>
      <Route exact path="/" component={MappingClient}/>
    </Switch>
  );
}

export default App;
