
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using KurumsalYonetim.API.Models;
using Microsoft.IdentityModel.Tokens;

namespace KurumsalYonetim.API.Services;

public class JwtServisi
{
    private readonly IConfiguration _configuration;

    public JwtServisi(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public string TokenOlustur(Kullanicilar kullanici)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT anahtarı bulunamadı.");

        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT issuer bulunamadı.");

        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT audience bulunamadı.");

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key));

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                kullanici.KullaniciId.ToString()),

            new Claim(
                ClaimTypes.Name,
                kullanici.AdSoyad),

            new Claim(
                ClaimTypes.Email,
                kullanici.Email),

            new Claim(
                ClaimTypes.Role,
                kullanici.Rol)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
