import React, { Component } from 'react';
import {Form} from 'semantic-ui-react';

class CommentaryInput extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commentary: this.props.commentary ? this.props.commentary : '',
    }
  }
  changeCommentary = (data) => {
    this.setState({commentary:data.value})
  }
  saveState = () => {
    this.props.save(this.state.commentary);

  }
  render() {
    return (
      <Form>
        <Form.TextArea label="Комментарий к документу" value={this.state.commentary} onInput={(e,d)=>this.changeCommentary(d)}/>
        <Form.Button onClick={()=>this.saveState()} disabled={this.state.commentary===this.props.commentary?true:false}>Сохранить</Form.Button>
      </Form>
    );
  }

}

export default CommentaryInput;
