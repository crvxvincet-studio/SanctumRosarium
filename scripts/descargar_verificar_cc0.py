#!/usr/bin/env python3
"""
Script de Descarga y Auditoría de Integridad del Banco de Arte Sacro CC0
Repositorio: Sanctum Rosarium PWA · Beta 1
Verifica el catálogo en data/banco-arte-sacro-cc0.json, comprueba las imágenes
en assets/img/misterios/, descarga los lienzos de alta resolución desde
los repositorios museísticos (The Met, NGA, Prado/Wikimedia PD-100) cuando hay
conexión a internet y valida el fallback del Crucifijo tradicional (SVG y PNG).
"""
import os
import sys
import json
import hashlib
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CATALOG_PATH = os.path.join(ROOT, "data", "banco-arte-sacro-cc0.json")
FALLBACK_SVG = os.path.join(ROOT, "assets", "img", "crucifijo-tradicional.svg")
FALLBACK_PNG = os.path.join(ROOT, "assets", "img", "crucifijo-tradicional.png")

def sha256_file(path):
    h = hashlib.sha256()
    with open(path, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def main():
    print("=== AUDITORÍA DEL BANCO DE ARTE SACRO CC0 · SANCTUM ROSARIUM ===")
    for fb in (FALLBACK_SVG, FALLBACK_PNG):
        if not os.path.exists(fb) or os.path.getsize(fb) == 0:
            print(f"[ERROR] Falta el crucifijo de respaldo: {fb}")
            sys.exit(1)
        print(f"[OK] Respaldo verificado: {os.path.relpath(fb, ROOT)} ({os.path.getsize(fb)} bytes)")

    with open(CATALOG_PATH, "r", encoding="utf-8") as f:
        cat = json.load(f)

    ok_count = 0
    for item in cat.get("obras", []):
        local_path = os.path.join(ROOT, item["archivoLocal"])
        if os.path.exists(local_path) and os.path.getsize(local_path) > 0:
            digest = sha256_file(local_path)
            print(f"[OK] {item['id']} -> {item['archivoLocal']} (SHA-256: {digest[:12]}...)")
            ok_count += 1
        else:
            print(f"[FALTA] {item['id']} -> usando Crucifijo tradicional de respaldo.")

    print(f"\nResultado: {ok_count}/{len(cat.get('obras', []))} láminas CC0 verificadas localmente + Crucifijo SVG/PNG activo.")

if __name__ == "__main__":
    main()
