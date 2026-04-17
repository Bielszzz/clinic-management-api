# 🏥 Clinic Management System - API & Web App

Sistema completo para gerenciamento de clínica, com API REST em C# (.NET) e interface web integrada para controle de pacientes e agendamento de consultas.

---

## 🌐 Acesso ao sistema

🔗 **Frontend:** https://clinic-management-api.vercel.app  

🔗 **API:** https://clinic-api-20p7.onrender.com/api

> ℹ️ A API não possui interface visual. Para teste direto, utilize os endpoints:

- https://clinic-api-20p7.onrender.com/api/patients
- https://clinic-api-20p7.onrender.com/api/appointments

> ⚠️ Observação: a API pode levar alguns segundos para responder na primeira requisição (plano gratuito).

---

## 📌 Sobre o projeto

Este projeto simula um sistema interno utilizado por clínicas para gerenciamento de pacientes e agendamentos.

Foi desenvolvido com foco em:
- construção de uma API REST 
- aplicação de regras de negócio reais
- integração entre frontend e backend
- deploy em ambiente de produção

---

## 🚀 Funcionalidades

### 👤 Pacientes
- Cadastro de pacientes
- Listagem completa
- Edição de dados
- Exclusão de registros

### 📅 Consultas
- Agendamento de consultas
- Listagem com dados vinculados ao paciente
- Edição e cancelamento de consultas

---

## 🧠 Regras de negócio

- ❌ Não permite agendar consultas em datas passadas  
- ❌ Impede conflitos de horário (duas consultas no mesmo horário)  
- ❌ Valida existência do paciente antes do agendamento  

---

## 💻 Interface (Frontend)

- Interface moderna e responsiva
- Feedback visual com notificações (toast)
- Busca dinâmica de pacientes (autocomplete)
- Melhor experiência de uso para cenários com muitos registros

---

## 🧰 Tecnologias utilizadas

### Backend
- C# (.NET 8)
- ASP.NET Core Web API
- Entity Framework Core
- SQLite
- Swagger

### Frontend
- HTML, CSS, JavaScript
- Integração com API REST
- Deploy via Vercel

### Infraestrutura
- API hospedada no Render
- Frontend hospedado no Vercel
- Docker para deploy do backend

---

## ⚙️ Diferenciais do projeto

- API com validações reais de negócio
- Separação clara entre camadas (Controller, Model, Data)
- Integração completa frontend + backend
- Deploy em produção (acessível publicamente)
- Uso de ferramentas de IA (Claude Code) como apoio no desenvolvimento

---

## 🚧 Status do projeto

🟡 Em desenvolvimento  
Novas melhorias planejadas:
- autenticação de usuários (login)
- controle de perfis (admin/atendente)
- dashboard com métricas
- paginação e filtros avançados

---

## 👨‍💻 Autor

**Gabriel R. Oliveira**  
🔗 www.linkedin.com/in/gabrieloliveira0099/
