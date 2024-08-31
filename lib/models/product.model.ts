
import mongoose from "mongoose";

const productSchema= new mongoose.Schema({
    url:{type: String,required:true, unique:true},
    image: {type: String,required:true},
    title:{type: String},
    currentPrice:{type: Number,required:true},
    originalPrice:{type: Number,required:true},
    priceHistory:{
        price:{type: Number,required:true},
        date:{type:Date,default:Date.now }},
    outOfStock:{type:Boolean ,default:false},
    discountRate:{type: Number},
    lowestPrice:{type: Number},
    highestPrice:{type: Number},
    averagePrice:{type: Number},
    discription:{type: String},
    category:{type: String},
    reviewsCount:{type: Number},
    stars:{type: Number},
    users:[
        {email:{type: String,required:true}}
    ],
    default:[]


},
{timestamps:true}
    
);

const Product= mongoose.models.Product || mongoose.model('Product',productSchema);
export default Product;