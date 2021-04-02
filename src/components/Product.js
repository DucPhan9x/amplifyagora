import React from "react";
import { S3Image } from "aws-amplify-react";
import { Notification, Popover, Button, Dialog, Card, Form, Input, Radio } from "element-react";
import { convertCentsToDollar } from "../utils";
import { UserContext } from "../App";
import PayButton from "./PayButton";

class Product extends React.Component {
  state = {};

  render() {
    const { product } = this.props;

    return (
      <UserContext.Consumer>
        {({ user }) => {
          const isProductOwner = user && user.attributes.sub === product.owner;
          console.log(product.file.key);
          return (
            <div className="card-container">
              <Card bodyStyle={{ padding: 0, minWidth: '200px' }}>
                <S3Image
                  imgKey={product.file && product.file.key}
                  theme={{
                    photoImg: { maxWidth: '100%', maxHeight: '100%' }
                  }}
                />
                <div className="card-body">
                  <h3 className="m-0">{product.description}</h3>
                  <div className="items-center">
                    <img
                      src="https://picsum.photos/200/300"
                      alt="Shipping Icon"
                      className="icon"
                      style={{ width: 16, height: 14, borderRadius: '50%' }}
                    />
                    {product.shipped ? "Shipped" : "Emailed"}
                    <div className="text-right">
                      <span className="mx-1">
                        $ {convertCentsToDollar(product.price)}
                      </span>
                      {!isProductOwner && (
                        <PayButton />
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )
        }}
      </UserContext.Consumer>
    )
  }
}

export default Product;
