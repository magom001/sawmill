import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {DocDetailsQuery} from '../../../queries';
import {Table} from 'semantic-ui-react';
import StackInputForm from '../utils/stackinputform';
import DocDetail from '../utils/docdetail';
import DocTotals from '../utils/doctotals';

class ProductionReportDetailsTable extends Component {
  render() {
    if (this.props.data.loading) {
      return <div>Загрузка...</div>
    } else {
      const data = this.props.data.allDocdetails.nodes;
      let rows = data.map((d, i) => {
        return (
          <DocDetail
            data = {d}
            key={i} i={i}
            doctype = {parseInt(this.props.doctype, 10)}
            docyear = {parseInt(this.props.docyear, 10)}
            docnum = {parseInt(this.props.docnum, 10)}
           />
          // <Table.Row key={i}>
          //   <Table.Cell collapsing>{i+1}.</Table.Cell>
          //   <Table.Cell collapsing>{d.stackid}</Table.Cell>
          //   <Table.Cell>{d.stackByStackid.speciesBySpeciesid.name}</Table.Cell>
          //   <Table.Cell>{d.stackByStackid.dimensionByDimensionid.thicknessMm}*{d.stackByStackid.dimensionByDimensionid.widthMm}</Table.Cell>
          //   <Table.Cell>{d.stackByStackid.lengthByLengthid.lengthMm}</Table.Cell>
          //   <Table.Cell>{d.quantity}</Table.Cell>
          //   <Table.Cell>{stackvol}</Table.Cell>
          //   <Table.Cell></Table.Cell>
          // </Table.Row>
        )
      });
      return (
        <Table singleLine={true} size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>№ штабеля</Table.HeaderCell>
              <Table.HeaderCell>порода</Table.HeaderCell>
              <Table.HeaderCell>сечение, мм</Table.HeaderCell>
              <Table.HeaderCell>длина, мм</Table.HeaderCell>
              <Table.HeaderCell collapsing style={{textAlign: "right"}}>кол-во, шт.</Table.HeaderCell>
              <Table.HeaderCell collapsing style={{textAlign:"right"}}>объем, м3</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
            <StackInputForm doctype={this.props.doctype} docyear={this.props.docyear} docnum={this.props.docnum} wh={this.props.wh}  />
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>              
              <Table.HeaderCell colSpan='8'>
                <DocTotals data = {data} />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      );
    }
  }
}

export default graphql(DocDetailsQuery, {
  options: (props) => ({
    variables: {
      doctype: parseInt(props.doctype, 10),
      year: parseInt(props.docyear, 10),
      docnum: parseInt(props.docnum, 10)
    }
  })
})(ProductionReportDetailsTable);
