# Levanta PostgreSQL con Docker (Windows / PowerShell)
$ErrorActionPreference = "Stop"
$root = Split-Path $PSScriptRoot -Parent
$compose = Join-Path $root "docker-compose.yml"

Write-Host "Iniciando PostgreSQL en $root ..." -ForegroundColor Cyan
docker compose -f $compose up -d
docker compose -f $compose ps
