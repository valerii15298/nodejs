import React from "react";
import ImageGallery from 'react-image-gallery';

const ProductPreview = (props: any) => {
    // console.log(props.data);
    // return <pre onClick={() => props.showProduct(props.data.id)}>{JSON.stringify(props.data, null, 2)}</pre>;
    // const product = props.data,
    //     images = product.images;
    // let r = [];
    // let urls = images.map((el: any) => {
    //     r.push({original: el.url, thumbnail: el.url});
    // });
    let images = [
        {
            original: 'https://picsum.photos/id/1018/1000/600/',
            thumbnail: 'https://picsum.photos/id/1018/250/150/',
        },
        {
            original: 'https://picsum.photos/id/1015/1000/600/',
            thumbnail: 'https://picsum.photos/id/1015/250/150/',
        },
        {
            original: 'https://picsum.photos/id/1019/1000/600/',
            thumbnail: 'https://picsum.photos/id/1019/250/150/',
        },
    ];
    // console.log(product);
    return <div className="product-preview">
        <ImageGallery items={images}/>
        {/*{images.map((image: any) => <img key={image.url} src={image.url} alt=""/>)}*/}
    </div>;

}

export default ProductPreview;