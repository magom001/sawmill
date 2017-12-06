import gql from 'graphql-tag';

export const CreateNewStack = gql`mutation CreateNewStack($input: CreateNewStackInput!) {
  createNewStack(input:$input) {
   clientMutationId
  }
}`;
