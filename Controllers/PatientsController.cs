using Microsoft.AspNetCore.Mvc;
using SistemaClinica.Data;
using SistemaClinica.Models;

namespace SistemaClinica.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PatientsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public PatientsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public ActionResult<IEnumerable<Paciente>> GetAll()
        {
            var pacientes = _context.Pacientes.ToList();
            return Ok(pacientes);
        }

        [HttpPost]
        public ActionResult<Paciente> Create(CreatePacienteRequest request)
        {
            var paciente = new Paciente
            {
                Nome = request.Nome,
                DataNascimento = request.DataNascimento
            };

            _context.Pacientes.Add(paciente);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAll), new { id = paciente.Id }, paciente);
        }
    }

    public class CreatePacienteRequest
    {
        public string Nome { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
    }
}
