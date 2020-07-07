// from when chrome launch , listen  events
// can see on extension tab, background page
let audibleTabIds = [];

chrome.tabs.onUpdated.addListener(handleUpdated);
chrome.tabs.query({ audible: true }, function (tabs) {
    // may only need in dev mode // get audio playing tab
    for (i = 0; i < tabs.length; i++) {
        if (!audibleTabIds.includes(tabs[i].id)) {
            audibleTabIds.push(tabs[i].id);
        }
    }
});
chrome.runtime.onMessage.addListener(gotMessage);

//handle message from content or popup
function gotMessage(request, sender, sendResponse) {
    console.log(
        `sender:: ${JSON.stringify(sender)} // request :: ${JSON.stringify(
            request
        )}`
    );
    if (request.txt === 'request audibleTabIds') {
        chrome.runtime.sendMessage({
            txt: 'response audibleTabIds',
            audibleTabIds,
        });
    }
}

//listens to change of tabs
function handleUpdated(tabId, changeInfo, tab) {
    // send tab changeinfo to currently active tab for debug
    chrome.tabs.query({ active: true }, function (t) {
        chrome.tabs.sendMessage(t[0].id, changeInfo);
        chrome.runtime.sendMessage({ audibleTabId: tabId, ...changeInfo });
    });

    // if there's new audible tab -> push to audibletabids
    if (changeInfo.audible === true && !audibleTabIds.includes(tabId)) {
        audibleTabIds.push(tabId);
    }

    //if audible tab update its title, request title and ad exist
    if (audibleTabIds.includes(tabId) && changeInfo.hasOwnProperty('title')) {
        chrome.tabs.sendMessage(tabId, { txt: 'request title' });
        chrome.tabs.sendMessage(tabId, { txt: 'request ad exist' });
    }
}
