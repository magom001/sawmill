import React, {Component} from 'react';
import YearsTab from '../utils/yearstab';
import MonthsTab from '../utils/monthstab';
import WriteOffReportsTable from './writeoffreportstable';
import NewProductionDocModal from '../utils/newproductiondocmodal';

class WriteoffReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: (new Date()).getFullYear(),
      selectedMonth: (new Date()).getMonth() + 1
    }
  }
  changeYear = (year) => {
    this.setState({selectedYear: year})
  }
  changeMonth = (month) => {
    this.setState({selectedMonth: month})
  }

  render() {
    return (
      <div>
        <YearsTab selectedYear={this.state.selectedYear} changeYear={this.changeYear}/>
        <br/>
        <MonthsTab selectedMonth={this.state.selectedMonth} changeMonth={this.changeMonth}/>
        <br/>
        <br/>
        <NewProductionDocModal doccat="списание" wh={1} />
        <h1>Отчёты о списании пиломатериалов</h1>
        <WriteOffReportsTable year={this.state.selectedYear} month={this.state.selectedMonth}/>
      </div>
    );
  }

}

export default WriteoffReports;
