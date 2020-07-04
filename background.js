// from when chrome launch , listen  events
console.log('background running'); // cant see on page inspection
// can see on extension tab, background page

chrome.browserAction.onClicked.addListener(buttonClicked);
function buttonClicked(tab) {
    console.log(tab);
    const msg = {
        txt: 'hello',
    };
    chrome.tabs.sendMessage(tab.id, msg);

    chrome.tabs.query({ audible: true }, gotTab);
    function gotTab(tabs) {
        chrome.tabs.sendMessage(tab.id, tabs[0]);
    }
}
