import React from 'react';

class SearchForm extends React.Component {
  static propTypes = {
    searchAction: React.PropTypes.func.isRequire,
  }
  changeHandler = e => {
    this.props.searchAction(e.target.value)
  }
  render() {
    return (
      <form className="navbar-form" role="search">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          onChange={this.changeHandler}

        />
      </form>
    );
  }
}

export default SearchForm;
