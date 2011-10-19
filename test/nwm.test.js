/**
 * These are just test stubs for now: testing a window manager is pretty complicated
 * as X11 events have to be generated etc.
 *
 * There would be quite a bit of instrumentation involved in getting these to run,
 * which might not be worth the effort. At least, first I'd like to work on improving logging
 * and only then see if these are needed.
 */

var NWM = require('../index.js').NWM;
var FakeX11 = require('./fake_binding.js');

var x11 = new FakeX11();
var nwm = new NWM(x11);

nwm.addLayout('grid', function() {});


exports['can start nwm'] = function(test) {
  x11.once('start', function() {
    test.ok(true);
    test.finish();
  });
  nwm.start();
};

// Single monitor tests

exports['when started, the focused window is root, monitor is 0 and workspace is 1'] = function(test) {
  test.equal(1, nwm.windows.current);
  test.equal(0, nwm.monitors.current);
  test.equal(null, nwm.monitors.get(nwm.monitors.current));
  test.finish();
};

exports['can load a single monitor'] = function(test) {
  x11.emit('addMonitor', { id: 0, x: 0, y: 0, width: 100, height: 100});
  test.equal(1, nwm.windows.current);
  test.equal(0, nwm.monitors.current);
  var current_monitor = nwm.monitors.get(nwm.monitors.current);
  test.equal(0, current_monitor.id);
  test.equal(0, current_monitor.x);
  test.equal(0, current_monitor.y);
  test.equal(100, current_monitor.width);
  test.equal(100, current_monitor.height);
  test.finish();
};

exports['adding a new window makes it the focused_window for the monitor, and the main_window for the workspace'] = function(test) {
  x11.emit('addWindow', {
    id: 1,
    x: 0,
    y: 0,
    monitor: 'foo',
    height: 50,
    width: 50,
    title: 'Hello world',
    'class': 'helloworldclass',
    isfloating: false
  });
  process.nextTick(function() {
    var monitor = nwm.monitors.get(nwm.monitors.current);
    test.equal(1, monitor.focused_window);
    var window = nwm.windows.get(monitor.focused_window);

    test.equal(1, window.id);
    test.equal(0, window.monitor);
    test.equal('Hello world', window.title);

    test.finish();
  });
};

/*
exports['switching to workspace 2 produces an empty screen'] = function(test){
  test.finish();
};

exports['moving a window to workspace 2 adds it and rearranges the windows'] = function(test){
  test.finish();
};

exports['closing a window removes it from the set of windows and rearranges the windows'] = function(test) {
  test.finish();
};

exports['moving focus between three windows works'] = function(test) {
  test.finish();
};

// Multiple monitor tests

exports['can add two monitors'] = function(test) {
  test.finish();
};

exports['newly added monitors are added to the current monitor'] = function(test) {
  test.finish();
};

// MOUSE / FOCUS

exports['moving the mouse within the monitor changes window focus but not monitor'] = function(test) {
  test.finish();
};

exports['moving the mouse from monitor 0 to monitor 1'] = function(test) {
  test.finish();
  // when monitor 1 is empty
    // changes current monitor to 1
    // sets workspace.current to 1

  // when monitor 1 has a window
    // same as above
};

exports['changing workspace while focused on monitor 1'] = function(test) {
  // changes current workspace on monitor 1, but not on monitor 0
  test.finish();
};

exports['adding new window while focused on monitor 1'] = function(test) {
  // adds the new window to monitor 1
  test.finish();
};

// MOVING WINDOWS BETWEEN MONITORS

exports['moving a window from monitor 0 to monitor 1'] = function(test) {
  // adds the new window to monitor 1
  // removes the monitor from monitor 0
  // sets the window workspace to the workspace on monitor 1, not that of monitor 0
  test.finish();
};
*/
// if this module is the script being run, then run the tests:
if (module == require.main) {
  var async_testing = require('async_testing');
  process.nextTick(function() {
    async_testing.run(__filename, process.ARGV, function(result) {
      process.exit(result[0].numErrors);
    } );
  });
}
