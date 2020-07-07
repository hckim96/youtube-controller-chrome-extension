chrome.runtime.onMessage.addListener(gotMessage);

let audibleTabIds = [];
chrome.runtime.sendMessage({ txt: 'request audibleTabIds' });

function gotMessage(request, sender, sendResponse) {
    console.log(`sender:: ${sender} // request :: ${JSON.stringify(request)}`);

    switch (request.txt) {
        case 'response audibleTabIds':
            audibleTabIds = request.audibleTabIds;
            let audibleTabContainer = document.querySelector(
                '.audible-tab-container'
            );

            let progress, play, next, prev, audibleTab, navBar, header;

            for (let i = 0; i < audibleTabIds.length; i++) {
                header = document.createElement('h1');
                audibleTab = document.createElement('div');
                audibleTab.classList.add('audible-tab');
                navBar = document.createElement('div');
                navBar.classList.add('nav-bar');
                progress = document.createElement('progress');
                progress.max = 100;
                progress.value = 0;
                play = document.createElement('button');
                prev = document.createElement('button');
                next = document.createElement('button');
                play.classList.add('play-button');
                prev.classList.add('prev-button');
                next.classList.add('next-button');
                audibleTab.id = 'audible-tab-' + audibleTabIds[i];
                navBar.id = 'nav-bar-' + audibleTabIds[i];
                progress.id = 'progress-' + audibleTabIds[i];
                header.id = 'h-' + audibleTabIds[i];
                play.id = 'play-' + audibleTabIds[i];
                next.id = 'next-' + audibleTabIds[i];
                prev.id = 'prev-' + audibleTabIds[i];
                play.innerText = 'play';
                prev.innerText = 'prev';
                next.innerText = 'next';

                play.addEventListener('click', (e) => {
                    chrome.tabs.sendMessage(audibleTabIds[i], { txt: 'play' });
                });
                next.addEventListener('click', (e) => {
                    chrome.tabs.sendMessage(audibleTabIds[i], { txt: 'next' });
                });
                prev.addEventListener('click', (e) => {
                    chrome.tabs.sendMessage(audibleTabIds[i], { txt: 'prev' });
                });

                audibleTabContainer.appendChild(audibleTab);
                audibleTab.appendChild(header);
                audibleTab.appendChild(progress);
                audibleTab.appendChild(navBar);
                navBar.appendChild(prev);
                navBar.appendChild(play);
                navBar.appendChild(next);

                chrome.tabs.sendMessage(audibleTabIds[i], {
                    txt: 'request title',
                });
            }

            break;
        case 'response title':
            document.querySelector('#h-' + sender.tab.id).innerText =
                request.title;
            break;
        case 'response progress':
            document.querySelector('#progress-' + sender.tab.id).max =
                request.valuemax;
            document.querySelector('#progress-' + sender.tab.id).value =
                request.valuenow;
            break;
        case 'response ad exist':
            skip = document.createElement('button');
            skip.classList.add('skip-ad-button');
            skip.innerText = 'skip';
            skip.addEventListener('click', (e) => {
                chrome.tabs.sendMessage(audibleTabIds, { txt: 'skip' });
            });
            document.querySelector('.nav-bar').appendChild(skip);
            break;
        case 'response ad skipped':
            document.querySelector('.skip-ad-button').remove();
            break;

        default:
            break;
    }
    if (request.audible === true) {
        chrome.tabs.sendMessage(request.audibleTabIds, {
            txt: 'request title',
        });
    }
}
