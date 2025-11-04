// ============================================
// CONFIGURATION - YOU NEED TO UPDATE THESE!
// ============================================

const CONFIG = {
    // Get this from Google Cloud Console (instructions in README.md)
    googleCalendarApiKey: 'YOUR_GOOGLE_API_KEY_HERE',
    
    // Your Google Calendar ID (usually your gmail address)
    // To find it: Go to Google Calendar → Settings → Your calendar → Calendar ID
    googleCalendarId: 'YOUR_CALENDAR_ID_HERE',
    
    // EmailJS credentials (instructions in README.md)
    emailjsPublicKey: 'YOUR_EMAILJS_PUBLIC_KEY',
    emailjsServiceId: 'YOUR_EMAILJS_SERVICE_ID',
    emailjsTemplateId: 'YOUR_EMAILJS_TEMPLATE_ID'
};

// ============================================
// CALENDAR INITIALIZATION
// ============================================

let calendar;

document.addEventListener('DOMContentLoaded', function() {
    initializeCalendar();
    initializeForm();
    
    // Set minimum date for booking form to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('checkin').setAttribute('min', today);
    document.getElementById('checkout').setAttribute('min', today);
});

function initializeCalendar() {
    const calendarEl = document.getElementById('calendar');
    
    calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: {
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,listMonth'
        },
        height: 'auto',
        events: fetchGoogleCalendarEvents,
        eventClick: function(info) {
            alert('Date: ' + info.event.title + '\nStatus: ' + 
                  (info.event.extendedProps.isBooked ? 'Booked' : 'Available'));
        },
        eventDidMount: function(info) {
            // Style events based on whether they're booked or not
            if (info.event.extendedProps.isBooked) {
                info.el.classList.add('fc-event-booked');
            }
        }
    });
    
    calendar.render();
}

// ============================================
// GOOGLE CALENDAR INTEGRATION
// ============================================

async function fetchGoogleCalendarEvents(info, successCallback, failureCallback) {
    // Check if API key is configured
    if (CONFIG.googleCalendarApiKey === 'YOUR_GOOGLE_API_KEY_HERE') {
        console.warn('Google Calendar API key not configured yet');
        // Return sample events for demo purposes
        successCallback(getSampleEvents());
        return;
    }
    
    const timeMin = info.start.toISOString();
    const timeMax = info.end.toISOString();
    
    const url = `https://www.googleapis.com/calendar/v3/calendars/${CONFIG.googleCalendarId}/events?` +
        `key=${CONFIG.googleCalendarApiKey}&` +
        `timeMin=${timeMin}&` +
        `timeMax=${timeMax}&` +
        `singleEvents=true&` +
        `orderBy=startTime`;
    
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error('Failed to fetch calendar events');
        }
        
        const data = await response.json();
        const events = data.items.map(event => ({
            title: event.summary || 'Booked',
            start: event.start.date || event.start.dateTime,
            end: event.end.date || event.end.dateTime,
            allDay: !!event.start.date,
            color: '#ef4444',
            extendedProps: {
                isBooked: true,
                description: event.description
            }
        }));
        
        successCallback(events);
    } catch (error) {
        console.error('Error fetching calendar events:', error);
        failureCallback(error);
    }
}

// Sample events for demo/testing before API is configured
function getSampleEvents() {
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    const twoWeeksOut = new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000);
    
    return [
        {
            title: 'Booked - Jane\'s Visit',
            start: nextWeek.toISOString().split('T')[0],
            end: new Date(nextWeek.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            color: '#ef4444',
            extendedProps: { isBooked: true }
        },
        {
            title: 'Booked - My Trip',
            start: twoWeeksOut.toISOString().split('T')[0],
            end: new Date(twoWeeksOut.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            color: '#ef4444',
            extendedProps: { isBooked: true }
        }
    ];
}

// ============================================
// FORM HANDLING
// ============================================

function initializeForm() {
    const form = document.getElementById('bookingForm');
    
    // Update checkout min date when checkin changes
    document.getElementById('checkin').addEventListener('change', function() {
        const checkinDate = this.value;
        document.getElementById('checkout').setAttribute('min', checkinDate);
    });
    
    form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(e) {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('.submit-btn');
    const statusDiv = document.getElementById('formStatus');
    
    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        checkin: document.getElementById('checkin').value,
        checkout: document.getElementById('checkout').value,
        guests: document.getElementById('guests').value,
        message: document.getElementById('message').value
    };
    
    // Validate dates
    if (new Date(formData.checkout) <= new Date(formData.checkin)) {
        showStatus('error', 'Check-out date must be after check-in date!');
        return;
    }
    
    // Disable submit button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    try {
        await sendBookingRequest(formData);
        showStatus('success', '🎉 Request sent! I\'ll get back to you soon via email.');
        e.target.reset();
    } catch (error) {
        console.error('Error sending request:', error);
        showStatus('error', 'Oops! Something went wrong. Please try again or send me a direct email.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Request Visit';
    }
}

async function sendBookingRequest(formData) {
    // Check if EmailJS is configured
    if (CONFIG.emailjsPublicKey === 'YOUR_EMAILJS_PUBLIC_KEY') {
        console.warn('EmailJS not configured - would send:', formData);
        // Simulate delay for demo
        await new Promise(resolve => setTimeout(resolve, 1000));
        return;
    }
    
    // Initialize EmailJS
    emailjs.init(CONFIG.emailjsPublicKey);
    
    // Prepare email template parameters
    const templateParams = {
        from_name: formData.name,
        from_email: formData.email,
        checkin_date: formData.checkin,
        checkout_date: formData.checkout,
        number_of_guests: formData.guests,
        message: formData.message || 'No additional message',
        to_name: 'You' // You can customize this
    };
    
    // Send email via EmailJS
    return emailjs.send(
        CONFIG.emailjsServiceId,
        CONFIG.emailjsTemplateId,
        templateParams
    );
}

function showStatus(type, message) {
    const statusDiv = document.getElementById('formStatus');
    statusDiv.className = `form-status ${type}`;
    statusDiv.textContent = message;
    
    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            statusDiv.style.display = 'none';
        }, 5000);
    }
}
