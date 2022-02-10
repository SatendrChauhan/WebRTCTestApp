import {gql} from "@apollo/client"

export const GET_ALL_DATA = gql`
  subscription {
    newActivity {
      audience
      deviceId
      geo {
        Lat
        Lon
      }
      timestamp
      audience
      peopleAlert
      peopleInvoled
    }
  }
`;