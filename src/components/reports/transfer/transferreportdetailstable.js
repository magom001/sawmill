import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {DocDetailsQuery} from '../../../queries';
import {Table} from 'semantic-ui-react';
import StackTransferForm from '../utils/stacktransferform';
import DocTotals from '../utils/doctotals';
import DocDetail from '../utils/docdetail';
import MenuBar from '../utils/menubar';

class TransferReportDetailsTable extends Component {

  render() {
    if (this.props.ddquery.loading) {
      return <div>Загрузка...</div>
    } else {
      const data = this.props.ddquery.allDocdetails.nodes;
      //  let totalvol = 0.00;
      let rows = data.map((d, i) => {
        // let stackvol = parseFloat((d.stackByStackid.dimensionByDimensionid.thicknessMm*d.stackByStackid.dimensionByDimensionid.widthMm*d.stackByStackid.lengthByLengthid.lengthMm*d.quantity)/1000000000).toFixed(3);
        // totalvol +=parseFloat(stackvol);
        return (
          <DocDetail data={d} key={d.stackid} i={i} doctype={parseInt(this.props.doctype, 10)} docyear={parseInt(this.props.docyear, 10)} docnum={parseInt(this.props.docnum, 10)} wh={parseInt(this.props.wh, 10)} transfer={true}/>

        //  <Table.Row key={i}>
        //    <Table.Cell collapsing>{i+1}.</Table.Cell>
        //    <Table.Cell collapsing>{d.stackid}</Table.Cell>
        //    <Table.Cell>{d.stackByStackid.speciesBySpeciesid.name}</Table.Cell>
        //    <Table.Cell>{d.stackByStackid.dimensionByDimensionid.thicknessMm}*{d.stackByStackid.dimensionByDimensionid.widthMm}</Table.Cell>
        //    <Table.Cell>{d.stackByStackid.lengthByLengthid.lengthMm}</Table.Cell>
        //    <Table.Cell style={{textAlign: "right"}} collapsing>{d.quantity}</Table.Cell>
        //    <Table.Cell style={{textAlign: "right"}} collapsing>{d.stackVol.toFixed(3)}</Table.Cell>
        //    <Table.Cell></Table.Cell>
        //  </Table.Row>
        )
      })
      return (
        <Table singleLine={true} size="small">
          <Table.Header>
            <MenuBar doctype={this.props.doctype} docnum={this.props.docnum} docyear={this.props.docyear} wh={this.props.wh} />
            <Table.Row>
              <Table.HeaderCell></Table.HeaderCell>
              <Table.HeaderCell>№ штабеля</Table.HeaderCell>
              <Table.HeaderCell>порода</Table.HeaderCell>
              <Table.HeaderCell>сечение, мм</Table.HeaderCell>
              <Table.HeaderCell>длина, мм</Table.HeaderCell>
              <Table.HeaderCell collapsing style={{
                textAlign: "right"
              }}>кол-во, шт.</Table.HeaderCell>
              <Table.HeaderCell collapsing style={{
                textAlign: "right"
              }}>объем, м3</Table.HeaderCell>
              <Table.HeaderCell></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows}
            <StackTransferForm doctype={this.props.doctype} docyear={this.props.docyear} docnum={this.props.docnum} wh={this.props.wh}/>
          </Table.Body>
          <Table.Footer fullWidth>
            <Table.Row>
              <Table.HeaderCell colSpan='8'>
                <DocTotals data={data}/>
              </Table.HeaderCell>
            </Table.Row>
          </Table.Footer>
        </Table>
      );
    }
  }
}

export default compose(graphql(DocDetailsQuery, {
  name: 'ddquery',
  options: (props) => ({
    variables: {
      doctype: parseInt(props.doctype, 10),
      year: parseInt(props.docyear, 10),
      docnum: parseInt(props.docnum, 10)
    },
    fetchPolicy: 'network-only'
  })
}))(TransferReportDetailsTable);
