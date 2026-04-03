# 🏥 Sistema de Clínica - API de Agendamento

Projeto em desenvolvimento de uma API REST desenvolvida em C# com .NET para gerenciamento de pacientes e agendamento de consultas.

---

## 📌 Sobre o projeto

Este projeto simula um sistema interno utilizado por clínicas para controle de pacientes e agendamentos.

O foco principal foi desenvolver uma API com regras de negócio reais, garantindo integridade dos dados e evitando conflitos de horários.

---

## 🚀 Funcionalidades  (terá CRUD completo em breve)

### 👤 Pacientes
- Cadastro de pacientes
- Listagem de pacientes

### 📅 Consultas
- Agendamento de consultas
- Listagem de consultas com dados do paciente
- Validação de conflito de horário
- Bloqueio de agendamentos em datas passadas

---

## 🧠 Regras de negócio implementadas

- ❌ Não permite agendar consultas no passado  
- ❌ Não permite duas consultas no mesmo horário  
- ❌ Não permite agendar consulta para paciente inexistente  

---

## 🧰 Tecnologias utilizadas

- C# (.NET 8)
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger (documentação da API)

---

👨‍💻 Autor

- Gabriel R Oliveira
  www.linkedin.com/in/gabrieloliveira0099/
