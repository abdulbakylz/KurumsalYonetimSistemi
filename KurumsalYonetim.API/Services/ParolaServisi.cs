
using KurumsalYonetim.API.Models;
using Microsoft.AspNetCore.Identity;

namespace KurumsalYonetim.API.Services;

public class ParolaServisi
{
    private readonly PasswordHasher<Kullanicilar> _hasher = new();

    public string Hashle(Kullanicilar kullanici, string parola)
    {
        return _hasher.HashPassword(kullanici, parola);
    }

    public bool Dogrula(
        Kullanicilar kullanici,
        string hash,
        string parola)
    {
        var sonuc = _hasher.VerifyHashedPassword(
            kullanici,
            hash,
            parola
        );

        return sonuc != PasswordVerificationResult.Failed;
    }
}
