# ============================================================================
#  Claude Skills Installer (Windows PowerShell)
#  Installs every slash command in skills/ plus the agent skills in external/
# ============================================================================

$ErrorActionPreference = "Stop"

# Support both: irm ... | iex  AND  .\install.ps1 (local clone)
$IsRemote = ($MyInvocation.MyCommand.Path -eq $null -or $MyInvocation.MyCommand.Path -eq "")

$GithubRawBase = "https://raw.githubusercontent.com/sgomez-dev/claude-skills/main"
$GithubApiBase = "https://api.github.com/repos/sgomez-dev/claude-skills"

if ($IsRemote) {
    # Running via irm | iex — download skills directly from GitHub
    $GithubBase = "$GithubRawBase/skills"
    $RepoDir = $null
    $SkillsDir = $null
    $ExternalDir = $null
} else {
    $RepoDir = Split-Path -Parent $MyInvocation.MyCommand.Path
    $SkillsDir = Join-Path $RepoDir "skills"
    $ExternalDir = Join-Path $RepoDir "external"
}

function Write-Banner {
    # Counted from disk on a local clone so the banner can't go stale.
    $n = "327"
    if (-not $IsRemote -and (Test-Path $SkillsDir)) {
        $n = @(Get-ChildItem -Path $SkillsDir -Filter "*.md" -Recurse).Count
    }
    $line = "{0} Slash Commands for Claude Code" -f $n

    Write-Host ""
    Write-Host "   ╔═══════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "   ║                                                       ║" -ForegroundColor Cyan
    Write-Host "   ║            CLAUDE SKILLS INSTALLER                    ║" -ForegroundColor Cyan
    Write-Host ("   ║            {0,-43}║" -f $line) -ForegroundColor Cyan
    Write-Host "   ║                                                       ║" -ForegroundColor Cyan
    Write-Host "   ╚═══════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
}

# Skills manifest for remote installs
$RemoteSkills = @{
    "git"          = @("commit","changelog","release","branch","undo","blame-detective","stash-manager","cherry-pick-pr","pr-create","pr-review")
    "code-quality" = @("review","refactor","dead-code","complexity","dry","code-smells","naming","type-check","error-handling","dependency-audit")
    "testing"      = @("test-gen","test-edge-cases","test-integration","test-fix","test-coverage","test-e2e","test-mock","snapshot-update","playwright-mcp")
    "docs"         = @("doc-gen","readme-gen","diagram","adr","api-doc","openapi-gen","contributing","video-spec")
    "security"     = @("security-audit","secrets-scan","auth-review","sanitize","cors-review","csp-gen","dependency-vuln","env-hardening")
    "devops"       = @("dockerfile","docker-compose","ci","github-actions","k8s","terraform","nginx","deploy-check")
    "database"     = @("migration","query-optimize","schema","seed","erd","prisma-gen")
    "api"          = @("endpoint","graphql-schema","rest-client","mock-api","messaging-bridge")
    "performance"  = @("perf-audit","bundle-analyze","cache","lazy-load","memory-leak")
    "scaffold"     = @("scaffold","fullstack","component","hook","middleware","model","startup-generator","component-3d","remotion")
    "ai"           = @("prompt-engineer","ai-integration","embeddings")
    "web"          = @("landing-page","spa-scaffold","animations","awwwards-animations","animated-components","design-engineering","design-system","ui-components-pro","conversion-optimizer")
    "utils"        = @("explain","translate","regex","gitignore","convert","dep-update","env-setup","cron-explain","tsconfig","eslint-config","package-json","monorepo","ffmpeg")
    "accessibility"= @("a11y-audit","a11y-fix")
    "i18n"         = @("i18n-setup")
    "marketing"    = @("marketing-audit")
    "meta"         = @("skills-init","pipeline-run","skill-forge","health-check")
}

# ============================================================================
#  EXTERNAL AGENT SKILLS
#
#  Third-party skills vendored in external/ use the Agent Skill format
#  (a directory with SKILL.md), so they install to .claude\skills\<name>\
#  instead of .claude\commands\. See external/README.md.
# ============================================================================

