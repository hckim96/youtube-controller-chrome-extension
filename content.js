chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(request, sender, sendResponse) {
    console.log(`sender:: ${sender} // request :: ${JSON.stringify(request)}`);

    const a = document.querySelectorAll('a');
    const buttons = document.querySelectorAll('button');
    let ele;
    // ele = document.querySelector('#container > h1 > yt-formatted-string');

    // chrome.runtime.sendMessage({
    //     txt: 'response title',
    //     title: ele.textContent,
    // });
    switch (request.txt) {
        case 'play':
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains('ytp-play-button')) {
                    buttons[i].click();
                }
            }
            break;
        case 'stop':
            for (let i = 0; i < buttons.length; i++) {
                if (buttons[i].classList.contains('ytp-play-button')) {
                    buttons[i].click();
                }
            }
            break;
        case 'next':
            for (let i = 0; i < a.length; i++) {
                if (a[i].classList.contains('ytp-next-button')) {
                    a[i].click();
                }
            }
            break;
        case 'prev':
            for (let i = 0; i < a.length; i++) {
                if (a[i].classList.contains('ytp-prev-button')) {
                    a[i].click();
                }
            }
            break;
        case 'skip':
            let skip = document.querySelector(
                '#skip-button:23 > span > button'
            );
            skip.click();
            break;
        case 'request html':
            chrome.runtime.sendMessage({
                txt: 'response html',
                html: document.all[0].outerHTML,
            });
            break;
        case 'request title':
            ele = document.querySelector(
                '#container > h1 > yt-formatted-string'
            );

            chrome.runtime.sendMessage({
                txt: 'response title',
                title: ele.textContent,
            });

            break;
        case 'request img':
            chrome.runtime.sendMessage({
                txt: 'response img',
            });
            break;
        case 'request progress':
            // ele = document.querySelector(
            //     '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div > span.ytp-time-duration'
            // );
            // let ele2 = document.querySelector(
            //     '#movie_player > div.ytp-chrome-bottom > div.ytp-chrome-controls > div.ytp-left-controls > div > span.ytp-time-current'
            // );
            // chrome.runtime.sendMessage({
            //     txt: 'response progress',
            //     progress:
            //         pasreInt(ele2.textContent) / pasreInt(ele.textContent),
            // });
            break;
        default:
            break;
    }
}

chrome.runtime.sendMessage({ txt: 'this is from content message' });
