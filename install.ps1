# ============================================================================
#  Claude Skills Installer (Windows PowerShell)
#  Installs 90 custom slash commands for Claude Code
# ============================================================================

$ErrorActionPreference = "Stop"

# Support both: irm ... | iex  AND  .\install.ps1 (local clone)
$IsRemote = ($MyInvocation.MyCommand.Path -eq $null -or $MyInvocation.MyCommand.Path -eq "")

if ($IsRemote) {
    # Running via irm | iex — download skills directly from GitHub
    $GithubBase = "https://raw.githubusercontent.com/sgomez-dev/claude-skills/main/skills"
    $RepoDir = $null
    $SkillsDir = $null
} else {
    $RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $SkillsDir = Join-Path $RepoDir "skills"
}

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

# Skills manifest for remote installs
$RemoteSkills = @{
    "git"          = @("commit","changelog","release","branch","undo","blame-detective","stash-manager","cherry-pick-pr","pr-create","pr-review")
    "code-quality" = @("review","refactor","dead-code","complexity","dry","code-smells","naming","type-check","error-handling","dependency-audit")
    "testing"      = @("test-gen","test-edge-cases","test-integration","test-fix","test-coverage","test-e2e","test-mock","snapshot-update")
    "docs"         = @("doc-gen","readme-gen","diagram","adr","api-doc","openapi-gen","contributing")
    "security"     = @("security-audit","secrets-scan","auth-review","sanitize","cors-review","csp-gen","dependency-vuln","env-hardening")
    "devops"       = @("dockerfile","docker-compose","ci","github-actions","k8s","terraform","nginx","deploy-check")
    "database"     = @("migration","query-optimize","schema","seed","erd","prisma-gen")
    "api"          = @("endpoint","graphql-schema","rest-client","mock-api")
    "performance"  = @("perf-audit","bundle-analyze","cache","lazy-load","memory-leak")
    "scaffold"     = @("scaffold","fullstack","component","hook","middleware","model")
    "ai"           = @("prompt-engineer","ai-integration","embeddings")
    "web"          = @("landing-page","spa-scaffold","animations","design-system","ui-components-pro","conversion-optimizer")
    "utils"        = @("explain","translate","regex","gitignore","convert","dep-update","env-setup","cron-explain","tsconfig","eslint-config","package-json","monorepo")
    "accessibility"= @("a11y-audit","a11y-fix")
    "i18n"         = @("i18n-setup")
    "meta"         = @("skills-init","pipeline-run","skill-forge","health-check")
}

function Install-ToTarget {
    param([string]$target)
    New-Item -ItemType Directory -Force -Path $target | Out-Null
    $script:installCount = 0

    if ($IsRemote) {
        foreach ($category in $RemoteSkills.Keys) {
            $catCount = 0
            foreach ($skill in $RemoteSkills[$category]) {
                $url = "$GithubBase/$category/$skill.md"
                $dest = Join-Path $target "${category}--${skill}.md"
                try {
                    Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
                    $script:installCount++; $catCount++
                } catch {
                    Write-Host "   ! Failed: $category/$skill" -ForegroundColor Yellow
                }
            }
            Write-Host "   + $category ($catCount skills)" -ForegroundColor Green
        }
    } else {
        foreach ($categoryDir in Get-ChildItem -Path $SkillsDir -Directory) {
            $category = $categoryDir.Name
            $catCount = 0
            foreach ($skillFile in Get-ChildItem -Path $categoryDir.FullName -Filter "*.md") {
                $skillName = [System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name)
                $destName = "${category}--${skillName}.md"
                Copy-Item $skillFile.FullName (Join-Path $target $destName)
                $script:installCount++; $catCount++
            }
            Write-Host "   + $category ($catCount skills)" -ForegroundColor Green
        }
    }
}

function Install-Global {
    $target = Join-Path $env:USERPROFILE ".claude\commands"
    Write-Host "`n[Global Install] Installing to $target`n" -ForegroundColor Blue
    Install-ToTarget -target $target
    Write-Host "`n   $script:installCount skills installed globally!" -ForegroundColor Green
    Write-Host "   Available in ALL your projects as /category--skill" -ForegroundColor Cyan
}

function Install-Project {
    $target = Join-Path (Get-Location) ".claude\commands"
    Write-Host "`n[Project Install] Installing to $target`n" -ForegroundColor Blue
    Install-ToTarget -target $target
    Write-Host "`n   $script:installCount skills installed to project!" -ForegroundColor Green
}

function Install-Selective {
    Write-Host "`n   Install selected categories to:"
    Write-Host "   1) Global  - ~/.claude/commands (all projects)"
    Write-Host "   2) Project - .claude/commands (this project only)`n"
    $scope = Read-Host "   Choose [1-2]"
    $target = if ($scope -eq "2") { Join-Path (Get-Location) ".claude\commands" } else { Join-Path $env:USERPROFILE ".claude\commands" }

    $categories = $RemoteSkills.Keys | Sort-Object

    Write-Host "`n[Selective Install] Choose categories to install:`n" -ForegroundColor Blue

    $i = 1
    $indexedCategories = @{}
    foreach ($cat in $categories) {
        $skillCount = $RemoteSkills[$cat].Count
        Write-Host "   $i) $cat ($skillCount skills)"
        $indexedCategories[$i] = $cat
        $i++
    }

    Write-Host "`n   Enter numbers separated by spaces (e.g., 1 3 5)"
    Write-Host "   Or 'all' to install everything`n"
    $selection = Read-Host "   > "

    if ($selection -eq "all") {
        Install-Global
        return
    }

    New-Item -ItemType Directory -Force -Path $target | Out-Null
    $script:installCount = 0

    foreach ($numStr in $selection -split '\s+') {
        $num = [int]$numStr
        if ($indexedCategories.ContainsKey($num)) {
            $category = $indexedCategories[$num]
            $catCount = 0
            if ($IsRemote) {
                foreach ($skill in $RemoteSkills[$category]) {
                    $url = "$GithubBase/$category/$skill.md"
                    $dest = Join-Path $target "${category}--${skill}.md"
                    try {
                        Invoke-WebRequest -Uri $url -OutFile $dest -UseBasicParsing
                        $script:installCount++; $catCount++
                    } catch {
                        Write-Host "   ! Failed: $category/$skill" -ForegroundColor Yellow
                    }
                }
            } else {
                $categoryDir = Join-Path $SkillsDir $category
                foreach ($skillFile in Get-ChildItem -Path $categoryDir -Filter "*.md" -ErrorAction SilentlyContinue) {
                    $skillName = [System.IO.Path]::GetFileNameWithoutExtension($skillFile.Name)
                    Copy-Item $skillFile.FullName (Join-Path $target "${category}--${skillName}.md")
                    $script:installCount++; $catCount++
                }
            }
            Write-Host "   + Installed $category ($catCount skills)" -ForegroundColor Green
        }
    }

    Write-Host "`n   $script:installCount skills installed!" -ForegroundColor Green
    Write-Host "   Available as /category--skill" -ForegroundColor Cyan
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
Write-Host "   3) Selective  - Choose specific categories"
Write-Host "   4) Uninstall  - Remove installed skills"
Write-Host ""

$choice = Read-Host "   Choose [1-4]"

switch ($choice) {
    "1" { Install-Global }
    "2" { Install-Project }
    "3" { Install-Selective }
    "4" { Uninstall-Skills }
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
