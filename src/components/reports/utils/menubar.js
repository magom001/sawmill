import React, {Component} from 'react';
import {Table, Dropdown} from 'semantic-ui-react';
import {graphql} from 'react-apollo';
import {UNLOADKD} from '../../../mutations';
import {DocDetailsQuery, STACKSINWH} from '../../../queries';

class MenuBar extends Component {
  handleMenuItemClick = () => {
    this.props.mutate({
      variables: {
        "input": {
          "doctype": parseInt(this.props.doctype, 10),
          "docyear": parseInt(this.props.docyear, 10),
          "docnum": parseInt(this.props.docnum, 10)
        }
      }
    })
  }
  render() {
    console.log(this.props);
    return (
      <Table.Row>
        <Table.HeaderCell collapsing>
          <Dropdown item icon='bars' simple>
            <Dropdown.Menu>
              <Dropdown.Item name="unloadkd" onClick={() => this.handleMenuItemClick()}>Выгрузить камеру</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>

        </Table.HeaderCell>
        <Table.HeaderCell colSpan={7}></Table.HeaderCell>
      </Table.Row>
    );
  }

}

export default graphql(UNLOADKD, {
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
})(MenuBar);
