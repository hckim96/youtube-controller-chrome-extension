console.log('content js is ready to go');

function handleCapture() {
    console.log('captured');
}
// chrome.tabCapture.getCapturedTabs(handleCapture);

function handleChange() {
    console.log('handle changed');
}
function gotTab(tab) {
    console.log(tab.id);
}
// chrome.tabs.getCurrent(gotTab);
// chrome.tabCapture.onStatusChanged.addListener(handleChange);
chrome.runtime.onMessage.addListener(gotMessage);
function gotMessage(request, sender, sendResponse) {
    // console.log(`request :: ${JSON.stringify(request)}`);
    // if (request.txt === 'hello') {
    //     let paragraphs = document.getElementsByTagName('p');
    //     for (e of paragraphs) {
    //         e.style['background-color'] = 'red';
    //     }
    // }

    let div = document.createElement('div');
    div.id = 'player';
    document.querySelector('body').appendChild(div);
    var tag = document.createElement('script');

    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    // 3. This function creates an <iframe> (and YouTube player)
    //    after the API code downloads.
    var player;
    function onYouTubeIframeAPIReady() {
        player = new YT.Player('player', {
            height: '360',
            width: '640',
            videoId: 'M7lc1UVf-VE',
            events: {
                onReady: onPlayerReady,
                onStateChange: onPlayerStateChange,
            },
        });
    }

    // 4. The API will call this function when the video player is ready.
    function onPlayerReady(event) {
        event.target.playVideo();
    }

    // 5. The API calls this function when the player's state changes.
    //    The function indicates that when playing a video (state=1),
    //    the player should play for six seconds and then stop.
    var done = false;
    function onPlayerStateChange(event) {
        if (event.data == YT.PlayerState.PLAYING && !done) {
            setTimeout(stopVideo, 6000);
            done = true;
        }
    }
    function stopVideo() {
        player.stopVideo();
    }
}
