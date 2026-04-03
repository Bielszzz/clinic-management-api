using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaClinica.Data;
using SistemaClinica.Models;

namespace SistemaClinica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AppointmentsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AppointmentsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Consulta>> GetAll()
        {
            var consultas = _context.Consultas
                .Include("Paciente")
                .ToList();
            return Ok(consultas);
        }

        [HttpPost]
        public ActionResult<Consulta> Create(CreateAppointmentRequest request)
        {
            if (request.DataHora < DateTime.UtcNow)
            {
                return BadRequest(new { error = "Não é permitido agendar consultas em datas passadas." });
            }

            var consultaExistente = _context.Consultas
                .FirstOrDefault(c => c.DataHora == request.DataHora);

            if (consultaExistente != null)
            {
                return BadRequest(new { error = "Já existe uma consulta agendada para este horário." });
            }

            var pacienteExiste = _context.Pacientes.Any(p => p.Id == request.PacienteId);
            if (!pacienteExiste)
            {
                return NotFound(new { error = "Paciente não encontrado." });
            }

            var consulta = new Consulta
            {
                PacienteId = request.PacienteId,
                DataHora = request.DataHora,
            };

            _context.Consultas.Add(consulta);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAll), new { id = consulta.Id }, consulta);
        }
    }

    public class CreateAppointmentRequest
    {
        public int PacienteId { get; set; }
        public DateTime DataHora { get; set; }
    }
}
