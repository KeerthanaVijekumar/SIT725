
$(document).ready(function () {
    // Initialize Materialize modals
    M.Modal.init(document.querySelectorAll('.modal'));

    $('#formSubmit').click(function () {
        const name = $('#name').val();
        const phone = $('#phone').val();
        const date = $('#date').val();
        const time = $('#time').val();

        $.ajax({
            type: 'POST',
            url: '/api/bookings',
            data: JSON.stringify({
                name: $('#name').val(),
                phone: $('#phone').val(),
                date: $('#date').val(),
                time: $('#time').val()
            }),
            contentType: 'application/json',
            success: function (response) {
                alert('Booking successful!');
                M.Modal.getInstance(document.getElementById('modal1')).close(); // Close modal on success
                // Fetch and display the updated list of bookings
                fetchAndDisplayBookings();
            },
            error: function (error) {
                alert('Error saving booking');
                console.error('Error:', error);
            }
        });
    });


    // Function to fetch and display booking details
    function fetchAndDisplayBookings() {
        $.ajax({
            url: '/api/bookings',
            method: 'GET',
            success: function (data) {
                console.log('Data received:', data); // Log the response to inspect its structure
                const tableBody = $('#bookingTableBody');
                tableBody.empty(); // Clear existing rows

                if (Array.isArray(data)) {
                    data.forEach(booking => {
                        const bookingDate = new Date(booking.date);
                        const bookingTime = new Date(`1970-01-01T${booking.time}Z`);

                        const formattedDate = bookingDate.toLocaleDateString();
                        const formattedTime = bookingTime.toLocaleTimeString();

                        const row = `<tr>
                                <td>${booking.name}</td>
                                <td>${booking.phone}</td>
                                <td>${formattedDate}</td>
                                <td>${formattedTime}</td>
                            </tr>`;
                        tableBody.append(row);
                    });
                } else {
                    console.error('Unexpected data format:', data);
                    console.log(data);
                }
            },
            error: function (error) {
                console.error('Error fetching bookings:', error);
            }
        });
    }

    // Function to fetch and display specific booking details
    function fetchSpecificBooking(name) {
        $.ajax({
            url: `/api/bookings/${name}`,
            method: 'GET',
            success: function (data) {
                console.log('Data received:', data); // Log the response to inspect its structure
                const tableBody = $('#bookingTableBody');
                tableBody.empty(); // Clear existing rows

                if (data) {
                    // Proper date-time parsing
                    const bookingDate = new Date(data.date);
                    const bookingTime = new Date(`1970-01-01T${data.time}`);

                    const row = `<tr>
                        <td>${data.name}</td>
                        <td>${data.phone}</td>
                        <td>${bookingDate.toLocaleDateString()}</td>
                        <td>${bookingTime.toLocaleTimeString()}</td>
                    </tr>`;
                    tableBody.append(row);
                } else {
                    console.error('Unexpected data format:', data);
                }
                $('#specificBookingName').val(''); // Clear the input field
            },
            error: function (error) {
                console.error('Error fetching specific booking:', error);
            }
        });
    }

    // Bind the click event to the "View All Bookings" button
    $('#viewAllBookings').click(function () {
        fetchAndDisplayBookings(); // Fetch and display all bookings on button click
    });

    // Bind the click event to the "View Specific Booking" button
    $('#viewSpecificBooking').click(function () {
        const specificBookingName = $('#specificBookingName').val();
        if (specificBookingName) {
            fetchSpecificBooking(specificBookingName); // Fetch and display specific booking on button click
        } else {
            alert('Please enter a name.');
        }
    });
});