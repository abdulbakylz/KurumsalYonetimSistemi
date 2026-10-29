using System;
using System.Collections.Generic;

namespace KurumsalYonetim.API.Models;

public partial class Departmanlar
{
    public int DepartmanId { get; set; }

    public string DepartmanAdi { get; set; } = null!;

    public virtual ICollection<Personeller> Personellers { get; set; } = new List<Personeller>();
}
