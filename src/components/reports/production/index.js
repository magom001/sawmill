import React, { Component } from 'react';
import YearsTab from './yearstab';
import MonthsTab from './monthstab';
import ProductionReportsTable from './productionreportstable';
class ProductionReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 2017,
      selectedMonth: 12
    }
  }
  changeYear = (year) => {
    this.setState({
      selectedYear: year
    })
  }
  changeMonth = (month) => {
    this.setState({
      selectedMonth:month
    })
  }
  render() {
    return (
      <div>
        <YearsTab selectedYear={this.state.selectedYear} changeYear={this.changeYear} />
        <br />
        <MonthsTab selectedMonth = {this.state.selectedMonth} changeMonth={this.changeMonth}/>
        <br /><br />
        <ProductionReportsTable year = {this.state.selectedYear} month={this.state.selectedMonth} />
      </div>
    );
  }

}

export default ProductionReports;
