function injectTestText(itemCard) {
    let testElement = itemCard.querySelector('.test-element');
    
    if (!testElement) {
      // If the test element doesn't exist, create it
      testElement = document.createElement('div');
      testElement.classList.add('test-element');
      testElement.style.color = 'white';
      testElement.style.backgroundColor = 'red';
      itemCard.insertBefore(testElement, itemCard.firstChild);
    }
    
    const percentElement = itemCard.querySelector('[data-testid="real-price-percent"]');
    
    if (percentElement) {
      let testElement = percentElement.parentNode.querySelector('.test-element');
      
      if (!testElement) {
        // If the test element doesn't exist within the container, create it
        testElement = document.createElement('div');
        testElement.classList.add('test-element');
        
        // Get the computed styles of the percent element
        const percentStyles = window.getComputedStyle(percentElement);
        
        // Apply the styles to the test element
        testElement.style.fontSize = '12px';
        testElement.style.fontWeight = percentStyles.fontWeight;
        testElement.style.color = percentStyles.color;
        testElement.style.backgroundColor = percentStyles.backgroundColor;
        testElement.style.padding = percentStyles.padding;
        testElement.style.borderRadius = percentStyles.borderRadius;
        testElement.style.marginLeft = '4px';
        
        // Wrap the percent element and test element in a new container
        const container = document.createElement('div');
        container.classList.add('flex', 'items-center');
        percentElement.parentNode.insertBefore(container, percentElement);
        container.appendChild(percentElement);
        container.appendChild(testElement);
      }
      
      // Check if the item has bids
      const bidElement = itemCard.querySelector('.icon-container + .size-medium');
      
      if (bidElement) {
        const bidCount = parseInt(bidElement.textContent.trim());
        testElement.textContent = `test ${bidCount}`;
        
        // Add orange border to the item card
        itemCard.style.border = '2px solid orange';
      } else {
        testElement.textContent = 'test';
        
        // Remove orange border from the item card
        itemCard.style.border = 'none';
      }
    }
  }
  
  function observeItemCards() {
    const itemCardsContainer = document.querySelector('.items-grid');
    
    if (itemCardsContainer) {
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          if (mutation.type === 'childList') {
            mutation.addedNodes.forEach(node => {
              if (node.nodeType === Node.ELEMENT_NODE && node.querySelector('.item-card')) {
                const itemCard = node.querySelector('.item-card');
                injectTestText(itemCard);
              }
            });
          }
        });
      });
  
      observer.observe(itemCardsContainer, { childList: true, subtree: true });
      
      // Inject "test" text into existing item cards
      const existingItemCards = itemCardsContainer.querySelectorAll('.item-card');
      existingItemCards.forEach(itemCard => {
        injectTestText(itemCard);
      });
    } else {
      setTimeout(observeItemCards, 1000); // Retry after 1 second if the container is not found
    }
  }
  
  observeItemCards();