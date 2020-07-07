// from when chrome launch , listen  events
// can see on extension tab, background page
let audibleTabIds = [];

chrome.tabs.onUpdated.addListener(handleUpdated);

chrome.runtime.onMessage.addListener(gotMessage);

//handle message from content or popup
function gotMessage(request, sender, sendResponse) {
    console.log(
        `sender:: ${JSON.stringify(sender)} // request :: ${JSON.stringify(
            request
        )}`
    );
    if (request.txt === 'request audibleTabIds') {
        chrome.tabs.query({ audible: true }, function (tabs) {
            // may only need in dev mode // get audio playing tab
            for (i = 0; i < tabs.length; i++) {
                for (let j = 0; j < audibleTabIds.length; j++) {
                    if (audibleTabIds[j].id == tabs[i].id) {
                        break;
                    }
                    if (
                        j == audibleTabIds.length - 1 ||
                        audibleTabIds.length == 0
                    ) {
                        audibleTabIds.push({ id: tabs[i].id, playing: true });
                        // chrome.runtime.sendMessage({
                        //     txt: 'response audibleTabIds',
                        //     audibleTabIds,
                        // });
                    }
                }
            }
        });
        chrome.runtime.sendMessage({
            txt: 'response audibleTabIds',
            audibleTabIds,
        });
    }
    switch (request.txt) {
        case 'play':
            for (let i = 0; i < audibleTabIds.length; i++) {
                if (audibleTabIds[i].id == sender.tab.id) {
                    audibleTabIds[i].playing = true;
                }
            }
            break;
        case 'pause':
            for (let i = 0; i < audibleTabIds.length; i++) {
                if (audibleTabIds[i].id == sender.tab.id) {
                    audibleTabIds[i].playing = false;
                }
            }
            break;
        case 'request audibleTabIds':
            chrome.runtime.sendMessage({
                txt: 'response audibleTabIds',
                audibleTabIds,
            });
            break;
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
    if (changeInfo.audible === true) {
        for (let i = 0; i < audibleTabIds.length; i++) {
            if (audibleTabIds[i].id == tabId) {
                break;
            }
            if (i == audibleTabIds.length - 1) {
                audibleTabIds.push({ id: tabId, playing: changeInfo.audible });
                chrome.runtime.sendMessage({
                    txt: 'response audibleTabIds',
                    audibleTabIds,
                });
            }
        }
    }

    //if audible tab update its title, request title and ad exist
    if (audibleTabIds.includes(tabId) && changeInfo.hasOwnProperty('title')) {
        for (let i = 0; i < audibleTabIds.length; i++) {
            if (audibleTabIds[i].id == tabId) {
                continue;
            }
            if (i == audibleTabIds.length || i == audibleTabIds.length - 1) {
                chrome.tabs.sendMessage(tabId, { txt: 'request title' });
                chrome.tabs.sendMessage(tabId, { txt: 'request ad exist' });
            }
        }
    }
}

chrome.tabs.onRemoved.addListener(function (tabId, removeInfo) {
    console.log(`tabid ${tabId} is closed , removeinfo :: ${removeInfo}`);

    for (let i = 0; i < audibleTabIds.length; i++) {
        if (tabId == audibleTabIds[i].id) {
            audibleTabIds.splice(i, 1);
            console.log(i);
        }
    }
    chrome.runtime.sendMessage({
        txt: 'response audibleTabIds',
        audibleTabIds,
    });
});
