import React from 'react';
import ReactDOM from 'react-dom';

import Quote from './quote';
import Relay from 'react-relay';

class QuotesLibrary extends React.Component {
  render() {
    return (
      <div className="quotes-list">
        {this.props.library.quotesConnection.edges.map(edge => {
          return <Quote key={edge.node.id} quote={edge.node}/>;
        })}
      </div>
    )
  }
}

QuotesLibrary = Relay.createContainer(QuotesLibrary, {
  fragments: {
    library: () => Relay.QL `
      fragment on QuotesLibrary {
        quotesConnection(first: 2) {
          edges {
            node {
              id
              ${Quote.getFragment('quote')}
            }
          }

        }
      }
    `
  },
});

class AppRoute extends Relay.Route {
  static routeName = 'App';
  static queries = {
    library: (Component) => Relay.QL `
      query QuotesLibrary {
        quotesLibrary {
          ${Component.getFragment('library')}
        }
      }
    `
  }
}

ReactDOM.render(
  <Relay.RootContainer
    Component={QuotesLibrary}
    route={new AppRoute()}
  />,
  document.getElementById('react')
);
