using System;
using System.Collections.Generic;

namespace KurumsalYonetim.API.Models;

public partial class Personeller
{
    public int PersonelId { get; set; }

    public string Ad { get; set; } = null!;

    public string Soyad { get; set; } = null!;

    public string Email { get; set; } = null!;

    public decimal? Maas { get; set; }

    public int? DepartmanId { get; set; }

    public virtual Departmanlar? Departman { get; set; }

    public virtual ICollection<MalzemeTeslimleri> MalzemeTeslimleris { get; set; } = new List<MalzemeTeslimleri>();
}
