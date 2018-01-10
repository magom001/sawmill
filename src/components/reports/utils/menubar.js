import React, {Component} from 'react';
import {Table, Dropdown, Modal, Button, Icon} from 'semantic-ui-react';
import {graphql, compose} from 'react-apollo';
import {UNLOADKD, CANCELTRANSFERDOC} from '../../../mutations';
import {DocDetailsQuery, STACKSINWH} from '../../../queries';
import {withRouter} from 'react-router-dom';

class MenuBar extends Component {
  state = {
    open: false
  }
  handleMenuItemClick = () => {
    this.props.unloadkd({
      variables: {
        "input": {
          "doctype": parseInt(this.props.doctype, 10),
          "docyear": parseInt(this.props.docyear, 10),
          "docnum": parseInt(this.props.docnum, 10)
        }
      }
    })
  }
  cancelTransfer = () => {
    this.props.canceltransfer({
      variables: {
        "input": {
          "_doctype": parseInt(this.props.match.params.doctype, 10),
          "_docyear": parseInt(this.props.match.params.docyear, 10),
          "_docnum": parseInt(this.props.match.params.docnum, 10),
          "_wh": parseInt(this.props.match.params.wh, 10)
        }
      }
    }).then(()=>{
      this.props.history.push("/reports/transfer");
    }).catch((err)=>{
      console.log(err);
    });
  }
  render() {
    return (
      <Table.Row>
        <Table.HeaderCell collapsing>
          <Dropdown item icon='bars' simple>
            <Dropdown.Menu>
              <Dropdown.Item name="unloadkd" onClick={() => this.handleMenuItemClick()}>Переместить всё</Dropdown.Item>
              <Dropdown.Divider/>
              <Modal open={this.state.open} size="tiny" trigger={< Dropdown.Item name = "delete_report" onClick = {
                () => this.setState({open: true})
              } > Удалить отчёт < /Dropdown.Item>}>
                <Modal.Header>
                  <Icon name="warning sign"/>Внимание!
                </Modal.Header>
                <Modal.Content>
                  <p>Вы уверены, что хотите удалить отчёт?</p>
                </Modal.Content>
                <Modal.Actions>
                  <Button negative onClick={() => this.setState({open: false})}>
                    Отменить
                  </Button>
                  <Button positive onClick={() => this.cancelTransfer()}>
                    Подтвердить
                  </Button>
                </Modal.Actions>
              </Modal>
            </Dropdown.Menu>
          </Dropdown>

        </Table.HeaderCell>
        <Table.HeaderCell colSpan={7}></Table.HeaderCell>
      </Table.Row>
    );
  }

}

MenuBar = compose(graphql(UNLOADKD, {
  name: "unloadkd",
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
}), graphql(CANCELTRANSFERDOC, {name: "canceltransfer"}))(MenuBar);

export default withRouter(MenuBar);
