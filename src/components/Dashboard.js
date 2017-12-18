import React, {Component} from 'react';
import Stock from './widgets/stock';
import StackInfo from './widgets/stackinfo';
import {Grid, Menu} from 'semantic-ui-react';

class Dashboard extends Component {

  render() {
    return (
      <Grid>
        <Grid.Column width={10}>
          <Stock/>
        </Grid.Column>
        <Grid.Column width={6}>
          <StackInfo/>
        </Grid.Column>
      </Grid>
    );
  }

}

export default Dashboard;
