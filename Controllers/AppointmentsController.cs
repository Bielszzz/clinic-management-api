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
            var dataHora = DateTime.Parse(request.DataHora);

            if (dataHora < DateTime.Now)
            {
                return BadRequest(new { error = "Não é permitido agendar consultas em datas passadas." });
            }

            var consultaExistente = _context.Consultas
                .FirstOrDefault(c => c.DataHora == dataHora);

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
                DataHora = dataHora,
            };

            _context.Consultas.Add(consulta);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAll), new { id = consulta.Id }, consulta);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, UpdateAppointmentRequest request)
        {
            var consulta = _context.Consultas.Find(id);
            if (consulta == null)
            {
                return NotFound(new { error = "Consulta não encontrada." });
            }

            var dataHora = DateTime.Parse(request.DataHora);

            if (dataHora < DateTime.Now)
            {
                return BadRequest(new { error = "Não é permitido agendar consultas em datas passadas." });
            }

            var consultaExistente = _context.Consultas
                .FirstOrDefault(c => c.DataHora == dataHora && c.Id != id);

            if (consultaExistente != null)
            {
                return BadRequest(new { error = "Já existe uma consulta agendada para este horário." });
            }

            consulta.PacienteId = request.PacienteId;
            consulta.DataHora = dataHora;

            _context.Consultas.Update(consulta);
            _context.SaveChanges();

            return Ok(consulta);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var consulta = _context.Consultas.Find(id);
            if (consulta == null)
            {
                return NotFound(new { error = "Consulta não encontrada." });
            }

            _context.Consultas.Remove(consulta);
            _context.SaveChanges();

            return NoContent();
        }
    }

    public class CreateAppointmentRequest
    {
        public int PacienteId { get; set; }
        public string DataHora { get; set; } = string.Empty;
    }

    public class UpdateAppointmentRequest
    {
        public int PacienteId { get; set; }
        public string DataHora { get; set; } = string.Empty;
    }
}
