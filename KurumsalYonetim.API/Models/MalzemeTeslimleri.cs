using System;
using System.Collections.Generic;

namespace KurumsalYonetim.API.Models;

public partial class MalzemeTeslimleri
{
    public int TeslimId { get; set; }

    public int? PersonelId { get; set; }

    public int? UrunId { get; set; }

    public int Adet { get; set; }

    public DateTime? TeslimTarihi { get; set; }

    public virtual Personeller? Personel { get; set; }

    public virtual Urunler? Urun { get; set; }
}
