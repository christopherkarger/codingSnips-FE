import gql from "graphql-tag";

export const createUserMutation = gql`
  mutation createUser($email: String!, $password: String!) {
    createUser(email: $email, password: $password) {
      email
    }
  }
`;