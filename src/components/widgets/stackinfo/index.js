import React, {Component} from 'react';
import {Input, Divider} from 'semantic-ui-react';
import StackInfoDetails from './stackinfodetails';

class StackInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: '',

    }
  }

  handleClick = (e) => {
    this.setState({id:e.target.previousElementSibling.value})
  }
  render() {
    return (
      <div>
        <Input
          onKeyPress = {(e) => e.key==='Enter' && e.target.value.length > 0 ? this.setState({id:e.target.value}) : null}
          icon={{
          name: 'search',
          circular: true,
          link: true,
          onClick: (e) => this.handleClick(e)
        }} placeholder='Поиск по № штабеля'/>
        <Divider horizontal>*</Divider>
        <StackInfoDetails id={this.state.id} />
      </div>
    );
  }

}

export default StackInfo;
