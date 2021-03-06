import React, {Component} from 'react';
import YearsTab from '../utils/yearstab';
import MonthsTab from '../utils/monthstab';
import ProductionReportsTable from './productionreportstable';
import NewProductionDocModal from '../utils/newproductiondocmodal';

class ProductionReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYear: 2017,
      selectedMonth: 12
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
        <NewProductionDocModal doccat='выпуск' wh={1} doctype={1} />
        <h1>Отчёты о выпуске штабелей</h1>
        <ProductionReportsTable year={this.state.selectedYear} month={this.state.selectedMonth}/>
      </div>
    );
  }

}

export default ProductionReports;
