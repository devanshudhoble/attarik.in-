const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize data files
const contactsFile = path.join(dataDir, 'contacts.json');
const newsletterFile = path.join(dataDir, 'newsletter.json');

if (!fs.existsSync(contactsFile)) {
    fs.writeFileSync(contactsFile, JSON.stringify([], null, 2));
}
if (!fs.existsSync(newsletterFile)) {
    fs.writeFileSync(newsletterFile, JSON.stringify([], null, 2));
}

// Helper: read JSON file safely
function readJsonFile(filePath) {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        return [];
    }
}

// Helper: write JSON file safely
function writeJsonFile(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// =====================
// API ROUTES
// =====================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'ok',
        brand: 'ATTARIK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Contact Form Submission
app.post('/api/contact', (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and message are required.'
            });
        }

        // Email format validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        // Save contact
        const contacts = readJsonFile(contactsFile);
        const newContact = {
            id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
            name: name.trim(),
            email: email.trim().toLowerCase(),
            phone: phone ? phone.trim() : '',
            subject: subject || 'general',
            message: message.trim(),
            timestamp: new Date().toISOString(),
            read: false
        };

        contacts.push(newContact);
        writeJsonFile(contactsFile, contacts);

        console.log(`📬 New contact from: ${name} (${email})`);

        res.json({
            success: true,
            message: 'Thank you for reaching out! We\'ll get back to you within 24 hours.'
        });
    } catch (err) {
        console.error('Contact form error:', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again or call us directly.'
        });
    }
});

// Newsletter Subscription
app.post('/api/newsletter', (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required.'
            });
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Please enter a valid email address.'
            });
        }

        const subscribers = readJsonFile(newsletterFile);

        // Check for duplicates
        const exists = subscribers.some(
            sub => sub.email.toLowerCase() === email.trim().toLowerCase()
        );

        if (exists) {
            return res.json({
                success: true,
                message: 'You\'re already part of the ATTARIK family! Stay tuned for updates.'
            });
        }

        subscribers.push({
            email: email.trim().toLowerCase(),
            subscribed: new Date().toISOString(),
            active: true
        });

        writeJsonFile(newsletterFile, subscribers);

        console.log(`📧 New subscriber: ${email}`);

        res.json({
            success: true,
            message: 'Welcome to the ATTARIK family! Watch your inbox for exclusive updates.'
        });
    } catch (err) {
        console.error('Newsletter error:', err);
        res.status(500).json({
            success: false,
            message: 'Something went wrong. Please try again.'
        });
    }
});

// Admin: View contacts (basic — protected by query param)
app.get('/api/admin/contacts', (req, res) => {
    if (req.query.key !== 'attarik2024') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const contacts = readJsonFile(contactsFile);
    res.json({ total: contacts.length, contacts });
});

// Admin: View subscribers
app.get('/api/admin/subscribers', (req, res) => {
    if (req.query.key !== 'attarik2024') {
        return res.status(403).json({ message: 'Unauthorized' });
    }
    const subscribers = readJsonFile(newsletterFile);
    res.json({ total: subscribers.length, subscribers });
});

// Catch-all: serve index.html for SPA
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`
    ╔══════════════════════════════════════╗
    ║                                      ║
    ║   🌟 ATTARIK — The Art of Scent 🌟   ║
    ║                                      ║
    ║   Server running on port ${PORT}        ║
    ║   http://localhost:${PORT}              ║
    ║                                      ║
    ╚══════════════════════════════════════╝
    `);
});
