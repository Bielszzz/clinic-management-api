const API_URL = 'http://localhost:5000/api';
let editingPatientId = null;
let editingAppointmentId = null;

// PACIENTES
async function loadPatients() {
    try {
        const response = await fetch(`${API_URL}/patients`);
        const patients = await response.json();
        displayPatients(patients);
        updatePatientSelect(patients);
    } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
    }
}

function displayPatients(patients) {
    const container = document.getElementById('patientsList');
    if (!patients || patients.length === 0) {
        container.innerHTML = '<p style="color: #999; text-align: center;">Nenhum paciente cadastrado</p>';
        return;
    }

    container.innerHTML = patients.map(patient => `
        <div class="item">
            <div class="item-info">
                <p><strong>Nome:</strong> ${patient.nome}</p>
                <p><strong>Nascimento:</strong> ${new Date(patient.dataNascimento).toLocaleDateString()}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editPatient(${patient.id}, '${patient.nome}', '${patient.dataNascimento.split('T')[0]}')">Editar</button>
                <button class="btn-delete" onclick="deletePatient(${patient.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

async function savePatient() {
    const name = document.getElementById('patientName').value;
    const birthdate = document.getElementById('patientBirthdate').value;
    const messageEl = document.getElementById('patientMessage');

    if (!name || !birthdate) {
        showMessage(messageEl, 'Preencha todos os campos', 'error');
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
            showMessage(messageEl, editingPatientId ? 'Paciente atualizado!' : 'Paciente cadastrado!', 'success');
            clearPatientForm();
            loadPatients();
        } else {
            showMessage(messageEl, 'Erro ao salvar paciente', 'error');
        }
    } catch (error) {
        showMessage(messageEl, 'Erro na requisição', 'error');
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
            showMessage(document.getElementById('patientMessage'), 'Paciente excluído!', 'success');
            loadPatients();
        }
    } catch (error) {
        showMessage(document.getElementById('patientMessage'), 'Erro ao excluir', 'error');
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

function updatePatientSelect(patients) {
    const select = document.getElementById('appointmentPatient');
    const currentValue = select.value;
    select.innerHTML = '<option value="">Selecione um paciente</option>' +
        patients.map(p => `<option value="${p.id}">${p.nome}</option>`).join('');
    select.value = currentValue;
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
        container.innerHTML = '<p style="color: #999; text-align: center;">Nenhuma consulta agendada</p>';
        return;
    }

    container.innerHTML = appointments.map(apt => `
        <div class="item">
            <div class="item-info">
                <p><strong>Paciente:</strong> ${apt.paciente?.nome || 'N/A'}</p>
                <p><strong>Data/Hora:</strong> ${new Date(apt.dataHora).toLocaleString('pt-BR')}</p>
            </div>
            <div class="item-actions">
                <button class="btn-edit" onclick="editAppointment(${apt.id}, ${apt.pacienteId}, '${apt.dataHora.split('T')[0]}T${apt.dataHora.split('T')[1].substring(0, 5)}')">Editar</button>
                <button class="btn-delete" onclick="deleteAppointment(${apt.id})">Excluir</button>
            </div>
        </div>
    `).join('');
}

async function saveAppointment() {
    const patientId = document.getElementById('appointmentPatient').value;
    const dateTime = document.getElementById('appointmentDateTime').value;
    const messageEl = document.getElementById('appointmentMessage');

    if (!patientId || !dateTime) {
        showMessage(messageEl, 'Preencha todos os campos', 'error');
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
            showMessage(messageEl, editingAppointmentId ? 'Consulta atualizada!' : 'Consulta agendada!', 'success');
            clearAppointmentForm();
            loadAppointments();
        } else {
            showMessage(messageEl, data.error || 'Erro ao salvar consulta', 'error');
        }
    } catch (error) {
        showMessage(messageEl, 'Erro na requisição', 'error');
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
            showMessage(document.getElementById('appointmentMessage'), 'Consulta cancelada!', 'success');
            loadAppointments();
        }
    } catch (error) {
        showMessage(document.getElementById('appointmentMessage'), 'Erro ao cancelar', 'error');
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

function showMessage(element, message, type) {
    element.textContent = message;
    element.className = `message ${type}`;
    setTimeout(() => {
        element.className = 'message';
    }, 3000);
}

// Inicializar
window.addEventListener('load', () => {
    loadPatients();
    loadAppointments();
    setInterval(loadAppointments, 5000);
});
