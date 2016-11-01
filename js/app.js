import React from 'react';
import ReactDOM from 'react-dom';

import Quote from './quote';
import Relay from 'react-relay';

class QuotesLibrary extends React.Component {
  state = {
    allQuotes: []
  };
  componentDidMount() {
    // Load the quotes list into this.state.allQuotes
    fetch(`/ql?query={allQuotes{id,text,author}}`)
    .then(res => res.json())
    .then(json => this.setState(json.data))
    .catch(ex => console.error(ex));
  }
  render() {
    return (
      <div className="quotes-list">
        {this.state.allQuotes.map(quote => <Quote key={quote.id} quote={quote}/>)}
      </div>
    )
  }
}

QuotesLibrary = Relay.createContainer(QuotesLibrary, {
  fragments: {},
});

class AppRoute extends Relay.Route {
  static routeName = 'App';
}

ReactDOM.render(
  <Relay.RootContainer
    Component={QuotesLibrary}
    route={new AppRoute()}
  />,
  document.getElementById('react')
);
