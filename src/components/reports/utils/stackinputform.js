import React, {Component} from 'react';
import {Table, Form, Dropdown, Button, Icon} from 'semantic-ui-react';
import {graphql, compose} from 'react-apollo';
import {AllSpecies, AllDimensions, AllLengths, DocDetailsQuery} from '../../../queries';
import {CreateNewStack} from '../../../mutations';

class StackInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',
      speciesid: 1,
      dimensionid: null,
      lengthid: null,
      quantity: 0
    }
  }
  submitForm = () => {
    const {docnum, doctype, wh, docyear} = this.props;
    const {id, speciesid, dimensionid, lengthid, quantity} = this.state;
    if(id===null || id==='') {
      alert("Введите номер штабеля!");
    } else if (speciesid===null) {
      alert("Выберите породу!");
    } else if(dimensionid===null){
      alert("Выберите сечение!");
    } else if(lengthid ===null) {
      alert("Выберите длину!");
    } else if(quantity===null || quantity===0) {
      alert("Введите количество досок в штабель!");
    } else {
      this.props.createnewstack({
        variables: {
          "input": {
            "fdoctype": parseInt(doctype, 10),
            "fdocnum": parseInt(docnum, 10),
            "fdocyear": parseInt(docyear, 10),
            "fwh": parseInt(wh, 10),
            "fstackid": id,
            "fspeciesid": parseInt(speciesid,10),
            "fdimensionid": parseInt(dimensionid,10),
            "flengthid": parseInt(lengthid, 10),
            "fquantity": parseInt(quantity,10)
          }
        },
      }).then(({ data }) => {
        this.setState({id:'',speciesid:1,dimensionid:null,lengthid:1, quantity:0});
      }).catch((error) => {
        console.log('there was an error sending the query', error);
      });
    }
  }
  render() {
    if (this.props.allspecies.loading || this.props.alldimensions.loading || this.props.alllengths.loading) {
      return (
        <Table.Row style={{
          cursor: 'default'
        }}>
          <Table.Cell colSpan={6}>Загрузка...</Table.Cell>
        </Table.Row>
      )
    } else {
      const species = this.props.allspecies.allSpecies.nodes.map((d)=>{
        return {value:d.id, text:d.name}
      });
      const dims = this.props.alldimensions.allDimensions.nodes.map((d)=>{
        return {value:d.id, text: `${d.thicknessMm}*${d.widthMm}`}
      });
      const lengths = this.props.alllengths.allLengths.nodes.map((d)=>{
        return {value:d.id, text: d.lengthMm}
      });
      return (
        <Table.Row className="inline-form">
          <Table.Cell></Table.Cell>
          <Table.Cell><Form.Input style={{width:"110px"}} type="text" placeholder='№ штабеля' value={this.state.id} onChange={(e)=>this.setState({id:e.target.value})}/></Table.Cell>
          <Table.Cell><Dropdown style={{minWidth:"220px"}} compact placeholder='Породу' fluid search selection value={this.state.speciesid} options={species} onChange={(e,d)=>this.setState({speciesid:d.value})}/></Table.Cell>
          <Table.Cell><Dropdown style={{minWidth:"150px"}} placeholder="Сечение" fluid search selection options={dims} value={this.state.dimensionid} onChange={(e,d)=>this.setState({dimensionid:d.value})} /></Table.Cell>
          <Table.Cell><Dropdown style={{minWidth:"100px"}} placeholder="Длина" fluid search selection options={lengths} value={this.state.lengthid} onChange={(e,d)=>this.setState({lengthid:d.value})} /></Table.Cell>
          <Table.Cell><Form.Input style={{width:"10 0px"}} type="text" pattern="^[ 0-9]+$" placeholder='Кол-во, шт.' value={this.state.quantity} onChange={(e)=>this.setState({quantity:e.target.value})} /></Table.Cell>
          <Table.Cell></Table.Cell>
          <Table.Cell>
            <Button animated="fade" onClick={this.submitForm}>
              <Button.Content visible>Добавить</Button.Content>
              <Button.Content hidden>
                <Icon name='add circle' />
              </Button.Content>
            </Button>
          </Table.Cell>
        </Table.Row>
      );
    }
  }
}

export default compose(
  graphql(AllSpecies, {name: 'allspecies'}),
  graphql(AllDimensions, {name:'alldimensions'}),
  graphql(AllLengths, {name:'alllengths'}),
  graphql(CreateNewStack, {name:'createnewstack',
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
  })
)(StackInputForm);
