$(document).ready(function () {
    // Initialize Socket.io
    const socket = io(); // Connect to the socket.io server

    // Handle incoming messages from the server
    socket.on('message', (message) => {
        console.log('Message from server:', message);
        $('#realTimeUpdates').append(`<p>${message}</p>`); // Display message in the designated area
    });
});
