cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/it.mobimentum.phonegapspinnerplugin/www/spinnerplugin.js",
        "id": "it.mobimentum.phonegapspinnerplugin.SpinnerPlugin",
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