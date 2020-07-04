function gotTab(tabs) {
    console.log(tabs);
    console.log(tabs[0]);
    chrome.tabs.sendMessage(tabs[0].id, tabs[0]);
}

chrome.tabs.query({ audible: true }, gotTab);