function Get-ExternalSkillNames {
    # Remote installs only ever see the committed manifest — the private one is
    # gitignored and exists on the local machine only.
    if ($IsRemote) {
        try {
            $txt = (Invoke-WebRequest -Uri "$GithubRawBase/external/sources.txt" -UseBasicParsing).Content
        } catch {
            return @()
        }
        return @($txt -split "`n" | ForEach-Object { $_.Trim() } |
            Where-Object { $_ -and -not $_.StartsWith("#") } |
            ForEach-Object { ($_ -split '\|')[0].Trim() })
    }

    # Local clone: the committed manifest plus the private one, whose skills are
    # vendored under external/.local/. See external/README.md.
    $found = @()
    $pairs = @(
        @{ Manifest = (Join-Path $ExternalDir "sources.txt");       Base = $ExternalDir },
        @{ Manifest = (Join-Path $ExternalDir "sources.local.txt"); Base = (Join-Path $ExternalDir ".local") }
    )
    foreach ($pair in $pairs) {
        if (-not (Test-Path $pair.Manifest)) { continue }
        $found += @(Get-Content $pair.Manifest | ForEach-Object { $_.Trim() } |
            Where-Object { $_ -and -not $_.StartsWith("#") } |
            ForEach-Object { ($_ -split '\|')[0].Trim() } |
            Where-Object { Test-Path (Join-Path (Join-Path $pair.Base $_) "SKILL.md") })
    }
    return @($found)
}

# Source directory for a vendored skill: the published tree, or the private one.
function Get-ExternalSkillPath {
    param([string]$name)
    $pub = Join-Path $ExternalDir $name
    if (Test-Path (Join-Path $pub "SKILL.md")) { return $pub }
    return (Join-Path (Join-Path $ExternalDir ".local") $name)
}

function Install-ExternalSkills {
    param([string]$target)

    $names = Get-ExternalSkillNames
    if ($names.Count -eq 0) { return 0 }

    New-Item -ItemType Directory -Force -Path $target | Out-Null
    $installed = 0

    if ($IsRemote) {
        try {
            $tree = Invoke-RestMethod -Uri "$GithubApiBase/git/trees/main?recursive=1" -UseBasicParsing
        } catch {
            Write-Host "   ! Could not list external skills from GitHub" -ForegroundColor Yellow
            return 0
        }
        foreach ($name in $names) {
            $prefix = "external/$name/"
            $blobs = @($tree.tree | Where-Object { $_.type -eq "blob" -and $_.path.StartsWith($prefix) })
            if ($blobs.Count -eq 0) { continue }

            $dest = Join-Path $target $name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            foreach ($blob in $blobs) {
                $rel = $blob.path.Substring($prefix.Length) -replace '/', '\'
                $outFile = Join-Path $dest $rel
                New-Item -ItemType Directory -Force -Path (Split-Path -Parent $outFile) | Out-Null
                Invoke-WebRequest -Uri "$GithubRawBase/$($blob.path)" -OutFile $outFile -UseBasicParsing
            }
            $installed++
            Write-Host "   + $name (external agent skill)" -ForegroundColor Green
        }
    } else {
        foreach ($name in $names) {
            $dest = Join-Path $target $name
            $src = Get-ExternalSkillPath -name $name
            if (Test-Path $dest) { Remove-Item $dest -Recurse -Force }
            Copy-Item $src $dest -Recurse -Force
            $installed++
            if ($src -like "*\.local\*") {
                Write-Host "   + $name (external agent skill, private)" -ForegroundColor Green
            } else {
                Write-Host "   + $name (external agent skill)" -ForegroundColor Green
            }
        }
    }

    Write-Host "   $installed agent skill(s) -> $target" -ForegroundColor Cyan
    return $installed
}

# Maps a commands dir (…\.claude\commands) to its sibling skills dir.
function Get-SkillsTargetFor {
    param([string]$commandsTarget)
    return (Join-Path (Split-Path -Parent $commandsTarget) "skills")
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

    $ext = Install-ExternalSkills -target (Get-SkillsTargetFor $target)
    if ($ext -gt 0) {
        Write-Host "   Invoked as /skill-name, or auto-triggered by description" -ForegroundColor Cyan
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

    $extNames = Get-ExternalSkillNames
    if ($extNames.Count -gt 0) {
        Write-Host "   $i) external ($($extNames.Count) agent skills)"
        $indexedCategories[$i] = "__external__"
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

            if ($category -eq "__external__") {
                Install-ExternalSkills -target (Get-SkillsTargetFor $target) | Out-Null
                continue
            }

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

    # External agent skills live in .claude\skills\<name>\ — only remove the
    # directories this repo vendors, and only if they really are skill dirs.
    $extNames = Get-ExternalSkillNames
    if ($extNames.Count -gt 0) {
        $extCount = 0
        $skillDirs = @(
            (Join-Path $env:USERPROFILE ".claude\skills"),
            (Join-Path (Get-Location) ".claude\skills")
        )
        foreach ($dir in $skillDirs) {
            if (-not (Test-Path $dir)) { continue }
            foreach ($name in $extNames) {
                $candidate = Join-Path $dir $name
                if (Test-Path (Join-Path $candidate "SKILL.md")) {
                    Remove-Item $candidate -Recurse -Force
                    $extCount++
                    Write-Host "   - $candidate" -ForegroundColor Yellow
                }
            }
        }
        Write-Host "   Removed $extCount external agent skill(s)." -ForegroundColor Green
    }
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
