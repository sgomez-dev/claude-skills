# ============================================================================
#  Claude Skills Installer (Windows PowerShell)
#  Installs 90 custom slash commands for Claude Code
# ============================================================================

$ErrorActionPreference = "Stop"
$RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$SkillsDir = Join-Path $RepoDir "skills"

function Write-Banner {
    Write-Host ""
    Write-Host "   ╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "   ║                                                       ║" -ForegroundColor Cyan
    Write-Host "   ║            CLAUDE SKILLS INSTALLER                    ║" -ForegroundColor Cyan
    Write-Host "   ║            90 Slash Commands for Claude Code          ║" -ForegroundColor Cyan
    Write-Host "   ║                                                       ║" -ForegroundColor Cyan
    Write-Host "   ╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

function Install-Global {
    $target = Join-Path $env:USERPROFILE ".claude\commands"
    Write-Host "`n[Global Install] Installing to $target`n" -ForegroundColor Blue
    New-Item -ItemType Directory -Force -Path $target | Out-Null

    $count = 0
    foreach ($categoryDir in Get-ChildItem -Path $SkillsDir -Directory) {
        $category = $categoryDir.Name
        $catCount = 0
        foreach ($skillFile in Get-ChildItem -Path $categoryDir.FullName -Filter "*.md") {
            $skillName = [System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name)
            $destName = "${category}--${skillName}.md"
            Copy-Item $skillFile.FullName (Join-Path $target $destName)
            $count++
            $catCount++
        }
        Write-Host "   + $category ($catCount skills)" -ForegroundColor Green
    }

    Write-Host "`n   $count skills installed globally!" -ForegroundColor Green
    Write-Host "   Available in ALL your projects as /category--skill" -ForegroundColor Cyan
}

function Install-Project {
    $target = Join-Path (Get-Location) ".claude\commands"
    Write-Host "`n[Project Install] Installing to $target`n" -ForegroundColor Blue
    New-Item -ItemType Directory -Force -Path $target | Out-Null

    $count = 0
    foreach ($categoryDir in Get-ChildItem -Path $SkillsDir -Directory) {
        $category = $categoryDir.Name
        $catCount = 0
        foreach ($skillFile in Get-ChildItem -Path $categoryDir.FullName -Filter "*.md") {
            $skillName = [System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name)
            $destName = "${category}--${skillName}.md"
            Copy-Item $skillFile.FullName (Join-Path $target $destName)
            $count++
            $catCount++
        }
        Write-Host "   + $category ($catCount skills)" -ForegroundColor Green
    }

    Write-Host "`n   $count skills installed to project!" -ForegroundColor Green
}

function Uninstall-Skills {
    Write-Host "`n[Uninstall] Removing claude-skills commands...`n" -ForegroundColor Yellow
    $count = 0

    $dirs = @(
        (Join-Path $env:USERPROFILE ".claude\commands"),
        (Join-Path (Get-Location) ".claude\commands")
    )

    foreach ($dir in $dirs) {
        if (Test-Path $dir) {
            foreach ($f in Get-ChildItem -Path $dir -Filter "*--*.md") {
                Remove-Item $f.FullName
                $count++
            }
        }
    }

    Write-Host "   Removed $count skill files." -ForegroundColor Green
}

# ============================================================================
#  MAIN
# ============================================================================

Write-Banner

Write-Host "   How would you like to install?`n"
Write-Host "   1) Global     - Available in ALL projects      " -NoNewline
Write-Host "(recommended)" -ForegroundColor Cyan
Write-Host "   2) Project    - Only in current project directory"
Write-Host "   3) Uninstall  - Remove installed skills"
Write-Host ""

$choice = Read-Host "   Choose [1-3]"

switch ($choice) {
    "1" { Install-Global }
    "2" { Install-Project }
    "3" { Uninstall-Skills }
    default { Write-Host "`n   Invalid choice." -ForegroundColor Red; exit 1 }
}

Write-Host ""
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   Usage: Type / in Claude Code to see all available commands"
Write-Host "   Example: " -NoNewline
Write-Host "/git--commit" -ForegroundColor Cyan -NoNewline
Write-Host ", " -NoNewline
Write-Host "/security--audit" -ForegroundColor Cyan -NoNewline
Write-Host ", " -NoNewline
Write-Host "/test--gen" -ForegroundColor Cyan
Write-Host "   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
