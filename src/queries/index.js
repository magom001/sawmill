import gql from 'graphql-tag';

export const ALLWAREHOUSES = gql`{
  allWarehouses {
    nodes {
      id
      name
    }
  }
}`;

export const DOCTYPES = gql`query AllDoctypes($category: String) {
  allDoctypes(condition:{
    category: $category
  }) {
    nodes {
      id
      docname
    }
  }
}`;

export const ALLEMPLOYEES = gql`{
  allEmployees {
    nodes {
      id
      firstname
      middlename
      lastname
      profession
    }
  }
}`

export const ALLLENGTHS = gql`{
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

export const LISTOFREPORTS = gql `
query LISTOFREPORTS($category: String, $year: Int, $month: Int){
allDocumentsViews(condition: {
  category: $category,
  docyear: $year,
  docmonth:$month
}) {
  nodes {
    doctype
    category
    docname
    docnum
    docyear
    docmonth
    docdate
    wh
  }
}
}
`;

export const REPORTQUERY = gql `query ProductionReport($doctype: Int!, $year: Int!, $docnum: Int!, $wh:Int!){
  documentByDoctypeAndDocnumAndDocyearAndWh(doctype:$doctype,docnum:$docnum,docyear:$year, wh:$wh) {
    doctype
    docnum
    docyear
    wh
    doctypeByDoctype{
      docname
    }
    docdate
    employee
    employeeByEmployee {
      id
      firstname
      middlename
      lastname
    }
    commentary
  }
}`;
