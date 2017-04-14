import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
} from 'react-router-dom'
import './App.css';

import Organization from './components/Organization';
import Repo from './components/Repo';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Organization}/>
          <Route path="/repos/:owner/:repo" component={Repo}/>
        </div>
      </Router>
    );
  }
}

export default App;
