import gql from 'graphql-tag';

export const AllLengths = gql`{
  allLengths {
    nodes {
      id
      lengthMm
    }
  }
}`;

export const AllDimensions = gql`{
  allDimensions {
    nodes {
      id
      thicknessMm
      widthMm
    }
  }
}`;

export const AllSpecies = gql`{
  allSpecies {
    nodes {
      id
      name
    }
  }
}`;

export const DocDetailsQuery = gql`query ProductionReportDetails($doctype: Int, $year: Int, $docnum: Int){
  allDocdetails(condition:{
    docnum:$docnum,
    doctype:$doctype,
    docyear:$year
  }) {
    nodes {
      stackid
      stackByStackid {
        speciesBySpeciesid {
          name
        }
        dimensionByDimensionid {
          thicknessMm
          widthMm
        }
        lengthByLengthid {
          lengthMm
        }
      }
      quantity
    }
  }
}`;

export const ProductionReportsQuery = gql `
query ListOfProductionReports($doctype: Int, $year: Int, $month: Int){
allDocuments(condition: {
  doctype: $doctype,
  docyear: $year,
  docmonth:$month
}) {
  nodes {
    doctype
    doctypeByDoctype {
      docname
    }
    docnum
    docyear
    docmonth
    docdate
    wh
  }
}
}
`;

export const ProductionReportQuery = gql `query ProductionReport($doctype: Int!, $year: Int!, $docnum: Int!, $wh:Int!){
  documentByDoctypeAndDocnumAndDocyearAndWh(doctype:$doctype,docnum:$docnum,docyear:$year, wh:$wh) {
    doctype
    docnum
    docyear
    wh
    doctypeByDoctype{
      docname
    }
    docdate
    employeeByEmployee {
      id
      firstname
      middlename
      lastname
    }
    commentary
  }
}`;
