import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ReportsDashboard from './components/reports';
import NotFound from './components/NotFound';
class Main extends Component {

  render() {
    return (
          <Switch>
            <Route exact path='/' component={Dashboard}/>
            <Route path='/reports' component={ReportsDashboard}/>
            <Route path="*" component={NotFound}/>
          </Switch>
    )
  }
}

export default Main;
