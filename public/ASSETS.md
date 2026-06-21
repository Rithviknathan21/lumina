# LUMINA Public Assets

Place the following assets in this directory:

## /models/
- `*.glb` / `*.gltf` — 3D models (Draco-compressed recommended)
- Load via `useGLTF` from @react-three/drei

## /textures/
- `*.ktx2` — KTX2 compressed textures (preferred for WebGL)
- `*.png` / `*.jpg` — Fallback textures
- Load via `useTexture` from @react-three/drei

## /sounds/
- `*.mp3` / `*.ogg` — Audio files
- Load via `use-audio.ts` hook

## /fonts/
- Loaded via Google Fonts (next/font) — no local files needed

## Notes
- Use Draco compression for GLB models: `npx gltf-pipeline -i model.glb -o model-draco.glb --draco.compressMeshes`
- Use Basis Universal for textures: reduces GPU memory by 6–8x
- Audio files should be < 2MB each; use mono 128kbps MP3
