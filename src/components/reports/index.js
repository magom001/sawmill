import React, {Component} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import {Grid} from 'semantic-ui-react';
import ProductionReports from './production';
import ProductionReportDetails from './production/productionreportdetails';
class ReportsDashboard extends Component {

  render() {
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column width={4} textAlign="right">
            <Link to='/reports/production'>Отчеты о выпуске штабелей</Link>
          </Grid.Column>
          <Grid.Column width={11} textAlign="left">
            <Switch>
              <Route exact path='/reports/production' component={ProductionReports} />
              <Route path='/reports/production/:doctype/:docyear/:docnum/:wh' component={ProductionReportDetails} />
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

export default ReportsDashboard;
