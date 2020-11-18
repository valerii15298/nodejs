import React from "react";
import ProductPreview from "./productPreview";

class ProductsList extends React.Component<any, any> {
    render() {
        const productsList = Object.values(this.props.productsList).slice(-2);

        return productsList.map(
            (el: any) => <ProductPreview key={el.id} showProduct={this.props.showProduct} data={el}/>);
    }

}

export default ProductsList;