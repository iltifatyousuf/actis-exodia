# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['desktop_app/exodia_desktop.py'],
    pathex=[],
    binaries=[],
    datas=[('venv/Lib/site-packages/customtkinter', 'customtkinter'), ('desktop_app/logo.png', 'desktop_app'), ('desktop_app/logo.ico', 'desktop_app')],
    hiddenimports=['PIL', 'PIL._tkinter_finder'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='Exodia Client',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    runtime_tmpdir=None,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
    icon=['desktop_app/logo.ico'],
)
