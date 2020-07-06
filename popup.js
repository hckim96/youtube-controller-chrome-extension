chrome.runtime.onMessage.addListener(gotMessage);

let audibleTabId = null;
chrome.runtime.sendMessage({ txt: 'request audibleTabID' });

function gotMessage(request, sender, sendResponse) {
    console.log(`sender:: ${sender} // request :: ${JSON.stringify(request)}`);

    if (request.txt === 'response audibleTabId') {
        audibleTabId = request.audibleTabId;
        const play = document.querySelector('.play-button'),
            next = document.querySelector('.next-button'),
            prev = document.querySelector('.prev-button');

        // chrome.tabs.sendMessage(audibleTabId, { txt: 'request html' });
        // chrome.tabs.sendMessage(audibleTabId, { txt: 'request img' });
        chrome.tabs.sendMessage(audibleTabId, { txt: 'request title' });
        // chrome.tabs.sendMessage(audibleTabId, {
        //     txt: 'request progress',
        // });
        play.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(audibleTabId, { txt: 'play' });
        });
        next.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(audibleTabId, { txt: 'next' });
        });
        prev.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(audibleTabId, { txt: 'prev' });
        });
    } else if (request.txt === 'response html') {
    } else if (request.txt === 'response title') {
        document.querySelector('h2').innerText = request.title;
    } else if (request.txt === 'response img') {
    } else if (request.txt === 'response progress') {
        document.querySelector('progress').max = request.valuemax;
        document.querySelector('progress').value = request.valuenow;
    } else if (request.audible === true) {
        chrome.tabs.sendMessage(request.audibleTabId, { txt: 'request title' });
    } else if (request.txt === 'response ad exist') {
        skip = document.createElement('button');
        skip.classList.add('skip-ad-button');
        skip.innerText = 'skip';
        skip.addEventListener('click', (e) => {
            chrome.tabs.sendMessage(audibleTabId, { txt: 'skip' });
        });
        document.querySelector('.nav-bar').appendChild(skip);
    } else if (request.txt === 'response ad skipped') {
        document.querySelector('.skip-ad-button').remove();
    }
}
