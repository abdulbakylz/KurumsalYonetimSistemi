using System;
using System.Collections.Generic;
using KurumsalYonetim.API.Models;
using Microsoft.EntityFrameworkCore;

namespace KurumsalYonetim.API.Data;

public partial class KurumsalYonetimDbContext : DbContext
{
    public KurumsalYonetimDbContext(DbContextOptions<KurumsalYonetimDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Departmanlar> Departmanlars { get; set; }

    public virtual DbSet<MalzemeTeslimleri> MalzemeTeslimleris { get; set; }

    public virtual DbSet<Personeller> Personellers { get; set; }

    public virtual DbSet<Kullanicilar> Kullanicilars { get; set; }

    public virtual DbSet<Urunler> Urunlers { get; set; }

    public virtual DbSet<VwMalzemeTeslimRaporu> VwMalzemeTeslimRaporus { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

modelBuilder.Entity<Kullanicilar>(entity =>
{
    entity.HasKey(e => e.KullaniciId);

    entity.ToTable("Kullanicilar");

    entity.HasIndex(e => e.Email).IsUnique();

    entity.Property(e => e.KullaniciId)
        .HasColumnName("KullaniciID");

    entity.Property(e => e.AdSoyad)
        .HasMaxLength(100);

    entity.Property(e => e.Email)
        .HasMaxLength(150);

    entity.Property(e => e.SifreHash)
        .HasMaxLength(255);

    entity.Property(e => e.Rol)
        .HasMaxLength(20)
        .HasDefaultValue("Personel");

    entity.Property(e => e.Aktif)
        .HasDefaultValue(true);

    entity.Property(e => e.OlusturmaTarihi)
        .HasDefaultValueSql("(sysdatetime())");
});

        modelBuilder.Entity<Departmanlar>(entity =>
        {
            entity.HasKey(e => e.DepartmanId).HasName("PK__Departma__3A231236FA89659D");

            entity.ToTable("Departmanlar");

            entity.HasIndex(e => e.DepartmanAdi, "UQ__Departma__535ED3CD44062287").IsUnique();

            entity.Property(e => e.DepartmanId).HasColumnName("DepartmanID");
            entity.Property(e => e.DepartmanAdi).HasMaxLength(100);
        });

        modelBuilder.Entity<MalzemeTeslimleri>(entity =>
        {
            entity.HasKey(e => e.TeslimId).HasName("PK__MalzemeT__698351C27D0BE706");

            entity.ToTable("MalzemeTeslimleri");

            entity.Property(e => e.TeslimId).HasColumnName("TeslimID");
            entity.Property(e => e.PersonelId).HasColumnName("PersonelID");
            entity.Property(e => e.TeslimTarihi).HasDefaultValueSql("(sysdatetime())");
            entity.Property(e => e.UrunId).HasColumnName("UrunID");

            entity.HasOne(d => d.Personel).WithMany(p => p.MalzemeTeslimleris)
                .HasForeignKey(d => d.PersonelId)
                .HasConstraintName("FK__MalzemeTe__Perso__49C3F6B7");

            entity.HasOne(d => d.Urun).WithMany(p => p.MalzemeTeslimleris)
                .HasForeignKey(d => d.UrunId)
                .HasConstraintName("FK__MalzemeTe__UrunI__4AB81AF0");
        });

        modelBuilder.Entity<Personeller>(entity =>
        {
            entity.HasKey(e => e.PersonelId).HasName("PK__Personel__0F0C5751CFC86538");

            entity.ToTable("Personeller");

            entity.HasIndex(e => e.Email, "UQ__Personel__A9D10534C055A668").IsUnique();

            entity.Property(e => e.PersonelId).HasColumnName("PersonelID");
            entity.Property(e => e.Ad).HasMaxLength(50);
            entity.Property(e => e.DepartmanId).HasColumnName("DepartmanID");
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.Maas).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Soyad).HasMaxLength(50);

            entity.HasOne(d => d.Departman).WithMany(p => p.Personellers)
                .HasForeignKey(d => d.DepartmanId)
                .HasConstraintName("FK__Personell__Depar__3B75D760");
        });

        modelBuilder.Entity<Urunler>(entity =>
        {
            entity.HasKey(e => e.UrunId).HasName("PK__Urunler__623D364BDBD0E5D6");

            entity.ToTable("Urunler");

            entity.Property(e => e.UrunId).HasColumnName("UrunID");
            entity.Property(e => e.BirimFiyat).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.Kategori).HasMaxLength(50);
            entity.Property(e => e.UrunAdi).HasMaxLength(100);
        });

        modelBuilder.Entity<VwMalzemeTeslimRaporu>(entity =>
        {
            entity
                .HasNoKey()
                .ToView("vw_MalzemeTeslimRaporu");

            entity.Property(e => e.PersonelAdi).HasMaxLength(101);
            entity.Property(e => e.UrunAdi).HasMaxLength(100);
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
