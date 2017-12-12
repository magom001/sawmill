import React, {Component} from 'react';
import {graphql, compose} from 'react-apollo';
import {REPORTQUERY} from '../../../queries';
import {UPDATEDOCUMENT} from '../../../mutations';
import WriteOffReportDetailsTable from './writeoffreportdetailstable';
import CommentaryInput from '../utils/doccommentaryinput';

class TransferReportDetails extends Component {
  changeCommentary = (commentary) => {
    const {doctype,docyear, docnum, wh} = this.props.match.params;
    console.log(doctype, docyear, docnum, wh);
    this.props.updatedocument({
      variables: {
        "input": {
          "doctype": parseInt(doctype, 10),
          "docyear": parseInt(docyear, 10),
          "docnum": parseInt(docnum, 10),
          "wh": parseInt(wh, 10),
          "documentPatch": {
            "commentary": String(commentary)
          }
        }
      }
    })
  }
  render() {
    if (this.props.productionreportquery.loading) {
      return <div>Загрузка...</div>
    } else {
      const doc = this.props.productionreportquery.documentByDoctypeAndDocnumAndDocyearAndWh;
      return (
        <div>
          <center>
            <h3>{`${doc.doctypeByDoctype.docname} #${doc.docnum}/${doc.docyear} от ${doc.docdate}`}</h3>
          </center>
          <br />

          <p>
            Мастер: {`${doc.employeeByEmployee.lastname} ${doc.employeeByEmployee.firstname} ${doc.employeeByEmployee.middlename}`}
          </p>
          <p>
            Склад списания: {`${doc.warehouseByWhRef.name}`}
          </p>
          <p>
            Склад оприходования: {`${dc.warehouseByWh.name}`}
          </p>
          <WriteOffReportDetailsTable doctype={doc.doctype} docnum={doc.docnum} docyear={doc.docyear} wh={doc.wh}/>
          <CommentaryInput commentary={doc.commentary} save={this.changeCommentary}/>
        </div>
      );
    }
  }
}

export default compose(graphql(REPORTQUERY, {
  name: 'productionreportquery',
  options: (props) => ({
    variables: {
      "doctype": parseInt(props.match.params.doctype, 10),
      "year": parseInt(props.match.params.docyear, 10),
      "docnum": parseInt(props.match.params.docnum, 10),
      "wh": parseInt(props.match.params.wh, 10)
    }
  })
}), graphql(UPDATEDOCUMENT, {name: 'updatedocument'}))(TransferReportDetails);
