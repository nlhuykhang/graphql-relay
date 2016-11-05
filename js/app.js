import React from 'react';
import ReactDOM from 'react-dom';

import Quote from './quote';
import Relay from 'react-relay';

import SearchForm from './search-form.js';
import { debounce } from 'lodash';

class QuotesLibrary extends React.Component {
  constructor(props) {
    super(props);
    this.search = debounce(this.search.bind(this), 300);
  }
  search(val) {
    this.props.relay.setVariables({
      searchTerm: val,
    });
  }
  render() {
    return (
      <div className="quotes-list">
        <SearchForm searchAction={this.search} />
        <div className="quotes-list">
          {this.props.library.quotesConnection.edges.map(edge => {
            return <Quote key={edge.node.id} quote={edge.node}/>;
          })}
        </div>
      </div>
    )
  }
}

QuotesLibrary = Relay.createContainer(QuotesLibrary, {
  initialVariables: {
    searchTerm: '',
  },
  fragments: {
    library: () => Relay.QL `
      fragment on QuotesLibrary {
        quotesConnection(first: 100, searchTerm: $searchTerm) {
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
