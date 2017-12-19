import gql from 'graphql-tag';

export const STOCK = gql`{
  allStockBySpecViews {
    nodes {
      specification
      name
      vol
    }
  }
}`;

export const STACKBYID = gql`query StackById ($id: String!) {
  stackById(id:$id) {
    id
    history {
      nodes {
        doctype
        docyear
        docnum
        wh
      	documentByDocnumAndDoctypeAndDocyearAndWh {
          doctypeByDoctype {
            docname
            category
          }
          docdate
        }
        warehouseByWh {
          name
        }
        quantity
      }
    }
  }
}`;

export const STOCKBYWH = gql`query StockByWh($wh:Int) {
  allStockBySpecViews(condition: {wh:$wh}) {
    nodes {
      specification
      wh
      name
      sum
      vol
    }
  }
}`;

export const STACKSINWH = gql `query StacksInWh($wh:Int)
{
  allStockViews(condition: {
    wh: $wh
  }) {
    nodes {
      stackid
      species
      size
      quantity
    }
  }
}`;

export const ALLWAREHOUSES = gql `{
  allWarehouses {
    nodes {
      id
      name
    }
  }
}`;

export const DOCTYPES = gql `query AllDoctypes($category: String) {
  allDoctypes(condition:{
    category: $category
  }) {
    nodes {
      id
      docname
    }
  }
}`;

export const ALLEMPLOYEES = gql `{
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

export const ALLLENGTHS = gql `{
  allLengths {
    nodes {
      id
      lengthMm
    }
  }
}`;

export const AllDimensions = gql `{
  allDimensions {
    nodes {
      id
      thicknessMm
      widthMm
    }
  }
}`;

export const AllSpecies = gql `{
  allSpecies {
    nodes {
      id
      name
    }
  }
}`;

export const DocDetailsQuery = gql `query ProductionReportDetails($doctype: Int, $year: Int, $docnum: Int){
  allDocdetails(condition:{
    docnum:$docnum,
    doctype:$doctype,
    docyear:$year
  }) {
    nodes {
      stackid
      stackByStackid {
        speciesid
        speciesBySpeciesid {
          name
        }
        dimensionid
        dimensionByDimensionid {
          thicknessMm
          widthMm
        }
        lengthid
        lengthByLengthid {
          lengthMm
        }
      }
      quantity
      stackVol
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
    warehouse
    whRef
    warehouseRef
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
    warehouseByWh {
      name
    }
    whRef
    warehouseByWhRef {
      name
    }
    doctypeByDoctype {
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
