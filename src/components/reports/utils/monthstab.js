import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';

class MonthsTab extends Component {

  render() {
    const months = [
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12
    ];
    const monthsname = [
      "январь",
      "февраль",
      "март",
      "апрель",
      "май",
      "июнь",
      "июль",
      "август",
      "сентябрь",
      "октябрь",
      "ноябрь",
      "декабрь"
    ];
    const monthslist = months.map((m) => {
      return (
        <Button key={m} disabled={this.props.selectedMonth===m ? true : false} onClick={()=>this.props.changeMonth(m)}>{monthsname[m-1]}</Button>
      )
    })
    return (
      <Button.Group>
        {monthslist}
      </Button.Group>
    );
  }

}

export default MonthsTab;
