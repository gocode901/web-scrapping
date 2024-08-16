import axios from 'axios';
import * as cheerio from 'cheerio';
import { extractCurrency, extractDescription, extractPrice } from '../utils';
export async function scrapeAmazonProduct(url:string) {
    if(!url) return;

// curl --proxy brd.superproxy.io:22225 --proxy-user brd-customer-hl_80f5b354-zone-web_unlocker9:0shx8t1x17gj -k "https://geo.brdtest.com/welcome.txt"

    /// BrightData proxy configuration
    const username= String(process.env.BRIGHT_DATA_USERNAME)
    const password= String(process.env.BRIGHT_DATA_PASSWORD)
    const port = 22225;
    const session_id = (1000000 * Math.random()) | 0;
  
    const options = {
      auth: {
        username: `${username}-session-${session_id}`,
        password,
      },
      host: 'brd.superproxy.io',
      port,
      rejectUnauthorized: false,
    }
    try {
        //fetch the product
        const response = await axios.get(url, options );
        const $ = cheerio.load(response.data);
        // Extract product details
        const title= $('#productTitle').text().trim();
        const rating = $('#acrCustomerReviewText').text().trim();
       
       
         const currentPrice = extractPrice(
          $('.priceToPay span.a-price-whole'),
          $('a.size.base.a-color-price'),
          $('.a-button-selected .a-color-base'),
       

        );
        const originalPrice=extractPrice(
          $('#priceblock_ourprice'),
          $('.a-price.a-text-price span.a-offscreen'),
          $('#listPrice '),
          $('#priceblock_dealprice'),
          $('.a-size-base .a-color-price'),

        );
        const outOfStock= $('#availability span').text().trim().toLowerCase()==='currently unavailable';
       
        const images =$('#imgBlkFront').attr('data-a-dynamic-image')|| $('#landingImage').attr('data-a-dynamic-image')||'{}';


        const imagesUrl=Object.keys(JSON.parse(images));


        // const currency=$('.a-price-symbol').text().trim().slice(0,2);    
        //  here no need to define an extra function ;
        const currency=extractCurrency($('.a-price-symbol'));  //using the extra function

        // const discountRate = $('.savingsPercentage').text().trim();   // gives as '-27%'
        const discountRate = $('.savingsPercentage').text().replace(/[%]/g, '');

       const Discription = extractDescription($);
           // console.log({title,rating, currentPrice, originalPrice,outOfStock,imagesUrl,currency,discountRate});
    
// now instead of the console.log() function , constract data object with scraped information
        
        const data = {
          url,
          image :imagesUrl[0],
          title,
          currency:currency||'$',
          currentPrice:Number(currentPrice)|| Number(originalPrice),
          discountRate:Number(discountRate),
          originalPrice:Number(originalPrice)||Number(currentPrice),
          rating :rating,
          category:'category',
          outOfStock:outOfStock,
          Discription,
          priceHistory:[],
          lowestPrice:Number(currentPrice)|| Number(originalPrice),
          highestPrice:Number(originalPrice)||Number(currentPrice),
          averagePrice:Number(originalPrice)||Number(currentPrice),


        };
        console.log(data);

      } catch (error:any) {
        throw new Error(`failed to scrape: ${error.message}`)
    }
} 