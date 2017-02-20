function filter_done(issue) {
    return issue.fields.status.name == 'Done';
}

function get_total_points(issues) {
    var total_points = 0;
    for (var x in issues) {
        var points = issues[x].fields['customfield_' + _settings.story_id];
        if (points) {
            total_points += points;
        }
    }
    return total_points;
}

function get_completed_points(issues) {
    return get_total_points(issues.filter(filter_done));
}

function create_and_add_node(element, content) {
    var node = document.createElement("div");
    node.className = "jira-status white";
    node.textContent = content;
    element.appendChild(node);
}

function set_info(element) {
    var key = element.textContent;
    ApiClient.getIssue(key,
        function(response) {
            element.textContent = '';
            var link = document.createElement("a");
            link.className = 'jira-link';
            link.textContent = key;
            link.href = _settings.url + '/browse/' + key;
            link.target = '_blank';
            element.appendChild(link);
            var node = document.createElement("div");
            node.className = "jira-status " + response.fields.status.statusCategory.colorName;
            node.textContent = response.fields.status.name;
            element.appendChild(node);
            // get all the issues and count them
            ApiClient.getTickets(key,
                function(response) {
                    var total_issues = response.issues.length;
                    var completed_issues = response.issues.filter(filter_done).length;
                    create_and_add_node(element, 'I: ' + completed_issues + '/' + total_issues);
                    var total_points = get_total_points(response.issues);
                    var completed_points = get_completed_points(response.issues);
                    create_and_add_node(element, 'P: ' + completed_points + '/' + total_points);
                },
                function(error) {
                    console.log(error);
                });
        },
        function(error) {
            console.error(error);
        });
}

var _settings = null;

document.onreadystatechange = function(e) {
    if (document.readyState === "complete") {
        setTimeout(function() {
            chrome.runtime.sendMessage({ method: "settings" }, function(settings) {
                _settings = settings;
                var project_blocks = document.getElementsByClassName("task__text__project");
                for (var i = 0; i < project_blocks.length; i++) {
                    set_info(project_blocks[i]);
                }
            });
        }, 2000);
    }
};