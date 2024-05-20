let cache = { data: null, lastFetch: 0 };

const getBuff = async (item_name, coins) => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000; // milliseconds in one hour

  // Convert coins to USD and round to 2 decimal places
  const coinsInUSD = parseFloat(((parseFloat(coins) / 100) * 0.6142808).toFixed(2));

  // Check if cache is older than one hour or empty
  if (!cache.data || now - cache.lastFetch > oneHour) {
    console.log("Fetching new data...");

    // Use the v3 endpoint to get prices for all items
    const url = `https://api.pricempire.com/v3/items/prices?api_key=6057f425-15e1-4262-ae2f-22908c66fac9&currency=USD&source=buff`;

    try {
      const response = await fetch(url, {
        headers: {
          accept: 'application/json'
        }
      });

      if (response.ok) {
        cache.data = await response.json();
        cache.lastFetch = now;
        console.log("200 OK - Price empire Data refreshed");
      } else {
        console.log(`Failed to fetch data: HTTP ${response.status}`);
        return null;
      }
    } catch (error) {
      console.error(`An error occurred: ${error.message}`);
      return null;
    }
  }

  const itemData = cache.data[item_name];

  if (!itemData) {
    console.log(`Item ${item_name} not found.`);
    return null;
  }

  const buffLiquidity = itemData.liquidity;
  const buffPrice = parseFloat((itemData.buff.price / 100).toFixed(2));
  const buffPercentage = parseFloat(((coinsInUSD / buffPrice) * 100).toFixed(2));

  return { coinsInUSD, buffPrice, buffPercentage, buffLiquidity };
};