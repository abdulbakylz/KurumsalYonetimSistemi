
using KurumsalYonetim.API.Data;
using KurumsalYonetim.API.Models;
using KurumsalYonetim.API.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace KurumsalYonetim.API.Controllers;

[ApiController]
[Route("api/auth")]

public class AuthController : ControllerBase
{
    private readonly KurumsalYonetimDbContext _context;
    private readonly ParolaServisi _parolaServisi;
    private readonly JwtServisi _jwtServisi;

    public AuthController(
        KurumsalYonetimDbContext context,
        ParolaServisi parolaServisi,
        JwtServisi jwtServisi)
    {
        _context = context;
        _parolaServisi = parolaServisi;
        _jwtServisi = jwtServisi;
    }

    public record KayitIstek(
        string AdSoyad,
        string Email,
        string Sifre
    );

    [HttpPost("register")]
    public async Task<IActionResult> Kayit(KayitIstek istek)
    {
        if (string.IsNullOrWhiteSpace(istek.AdSoyad) ||
            string.IsNullOrWhiteSpace(istek.Email) ||
            string.IsNullOrWhiteSpace(istek.Sifre))
        {
            return BadRequest("Tüm alanları doldurun.");
        }

        if (istek.AdSoyad.Trim().Length > 100 ||
            istek.Email.Trim().Length > 150 ||
            istek.Sifre.Length < 8)
        {
            return BadRequest("Ad, e-posta veya şifre uzunluğu geçersiz.");
        }

        var email = istek.Email.Trim().ToLowerInvariant();

        if (await _context.Kullanicilars.AnyAsync(k => k.Email == email))
        {
            return Conflict("Bu e-posta zaten kayıtlı.");
        }

        var kullanici = new Kullanicilar
        {
            AdSoyad = istek.AdSoyad.Trim(),
            Email = email,
            Rol = "Personel",
            Aktif = true
        };

        kullanici.SifreHash =
            _parolaServisi.Hashle(kullanici, istek.Sifre);

        _context.Kullanicilars.Add(kullanici);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict("Kayıt oluşturulamadı.");
        }

        return StatusCode(201, new
        {
            kullanici.KullaniciId,
            kullanici.AdSoyad,
            kullanici.Email,
            kullanici.Rol
        });
    }

    public record GirisIstek(
        string Email,
        string Sifre
    );

    [HttpPost("login")]
    public async Task<IActionResult> Giris(GirisIstek istek)
    {
        if (string.IsNullOrWhiteSpace(istek.Email) ||
            string.IsNullOrWhiteSpace(istek.Sifre))
        {
            return BadRequest("E-posta ve şifre gereklidir.");
        }

        var email = istek.Email.Trim().ToLowerInvariant();

        var kullanici = await _context.Kullanicilars
            .FirstOrDefaultAsync(k => k.Email == email);

        if (kullanici == null ||
            !_parolaServisi.Dogrula(
                kullanici,
                kullanici.SifreHash,
                istek.Sifre))
        {
            return Unauthorized("E-posta veya şifre hatalı.");
        }

        if (!kullanici.Aktif)
        {
            return Unauthorized("Bu hesap aktif değil.");
        }

        var token = _jwtServisi.TokenOlustur(kullanici);

        return Ok(new
        {
            Mesaj = "Giriş başarılı.",
            Token = token,
            kullanici.KullaniciId,
            kullanici.AdSoyad,
            kullanici.Email,
            kullanici.Rol
        });
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var kullaniciIdDegeri =
            User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(kullaniciIdDegeri, out var kullaniciId))
        {
            return Unauthorized(new
            {
                mesaj = "Geçersiz oturum."
            });
        }

        var kullanici = await _context.Kullanicilars
            .AsNoTracking()
            .FirstOrDefaultAsync(k => k.KullaniciId == kullaniciId);

        if (kullanici == null || !kullanici.Aktif)
        {
            return Unauthorized(new
            {
                mesaj = "Kullanıcı bulunamadı veya hesap pasif."
            });
        }

        if (kullanici.Rol != "Admin")
        {
            return StatusCode(403, new
            {
                mesaj = "Yönetim paneline erişim yetkiniz yok."
            });
        }

        return Ok(new
        {
            kullanici.KullaniciId,
            kullanici.AdSoyad,
            kullanici.Email,
            kullanici.Rol
        });
    }

}
