import gql from 'graphql-tag';

export const CREATEDOCUMENT = gql`mutation CreateDocument($input: CreateDocumentInput!) {
  createDocument(input:$input) {
    document {
      doctype
      docyear
      docnum
      wh
    }
  }
}`;

export const UPDATEDOCUMENT = gql`mutation UpdateDocument($input: UpdateDocumentByDoctypeAndDocnumAndDocyearAndWhInput!) {
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

export const CreateNewStack = gql`mutation CreateNewStack($input: CreateNewStackInput!) {
  createNewStack(input:$input) {
   clientMutationId
  }
}`;
