import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {sendReq, getCategories} from './tools';

import Header from './components/header';
import Nav from './components/nav';
import Main from './components/main';
import Footer from './components/footer';
import ProductDetails from './components/productDetails';

class Root extends React.Component<any, any> {
    constructor(props: any) {
        super(props);
        this.state = {
            path: null,
            filters: null,
            searchText: 'def',
            productsList: [],
            productId: null,
        };
    }

    render() {
        return (
            <>
                {/* <ProductDetails productId="40b94e9f-291c-4a4a-bbd8-f70786e3c1a8" /> */}
                <Header handleSearch={(searchText: any) => {
                    if (searchText === '') {
                        this.setState({productsList: []});
                        return;
                    }
                    this.setState({productId: null});
                    this.setState({searchText});
                    sendReq(`/sale/products?phrase=${searchText}`)
                        .then((products) => {
                            // console.log(products);
                            const r = (searchText === this.state.searchText)
                                ? this.setState({productsList: products.products}) : null;
                        });
                }}
                />
                {/* <Nav filters={this.state.filters}/> */}
                <Main
                    productsList={this.state.productsList}
                    showProduct={(productId: any) => this.setState({productId})}
                    productId={this.state.productId}
                />
                {/* {this.state.searchText} */}
                <Footer/>
            </>
        );
    }
}

ReactDOM.render(<Root/>, document.getElementById('root'));
console.log(22);

// @ts-ignore
// getCategories('').then((resp: any) => document.getElementById("root").innerHTML = ("<pre>" + JSON.stringify(resp,undefined, 2)) + '<pre/>');

// sendReq('/sale/categories/3').then(data => {
//     // console.log(data.categories.length);
//     // @ts-ignore
//     document.getElementById("root").textContent = JSON.stringify(data, undefined, 2);
// });
