import React, {Component} from 'react';
import {Table, Form, Dropdown, Button, Icon} from 'semantic-ui-react';
import {graphql, compose} from 'react-apollo';
import {STACKSINWH, DocDetailsQuery} from '../../../queries';
import {CREATEDOCDETAIL} from '../../../mutations';

class StackSelectForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      stackid: null,
      stackquantity: 0,
      quantity: 0
    }
  }
  submitForm = () => {
    const {doctype, docnum, docyear, wh} = this.props;
    console.log(doctype, docnum, docyear, wh);
    if (!this.state.stackid) {
      alert("Выберите штабель")
    } else if (!Number.isInteger(this.state.quantity)) {
      alert("Количество должно быть целым числом")
    } else if (this.state.quantity <= 0) {
      alert("Значение не может быть негативным или равным нулю")
    } else {
      this.props.createdocdetail({
        variables: {
          "input": {
            "docdetail": {
              "doctype": parseInt(doctype, 10),
              "docnum": parseInt(docnum, 10),
              "docyear": parseInt(docyear, 10),
              "wh": parseInt(wh, 10),
              "stackid": this.state.stackid,
              "quantity": this.state.quantity
            }
          }
        }
      }).then(({ data }) => {
        console.log(data);
      }).catch((error) => {
        alert(error.message);
      });
    }
  }
  selectStack = (v) => {
    let myindex = v.options.findIndex(i => i.value === v.value);
    let quantity = parseInt(v.options[myindex].quantity, 10);
    this.setState({stackid: v.value, quantity, stackquantity: quantity})
  }
  changeQuantity = (e) => {
    let quantity = Number.isInteger(parseInt(e.target.value, 10))
      ? Math.abs(parseInt(e.target.value, 10))
      : 0;
    quantity = quantity > this.state.stackquantity
      ? this.state.stackquantity
      : quantity;
    this.setState({quantity});
  }
  render() {
    if (this.props.stock.loading) {
      return (
        <Table.Row style={{
          cursor: 'default'
        }}>
          <Table.Cell colSpan={6}>Загрузка...</Table.Cell>
        </Table.Row>
      )
    } else {
      const stacks = this.props.stock.allStockViews.nodes.map((d, i) => {
        return {key: i, value: d.stackid, quantity: d.quantity, text: `${d.stackid}: ${d.species} ${d.size} - ${d.quantity} шт.`}
      });
      return (
        <Table.Row className="inline-form">
          <Table.Cell></Table.Cell>
          <Table.Cell colSpan={5}>
            <Dropdown style={{
              minWidth: "220px"
            }} compact placeholder='Штабель' fluid search selection options={stacks} onChange= {(d,v) => this.selectStack(v)}/>
          </Table.Cell>
          <Table.Cell>
            <Form.Input value={this.state.quantity} onChange= {(e) => this.changeQuantity(e)}/>
          </Table.Cell>
          <Table.Cell>
            <Button animated="fade" onClick={this.submitForm}>
              <Button.Content visible>Добавить</Button.Content>
              <Button.Content hidden>
                <Icon name='add circle'/>
              </Button.Content>
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    }
  }
}

export default compose(graphql(STACKSINWH, {
  name: 'stock',
  options: (props) => ({
    variables: {
      "wh": parseInt(props.wh, 10)
    },
    fetchPolicy: 'network-only'
  })
}), graphql(CREATEDOCDETAIL, {
  name: 'createdocdetail',
  options: (props) => ({
    refetchQueries: [
      {
        query: STACKSINWH,
        variables: {
          "wh": parseInt(props.wh, 10)
          // doctype: parseInt(props.doctype, 10),
          // year: parseInt(props.docyear, 10),
          // docnum: parseInt(props.docnum, 10)
        }
      }, {
        query: DocDetailsQuery,
        variables: {
          doctype: parseInt(props.doctype, 10),
          year: parseInt(props.docyear, 10),
          docnum: parseInt(props.docnum, 10)
        }
      }
    ]
  })
}))(StackSelectForm);
