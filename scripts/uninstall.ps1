$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
& node (Join-Path $Root "scripts/lib.mjs") uninstall @args
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
