import { NgModule } from '@angular/core';
import { ApolloModule, APOLLO_OPTIONS } from 'apollo-angular';
import {
  ApolloClientOptions,
  ApolloLink,
  InMemoryCache,
} from '@apollo/client/core';
import { HttpLink } from 'apollo-angular/http';
import { environment } from 'src/environments/environment';
import { setContext } from '@apollo/client/link/context';
import { HttpClientModule } from '@angular/common/http';
import { createUploadLink } from 'apollo-upload-client';

const uri = 'http://localhost:3000/api/graphql'; // <-- add the URL of the GraphQL server here
export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const basic = setContext((operation, context) => ({
    headers: {
      Accept: 'charset=utf-8',
    },
  }));

  const auth = setContext((operation, context) => {
    const token = 'sessionToken';

    if (token === null) {
      return {};
    } else {
      return {
        headers: {
          Authorization: `Bearer ${JSON.parse(token)}`,
        },
      };
    }
  });

  const link = ApolloLink.from([basic, auth, createUploadLink({ uri: uri })]);
  const cache = new InMemoryCache();

  return {
    link,
    cache,
  };
}

@NgModule({
  exports: [HttpClientModule, ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
