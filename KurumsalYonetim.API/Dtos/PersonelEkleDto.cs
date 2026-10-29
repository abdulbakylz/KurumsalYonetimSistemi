using System.ComponentModel.DataAnnotations;

namespace KurumsalYonetim.API.Dtos;

public class PersonelEkleDto
{
    [Required]
    public string Ad { get; set; } = "";

    [Required]
    public string Soyad { get; set; } = "";

    [Required]
    [EmailAddress]
    public string Email { get; set; } = "";

    [Range(0, double.MaxValue)]
    public decimal Maas { get; set; }

    [Range(1, int.MaxValue)]
    public int DepartmanId { get; set; }
}