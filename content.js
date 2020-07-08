chrome.runtime.onMessage.addListener(gotMessage);
let progressBar;
let buttons;
let intervalIdList = [];
let asdf = null;

function gotMessage(request, sender, sendResponse) {
    console.log(`sender:: ${JSON.stringify(sender)}`);
    console.log(`request :: ${JSON.stringify(request)}`);
    if (asdf == null && document.querySelector('video') != null) {
        asdf = setInterval(() => {
            chrome.runtime.sendMessage({
                txt: 'response progress',
                valuemax: document.querySelector('video').duration,
                valuenow: document.querySelector('video').currentTime,
            });
            // console.dir(
            //     document.querySelector(
            //         '#movie_player > div.html5-video-container > video'
            //     )
            // );
        }, 1000);
        document.querySelector('video').addEventListener('pause', () => {
            chrome.runtime.sendMessage({
                txt: 'response pause',
            });
            console.log('video paused');
        });
        document.querySelector('video').addEventListener('play', () => {
            chrome.runtime.sendMessage({
                txt: 'response play',
            });
            console.log('video play');
        });
    }
    switch (request.txt) {
        case 'play':
            document
                .querySelector(
                    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button'
                )
                .click();
            break;
        case 'stop':
            document
                .querySelector(
                    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > button'
                )
                .click();
            break;
        case 'next':
            document
                .querySelector(
                    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-next-button.ytp-button'
                )
                .click();

            break;
        case 'prev':
            document
                .querySelector(
                    '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > a.ytp-prev-button.ytp-button'
                )
                .click();

            break;
        case 'skip':
            buttons = document
                .querySelector('#movie_player > div.video-ads.ytp-ad-module')
                .querySelectorAll('button');

            for (let i = 0; i < buttons.length; i++) {
                console.log(`i = ${i}`);
                if (buttons[i].classList.contains('ytp-ad-skip-button')) {
                    buttons[i].click();
                    console.log(`target i = ${i}`);
                    chrome.runtime.sendMessage({ txt: 'response ad skipped' });
                }
            }
            break;
        // case 'request html':
        //     chrome.runtime.sendMessage({
        //         txt: 'response html',
        //         html: document.all[0].outerHTML,
        //     });
        //     break;
        case 'request title':
            ele = document.querySelector(
                '#container > h1 > yt-formatted-string'
            );

            chrome.runtime.sendMessage({
                txt: 'response title',
                title: ele.textContent,
            });
            buttons = document
                .querySelector('#movie_player > div.video-ads.ytp-ad-module')
                .querySelectorAll('button');

            for (let i = 0; i < buttons.length; i++) {
                console.log(`i = ${i}`);
                if (buttons[i].classList.contains('ytp-ad-skip-button')) {
                    buttons[i].click();
                    console.log(`target i = ${i}`);
                    chrome.runtime.sendMessage({ txt: 'response ad skipped' });
                }
            }
            break;
        case 'request img':
            chrome.runtime.sendMessage({
                txt: 'response img',
            });
            break;
        case 'request progress':
            break;
        case 'request ad exist':
            let adModule = document.querySelector(
                '#movie_player > div.video-ads.ytp-ad-module'
            );
            if (
                typeof adModule != 'undefined' &&
                adModule != null &&
                adModule.hasChildNodes()
            ) {
                console.log('ad exist');
                if (adModule.querySelector('button')) {
                    console.log('button exist');
                    chrome.runtime.sendMessage({ txt: 'response ad exist' });
                }
            } else {
                console.log('ad does not exist');
            }

            break;

        default:
            break;
    }
}

chrome.runtime.sendMessage({ txt: 'this is from content message' });
