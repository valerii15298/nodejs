import React from 'react';
import ProductsList from "./productsList";
import ProductDetails from "./productDetails";

class Main extends React.Component<any, any> {
    render() {
        return <main>{
            this.props.productId && <ProductDetails productId={this.props.productId}/> ||
            <ProductsList
                productsList={this.props.productsList}
                showProduct={this.props.showProduct}
                filters={this.props.filters}/>
        }</main>;
    }
}

export default Main;