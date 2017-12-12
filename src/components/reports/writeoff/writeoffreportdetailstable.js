import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {DocDetailsQuery} from '../../../queries';
import {Table} from 'semantic-ui-react';
import StackSelectForm from '../utils/stackselectform';

class WriteOffReportDetailsTable extends Component {
  render() {
    if (this.props.data.loading) {
      return <div>Загрузка...</div>
    } else {
      const data = this.props.data.allDocdetails.nodes;
      let totalvol = 0.00;
      let rows = data.map((d, i) => {
        let stackvol = parseFloat((d.stackByStackid.dimensionByDimensionid.thicknessMm*d.stackByStackid.dimensionByDimensionid.widthMm*d.stackByStackid.lengthByLengthid.lengthMm*d.quantity)/1000000000).toFixed(3);
        totalvol +=parseFloat(stackvol);
        return (
          <Table.Row key={i}>
            <Table.Cell collapsing>{i+1}.</Table.Cell>
            <Table.Cell collapsing>{d.stackid}</Table.Cell>
            <Table.Cell>{d.stackByStackid.speciesBySpeciesid.name}</Table.Cell>
            <Table.Cell>{d.stackByStackid.dimensionByDimensionid.thicknessMm}*{d.stackByStackid.dimensionByDimensionid.widthMm}</Table.Cell>
            <Table.Cell>{d.stackByStackid.lengthByLengthid.lengthMm}</Table.Cell>
            <Table.Cell>{d.quantity}</Table.Cell>
            <Table.Cell>{stackvol}</Table.Cell>
            <Table.Cell></Table.Cell>
          </Table.Row>
        )
      })
      return (
        <Table celled singleLine={true} size="small">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>№ штабеля</Table.HeaderCell>
              <Table.HeaderCell>порода</Table.HeaderCell>
              <Table.HeaderCell>сечение, мм</Table.HeaderCell>
              <Table.HeaderCell>длина, мм</Table.HeaderCell>
              <Table.HeaderCell>кол-во, шт.</Table.HeaderCell>
              <Table.HeaderCell>объем, м3</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
            <StackSelectForm doctype={this.props.doctype} docyear={this.props.docyear} docnum={this.props.docnum} wh={this.props.wh}  />
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell colSpan='7'>Количество выпущенных штабелей: {data.length} | объем: {totalvol.toFixed(3)} </Table.HeaderCell>
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
})(WriteOffReportDetailsTable);
