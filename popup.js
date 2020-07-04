chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(request, sender, sendResponse) {
    console.log(`sender:: ${sender} // request :: ${JSON.stringify(request)}`);
    if (request.hasOwnProperty('audibleTabId')) {
        chrome.tabs.sendMessage(request.audibleTabId, { txt: 'request html' });
        chrome.tabs.sendMessage(request.audibleTabId, { txt: 'request title' });
        chrome.tabs.sendMessage(request.audibleTabId, { txt: 'request img' });
        chrome.tabs.sendMessage(request.audibleTabId, {
            txt: 'request progress',
        });
    }

    if (request.txt === 'response to tabid request') {
        const play = document.querySelector('.play-button'),
            next = document.querySelector('.next-button'),
            prev = document.querySelector('.prev-button');
        skip = document.querySelector('.skip-ad-button');

        play.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(request.audibleTabId, { txt: 'play' });
        });
        next.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(request.audibleTabId, { txt: 'next' });
        });
        prev.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(request.audibleTabId, { txt: 'prev' });
        });
        skip.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(request.audibleTabId, { txt: 'skip' });
        });
    } else if (request.txt === 'response html') {
    } else if (request.txt === 'response title') {
        document.querySelector('h2').innerText = request.title;
    } else if (request.txt === 'response img') {
    } else if (request.txt === 'response progress') {
        console.log(request.progress);
        document.querySelector('input').value = request.progress;
    } else if (request.audible === true) {
        chrome.tabs.sendMessage(request.audibleTabId, { txt: 'request title' });
    }
}
chrome.runtime.sendMessage({ txt: 'request audible tabid' });
