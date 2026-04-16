const API_URL = 'http://localhost:5000/api';
let editingPatientId = null;
let editingAppointmentId = null;
let allPatients = [];

// TOAST NOTIFICATIONS
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    const icons = {
        success: '✓',
        error: '✕',
        info: 'ℹ'
    };

    toast.innerHTML = `
        <span class="toast-icon">${icons[type]}</span>
        <span class="toast-message">${message}</span>
        <button class="toast-close" onclick="this.parentElement.remove()">×</button>
    `;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('removing');
            setTimeout(() => toast.remove(), 300);
        }
    }, 4000);
}

// AUTOCOMPLETE PACIENTE
function initializePatientAutocomplete() {
    const searchInput = document.getElementById('appointmentPatientSearch');
    const patientInput = document.getElementById('appointmentPatient');
    const patientList = document.getElementById('appointmentPatientList');

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();

        if (searchTerm.length === 0) {
            patientList.classList.remove('active');
            return;
        }

        const filtered = allPatients.filter(patient =>
            patient.nome.toLowerCase().includes(searchTerm)
        );

        if (filtered.length === 0) {
            patientList.classList.remove('active');
            return;
        }

        patientList.innerHTML = filtered.map(patient => `
            <div class="autocomplete-item" onclick="selectPatient(${patient.id}, '${patient.nome}', '${patient.dataNascimento.split('T')[0]}')">
                <div class="autocomplete-item-name">${patient.nome}</div>
                <div class="autocomplete-item-info">ID: ${patient.id} - ${new Date(patient.dataNascimento).toLocaleDateString('pt-BR')}</div>
            </div>
        `).join('');

        patientList.classList.add('active');
    });

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            patientList.classList.remove('active');
        }
    });
}

function selectPatient(id, name, birthdate) {
    document.getElementById('appointmentPatientSearch').value = name;
    document.getElementById('appointmentPatient').value = id;
    document.getElementById('appointmentPatientList').classList.remove('active');
}

// SCREEN SWITCHING
function switchScreen(screenName) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    if (screenName === 'patients') {
        document.getElementById('patientsScreen').classList.add('active');
        document.querySelectorAll('.nav-item')[0].classList.add('active');
    } else if (screenName === 'appointments') {
        document.getElementById('appointmentsScreen').classList.add('active');
        document.querySelectorAll('.nav-item')[1].classList.add('active');
    }
}

// PACIENTES
async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const patients = await response.json();
        allPatients = patients;
        displayPatients(patients);
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

function displayPatients(patients) {
    const container = document.getElementById('patientsList');
    if (!patients || patients.length === 0) {
        container.innerHTML = '<tr class="empty-state"><td colspan="4">Nenhum paciente cadastrado</td></tr>';
        return;
    }

    container.innerHTML = patients.map(patient => `
        <tr>
            <td>${patient.id}</td>
            <td>${patient.nome}</td>
            <td>${new Date(patient.dataNascimento).toLocaleDateString('pt-BR')}</td>
            <td>
                <button class="btn btn-edit" onclick="editPatient(${patient.id}, '${patient.nome}', '${patient.dataNascimento.split('T')[0]}')">Editar</button>
                <button class="btn btn-delete" onclick="deletePatient(${patient.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

async function savePatient() {
    const name = document.getElementById('patientName').value;
    const birthdate = document.getElementById('patientBirthdate').value;

    if (!name || !birthdate) {
        showToast('Preencha todos os campos', 'error');
        return;
    }

    try {
        const method = editingPatientId ? 'PUT' : 'POST';
        const url = editingPatientId
            ? `${API_URL}/patients/${editingPatientId}`
            : `${API_URL}/patients`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nome: name,
                dataNascimento: birthdate
            })
        });

        if (response.ok) {
            showToast(editingPatientId ? 'Paciente atualizado com sucesso!' : 'Paciente cadastrado com sucesso!', 'success');
            clearPatientForm();
            loadPatients();
        } else {
            showToast('Erro ao salvar paciente', 'error');
        }
    } catch (error) {
        showToast('Erro na requisição', 'error');
    }
}

function editPatient(id, name, birthdate) {
    editingPatientId = id;
    document.getElementById('patientName').value = name;
    document.getElementById('patientBirthdate').value = birthdate;
}

async function deletePatient(id) {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return;

    try {
        const response = await fetch(`${API_URL}/patients/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Paciente excluído com sucesso!', 'success');
            loadPatients();
        } else {
            showToast('Erro ao excluir paciente', 'error');
        }
    } catch (error) {
        showToast('Erro ao excluir paciente', 'error');
    }
}

