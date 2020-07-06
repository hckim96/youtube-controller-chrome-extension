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
    if (request.txt === 'request audible tabid') {
        chrome.runtime.sendMessage({
            txt: 'response audibleTabId',
            audibleTabId,
        });
    }
}

function handleUpdated(tabId, changeInfo, tab) {
    chrome.tabs.query({ active: true }, function (t) {
        chrome.tabs.sendMessage(t[0].id, changeInfo);
        chrome.runtime.sendMessage({ audibleTabId: tabId, ...changeInfo });
    });
    if (changeInfo.audible === true) {
        audibleTabId = tabId;
    }
}

chrome.tabs.onUpdated.addListener(handleUpdated);

chrome.tabs.query({ audible: true }, function (tabs) {
    if (tabs.length !== 0) {
        audibleTabId = tabs[0].id;
    }
});
