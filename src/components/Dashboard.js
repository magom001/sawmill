import React, {Component} from 'react';
import Stock from './widgets/stock';
import StackInfo from './widgets/stackinfo';
import {Grid, Button} from 'semantic-ui-react';

///DELETE LATER
import download from 'downloadjs';

class Dashboard extends Component {
  render() {
    return (
      <Grid>
        <Grid.Row>
          <Grid.Column width={10}>
            <Stock/>
          </Grid.Column>
          <Grid.Column width={6}>
            <StackInfo/>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }

}

export default Dashboard;
