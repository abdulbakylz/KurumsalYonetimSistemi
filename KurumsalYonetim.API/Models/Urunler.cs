using System;
using System.Collections.Generic;

namespace KurumsalYonetim.API.Models;

public partial class Urunler
{
    public int UrunId { get; set; }

    public string UrunAdi { get; set; } = null!;

    public string Kategori { get; set; } = null!;

    public int StokAdedi { get; set; }

    public decimal BirimFiyat { get; set; }

    public virtual ICollection<MalzemeTeslimleri> MalzemeTeslimleris { get; set; } = new List<MalzemeTeslimleri>();
}
