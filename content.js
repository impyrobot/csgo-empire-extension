function injectTestText(itemCard) {
    let testElement = itemCard.querySelector('.test-element');
  
    if (!testElement) {
      // If the test element doesn't exist, create it
      testElement = document.createElement('div');
      testElement.classList.add('test-element');
      testElement.style.color = 'white';
      testElement.style.backgroundColor = 'red';
      testElement.style.position = 'absolute'; // Add position absolute for higher stacking context
      testElement.style.zIndex = '9999'; // Increase z-index to ensure visibility
      itemCard.insertBefore(testElement, itemCard.firstChild);
    }
  
    const percentElement = itemCard.querySelector('[data-testid="real-price-percent"]');
  
    if (percentElement) {
      const handleTestElement = (function () {
        let currentTestElement = testElement;
  
        return function () {
          currentTestElement = percentElement.parentNode.querySelector('.test-element');
  
          if (!currentTestElement) {
            // If the test element doesn't exist within the container, create it
            currentTestElement = document.createElement('div');
            currentTestElement.classList.add('test-element');
  
            // Get the computed styles of the percent element
            const percentStyles = window.getComputedStyle(percentElement);
  
            // Apply the styles to the test element
            currentTestElement.style.fontSize = '12px';
            currentTestElement.style.fontWeight = percentStyles.fontWeight;
            currentTestElement.style.color = percentStyles.color;
            currentTestElement.style.backgroundColor = percentStyles.backgroundColor;
            currentTestElement.style.padding = percentStyles.padding;
            currentTestElement.style.borderRadius = percentStyles.borderRadius;
            currentTestElement.style.marginLeft = '4px';
            currentTestElement.style.position = 'relative'; // Add position relative for layout
    
            // Wrap the percent element and test element in a new container
            const container = document.createElement('div');
            container.classList.add('flex', 'items-center'); // Add flex-col to stack elements vertically
            percentElement.parentNode.insertBefore(container, percentElement);
            container.appendChild(percentElement);
            container.appendChild(currentTestElement);

            const targetDiv = itemCard.querySelector('.my-sm.flex.h-full.flex-col.justify-between.px-lg.pb-md');

            if (targetDiv) {
                // Create a sub-container for the additional elements
                const subContainer = document.createElement('div');
                subContainer.classList.add('sub-container');
                subContainer.style.marginTop = '4px';
                subContainer.style.display = 'flex';
                subContainer.style.justifyContent = 'flex-start';
                subContainer.style.gap = '0px'; // Add 10px gap between elements

                // Create favicon element
                const buffImageElement = document.createElement('img');
                buffImageElement.src = 'https://buff.163.com/favicon.ico'; // Replace with the actual path or URL of your favicon image
                buffImageElement.alt = 'Buff';
                buffImageElement.style.width = '16px'; // Adjust the width as needed
                buffImageElement.style.height = '16px'; // Adjust the height as needed
                subContainer.appendChild(buffImageElement);
      
                // Create buffPercentageElement
                const buffPercentageElement = document.createElement('div');
                buffPercentageElement.classList.add('buff-percentage-element');
                buffPercentageElement.textContent = 'XX.XX%';
                buffPercentageElement.style.fontSize = '12px';
                buffPercentageElement.style.color = 'white';
                buffPercentageElement.style.textAlign = 'center';
                // buffPercentageElement.style.margin = '0 8px';
                subContainer.appendChild(buffPercentageElement);
      
                // Create liquidityElement
                const liquidityElement = document.createElement('div');
                liquidityElement.classList.add('liquidity-element');
                liquidityElement.textContent = 'XXX liqudity';
                liquidityElement.style.fontSize = '12px';
                liquidityElement.style.color = 'white';
                liquidityElement.style.textAlign = 'center';
                liquidityElement.style.margin = '0 8px';
                subContainer.appendChild(liquidityElement);
      
                // Insert the sub-container into the target div
                targetDiv.appendChild(subContainer);
            }
          }
  
          // Check if the item has bids
          const bidElement = itemCard.querySelector('.icon-container + .size-medium');
  
          if (bidElement) {
            const bidCount = parseInt(bidElement.textContent.trim());
            currentTestElement.textContent = `test ${bidCount}`;
  
            // Add orange border to the item card
            itemCard.style.border = '2px solid orange';
            itemCard.style.position = 'relative'; // Add position relative for border
          } else {
            currentTestElement.textContent = 'test';
  
            // Remove orange border from the item card
            itemCard.style.border = 'none';
          }
  
          // Update the outer testElement variable with the current value
          testElement = currentTestElement;
        };
      })();
  
      handleTestElement();
    }
  
    // Get the formatted name
    const itemPrefix = itemCard.querySelector('.prefix');
    const itemName = itemCard.querySelector('p.size-medium.font-bold.text-light-1');
    const itemTypeAndCondition = Array.from(itemCard.querySelectorAll('p.size-small.font-bold'));


    let itemType = '';
    let itemCondition = '';
  
    itemTypeAndCondition.forEach(element => {
      const isCondition = element.classList.contains('flex-shrink-0') && element.classList.contains('uppercase');
      if (isCondition) {
        itemCondition = element.textContent.trim();
      } else {
        itemType = element.textContent.trim();
      }
    });
  
    let formattedName = `${itemPrefix ? `${itemPrefix.textContent} ` : ''}${itemType}`;

    //TODO - Add handling for gems (maybe also agent skins? stickers?)

    // If the formatted name is empty its probably a vanilla knife where itemType is "" and itemName is the the only thing that exists
    if (formattedName == "") {
        formattedName += `${itemName.textContent.trim()}`;
    // Else it is a regular item and we append the itemName and itemCondition to itemType
    } else {
        if (itemName) {
            formattedName += ` | ${itemName.textContent.trim()}`;
        }

        if (itemCondition) {
            formattedName += ` (${itemCondition})`;
        }
    }
    console.log(formattedName);
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
  
      const existingItemCards = itemCardsContainer.querySelectorAll('.item-card');
      existingItemCards.forEach(itemCard => {
        injectTestText(itemCard);
      });
    } else {
      setTimeout(observeItemCards, 1000);
    }
  }
  
  observeItemCards();