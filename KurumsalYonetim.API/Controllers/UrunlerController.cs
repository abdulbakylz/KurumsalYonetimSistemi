
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using KurumsalYonetim.API.Data;
using KurumsalYonetim.API.Models;
using System.ComponentModel.DataAnnotations;

namespace KurumsalYonetim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UrunlerController : ControllerBase
{
    private readonly KurumsalYonetimDbContext _context;

    public UrunlerController(KurumsalYonetimDbContext context)
    {
        _context = context;
    }

    // Tüm ürünleri listele
    [HttpGet]
    public async Task<IActionResult> GetUrunler()
    {
        var urunler = await _context.Urunlers
            .AsNoTracking()
            .OrderBy(u => u.UrunAdi)
            .Select(u => new
            {
                u.UrunId,
                u.UrunAdi,
                u.Kategori,
                u.StokAdedi,
                u.BirimFiyat,
                KritikStok = u.StokAdedi <= 5,
                StokDegeri = u.StokAdedi * u.BirimFiyat
            })
            .ToListAsync();

        return Ok(urunler);
    }

    // Yeni ürün ekle
    [HttpPost]
    public async Task<IActionResult> UrunEkle(
        [FromBody] UrunDto bilgi)
    {
        var urun = new Urunler
        {
            UrunAdi = bilgi.UrunAdi.Trim(),
            Kategori = bilgi.Kategori.Trim(),
            StokAdedi = bilgi.StokAdedi,
            BirimFiyat = bilgi.BirimFiyat
        };

        _context.Urunlers.Add(urun);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            message = "Ürün başarıyla eklendi.",
            urunId = urun.UrunId
        });
    }

    // Ürün güncelle
    [HttpPut("{id}")]
    public async Task<IActionResult> UrunGuncelle(
        int id,
        [FromBody] UrunDto bilgi)
    {
        var urun = await _context.Urunlers
            .FirstOrDefaultAsync(u => u.UrunId == id);

        if (urun == null)
            return NotFound("Ürün bulunamadı.");

        urun.UrunAdi = bilgi.UrunAdi.Trim();
        urun.Kategori = bilgi.Kategori.Trim();
        urun.StokAdedi = bilgi.StokAdedi;
        urun.BirimFiyat = bilgi.BirimFiyat;

        await _context.SaveChangesAsync();

        return Ok(new { message = "Ürün güncellendi." });
    }

    // Ürün sil
    [HttpDelete("{id}")]
    public async Task<IActionResult> UrunSil(int id)
    {
        var urun = await _context.Urunlers
            .FirstOrDefaultAsync(u => u.UrunId == id);

        if (urun == null)
            return NotFound("Ürün bulunamadı.");

        bool teslimKaydiVar = await _context.MalzemeTeslimleris
            .AnyAsync(t => t.UrunId == id);

        if (teslimKaydiVar)
        {
            return BadRequest(
                "Bu ürüne ait malzeme teslim kayıtları bulunduğu için silinemez."
            );
        }

        _context.Urunlers.Remove(urun);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

// Ürün ekleme ve güncelleme için veri modeli
public class UrunDto
{
    [Required]
    [MaxLength(150)]
    public string UrunAdi { get; set; } = "";

    [Required]
    [MaxLength(100)]
    public string Kategori { get; set; } = "";

    [Range(0, int.MaxValue)]
    public int StokAdedi { get; set; }

    [Range(typeof(decimal), "0", "999999999")]
    public decimal BirimFiyat { get; set; }
}
