import React from "react";
import { Connect } from "aws-amplify-react";
import { listMarkets } from "../graphql/queries";
import { graphqlOperation } from "aws-amplify";
import Error from "./Error";
import { Loading, Card, Tag, Icon } from "element-react";
import { Link } from "react-router-dom"
import { onCreateMarket } from "../graphql/subscriptions"

const MarketList = ({ searchResults }) => {
  const onNewMarket = (prevQuery, newData) => {
    let updatedQuery = { ...prevQuery };
    const updatedMarketList = [
      newData.onCreateMarket,
      ...prevQuery.listMarkets.items
    ];
    updatedQuery.listMarkets.items = updatedMarketList;
    return updatedQuery;
  };
  return (
    <Connect
      query={graphqlOperation(listMarkets)}
      subscription={graphqlOperation(onCreateMarket)}
      onSubscriptionMsg={onNewMarket}
    >
      {
        ({ data, loading, errors }) => {

          if (errors.length > 0) return <Error errors={errors} />;
          if (loading || !data.listMarkets) return <Loading fullscreen={true} />
          const markets = searchResults.length > 0 ? searchResults : data.listMarkets.items
          return (
            <>
              {searchResults.length > 0 ? (
                <h2 className="text-green">
                  <Icon type="success" name="check" className="icon" />
                  {searchResults.length} results
                </h2>
              ) :
                <h2 className="header">
                  <img src="https://picsum.photos/300" alt="Store Icon" className="large-icon" style={{ width: "50px", height: "50px", borderRadius: "20%", paddingRight: "5px" }} />
                Markets
              </h2>
              }
              {markets.map((market, index) => (
                <div key={market.id} className="my-2">
                  <Card
                    bodyStyle={{
                      padding: "0.7em",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <span className="flex" style={{ alignItems: "center" }}>
                        <img src={`https://picsum.photos/${index + 200}`} alt="Shopping Cart" style={{ width: "30px", height: "30px", borderRadius: "50%", padding: "2px" }} />
                        <Link className="link" to={`/markets/${market.id}`}>
                          {market.name}
                        </Link>
                        <span style={{ color: 'var(--darkAmazonOrange' }}>
                          {market.products.items ? market.products.items.length : 0}
                        </span>
                      </span>
                      <div style={{ color: "var(--lightSquidInk" }}>
                        {market.owner}
                      </div>
                    </div>
                    <div>
                      {market.tags && market.tags.map(tag => (
                        <Tag
                          key={tag}
                          type="danger"
                          className="mx-1"
                        >
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </Card>
                </div>
              ))}
            </>
          )
        }
      }
    </Connect>
  );
};

export default MarketList;
