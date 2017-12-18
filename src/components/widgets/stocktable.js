import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {STOCKBYWH} from '../../queries';
import {Table} from 'semantic-ui-react';

class StockTable extends Component {

  render() {
    if (this.props.data.loading) {
      return <div>Загрузка...</div>
    } else {
      //console.log(this.props.data.allStockBySpecViews.nodes);
      const data = this.props.data.allStockBySpecViews.nodes;
      const sumcount = data.reduce((p, c)=>{return {sum:parseInt(p.sum,10)+parseInt(c.sum,10), vol: parseFloat(p.vol)+parseFloat(c.vol)}}, {sum:0, vol:0} );
      
      if(data.length===0) {
        return(
          <Table>
            <Table.Header>
              <Table.Row key="header">
                <Table.HeaderCell>спецификация</Table.HeaderCell>
                <Table.HeaderCell collapsing>кол-во, шт.</Table.HeaderCell>
                <Table.HeaderCell collapsing>объем, м3</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              <Table.Row>
                <Table.Cell textAlign="center" colSpan={3}>
                  Склад пуст
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        )
      } else {
      return (
        <Table tableData = {data}
          headerRow = {
            <Table.Row key="header">
              <Table.HeaderCell>спецификация</Table.HeaderCell>
              <Table.HeaderCell collapsing>кол-во, шт.</Table.HeaderCell>
              <Table.HeaderCell collapsing>объем, м3</Table.HeaderCell>
            </Table.Row>
          }
          renderBodyRow = {(data, i ) => {
         return (<Table.Row key={i}>
            <Table.Cell>{data.specification}</Table.Cell>
            <Table.Cell  style={{textAlign:"right"}}>{data.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Table.Cell>
            <Table.Cell  style={{textAlign:"right"}}>{parseFloat(data.vol).toFixed(2)}</Table.Cell>
          </Table.Row>)
        }}
          footerRow = {
            <Table.Row key="footer">
              <Table.HeaderCell style={{textAlign:"right"}}>Итого:</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign:"right"}}>{sumcount.sum.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Table.HeaderCell>
              <Table.HeaderCell style={{textAlign:"right"}}>{sumcount.vol.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</Table.HeaderCell>
            </Table.Row>}
      />

      );
      }
    }
  }
}

export default graphql(STOCKBYWH, {
  options: (props) => ({
    variables: {
      "wh": props.wh
    },
    fetchPolicy: 'network-only'
  })
})(StockTable);
