const fs = require('fs');

async function getColor() {
  try {
    const Jimp = require('jimp');
    const image = await Jimp.read('public/logo.png');
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    
    const colors = new Map();
    for(let x=0; x<width; x++) {
      for(let y=0; y<height; y++) {
        let rgba = image.getPixelColor(x, y);
        let rgb = rgba >>> 8;
        let a = rgba & 0xFF;
        
        if(a > 200) { // mostly opaque
          let hex = rgb.toString(16).padStart(6, '0');
          if(hex !== 'ffffff' && hex !== '000000') {
            colors.set(hex, (colors.get(hex) || 0) + 1);
          }
        }
      }
    }
    
    const sorted = [...colors.entries()].sort((a,b) => b[1] - a[1]);
    console.log('Most common opaque colors (non b/w):', sorted.slice(0, 10));

  } catch(e) {
    console.error(e);
  }
}

getColor();
