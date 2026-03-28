#!/usr/bin/env node
// Generates icons/icon-192.png and icons/icon-512.png using sharp to rasterize SVG.

import sharp from 'sharp';
import { mkdir } from 'fs/promises';

await mkdir('icons', { recursive: true });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Background -->
  <rect width="100" height="100" fill="#000000"/>

  <!-- Rear wheel -->
  <circle cx="28" cy="66" r="17" fill="none" stroke="#e8ff47" stroke-width="4.5"/>
  <!-- Front wheel -->
  <circle cx="72" cy="66" r="17" fill="none" stroke="#e8ff47" stroke-width="4.5"/>

  <!-- Frame: chainstay (BB to rear dropout) -->
  <line x1="48" y1="66" x2="28" y2="66" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>
  <!-- Frame: seat tube (BB to seat) -->
  <line x1="48" y1="66" x2="44" y2="44" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>
  <!-- Frame: down tube (BB to head tube) -->
  <line x1="48" y1="66" x2="68" y2="44" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>
  <!-- Frame: top tube (seat to head tube) -->
  <line x1="44" y1="44" x2="68" y2="44" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>
  <!-- Frame: seat stay (seat to rear dropout) -->
  <line x1="44" y1="44" x2="28" y2="66" stroke="#e8ff47" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Fork (head tube to front dropout) -->
  <line x1="68" y1="44" x2="72" y2="66" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>

  <!-- Seat post + saddle -->
  <line x1="44" y1="44" x2="42" y2="36" stroke="#e8ff47" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="37" y1="35" x2="47" y2="35" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>

  <!-- Handlebar stem + bars -->
  <line x1="68" y1="44" x2="70" y2="36" stroke="#e8ff47" stroke-width="3.5" stroke-linecap="round"/>
  <line x1="65" y1="34" x2="75" y2="38" stroke="#e8ff47" stroke-width="4" stroke-linecap="round"/>

  <!-- Bottom bracket (crank axle) -->
  <circle cx="48" cy="66" r="4" fill="#e8ff47"/>
</svg>`;

for (const size of [192, 512]) {
  await sharp(Buffer.from(svg))
    .resize(size, size)
    .png()
    .toFile(`icons/icon-${size}.png`);
  console.log(`Created icons/icon-${size}.png`);
}
