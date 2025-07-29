chrome.action.onClicked.addListener(async (tab) => {
  if (tab.url === "https://freightpower.schneider.com/carrier/app/search") {
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const button = document.querySelector("button"); // change selector to your target button
        if (button) {
          setInterval(() => button.click(), 3000);
        }
      },
    });
  } else {
    console.log("Extension not allowed to run on this page.");
  }
});
