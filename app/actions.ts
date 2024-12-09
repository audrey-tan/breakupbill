"use server";

import { AxiosError } from 'axios';

// Parse receipt
export const parseReceipt = async (imgUrl: string) => {
  // Use Axios to make HTTP requests
  const axios = require('axios'); 

  // Create a JSON payload with imgUrl
  let data = JSON.stringify({
    "file_data": imgUrl
  });

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://api.veryfi.com/api/v8/partner/documents',
    headers: { 
      'Content-Type': 'application/json', 
      'Accept': 'application/json', 
      'CLIENT-ID': process.env.NEXT_PUBLIC_VERYFI_CLIENT_ID, 
      'AUTHORIZATION': `apikey ${process.env.NEXT_PUBLIC_VERYFI_API_KEY}`, 
    },
    data : data
  };

  try {
    // Send request to the Veryfi API using Axios and wait for the response
    const response = await axios(config);
    
    let tempItems: Record<number, {name: string, price: number}> = {};
    let itemId = 1;

    // Iterate through each line in the line_items of the API response
    for (const item of response.data.line_items) {
      // Add item to tempItems
      tempItems[itemId] = {
        name: item.description.replace(/\n/g, " "),
        price: (item.total || 0.00)
      };
      // Increment itemId counter 
      itemId++;
    }

    // Return tempItems and total
    return [tempItems, (+response.data.total?.toFixed(2) || 0.00)];
  } catch (err) {
    const error = err as AxiosError;
    if (error?.response?.status === 429) { // Limit reached error
      return error.response.status;
    }
    return null;
  }
};