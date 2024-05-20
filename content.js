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
          const data = await response.json();
          console.log("API Response:", data);
          cache.data = data;
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

async function injectBuffData(itemCard, formattedName, itemPrice) {
    try {
      const percentElement = itemCard.querySelector('[data-testid="real-price-percent"]');
  
      if (percentElement) {
        const container = percentElement.parentNode;
        let testElement = container.querySelector('.test-element');
  
        if (!testElement) {
          testElement = document.createElement('div');
          testElement.classList.add('test-element');
  
          const percentStyles = window.getComputedStyle(percentElement);
          testElement.style.fontSize = '12px';
          testElement.style.fontWeight = percentStyles.fontWeight;
          testElement.style.color = percentStyles.color;
          testElement.style.backgroundColor = percentStyles.backgroundColor;
          testElement.style.padding = percentStyles.padding;
          testElement.style.borderRadius = percentStyles.borderRadius;
          testElement.style.marginLeft = '4px';
  
          container.appendChild(testElement);
        }
  
        const itemPrice = parseFloat(itemPrice.replace(/,/g, ''));
        const buffData = await getBuff(formattedName, itemPrice);
  
        if (buffData) {
          const { buffPercentage, buffLiquidity } = buffData;
          testElement.textContent = `${buffPercentage}% (${buffLiquidity})`;
  
          if (buffLiquidity === 100) {
            itemCard.style.border = '2px solid orange';
          } else {
            itemCard.style.border = 'none';
          }
        } else {
          testElement.textContent = 'Error: Failed to get Buff data';
          itemCard.style.border = 'none';
        }
      }
    } catch (error) {
      console.error('Error injecting Buff data:', error);
    }
  }
  
  function observeItemCards() {
    const itemCardsContainer = document.querySelector('.items-grid');
  
    if (itemCardsContainer) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(async node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.item-card')) {
                const itemCard = node.querySelector('.item-card');
                const itemType = itemCard.querySelector('p.size-small.font-bold');
                const itemName = itemCard.querySelector('p.size-medium.font-bold.text-light-1');
                const itemCondition = itemCard.querySelector('p[data-v-d6b986a2].size-small.font-bold.flex-shrink-0.uppercase');
                const itemPrice = itemCard.querySelector('span.font-numeric.inline-flex.items-baseline.justify-center.font-bold.text-large div.font-numeric');
  
                if (itemType && itemName && itemCondition && itemPrice) {
                  const formattedName = `${itemType.textContent} | ${itemName.textContent} (${itemCondition.textContent})`;
                  await injectBuffData(itemCard, formattedName, itemPrice.textContent);
                }
              }
            });
          }
        });
      });
  
      observer.observe(itemCardsContainer, { childList: true, subtree: true });
  
      const existingItemCards = itemCardsContainer.querySelectorAll('.item-card');
      existingItemCards.forEach(async itemCard => {
        const itemType = itemCard.querySelector('p.size-small.font-bold');
        const itemName = itemCard.querySelector('p.size-medium.font-bold.text-light-1');
        const itemCondition = itemCard.querySelector('p.size-small.font-bold.flex-shrink-0.uppercase');
        const itemPrice = itemCard.querySelector('span.font-numeric.inline-flex.items-baseline.justify-center.font-bold.text-large div.font-numeric');
  
        if (itemType && itemName && itemCondition && itemPrice) {
          const formattedName = `${itemType.textContent} | ${itemName.textContent} (${itemCondition.textContent})`;
          await injectBuffData(itemCard, formattedName, itemPrice.textContent);
        }
      });
    } else {
      setTimeout(observeItemCards, 1000);
    }
  }
  
  observeItemCards();