chrome.runtime.onMessage.addListener(gotMessage);

let audibleTabIds = [];
chrome.runtime.sendMessage({ txt: 'request audibleTabIds' });

function gotMessage(request, sender, sendResponse) {
    console.log(
        `sender:: ${JSON.stringify(sender)} // request :: ${JSON.stringify(
            request
        )}`
    );

    switch (request.txt) {
        case 'response audibleTabIds':
            audibleTabIds = request.audibleTabIds;
            let audibleTabContainer = document.querySelector(
                '.audible-tab-container'
            );
            while (audibleTabContainer.hasChildNodes()) {
                audibleTabContainer.removeChild(audibleTabContainer.firstChild);
            }

            let progress, play, next, prev, audibleTab, navBar, header;

            for (let i = 0; i < audibleTabIds.length; i++) {
                header = document.createElement('h1');
                audibleTab = document.createElement('div');
                audibleTab.classList.add('audible-tab');
                audibleTab.id = 'audible-tab-' + audibleTabIds[i];
                navBar = document.createElement('div');
                navBar.classList.add('nav-bar');
                navBar.id = 'nav-bar-' + audibleTabIds[i];
                header.id = 'h-' + audibleTabIds[i];
                prev = document.createElement('button');
                prev.classList.add('prev-button');
                prev.id = 'prev-' + audibleTabIds[i];
                prev.innerHTML =
                    '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-10"></use><path class="ytp-svg-fill" d="m 12,12 h 2 v 12 h -2 z m 3.5,6 8.5,6 V 12 z" id="ytp-id-10"></path></svg>';
                next = document.createElement('button');
                next.classList.add('next-button');
                next.id = 'next-' + audibleTabIds[i];
                next.innerHTML =
                    '<svg height="100%" version="1.1" viewBox="0 0 36 36" width="100%"><use class="ytp-svg-shadow" xlink:href="#ytp-id-12"></use><path class="ytp-svg-fill" d="M 12,24 20.5,18 12,12 V 24 z M 22,12 v 12 h 2 V 12 h -2 z" id="ytp-id-12"></path></svg>';
                progress = document.createElement('progress');
                progress.max = 100;
                progress.value = 0;
                progress.id = 'progress-' + audibleTabIds[i];
                play = document.createElement('button');
                play.classList.add('play-button');
                play.id = 'play-' + audibleTabIds[i];
                play.innerHTML = '&#9658;';

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
            skip.id = 'skip-' + sender.tab.id;
            skip.innerText = 'skip';
            skip.addEventListener('click', (e) => {
                chrome.tabs.sendMessage(sender.tab.id, { txt: 'skip' });
            });
            document
                .querySelector('#nav-bar-' + sender.tab.id)
                .appendChild(skip);
            break;
        case 'response ad skipped':
            document.querySelector('#skip-' + sender.tab.id).remove();
            break;

        default:
            break;
    }
}
