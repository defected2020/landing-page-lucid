import maskImage from '../../public/globe/land-mask.png';

// Decodes the equirectangular land mask (255 = land) into a lookup so the
// globe can scatter its dots over continents only.
export async function loadLandMask({ scale = 1 } = {}) {
  const img = new Image();
  img.decoding = 'async';
  img.src = maskImage.src;
  await img.decode();

  const width = Math.round(img.naturalWidth * scale);
  const height = Math.round(img.naturalHeight * scale);
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  ctx.drawImage(img, 0, 0, width, height);
  const rgba = ctx.getImageData(0, 0, width, height).data;
  const land = new Uint8Array(width * height);
  for (let i = 0; i < land.length; i++) land[i] = rgba[i * 4] > 127 ? 1 : 0;

  return {
    width,
    height,
    // lat/lon in radians
    isLand(lat, lon) {
      const x = Math.floor(((lon + Math.PI) / (2 * Math.PI)) * width) % width;
      const y = Math.min(height - 1, Math.floor(((Math.PI / 2 - lat) / Math.PI) * height));
      return land[y * width + x] === 1;
    },
  };
}
