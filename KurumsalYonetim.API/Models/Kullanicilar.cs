
namespace KurumsalYonetim.API.Models;

public partial class Kullanicilar
{
    public int KullaniciId { get; set; }

    public string AdSoyad { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string SifreHash { get; set; } = null!;

    public string Rol { get; set; } = "Personel";

    public bool Aktif { get; set; } = true;

    public DateTime OlusturmaTarihi { get; set; }
}
