namespace SistemaClinica.Models
{
    public class Paciente
    {
        public int Id { get; set; }
        public string Nome { get; set; } = string.Empty;
        public DateTime DataNascimento { get; set; }
        public ICollection<Consulta> Consultas { get; set; } = new List<Consulta>();
    }
}
