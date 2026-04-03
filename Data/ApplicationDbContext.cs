using Microsoft.EntityFrameworkCore;
using SistemaClinica.Models;

namespace SistemaClinica.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Paciente> Pacientes { get; set; }
        public DbSet<Consulta> Consultas { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Paciente>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Nome).IsRequired().HasMaxLength(200);
                entity.HasMany(e => e.Consultas)
                    .WithOne(c => c.Paciente)
                    .HasForeignKey(c => c.PacienteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Consulta>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.DataHora).IsRequired();
                entity.HasOne(e => e.Paciente)
                    .WithMany(p => p.Consultas)
                    .HasForeignKey(e => e.PacienteId)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
