// capture-map.js — scroll to the ServiceAreaMap and screenshot
const { execSync } = require('child_process');
const http = require('http');
const fs = require('fs');

const url = 'http://127.0.0.1:3001/';

// Get the section via the home page and use a tall viewport
// Chrome headless --screenshot with --window-size=NxM captures
// the top of the page. To capture the map, set the window
// height to span from top to map, and use --hide-scrollbars
// for clean output. Map is at ~Y=5800 on a 1440-wide page.

console.log('Use --window-size=1440x7200 then crop to map region');
