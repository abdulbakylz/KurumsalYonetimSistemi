using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using KurumsalYonetim.API.Data;
using KurumsalYonetim.API.Dtos;
using KurumsalYonetim.API.Models;

namespace KurumsalYonetim.API.Controllers;

[ApiController]
[Route("api/personeller")]
public class PersonellerController : ControllerBase
{
    private readonly KurumsalYonetimDbContext _context;

    public PersonellerController(KurumsalYonetimDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPersoneller()
    {
        var personeller = await _context.Personellers
            .Select(p => new
            {
                p.PersonelId,
                p.Ad,
                p.Soyad,
                p.Email,
                maas = p.Maas,
                p.DepartmanId
                
            })
            .ToListAsync();

        return Ok(personeller);
    }
    [HttpPost]
public async Task<IActionResult> PersonelEkle(
    [FromBody] PersonelEkleDto yeniPersonel)
{
    if (string.IsNullOrWhiteSpace(yeniPersonel.Ad) ||
        string.IsNullOrWhiteSpace(yeniPersonel.Soyad) ||
        string.IsNullOrWhiteSpace(yeniPersonel.Email))
    {
        return BadRequest("Ad, soyad ve e-posta zorunludur.");
    }

    bool departmanVar = await _context.Departmanlars
        .AnyAsync(d => d.DepartmanId == yeniPersonel.DepartmanId);

    if (!departmanVar)
    {
        return BadRequest("Geçersiz departman.");
    }

    var personel = new Personeller
    {
        Ad = yeniPersonel.Ad,
        Soyad = yeniPersonel.Soyad,
        Email = yeniPersonel.Email,
        Maas = yeniPersonel.Maas,
        DepartmanId = yeniPersonel.DepartmanId
    };

    _context.Personellers.Add(personel);
    await _context.SaveChangesAsync();

    return Created(
        $"/api/personeller/{personel.PersonelId}",
        new { personel.PersonelId, personel.Ad, personel.Soyad }
    );
}

[HttpPut("{id}")]
public async Task<IActionResult> PersonelGuncelle(
    int id,
    [FromBody] PersonelEkleDto bilgi)
{
    var personel = await _context.Personellers
        .FirstOrDefaultAsync(p => p.PersonelId == id);

    if (personel == null)
        return NotFound("Personel bulunamadı.");

    bool departmanVar = await _context.Departmanlars
        .AnyAsync(d => d.DepartmanId == bilgi.DepartmanId);

    if (!departmanVar)
        return BadRequest("Geçersiz departman.");

    personel.Ad = bilgi.Ad;
    personel.Soyad = bilgi.Soyad;
    personel.Email = bilgi.Email;
    personel.Maas = bilgi.Maas;
    personel.DepartmanId = bilgi.DepartmanId;

    await _context.SaveChangesAsync();

    return Ok(new { message = "Personel güncellendi." });
}

[HttpDelete("{id}")]
public async Task<IActionResult> PersonelSil(int id)
{
    var personel = await _context.Personellers
        .FirstOrDefaultAsync(p => p.PersonelId == id);

    if (personel == null)
        return NotFound("Personel bulunamadı.");

    _context.Personellers.Remove(personel);
    await _context.SaveChangesAsync();

    return NoContent();
}

}