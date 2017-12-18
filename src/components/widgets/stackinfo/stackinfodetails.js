import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {STACKBYID} from '../../../queries';
import {List} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class StackInfoDetails extends Component {

  render() {
    if (this.props.data.loading) {
      return (
        <div>Загрузка ...</div>
      )
    } else if (!this.props.id) {
      return (
        <div>Поиск истории перемещений по номеру штабеля</div>
      )
    } else if (!this.props.data.stackById) {
      return (
        <div>{`Штабель с № ${this.props.id} не найден`}</div>
      )
    } else {
      console.log(this.props.data);
      let mappings = {};
      mappings['выпуск'] = "production";
      mappings['перемещение'] = "transfer";
      mappings['списание'] = "writeoff";

      const data = this.props.data.stackById.history.nodes.map((d, i) => {
        return (
          <List.Item key={i}>
            <List.Content>
              <List.Header>{`${(new Date(d.documentByDocnumAndDoctypeAndDocyearAndWh.docdate)).toLocaleDateString('ru')}: `}
                <Link to={`/reports/${mappings[d.documentByDocnumAndDoctypeAndDocyearAndWh.doctypeByDoctype.category]}/${d.doctype}/${d.docyear}/${d.docnum}/${d.wh}`}>
                  {d.documentByDocnumAndDoctypeAndDocyearAndWh.doctypeByDoctype.docname}
                </Link>
              </List.Header>
              <List.Description>
                {`${d.warehouseByWh.name} - ${d.quantity} шт.`}
              </List.Description>
            </List.Content>
          </List.Item>
        )
      })
      return (
        <div style={{
          textAlign: 'left'
        }}>
          <center>
            <h2>Штабель № {this.props.id}</h2>
          </center>
          <List>
            {data}
          </List>
        </div>
      );
    }
  }
}

export default graphql(STACKBYID, {
  options: (props) => ({
    variables: {
      "id": props.id
    }
  })
})(StackInfoDetails);
