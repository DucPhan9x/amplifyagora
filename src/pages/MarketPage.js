import React from "react";
import { API, graphqlOperation } from "aws-amplify";
// import { getMarket } from "../graphql/queries";
import { Loading, Tabs, Icon } from "element-react";
import { Link } from "react-router-dom";
import NewProduct from "../components/NewProduct";
// import PayButton from "../components/PayButton";
import Product from "../components/Product";

const getMarket = /* GraphQL */ `
  query GetMarket($id: ID!) {
    getMarket(id: $id) {
      id
      name
      products {
        items {
          id
          description
          price
          shipped
          owner
          file {
            key
          }
          createdAt
          updatedAt
        }
        nextToken
      }
      tags
      owner
      createdAt
      updatedAt
    }
  }
`;

class MarketPage extends React.Component {
  state = {
    market: null,
    isLoading: true,
    isMarketOwner: false,
  };

  componentDidMount() {
    this.handleGetMarket();
  }

  checkMarketOwner = () => {
    const { user } = this.props;
    const { market } = this.state;
    if (user) {
      this.setState({ isMarketOwner: user.attributes.email === market.owner });
    }
  };

  handleGetMarket = async () => {
    const input = {
      id: this.props.marketId,
    };
    const result = await API.graphql(graphqlOperation(getMarket, input));
    this.setState({ market: result.data.getMarket, isLoading: false }, () => {
      this.checkMarketOwner();
    });
  };

  render() {
    const { market, isLoading, isMarketOwner } = this.state;
    return isLoading ? (
      <Loading fullscreen={true} />
    ) : (
      <>
        {/* Back button */}
        <Link className="link" to="/">
          Back to Markets List
        </Link>
        {/* Market MetaData */}
        <span className="items-center pt-2">
          <h2 className="mb-mr">{market.name}</h2>- {market.owner}
        </span>
        <div className="items-center pt-2">
          <span style={{ color: "var(--lightSquidInk)", paddingBottom: "1em" }}>
            <Icon name="date" className="icon" />
            {market.createdAt}
          </span>
        </div>

        {/* New Product */}
        <Tabs type="border-card" value={isMarketOwner ? "1" : "2"}>
          {isMarketOwner && (
            <Tabs.Pane
              label={
                <>
                  <Icon name="plus" className="icon" />
                  Add Product
                </>
              }
              name="1"
            >
              <NewProduct marketId={this.props.marketId} />
            </Tabs.Pane>
          )}

          {/* Products List */}
          <Tabs.Pane
            label={
              <>
                <Icon name="menu" className="icon" />
              Products ({market.products.items.length})
            </>
            }
            name="2"
          >
            <div className="product-list">
              {market.products.items.map((product, index) => (
                <Product product={product} key={index} />
              ))}
            </div>
          </Tabs.Pane>
        </Tabs>
      </>
    );
  }
}

export default MarketPage;
