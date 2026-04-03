namespace SistemaClinica.Models
{
    public class Consulta
    {
        public int Id { get; set; }
        public int PacienteId { get; set; }
        public DateTime DataHora { get; set; }
        public Paciente? Paciente { get; set; }
    }
}
