# PowerShell Script zum Wechsel zwischen Farbpaletten-Varianten

Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  TASTY-APP: Farbpaletten-Varianten zum Testen                ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "Welche Variante möchtest du testen?" -ForegroundColor Yellow
Write-Host ""
Write-Host "[A] - Helles Cream       (Cream Hauptfläche, Bordeaux Akzente)" -ForegroundColor Magenta
Write-Host "[B] - Modernes Grau      (Grau Basis, Bordeaux + Gold Akzente)" -ForegroundColor Magenta
Write-Host "[O] - Original           (Bordeaux Basis - Originalversion)" -ForegroundColor Magenta
Write-Host ""
Write-Host "Eingabe (A/B/O): " -ForegroundColor Yellow -NoNewline
$choice = Read-Host

$scriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$configPath = Join-Path $scriptDir "tailwind.config.cjs"

switch ($choice.ToUpper()) {
    "A" {
        Write-Host ""
        Write-Host "🎨 Lade Variante A: Helles Cream..." -ForegroundColor Green
        Copy-Item (Join-Path $scriptDir "tailwind.config.variant-a.cjs") $configPath -Force
        Write-Host "✅ Fertig! Tailwind wird neu geparst..." -ForegroundColor Green
        Write-Host "   Öffne http://localhost:3000 um die Änderungen zu sehen" -ForegroundColor Cyan
    }
    "B" {
        Write-Host ""
        Write-Host "🎨 Lade Variante B: Modernes Grau..." -ForegroundColor Green
        Copy-Item (Join-Path $scriptDir "tailwind.config.variant-b.cjs") $configPath -Force
        Write-Host "✅ Fertig! Tailwind wird neu geparst..." -ForegroundColor Green
        Write-Host "   Öffne http://localhost:3000 um die Änderungen zu sehen" -ForegroundColor Cyan
    }
    "O" {
        Write-Host ""
        Write-Host "🎨 Lade Originalversion: Bordeaux..." -ForegroundColor Green
        # Original aus Git wiederherstellen oder von Backup kopieren
        git -C $scriptDir checkout tailwind.config.cjs 2>$null
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Git Restore fehlgeschlagen - Config wurde nicht geändert" -ForegroundColor Yellow
        } else {
            Write-Host "✅ Fertig! Originalversion hergestellt..." -ForegroundColor Green
            Write-Host "   Öffne http://localhost:3000 um die Änderungen zu sehen" -ForegroundColor Cyan
        }
    }
    default {
        Write-Host "❌ Ungültige Eingabe. Bitte A, B oder O eingeben." -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Zu testen:" -ForegroundColor Yellow
Write-Host "  • Startseite (Pizza Verinio Hero)" -ForegroundColor Gray
Write-Host "  • Speisekarten-Tab (Lesbarkeit)" -ForegroundColor Gray
Write-Host "  • Coupons/Aufmerksamkeiten (müssen herausstechen)" -ForegroundColor Gray
Write-Host "  • Profil-Tab (Kontrast)" -ForegroundColor Gray
Write-Host ""
