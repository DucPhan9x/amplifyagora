import React from "react";
import NewMarket from "../components/NewMarket";
import MarketList from "../components/MarketList";
import { API, graphqlOperation } from "aws-amplify";
import { searchMarkets } from "../graphql/queries";

class HomePage extends React.Component {
  state = {
    searchTerm: "",
    searchResults: [],
    isSearching: false
  };

  handleSearchChange = searchTerm => this.setState({ searchTerm });
  handleClearSearch = () => { this.setState({ searchTerm: "", searchResults: [] }) }
  handleSearch = async (event) => {
    try {
      event.preventDefault();
      this.setState({ isSearching: true });
      const result = await API.graphql(graphqlOperation(searchMarkets, {
        filter: {
          or: [
            { name: { match: this.state.searchTerm } },
            { owner: { match: this.state.searchTerm } },
            { tags: { match: this.state.searchTerm } }
          ]
        },
        sort: {
          field: "name",
          direction: "desc"
        }
      }));
      console.log({ result });
      this.setState({
        searchResults: result.data.searchMarkets.items,
        isSearching: false
      })
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    return (
      <>
        <NewMarket
          searchTerm={this.state.searchTerm}
          handleSearchChange={this.handleSearchChange}
          handleClearSearch={this.handleClearSearch}
          handleSearch={this.handleSearch}
          isSearching={this.state.isSearching}
        />
        <MarketList
          searchResults={this.state.searchResults}
        />
      </>
    );
  }
}

export default HomePage;
