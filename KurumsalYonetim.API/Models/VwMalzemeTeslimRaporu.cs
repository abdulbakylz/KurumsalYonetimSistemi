using System;
using System.Collections.Generic;

namespace KurumsalYonetim.API.Models;

public partial class VwMalzemeTeslimRaporu
{
    public string PersonelAdi { get; set; } = null!;

    public string UrunAdi { get; set; } = null!;

    public int Adet { get; set; }

    public DateTime? TeslimTarihi { get; set; }
}
