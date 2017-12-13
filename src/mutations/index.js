import gql from 'graphql-tag';

export const TRANSFERSTACK = gql`mutation TransferStack($input: MoveStockDocdetailInput!) {
  moveStockDocdetail(input:$input) {
   	docdetail {
      stackid
    }
  }
}`;

export const CREATETRANSFERDOCUMENT = gql `mutation NewTransferDocument($input: MoveStackDocumentInput!) {
  moveStackDocument(input:$input) {
   document {
    doctype
    docyear
    docnum
    wh
  }
  }
}`

export const CREATEDOCDETAIL = gql `mutation CreateDocDetail($input: CreateDocdetailInput!) {
  createDocdetail(input:$input) {
		docdetail {
      doctype
      docnum
      wh
      docyear
      stackid
      quantity
    }
  }
}`

export const CREATEDOCUMENT = gql `mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input:$input) {
    document {
      doctype
      docyear
      docnum
      wh
    }
  }
}`;

export const UPDATEDOCUMENT = gql `mutation UpdateDocument($input: UpdateDocumentByDoctypeAndDocnumAndDocyearAndWhInput!) {
	updateDocumentByDoctypeAndDocnumAndDocyearAndWh(input:$input) {
    document {
      docdate
      commentary
      doctypeRef
      docyearRef
      docnumRef
      whRef
      docmonth
    }
  }
}`

export const CreateNewStack = gql `mutation CreateNewStack($input: CreateNewStackInput!) {
  createNewStack(input:$input) {
   clientMutationId
  }
}`;