function clearPatientForm() {
    editingPatientId = null;
    document.getElementById('patientName').value = '';
    document.getElementById('patientBirthdate').value = '';
}

function cancelPatientEdit() {
    clearPatientForm();
}

// CONSULTAS
async function loadAppointments() {
    try {
        const response = await fetch(`${API_URL}/appointments`);
        const appointments = await response.json();
        displayAppointments(appointments);
    } catch (error) {
        console.error('Erro ao carregar consultas:', error);
    }
}

function displayAppointments(appointments) {
    const container = document.getElementById('appointmentsList');
    if (!appointments || appointments.length === 0) {
        container.innerHTML = '<tr class="empty-state"><td colspan="4">Nenhuma consulta agendada</td></tr>';
        return;
    }

    container.innerHTML = appointments.map(apt => `
        <tr>
            <td>${apt.id}</td>
            <td>${apt.paciente?.nome || 'N/A'}</td>
            <td>${new Date(apt.dataHora).toLocaleString('pt-BR')}</td>
            <td>
                <button class="btn btn-edit" onclick="editAppointment(${apt.id}, ${apt.pacienteId}, '${apt.dataHora.split('T')[0]}T${apt.dataHora.split('T')[1].substring(0, 5)}')">Editar</button>
                <button class="btn btn-delete" onclick="deleteAppointment(${apt.id})">Excluir</button>
            </td>
        </tr>
    `).join('');
}

async function saveAppointment() {
    const patientId = document.getElementById('appointmentPatient').value;
    const dateTime = document.getElementById('appointmentDateTime').value;

    if (!patientId || !dateTime) {
        showToast('Preencha todos os campos', 'error');
        return;
    }

    try {
        const method = editingAppointmentId ? 'PUT' : 'POST';
        const url = editingAppointmentId
            ? `${API_URL}/appointments/${editingAppointmentId}`
            : `${API_URL}/appointments`;

        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                pacienteId: parseInt(patientId),
                dataHora: dateTime
            })
        });

        const data = await response.json();

        if (response.ok) {
            showToast(editingAppointmentId ? 'Consulta atualizada com sucesso!' : 'Consulta agendada com sucesso!', 'success');
            clearAppointmentForm();
            loadAppointments();
        } else {
            showToast(data.error || 'Erro ao salvar consulta', 'error');
        }
    } catch (error) {
        showToast('Erro na requisição', 'error');
    }
}

function editAppointment(id, patientId, dateTime) {
    editingAppointmentId = id;
    document.getElementById('appointmentPatient').value = patientId;
    document.getElementById('appointmentDateTime').value = dateTime;
}

async function deleteAppointment(id) {
    if (!confirm('Tem certeza que deseja cancelar esta consulta?')) return;

    try {
        const response = await fetch(`${API_URL}/appointments/${id}`, { method: 'DELETE' });
        if (response.ok) {
            showToast('Consulta cancelada com sucesso!', 'success');
            loadAppointments();
        } else {
            showToast('Erro ao cancelar consulta', 'error');
        }
    } catch (error) {
        showToast('Erro ao cancelar consulta', 'error');
    }
}

function clearAppointmentForm() {
    editingAppointmentId = null;
    document.getElementById('appointmentPatient').value = '';
    document.getElementById('appointmentDateTime').value = '';
}

function cancelAppointmentEdit() {
    clearAppointmentForm();
}

// Inicializar
window.addEventListener('load', () => {
    loadPatients();
    loadAppointments();
    initializePatientAutocomplete();
    setInterval(loadAppointments, 5000);
});
