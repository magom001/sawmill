import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {graphql} from 'react-apollo';
import {LISTOFREPORTS} from '../../../queries/';
import {Table} from 'semantic-ui-react';

class WriteOffReportsTable extends Component {
  handleRowClick = (doctype, docyear, docnum, wh) => {
    this.props.history.push(`/reports/writeoff/${doctype}/${docyear}/${docnum}/${wh}`);
  }
  render() {
    if (this.props.data.loading) {
      return (
        <div>Загрузка...</div>
      )
    } else {
      const docs = this.props.data.allDocumentsViews.nodes;
      let rows;
      if (docs.length === 0) {
        rows = <Table.Row>
          <Table.Cell colSpan={4} textAlign="center">Данных нет</Table.Cell>
        </Table.Row>
      } else {
        rows = docs.map((d, i) => {
          return (
            <Table.Row key={i} onClick={() => this.handleRowClick(d.doctype, d.docyear, d.docnum, d.wh)}>
              <Table.Cell>{d.docname}</Table.Cell>
              <Table.Cell collapsing>{d.docnum}/{d.docyear}</Table.Cell>
              <Table.Cell collapsing>{d.docdate}</Table.Cell>
              <Table.Cell>{d.warehouse}</Table.Cell>
            </Table.Row>
          )
        })
      }

      return (

        <Table celled selectable size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>документ</Table.HeaderCell>
              <Table.HeaderCell collapsing>№ документа</Table.HeaderCell>
              <Table.HeaderCell collapsing>дата документа</Table.HeaderCell>
              <Table.HeaderCell>склад списания</Table.HeaderCell>
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
WriteOffReportsTable = withRouter(WriteOffReportsTable);
export default graphql(LISTOFREPORTS, {
  options: (props) => ({
    variables: {
      "category": "списание",
      "year": parseInt(props.year, 10),
      "month": parseInt(props.month, 10)
    },
    fetchPolicy: 'network-only'
  }),

})(WriteOffReportsTable);
