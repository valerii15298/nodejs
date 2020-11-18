import React from "react";
import {sendReq} from "../tools"

class ProductDetails extends React.Component<any, any> {
    state = {
        details: false,
    }

    componentDidMount() {
        sendReq(`/sale/products/${this.props.productId}`).then(product => {
            this.setState({details: product});
        });
    }

    render() {
        return this.state.details ? <pre>{JSON.stringify(this.state.details, null, 2)}</pre> : "Loading product details . . .";
    }

}

export default ProductDetails;