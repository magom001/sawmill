import React, { Component } from 'react';
import { Button } from 'semantic-ui-react';

class YearsTab extends Component {

  render() {
    const years = [2016,2017,2018,2019];
    const yearslist = years.map((y)=> {
      return(
        <Button key={y} disabled={y===this.props.selectedYear ? true: false} onClick={()=>this.props.changeYear(y)}>{y}</Button>
      )
    })
    return (
      <Button.Group>
        {yearslist}
      </Button.Group>
    );
  }

}

export default YearsTab;
