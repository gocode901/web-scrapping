'use server';
import { revalidatePath } from "next/cache";    /// otherwise we stuck in cache error
import Product from "../models/product.model";
import { connectToDB } from "../Mongosse";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";
export async function scrapeAndStoreProduct(productURL:string){
    if(!productURL) return;
    try {
        connectToDB();
        const scrapedProduct:any = await scrapeAmazonProduct(productURL);  // why i used this any 
        if(!scrapedProduct) return;
    //    if (scrapedProduct === null ) return;
       let product = scrapedProduct;
       
      const existingProduct = await Product.findOne({url: scrapedProduct.url});


     if(existingProduct){
             const updatedPriceHistory:any =[
                ...existingProduct.priceHistory,
                 {price: scrapedProduct.currentPrice },
             ]
             product={
           ...scrapedProduct,
                priceHistory:updatedPriceHistory,     // update price history;
                lowestPrice:getLowestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),

             }

             const newProduct= await Product.findOneAndUpdate(
               { url: scrapedProduct.url},
                product,                           // update product;
                {upsert: true, new : true}   // if new one is added then add
               )
      revalidatePath(`/products/${newProduct._id}`);
     }

    } catch (error:any) { 
        throw new Error(`failed to scrape: ${error.message}`);
    }
}
export async function getProductById(productId:string){
    try {
        connectToDB();
        // fetch product 
        const product = await Product.findOne({_id: productId});
        if(!product) return null;

        return product;
    } catch (error) {
        console.log(error);
    }
}

export async function getAllProducts(){
    try {
        connectToDB();
        // fetch all products
        const products = await Product.find();
        return products;
    } catch (error) {
        console.log(error);
    }
}