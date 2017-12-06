import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {graphql} from 'react-apollo';
import {ProductionReportsQuery} from '../../../queries/';
import {Table} from 'semantic-ui-react';

class ProductionReportsTable extends Component {
  handleRowClick = (doctype, docyear, docnum, wh) => {
    this.props.history.push(`/reports/production/${doctype}/${docyear}/${docnum}/${wh}`);
  }
  render() {
    if (this.props.data.loading) {
      return (
        <div>Загрузка...</div>
      )
    } else {
      const docs = this.props.data.allDocuments.nodes;
      let rows;
      if (docs.length === 0) {
        rows = <Table.Row>
          <Table.Cell colSpan={3} textAlign="center">Данных нет</Table.Cell>
        </Table.Row>
      } else {
        rows = docs.map((d, i) => {
          return (
            <Table.Row key={i} onClick={() => this.handleRowClick(d.doctype, d.docyear, d.docnum, d.wh)}>
              <Table.Cell>{d.doctypeByDoctype.docname}</Table.Cell>
              <Table.Cell>{d.docnum}/{d.docyear}</Table.Cell>
              <Table.Cell>{d.docdate}</Table.Cell>
            </Table.Row>
          )
        })
      }

      return (

        <Table celled selectable size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>документ</Table.HeaderCell>
              <Table.HeaderCell>№ документа</Table.HeaderCell>
              <Table.HeaderCell>дата документа</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body style={{
            cursor: 'pointer'
          }}>
            {rows}
          </Table.Body>
        </Table>

      );
    }
  }
}
ProductionReportsTable = withRouter(ProductionReportsTable);
export default graphql(ProductionReportsQuery, {
  options: (props) => ({
    variables: {
      "doctype": 1,
      "year": parseInt(props.year, 10),
      "month": parseInt(props.month, 10)
    }
  })
})(ProductionReportsTable);
