import React, { Component } from 'react';
import {Menu, Icon, Dropdown} from 'semantic-ui-react';
import {withApollo} from 'react-apollo';
import {STOCK} from '../../queries';
import download from 'downloadjs';

class StockToolBar extends Component {
  handleClick = () => {
    this.props.client.query({
      query: STOCK
    }).then(response => {
      //console.log(response.data.allStockBySpecViews.nodes);
      const data = response.data.allStockBySpecViews.nodes.map(i => ({specification:i.specification, warehouse: i.name, amount: i.vol}))
      const req_body = {
        "template": {
          "name": "Inventory"
        },
        "data": {
          "inventory":data
        }
      };
      //console.log(req_body);
      fetch("http://192.168.1.77:5488/api/report", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(req_body)
      }).then((response) => {
        return response.blob();
      }).then(response => {
        //console.log(response);
        download(response, (new Date().toLocaleDateString())+".xlsx", response.type);
      })

    }).catch(error => {
      alert(error)
    })
  }
  render() {
    console.log(this.props);
    return (
      <Menu attached='top'>
        <Dropdown item icon='clipboard' simple>
          <Dropdown.Menu>
            <Dropdown.Item>
              <Icon name='dropdown'/>
              <span className='text'>Отчёты</span>

              <Dropdown.Menu>
                <Dropdown.Item onClick={()=>this.handleClick()}>Остатки полуфабриката</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Menu>
    );
  }

}

export default withApollo(StockToolBar);
