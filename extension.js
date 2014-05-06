/*
Version 9 : Add support for flashback/fallback
*/

const Main = imports.ui.main;
const ExtensionUtils = imports.misc.extensionUtils;
const Config = imports.misc.config;

let _id;

function _disable_hot_corners() {
  // Used for gnome-shell 3.8, 3.10 and 3.12
  // Disables all hot corners
  Main.layoutManager.hotCorners.forEach(function(hot_corner) { 
    hot_corner._toggleOverview = function(){};
    hot_corner._pressureBarrier.destroy();
    hot_corner._pressureBarrier = null;
  });
}

function _hide_hot_corners_34() {
  // Used for gnome-shell 3.4
  // Hides hot corners
  Main.panel._activitiesButton._hotCorner._corner.hide();
  Main.layoutManager._hotCorners.forEach(function(hot_corner) { hot_corner._corner.hide(); });
}

function _hide_hot_corners_36() {
  // Used for gnome-shell 3.6
  // Hides hot corners
  Main.panel.statusArea['activities'].hotCorner._corner.hide();
  Main.layoutManager._hotCorners.forEach(function(hot_corner) { hot_corner._corner.hide(); });
}

function init() {
}

function enable() {
  if(ExtensionUtils.versionCheck(['3.8', '3.10', '3.12'], Config.PACKAGE_VERSION)) {
    _disable_hot_corners();
    // Hot corners may be re-created afterwards (for example, If there's a monitor change).
    // So we catch all changes.
    _id = Main.layoutManager.connect('hot-corners-changed', _disable_hot_corners);
  }
  if(ExtensionUtils.versionCheck(['3.6'], Config.PACKAGE_VERSION)) {
    _hide_hot_corners_36();
    _id = Main.layoutManager.connect('monitors-changed', _hide_hot_corners_36);
  }
  if(ExtensionUtils.versionCheck(['3.4'], Config.PACKAGE_VERSION)) {
    _hide_hot_corners_34();
    _id = Main.layoutManager.connect('monitors-changed', _hide_hot_corners_34);
  }
}

function disable() {
  // Disconnects the callback and re-creates the hot corners
  Main.layoutManager.disconnect(_id);
  Main.layoutManager._updateHotCorners();
}
