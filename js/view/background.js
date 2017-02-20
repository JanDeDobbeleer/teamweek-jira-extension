chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "settings")
        sendResponse({
            username: localStorage.user,
            password: localStorage.pass,
            url: localStorage.url,
            epic_id: localStorage.epic_id,
            story_id: localStorage.story_id
        });
    else
        sendResponse({});
});

chrome.runtime.onInstalled.addListener(function(object) {
    var optionsUrl = chrome.extension.getURL('html/options.html');
    chrome.tabs.query({
        url: optionsUrl
    }, function(tabs) {
        if (tabs.length) {
            chrome.tabs.update(tabs[0].id, {
                active: true
            });
        } else {
            chrome.tabs.create({
                url: optionsUrl
            });
        }
    });
});