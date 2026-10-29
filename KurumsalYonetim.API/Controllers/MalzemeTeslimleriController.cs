
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalYonetim.API.Data;
using Microsoft.AspNetCore.Authorization;
using KurumsalYonetim.API.Models;
using System.ComponentModel.DataAnnotations;

namespace KurumsalYonetim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class MalzemeTeslimleriController : ControllerBase
{
    private readonly KurumsalYonetimDbContext _context;

    public MalzemeTeslimleriController(
        KurumsalYonetimDbContext context)
    {
        _context = context;
    }

    // Teslim kayıtlarını listele
    [HttpGet]
    public async Task<IActionResult> GetTeslimler()
    {
        var teslimler = await _context.MalzemeTeslimleris
            .AsNoTracking()
            .OrderByDescending(t => t.TeslimTarihi)
            .Select(t => new
            {
                t.TeslimId,
                t.PersonelId,
                PersonelAdi = t.Personel == null
                    ? "Bilinmiyor"
                    : t.Personel.Ad + " " + t.Personel.Soyad,
                t.UrunId,
                UrunAdi = t.Urun == null
                    ? "Bilinmiyor"
                    : t.Urun.UrunAdi,
                t.Adet,
                t.TeslimTarihi
            })
            .ToListAsync();

        return Ok(teslimler);
    }

    // Yeni malzeme teslimi
    [HttpPost]
    public async Task<IActionResult> TeslimEkle(
        [FromBody] TeslimEkleDto bilgi)
    {
        if (bilgi.Adet <= 0)
            return BadRequest("Teslim adedi sıfırdan büyük olmalıdır.");

        await using var transaction =
            await _context.Database.BeginTransactionAsync(
                System.Data.IsolationLevel.Serializable);

        var personelVar = await _context.Personellers
            .AnyAsync(p => p.PersonelId == bilgi.PersonelId);

        if (!personelVar)
            return BadRequest("Personel bulunamadı.");

        var urun = await _context.Urunlers
            .FirstOrDefaultAsync(u => u.UrunId == bilgi.UrunId);

        if (urun == null)
            return BadRequest("Ürün bulunamadı.");

        if (urun.StokAdedi < bilgi.Adet)
            return BadRequest(
                $"Yetersiz stok. Mevcut stok: {urun.StokAdedi}");

        urun.StokAdedi -= bilgi.Adet;

        var teslim = new MalzemeTeslimleri
        {
            PersonelId = bilgi.PersonelId,
            UrunId = bilgi.UrunId,
            Adet = bilgi.Adet,
            TeslimTarihi = DateTime.Now
        };

        _context.MalzemeTeslimleris.Add(teslim);

        await _context.SaveChangesAsync();
        await transaction.CommitAsync();

        return Ok(new
        {
            message = "Malzeme teslimi başarıyla kaydedildi.",
            teslimId = teslim.TeslimId,
            kalanStok = urun.StokAdedi
        });
    }
}

public class TeslimEkleDto
{
    [Range(1, int.MaxValue)]
    public int PersonelId { get; set; }

    [Range(1, int.MaxValue)]
    public int UrunId { get; set; }

    [Range(1, int.MaxValue)]
    public int Adet { get; set; }
}
