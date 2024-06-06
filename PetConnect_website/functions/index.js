const functions = require('firebase-functions');

// Dynamically import the server module
import('./server.mjs').then((module) => {
    const api = module.default; // Obtain the exported app from the server module

    // Export the Firebase function after the module has been successfully loaded
    exports.api = functions.https.onRequest(api);

}).catch(err => {
    console.error('Failed to load the server module:', err);
    // Handle failures where the server might not load
});
