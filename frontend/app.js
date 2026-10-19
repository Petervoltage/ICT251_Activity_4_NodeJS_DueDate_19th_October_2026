const API_URL = 'http://localhost:3000/api/timetable';

// 1. Fetch and render timetable records on page load
async function fetchTimetable() {
    try {
        const response = await fetch(API_URL);
        const result = await response.json();
        
        const tbody = document.getElementById('timetableTableBody');
        tbody.innerHTML = '';

        if (result.success && result.data.length > 0) {
            result.data.forEach(item => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td class="py-3 px-4">
                        <span class="font-bold text-blue-600">${item.course_code}</span><br>
                        <span class="text-slate-500 text-xs">${item.course_name}</span>
                    </td>
                    <td class="py-3 px-4">
                        <span class="font-medium">${item.day_of_week}</span><br>
                        <span class="text-slate-500 text-xs">${item.start_time} - ${item.end_time}</span>
                    </td>
                    <td class="py-3 px-4">${item.venue || 'N/A'}</td>
                    <td class="py-3 px-4 text-slate-500 text-xs">${item.goal_notes || 'None'}</td>
                    <td class="py-3 px-4 text-right">
                        <button onclick="deleteRecord(${item.id})" class="text-red-500 hover:text-red-700 font-medium text-xs bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition">Delete</button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        } else {
            tbody.innerHTML = `<tr><td colspan="5" class="py-4 text-center text-slate-400">No timetable records found.</td></tr>`;
        }
    } catch (error) {
        console.error('Error fetching timetable:', error);
    }
}

// 2. Handle Form Submission (Create Record)
document.getElementById('timetableForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const newRecord = {
        course_code: document.getElementById('course_code').value,
        course_name: document.getElementById('course_name').value,
        day_of_week: document.getElementById('day_of_week').value,
        start_time: document.getElementById('start_time').value,
        end_time: document.getElementById('end_time').value,
        venue: document.getElementById('venue').value,
        goal_notes: document.getElementById('goal_notes').value
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newRecord)
        });

        const result = await response.json();
        if (response.ok) {
            document.getElementById('timetableForm').reset();
            fetchTimetable();
        } else {
            alert(result.error || 'Failed to add record');
        }
    } catch (error) {
        console.error('Error creating record:', error);
    }
});

// 3. Delete Record Function
async function deleteRecord(id) {
    if (!confirm('Are you sure you want to delete this record?')) return;

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            fetchTimetable();
        } else {
            alert('Failed to delete record');
        }
    } catch (error) {
        console.error('Error deleting record:', error);
    }
}

// Initial fetch on page load
fetchTimetable();