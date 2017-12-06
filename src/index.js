import React from 'react';
import ReactDOM from 'react-dom';
// IMPORT APOLLO GRAPHQL
import {ApolloProvider} from 'react-apollo';
import {ApolloClient} from 'apollo-client';
import {HttpLink} from 'apollo-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';

// IMPORT ROUTER COMPONENTS
import {BrowserRouter} from 'react-router-dom';

import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  link: new HttpLink(),
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
  <BrowserRouter>
    <App/>
  </BrowserRouter>
</ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
