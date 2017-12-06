import React, {Component} from 'react';
import {graphql} from 'react-apollo';
import {ProductionReportQuery} from '../../../queries';
import ProductionReportDetailsTable from './productionreportdetailstable';
import {Form, TextArea} from 'semantic-ui-react';

class ProductionReportDetails extends Component {

  render() {
    if (this.props.data.loading) {
      return <div>Загрузка...</div>
    } else {
      const doc = this.props.data.documentByDoctypeAndDocnumAndDocyearAndWh;
      return (
        <div>
          <h3>Отчёт о выпуске сушильных штабелей № {`${doc.docnum}/${doc.docyear} от ${doc.docdate}`}</h3>
          <span>Мастер: {`${doc.employeeByEmployee.lastname} ${doc.employeeByEmployee.firstname} ${doc.employeeByEmployee.middlename}`}</span>
          <ProductionReportDetailsTable doctype={doc.doctype} docnum={doc.docnum} docyear={doc.docyear} wh={doc.wh}/>
          <Form>
            <TextArea placeholder="Комментарий к документу" value={doc.commentary}/>
          </Form>
        </div>
      );
    }
  }
}

export default graphql(ProductionReportQuery, {
  options: (props) => ({
    variables: {
      "doctype": parseInt(props.match.params.doctype, 10),
      "year": parseInt(props.match.params.docyear, 10),
      "docnum": parseInt(props.match.params.docnum, 10),
      "wh": parseInt(props.match.params.wh, 10)
    }
  })
})(ProductionReportDetails);
