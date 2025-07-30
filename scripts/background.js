// This function encapsulates the logic to inject and run the content script
async function injectAndRunContentScript(tabId) {
  try {
    const results = await chrome.scripting.executeScript({
      target: { tabId: tabId },
      func: () => {
        // --- CONTENT SCRIPT STARTS HERE ---
        // This code runs *inside* the context of the target webpage.

        const applyButton = document.querySelector(
          'ion-button[data-testid="apply-mobile"]'
        );

        if (applyButton) {
          // Immediately start clicking the button every 3 seconds
          setInterval(() => {
            applyButton.click();
            console.log(
              "Refresher: Button clicked automatically (immediate trigger)!"
            );
          }, 10000);

          console.log(
            "Refresher: Automatic refreshing started immediately on page load."
          );
          return true; // Indicate success to the background script
        } else {
          console.log(
            "Refresher: Apply button not found on page. Cannot start immediate auto-refresh."
          );
          return false; // Indicate failure
        }

        // --- CONTENT SCRIPT ENDS HERE ---
      },
    });

    // Handle results returned from the content script (optional)
    if (results && results[0] && results[0].result === true) {
      console.log(
        `Refresher: Script injected successfully and auto-refresh initiated on tab ${tabId}.`
      );
    } else {
      console.log(
        `Refresher: Script injected, but button was not found on tab ${tabId}.`
      );
    }
  } catch (error) {
    console.error(
      `Refresher: Error injecting script into tab ${tabId}:`,
      error
    );
  }
}

// Listen for updates to tabs to automatically inject the content script when the page is fully loaded.
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  // We only want to act when:
  // 1. The tab's status is 'complete' (meaning the DOM is fully loaded).
  // 2. The tab's URL matches our target page.
  if (
    changeInfo.status === "complete" &&
    tab.url &&
    tab.url.startsWith("https://freightpower.schneider.com/carrier/app/search")
  ) {
    console.log(
      `Refresher: Detected target page fully loaded: ${tab.url}. Attempting immediate script injection...`
    );
    injectAndRunContentScript(tabId);
  }
});

// This log confirms that your background service worker has loaded.
console.log("Refresher: Background script loaded and ready.");
