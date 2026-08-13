import { writeFileSync } from 'fs'
import { deflateSync } from 'zlib'

function crc32(buf){
  let c = 0xffffffff
  for(let i=0;i<buf.length;i++){
    c ^= buf[i]
    for(let k=0;k<8;k++) c = (c>>>1) ^ (0xEDB88320 & -(c & 1))
  }
  return (c ^ 0xffffffff) >>> 0
}
function chunk(type, data){
  const len = Buffer.alloc(4)
  len.writeUInt32BE(data.length,0)
  const t = Buffer.from(type)
  const crc = Buffer.alloc(4)
  crc.writeUInt32BE(crc32(Buffer.concat([t,data]))>>>0,0)
  return Buffer.concat([len,t,data,crc])
}
function createPng(w,h,r,g,b){
  const sig = Buffer.from([0x89,0x50,0x4E,0x47,0x0D,0x0A,0x1A,0x0A])
  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4)
  ihdr[8]=8; ihdr[9]=2; ihdr[10]=0; ihdr[11]=0; ihdr[12]=0
  const rowLen = 1 + w*3
  const raw = Buffer.alloc(rowLen*h)
  for(let y=0;y<h;y++){
    raw[y*rowLen]=0
    for(let x=0;x<w;x++){
      const o = y*rowLen+1+x*3
      raw[o]=r; raw[o+1]=g; raw[o+2]=b
      // simple subtle envelope icon effect: white circle in center
      const cx=w/2, cy=h/2, dx=x-cx, dy=y-cy
      const dist = Math.sqrt(dx*dx+dy*dy)
      const rad = w*0.36
      // draw white border ring
      if(dist>rad- w*0.02 && dist<rad+ w*0.02){
        raw[o]=255; raw[o+1]=255; raw[o+2]=255
      }
    }
    // draw $ in center as white block approx
    // we approximate with a thicker cross
  }
  // draw dollar sign pixels (very approximated)
  // overlay white pixels for $ shape
  const cx=Math.floor(w/2), cy=Math.floor(h/2)
  const s=Math.floor(w*0.45)
  for(let y=-s/2;y<s/2;y++){
    for(let x=-s/3;x<s/3;x++){
      // crude $ shape: vertical line + curves
      const px=cx+x, py=cy+y
      if(px<0||py<0||px>=w||py>=h) continue
      const o = py*rowLen+1+px*3
      const inVert = Math.abs(x) < w*0.025
      const topCurve = y< -s*0.12 && x>-s*0.15 && x < s*0.12 && Math.abs(y+s*0.18)< s*0.08
      const botCurve = y> s*0.12 && x>-s*0.15 && x < s*0.12 && Math.abs(y-s*0.18)< s*0.08
      const midLine = Math.abs(y) < w*0.015 && Math.abs(x) < s*0.22
      if(inVert || midLine){
        // leave as white will be set below
      } else continue
      // actually set white
      // we already continue logic; set white for those pixels
      if(inVert || midLine){
        raw[o]=255; raw[o+1]=255; raw[o+2]=255
      }
    }
  }
  const compressed = deflateSync(raw)
  return Buffer.concat([sig, chunk('IHDR',ihdr), chunk('IDAT',compressed), chunk('IEND',Buffer.alloc(0))])
}

const icons = [
  {file:'public/pwa-192x192.png', size:192},
  {file:'public/pwa-512x512.png', size:512},
]
for(const {file,size} of icons){
  const buf = createPng(size,size, 16,185,129)
  writeFileSync(file, buf)
  console.log(`written ${file} ${buf.length} bytes`)
}
