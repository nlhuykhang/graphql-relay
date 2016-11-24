import React from 'react';
import Relay from 'react-relay';
import ThumbsUpMutation from './thumbs-up-mutation';

class Quote extends React.Component {
  displayLikes() {
    if (!this.props.relay.variables.showLikes) {
      return null;
    }

    return (
      <div className="">
        {this.props.quote.likesCount} &nbsp;
        <span
          className="glyphicon glyphicon-thumbs-up"
          onClick={this.thumbsUpClick}
        ></span>
      </div>
    );
  }
  thumbsUpClick = () => {
    console.log(this.props.quote);
    Relay.Store.commitUpdate(
      new ThumbsUpMutation({
        quote: this.props.quote,
      })
    );
  }
  showLikes = () => {
    this.props.relay.setVariables({showLikes: true});
  }
  render() {
    return (
      <blockquote onClick={this.showLikes}>
        <p>{this.props.quote.text}</p>
        <footer>{this.props.quote.author}</footer>
        {this.displayLikes()}
      </blockquote>
    );
  }
}

Quote = Relay.createContainer(Quote, {
  initialVariables: {
    showLikes: false,
  },
  fragments: {
    quote: () => Relay.QL `
      fragment OneQuote on Quote {
        ${ThumbsUpMutation.getFragment('quote')}
        text
        author
        likesCount @include(if: $showLikes)
      }
    `
  },
});

export default Quote;
