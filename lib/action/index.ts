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
                priceHistory:updatedPriceHistory,
                lowestPrice:getLowestPrice(updatedPriceHistory),
                averagePrice: getAveragePrice(updatedPriceHistory),
                highestPrice: getHighestPrice(updatedPriceHistory),

             }

             const newProduct= await Product.findOne(
               { url: scrapedProduct.url},
                product,
                {upsert: true,new : true}
               )

      revalidatePath(`/products/${newProduct._id}`);
             
     }

    } catch (error:any) { 
        throw new Error(`failed to scrape: ${error.message}`);
    }
}