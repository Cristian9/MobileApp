cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "id": "it.mobimentum.phonegapspinnerplugin.SpinnerPlugin",
        "file": "plugins/it.mobimentum.phonegapspinnerplugin/www/spinnerplugin.js",
        "pluginId": "it.mobimentum.phonegapspinnerplugin",
        "clobbers": [
            "window.spinnerplugin"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "cordova-plugin-whitelist": "1.2.2",
    "it.mobimentum.phonegapspinnerplugin": "1.2.1"
};
// BOTTOM OF METADATA
});