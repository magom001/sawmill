import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {ALLWAREHOUSES} from '../../queries';
import StockTable from './stocktable';
import StockToolBar from './toolbar';
import {Grid, Menu} from 'semantic-ui-react';


class Stock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whid: 1
    }
  }
  handleItemClick = (e, {whid}) => {
    this.setState({whid});
  }
  render() {
    if (this.props.warehouses.loading) {
      return <div>Загрузка...</div>
    } else {
      const warehouses = this.props.warehouses.allWarehouses.nodes.map((wh, i) => {
        return <Menu.Item key={i} name={wh.name} whid={wh.id} active={this.state.whid === wh.id} onClick={this.handleItemClick}/>
      });
      return (
        <Grid style={{
          textAlign: "left"
        }}>
          <Grid.Row>
            <Grid.Column width={16}>
              <center>
                <h2>Остатки пиломатериалов на производственных участках</h2>
              </center>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={16}>
              <StockToolBar />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Menu fluid vertical tabular>
                {warehouses}
                {/* <Menu.Item name='bio' active={this.state.whid === 'bio'} onClick={this.handleItemClick}/>
                <Menu.Item name='pics' active={this.state.whid === 'pics'} onClick={this.handleItemClick}/>
                <Menu.Item name='companies' active={this.state.whid === 'companies'} onClick={this.handleItemClick}/>
                <Menu.Item name='links' active={this.state.whid === 'links'} onClick={this.handleItemClick}/> */}
              </Menu>
            </Grid.Column>

            <Grid.Column stretched width={10}>
              <StockTable wh={this.state.whid}/>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      );
    }
  }
}

export default compose(graphql(ALLWAREHOUSES, {name: 'warehouses'}))(Stock);
