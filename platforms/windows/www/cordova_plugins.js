﻿cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "it.mobimentum.phonegapspinnerplugin.SpinnerPlugin",
        "file": "plugins/it.mobimentum.phonegapspinnerplugin/www/spinnerplugin.js",
        "pluginId": "it.mobimentum.phonegapspinnerplugin",
        "clobbers": [
            "window.spinnerplugin"
        ]
    },
    {
        "id": "phonegap-plugin-push.PushNotification",
        "file": "plugins/phonegap-plugin-push/www/push.js",
        "pluginId": "phonegap-plugin-push",
        "clobbers": [
            "PushNotification"
        ]
    },
    {
        "id": "phonegap-plugin-push.PushPlugin",
        "file": "plugins/phonegap-plugin-push/src/windows/PushPluginProxy.js",
        "pluginId": "phonegap-plugin-push",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLitePlugin",
        "file": "plugins/cordova-sqlite-storage/www/SQLitePlugin.js",
        "pluginId": "cordova-sqlite-storage",
        "clobbers": [
            "SQLitePlugin"
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLiteProxy",
        "file": "plugins/cordova-sqlite-storage/src/windows/sqlite-proxy.js",
        "pluginId": "cordova-sqlite-storage",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-sqlite-storage.SQLite3",
        "file": "plugins/cordova-sqlite-storage/src/windows/SQLite3-Win-RT/SQLite3JS/js/SQLite3.js",
        "pluginId": "cordova-sqlite-storage",
        "merges": [
            ""
        ]
    },
    {
        "id": "cordova-plugin-dialogs.notification",
        "file": "plugins/cordova-plugin-dialogs/www/notification.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            "navigator.notification"
        ]
    },
    {
        "id": "cordova-plugin-dialogs.NotificationProxy",
        "file": "plugins/cordova-plugin-dialogs/src/windows/NotificationProxy.js",
        "pluginId": "cordova-plugin-dialogs",
        "merges": [
            ""
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "it.mobimentum.phonegapspinnerplugin": "1.2.1",
    "phonegap-plugin-push": "1.8.1",
    "cordova-sqlite-storage": "1.4.7-pre1",
    "cordova-plugin-dialogs": "1.2.1"
};
// BOTTOM OF METADATA
});