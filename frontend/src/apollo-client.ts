import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";

// Create an HTTP link to the GraphQL server
const httpLink = createHttpLink({
  uri: "http://localhost:8080/calculate", // Directly point to the backend server
});

// Set context to include credentials in the requests
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      // Include credentials in the request
      "Access-Control-Allow-Credentials": "true",
    },
  };
});

// Combine the authLink and httpLink
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;