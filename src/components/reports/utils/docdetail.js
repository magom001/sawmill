import React, {Component} from 'react';
import {Table, Icon, Popup, Button} from 'semantic-ui-react';
import {UPDATEDOCDETAIL, CANCELTRANSFER} from '../../../mutations';
import {DocDetailsQuery, STACKSINWH} from '../../../queries';
import {graphql, compose} from 'react-apollo';

class DocDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      quantity_init: this.props.data.quantity,
      quantity: this.props.data.quantity,
      edit_mode: false
    }
  }

  cancelTransfer = () => {
    if (this.props.transfer) {
      this.props.canceltransfer({
        variables: {
          "input": {
            "docnum": parseInt(this.props.docnum, 10),
            "doctype": parseInt(this.props.doctype, 10),
            "docyear": parseInt(this.props.docyear, 10),
            "stack": this.props.data.stackid
          }
        }
      }).then(({data}) => {}).catch((error) => {
        alert(error.message);
      });
    }
  }

  updateQuantity = () => {
    if (!this.props.transfer) {
      if (this.state.quantity !== this.state.quantity_init) {
        this.props.updatedocdetail({
          variables: {
            "input": {
              "docnum": parseInt(this.props.docnum, 10),
              "doctype": parseInt(this.props.doctype, 10),
              "docyear": parseInt(this.props.docyear, 10),
              "stackid": this.props.data.stackid,
              "docdetailPatch": {
                "quantity": parseInt(this.state.quantity, 10)
              }
            }
          }
        }).then(({data}) => {
          this.setState({edit_mode: false})
        }).catch((error) => {
          alert(error.message);
        });
      }
    } else {
      alert("В отчете о перемещении невозможно изменить количество. Отмените перемещение и добавьте штабель вновь")
    }
  }
  render() {
    //console.log(this.props);
    let quantity_cell = '';
    if (this.state.edit_mode) {
      quantity_cell = <div>
        <input size={10} style={{
          margin: "0px",
          textAlign: "right",
          border: "0px",
          borderBottom: "1px dotted black"
        }} value={this.state.quantity} onChange={(e) => this.setState({
          quantity: Number.isInteger(parseInt(e.target.value, 10))
            ? Math.abs(parseInt(e.target.value, 10))
            : 0
        })}/>

        <Icon name="checkmark" style={{
          cursor: this.state.quantity_init !== this.state.quantity
            ? "pointer"
            : "default"
        }} disabled={this.state.quantity_init === this.state.quantity} onClick={(e) => this.state.quantity_init !== this.state.quantity
          ? this.updateQuantity()
          : null}/>
        <Icon name="cancel" style={{
          cursor: "pointer"
        }} onClick={(e) => this.setState({quantity: this.state.quantity_init, edit_mode: false})}/>
      </div>
    } else {
      quantity_cell = this.state.quantity
    }

    return (
      <Table.Row>
        <Table.Cell collapsing>{this.props.i + 1}.</Table.Cell>
        <Table.Cell collapsing>{this.props.data.stackid}</Table.Cell>
        <Table.Cell>{this.props.data.stackByStackid.speciesBySpeciesid.name}</Table.Cell>
        <Table.Cell>{this.props.data.stackByStackid.dimensionByDimensionid.thicknessMm}*{this.props.data.stackByStackid.dimensionByDimensionid.widthMm}</Table.Cell>
        <Table.Cell>{this.props.data.stackByStackid.lengthByLengthid.lengthMm}</Table.Cell>
        <Table.Cell onDoubleClick={() => this.setState({edit_mode: true})} collapsing style={{
          padding: "0px",
          textAlign: "right"
        }}>
          {quantity_cell}
        </Table.Cell>
        <Table.Cell style={{
          textAlign: "right"
        }}>{this.props.data.stackVol.toFixed(3)}</Table.Cell>
        <Table.Cell style={{
          textAlign: "center"
        }}>
          {this.props.transfer
            ? <Popup trigger={< Button size = "mini" color = 'red' icon = 'cancel' />} content={< Button size = "mini" label = "отменить перемещение" color = 'red' content = 'Подтвердить' onClick = {
                () => this.cancelTransfer()
              } />} on='click' position='top right'/>
            : null
}
        </Table.Cell>
      </Table.Row>
    );
  }

}

export default compose(graphql(UPDATEDOCDETAIL, {
  name: "updatedocdetail",
  options: (props) => ({
    refetchQueries: [
      {
        query: DocDetailsQuery,
        variables: {
          doctype: parseInt(props.doctype, 10),
          year: parseInt(props.docyear, 10),
          docnum: parseInt(props.docnum, 10)
        }
      }
    ]
  })
}), graphql(CANCELTRANSFER, {
  name: "canceltransfer",
  options: (props) => ({
    refetchQueries: [
      {
        query: DocDetailsQuery,
        variables: {
          doctype: parseInt(props.doctype, 10),
          year: parseInt(props.docyear, 10),
          docnum: parseInt(props.docnum, 10)
        }
      }, {
        query: STACKSINWH,
        variables: {
          "wh": parseInt(props.wh, 10)
        }
      }
    ]
  })
}))(DocDetail);
