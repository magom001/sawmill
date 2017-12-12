import React, {Component} from 'react';
import {Button, Modal, Form, Message} from 'semantic-ui-react';
import {graphql, compose} from 'react-apollo';
import {withRouter} from 'react-router-dom';
import {ALLEMPLOYEES, DOCTYPES, ALLWAREHOUSES} from '../../../queries';
import {CREATETRANSFERDOCUMENT} from '../../../mutations';

class NewTransferDocModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      year: (new Date()).getFullYear(),
      month: (new Date()).getMonth() + 1,
      day: (new Date()).getDate(),
      doctype: this.props.doctype,
      wh: this.props.wh,
      wh_to: 0,
      employee: 0,
      error: ''
    }
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.doctypes.loading) {
      this.setState({doctype: nextProps.doctypes.allDoctypes.nodes[0].id})
    }
  }

  handleSubmit = () => {
    if (this.state.employee === null || this.state.employee === 0) {
      this.setState({error: "Выберите сотрудника, составившего отчет"})
    } else {
      const {
        doctype,
        year,
        month,
        day,
        wh,
        wh_to,
        employee
      } = this.state;
      this.props.createtransferdocument({
        variables: {
          "input": {
            "doctype": parseInt(doctype, 10),
            "year": parseInt(year, 10),
            "fromWh": parseInt(wh, 10),
            "toWh": parseInt(wh_to,10),
            "e": parseInt(employee, 10),
            "dd": `${year}-${month}-${day}`
          }
        }
      }).then(({data}) => {
        console.log('got data', data);
        const {doctype, docyear, docnum, wh} = data.moveStackDocument.document;
        this.props.history.push(`/reports/transfer/${doctype}/${docyear}/${docnum}/${wh}`);
      }).catch((error) => {
        this.setState({error: "Произошла ошибка"});
      });
    }
  }
  changeDoctype = (doctype) => {
    this.setState({doctype});
  }
  changeDay = (day) => {
    this.setState({day});
  }
  changeYear = (year) => {
    this.setState({year});
  }
  changeMonth = (month) => {
    this.setState({month});
  }
  render() {
    let error = '';
    if (this.state.error !== '') {
      error = <Message negative>
        <Message.Header>Ошибка</Message.Header>
        <p>{this.state.error}</p>
      </Message>
    } else {
      error = '';
    }
    if (this.props.allemployees.loading || this.props.doctypes.loading || this.props.allwarehouses.loading) {
      return (
        <Modal trigger={< Button > Новый отчёт < /Button>}>
          <Modal.Header>Создать новый отчёт</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Form loading>
                Загрузка...
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      )
    } else {
      const employees = this.props.allemployees.allEmployees.nodes.map((e, i) => {
        return {key: i, value: e.id, text: `${e.lastname} ${e.firstname} ${e.middlename}`}
      });
      const doctypes = this.props.doctypes.allDoctypes.nodes.map((d, i) => {
        return {key: i, value: d.id, text: d.docname}
      });
      const warehouses = this.props.allwarehouses.allWarehouses.nodes.map((wh, i) => {
        return {key: i, value: wh.id, text: wh.name}
      });
      const years = [
        {
          value: 2016,
          text: 2016
        }, {
          value: 2017,
          text: 2017
        }, {
          value: 2018,
          text: 2018
        }
      ];
      const months = [
        {
          value: 1,
          text: 'январь'
        }, {
          value: 2,
          text: 'февраль'
        }, {
          value: 3,
          text: 'март'
        }, {
          value: 4,
          text: 'апрель'
        }, {
          value: 5,
          text: 'май'
        }, {
          value: 6,
          text: 'июнь'
        }, {
          value: 7,
          text: 'июль'
        }, {
          value: 8,
          text: 'август'
        }, {
          value: 9,
          text: 'сентябрь'
        }, {
          value: 10,
          text: 'октябрь'
        }, {
          value: 11,
          text: 'ноябрь'
        }, {
          value: 12,
          text: 'декабрь'
        }
      ];
      const daysInMonth = new Date(this.state.year, this.state.month, 0).getDate();
      const days = Array.apply(null, Array(daysInMonth)).map((_, i) => {
        return {
          value: i + 1,
          text: i + 1
        }
      });
      return (
        <Modal trigger={< Button > Новый отчёт < /Button>}>
          <Modal.Header>Создать новый отчёт</Modal.Header>
          <Modal.Content image>
            <Modal.Description>
              <Form onSubmit={this.handleSubmit}>
                {error}
                <Form.Group>
                  <Form.Dropdown width={9} onChange={(e, d) => this.changeDoctype(d.value)} value={this.state.doctype} label="Выбрать документ" fluid search selection options ={doctypes}/>
                  <Form.Dropdown width={2} onChange={(e, d) => this.changeYear(d.value)} label="Год" fluid search selection value={this.state.year} options ={years}/>
                  <Form.Dropdown width={3} onChange={(e, d) => this.changeMonth(d.value)} label="Месяц" fluid search selection value={this.state.month} options ={months}/>
                  <Form.Dropdown width={2} onChange={(e, d) => this.changeDay(d.value)} value={this.state.day} label="День" fluid search selection options ={days}/>
                </Form.Group>
                <Form.Dropdown label="Склад списания" value={this.state.wh} onChange={(e, d) => this.setState({wh: d.value})} fluid search selection options ={warehouses}/>
                <Form.Dropdown label="Склад оприходования" value={this.state.wh_to} onChange={(e, d) => this.setState({wh_to: d.value})} fluid search selection options ={warehouses}/>
                <Form.Dropdown onChange={(e, d) => this.setState({employee: d.value, error: ''})} value={this.state.employee} label="Выбрать сотрудника, составившего отчет" fluid search selection options ={employees}/>
                <Form.Button content='Создать'/>
              </Form>
            </Modal.Description>
          </Modal.Content>
        </Modal>
      );
    }
  }
}

export default withRouter(compose(graphql(ALLEMPLOYEES, {name: 'allemployees'}), graphql(DOCTYPES, {
  name: 'doctypes',
  options: (props) => ({
    variables: {
      "category": props.doccat
    }
  })
}), graphql(ALLWAREHOUSES, {name: 'allwarehouses'}), graphql(CREATETRANSFERDOCUMENT, {name: 'createtransferdocument'}))(NewTransferDocModal));
