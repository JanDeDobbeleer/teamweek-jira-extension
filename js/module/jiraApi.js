"use strict";

var ApiClient = (function() {

    var _settings = null;
    chrome.runtime.sendMessage({ method: "settings" }, function(settings) {
        _settings = settings;
    });

    var _endPoints = {
        issue: '{url}/rest/api/2/issue/{issue}',
        issues: '{url}/rest/api/2/search?jql=cf[{id}]={issue}'
    };

    var getIssue = function(issueNumber, onSuccess, onFailure) {
        var endpoint = _endPoints.issue.replace("{issue}", issueNumber);
        endpoint = endpoint.replace('{url}', _settings.url);
        _restRequest(endpoint, onSuccess, onFailure);
    };

    var getTickets = function(issueNumber, onSuccess, onFailure) {
        var endpoint = _endPoints.issues.replace("{id}", _settings.epic_id);
        endpoint = endpoint.replace("{issue}", issueNumber);
        endpoint = endpoint.replace('{url}', _settings.url);
        _restRequest(endpoint, onSuccess, onFailure);
    };

    // private functions
    var _restRequest = function(endPoint, onSuccess, onFailure) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', endPoint, true);
        xhr.withCredentials = false;
        xhr.setRequestHeader('Accept', 'application/json');
        xhr.setRequestHeader("Content-type", "application/json");
        xhr.setRequestHeader("Authorization", "Basic " + window.btoa(_settings.username + ':' + _settings.password));
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                // Decode JSON string
                var response = JSON.parse(xhr.response);
                // Error response from server
                if (response.errorMessages) {
                    onFailure(response.errorMessages[0]);
                } else {
                    onSuccess(response);
                }
            }
        };
        xhr.send();
    };

    return {
        getIssue: getIssue,
        getTickets: getTickets
    };
})();