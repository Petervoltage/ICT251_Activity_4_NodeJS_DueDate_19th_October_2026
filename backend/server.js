const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data.json');

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to read local JSON data
function readData() {
    if (!fs.existsSync(DATA_FILE)) {
        const initialData = [
            { id: 1, course_code: 'ICT251', course_name: 'Web Technologies I', day_of_week: 'Monday', start_time: '08:00', end_time: '10:00', venue: 'Lab 1', goal_notes: 'Complete CRUD assignment UI', created_at: new Date().toISOString() },
            { id: 2, course_code: 'ICT241', course_name: 'Digital Design', day_of_week: 'Monday', start_time: '10:00', end_time: '12:00', venue: 'Room 204', goal_notes: 'Review logic gates and FSMs', created_at: new Date().toISOString() },
            { id: 3, course_code: 'ICT261', course_name: 'Object Oriented Programming and Java', day_of_week: 'Tuesday', start_time: '14:00', end_time: '16:00', venue: 'Lab 2', goal_notes: 'Practice JavaFX configurations', created_at: new Date().toISOString() }
        ];
        fs.writeFileSync(DATA_FILE, JSON.stringify(initialData, null, 2));
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
}

// Helper function to write local JSON data
function writeData(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// GET /api/timetable -> List all records
app.get('/api/timetable', (req, res) => {
    const records = readData();
    res.json({ success: true, data: records.sort((a, b) => b.id - a.id) });
});

// POST /api/timetable -> Create a record
app.post('/api/timetable', (req, res) => {
    const { course_code, course_name, day_of_week, start_time, end_time, venue, goal_notes } = req.body;
    if (!course_code || !course_name) {
        return res.status(400).json({ error: 'course_code and course_name are required.' });
    }

    const records = readData();
    const newId = records.length > 0 ? Math.max(...records.map(r => r.id)) + 1 : 1;
    const newRecord = {
        id: newId,
        course_code,
        course_name,
        day_of_week: day_of_week || '',
        start_time: start_time || '',
        end_time: end_time || '',
        venue: venue || '',
        goal_notes: goal_notes || '',
        created_at: new Date().toISOString()
    };

    records.push(newRecord);
    writeData(records);
    res.status(201).json({ success: true, message: 'Record created successfully', id: newId });
});

// DELETE /api/timetable/:id -> Delete a record
app.delete('/api/timetable/:id', (req, res) => {
    const id = parseInt(req.params.id);
    let records = readData();
    const filteredRecords = records.filter(r => r.id !== id);

    if (filteredRecords.length === records.length) {
        return res.status(404).json({ error: 'Record not found' });
    }

    writeData(filteredRecords);
    res.json({ success: true, message: 'Record deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Server is running smoothly on http://localhost:${PORT}`);
});