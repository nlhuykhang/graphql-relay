import React from 'react';
import ReactDOM from 'react-dom';

import Quote from './quote';
import Relay from 'react-relay';

class QuotesLibrary extends React.Component {
  // state = {
  //   allQuotes: []
  // };
  // componentDidMount() {
  //   // Load the quotes list into this.state.allQuotes
  //   fetch(`/ql?query={allQuotes{id,text,author}}`)
  //   .then(res => res.json())
  //   .then(json => this.setState(json.data))
  //   .catch(ex => console.error(ex));
  // }
  render() {
    return (
      <div className="quotes-list">
        {this.props.library.allQuotes.map(quote => <Quote key={quote.id} quote={quote}/>)}
      </div>
    )
  }
}

QuotesLibrary = Relay.createContainer(QuotesLibrary, {
  fragments: {
    library: () => Relay.QL `
      fragment AllQuotes on QuotesLibrary {
        allQuotes {
          id
          ${Quote.getFragment('quote')}
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
