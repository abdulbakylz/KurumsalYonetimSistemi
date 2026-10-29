
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using KurumsalYonetim.API.Data;
using KurumsalYonetim.API.Models;

namespace KurumsalYonetim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class DepartmanlarController : ControllerBase
{
    private readonly KurumsalYonetimDbContext _context;

    public DepartmanlarController(KurumsalYonetimDbContext context)
    {
        _context = context;
    }

    // Departmanları listele
    [HttpGet]
    public async Task<IActionResult> GetDepartmanlar()
    {
        var departmanlar = await _context.Departmanlars
            .AsNoTracking()
            .Select(d => new
            {
                d.DepartmanId,
                d.DepartmanAdi,
                PersonelSayisi = d.Personellers.Count
            })
            .ToListAsync();

        return Ok(departmanlar);
    }

    // Yeni departman ekle
    [HttpPost]
    public async Task<IActionResult> DepartmanEkle(
        [FromBody] DepartmanDto bilgi)
    {
        if (string.IsNullOrWhiteSpace(bilgi.DepartmanAdi))
            return BadRequest("Departman adı boş olamaz.");

        var departman = new Departmanlar
        {
            DepartmanAdi = bilgi.DepartmanAdi.Trim()
        };

        _context.Departmanlars.Add(departman);
        await _context.SaveChangesAsync();

        return Ok(departman);
    }

    // Departman güncelle
    [HttpPut("{id}")]
    public async Task<IActionResult> DepartmanGuncelle(
        int id,
        [FromBody] DepartmanDto bilgi)
    {
        var departman = await _context.Departmanlars
            .FindAsync(id);

        if (departman == null)
            return NotFound("Departman bulunamadı.");

        if (string.IsNullOrWhiteSpace(bilgi.DepartmanAdi))
            return BadRequest("Departman adı boş olamaz.");

        departman.DepartmanAdi = bilgi.DepartmanAdi.Trim();

        await _context.SaveChangesAsync();

        return Ok(new { message = "Departman güncellendi." });
    }

    // Departman sil
    [HttpDelete("{id}")]
    public async Task<IActionResult> DepartmanSil(int id)
    {
        var departman = await _context.Departmanlars
            .Include(d => d.Personellers)
            .FirstOrDefaultAsync(d => d.DepartmanId == id);

        if (departman == null)
            return NotFound("Departman bulunamadı.");

        if (departman.Personellers.Any())
            return BadRequest(
                "Bu departmanda personel bulunduğu için silinemez."
            );

        _context.Departmanlars.Remove(departman);
        await _context.SaveChangesAsync();

        return NoContent();
    }
}

public class DepartmanDto
{
    public string DepartmanAdi { get; set; } = "";
}
