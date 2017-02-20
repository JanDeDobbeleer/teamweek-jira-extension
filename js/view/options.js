function saveSettings(e) {
    if (e.preventDefault) e.preventDefault();
    localStorage.setItem('user', document.getElementById('id_username').value);
    localStorage.setItem('pass', document.getElementById('id_password').value);
    localStorage.setItem('url', document.getElementById('id_url').value);
    localStorage.setItem('epic_id', document.getElementById('id_epic_field').value);
    localStorage.setItem('story_id', document.getElementById('id_story_field').value);
    var button = document.getElementById('settings_button');
    button.value = 'Saved!';
    setTimeout(function() {
        button.value = 'Submit';
    }, 2000);
}

function loadSettings() {
    document.getElementById('id_username').value = localStorage.getItem('user');
    document.getElementById('id_password').value = localStorage.getItem('pass');
    document.getElementById('id_url').value = localStorage.getItem('url');
    document.getElementById('id_epic_field').value = localStorage.getItem('epic_id');
    document.getElementById('id_story_field').value = localStorage.getItem('story_id');
}

window.addEventListener('load', function() {
    loadSettings();
    var settingsform = document.getElementById('settingsform');
    if (settingsform) {
        if (settingsform.attachEvent) {
            settingsform.attachEvent("submit", saveSettings);
        } else {
            settingsform.addEventListener("submit", saveSettings);
        }
    }
});