import React, {Component} from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import {Grid} from 'semantic-ui-react';
import ProductionReports from './production';
import ProductionReportDetails from './production/productionreportdetails';
import WriteOffReportDetails from './writeoff/writeoffreportdetails';
import WriteoffReports from './writeoff';
import TransferReports from './transfer';
import TransferReportDetails from './transfer/transferreportdetails';
import Test from '../Test';

class ReportsDashboard extends Component {

  render() {
    return (
      <Grid columns={2} divided>
        <Grid.Row>
          <Grid.Column width={4} textAlign="right">
            <Link to='/reports/production'>Отчеты о выпуске штабелей</Link><br />
            <Link to='/reports/transfer'>Отчеты о перемещении штабелей</Link><br />
            <Link to='/reports/writeoff'>Отчеты о списании пиломатериалов</Link>
          </Grid.Column>
          <Grid.Column width={11} textAlign="left">
            <Switch>
              <Route exact path='/reports' component={Test} />
              <Route exact path='/reports/production' component={ProductionReports} />
              <Route path='/reports/production/:doctype/:docyear/:docnum/:wh' component={ProductionReportDetails} />
              <Route exact path='/reports/writeoff' component={WriteoffReports} />
              <Route path='/reports/writeoff/:doctype/:docyear/:docnum/:wh' component={WriteOffReportDetails} />
              <Route exact path='/reports/transfer' component = {TransferReports} />
              <Route path='/reports/transfer/:doctype/:docyear/:docnum/:wh' component={TransferReportDetails} />
            </Switch>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

export default ReportsDashboard;
