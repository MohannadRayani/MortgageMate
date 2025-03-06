import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ApolloProvider } from "@apollo/client";
import client from "./apollo-client";
import { BrowserRouter } from "react-router-dom";

import './index.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
    </ApolloProvider>
  </StrictMode>,
);
