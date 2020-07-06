// from when chrome launch , listen  events
// can see on extension tab, background page
let audibleTabId = null;

chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(request, sender, sendResponse) {
    console.log(
        `sender:: ${JSON.stringify(sender)} // request :: ${JSON.stringify(
            request
        )}`
    );
    if (request.txt === 'request audibleTabID') {
        chrome.runtime.sendMessage({
            txt: 'response audibleTabId',
            audibleTabId,
        });
    }
}

function handleUpdated(tabId, changeInfo, tab) {
    chrome.tabs.query({ active: true }, function (t) {
        chrome.tabs.sendMessage(t[0].id, changeInfo); // send tab changeinfo to currently active tab for debug
        chrome.runtime.sendMessage({ audibleTabId: tabId, ...changeInfo });
    });
    if (changeInfo.audible === true) {
        audibleTabId = tabId;
    }
    if (audibleTabId === tabId) {
        if (changeInfo.hasOwnProperty('title')) {
            chrome.tabs.sendMessage(tabId, { txt: 'request title' });
            chrome.tabs.sendMessage(tabId, { txt: 'request ad exist' });
        }
    }
}

chrome.tabs.onUpdated.addListener(handleUpdated);

chrome.tabs.query({ audible: true }, function (tabs) {
    // may only need in dev mode // get audio playing tab
    if (tabs.length !== 0) {
        audibleTabId = tabs[0].id;
    }
});
