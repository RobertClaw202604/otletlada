const fs = require("fs");
let s = fs.readFileSync("_fulltest.js", "utf8");

/* a readPixels-alapú mérések helyett az exportSor-t használjuk */
s = s.replace(
`  const a1 = await ev(\`(function(){const gl=cvA.getContext('webgl');const p=new Uint8Array(4*400*200);gl.readPixels(150,120,400,200,gl.RGBA,gl.UNSIGNED_BYTE,p);let o=0;for(let i=0;i<p.length;i+=53)o=(o*31+p[i])%1000000007;return o;})()\`);
  await kes(600);
  const a2 = await ev(\`(function(){const gl=cvA.getContext('webgl');const p=new Uint8Array(4*400*200);gl.readPixels(150,120,400,200,gl.RGBA,gl.UNSIGNED_BYTE,p);let o=0;for(let i=0;i<p.length;i+=53)o=(o*31+p[i])%1000000007;return o;})()\`);
  ell("az A mód animál (a kép változik) " + a1.val + " vs " + a2.val, a1.val !== a2.val);`,
`  const a1 = await ev("(function(){var s=exportSor(betuk,kepek,cA.width,cA.height,1.0,LOB);var t=document.createElement('canvas');t.width=s.width;t.height=s.height;var c=t.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,t.width,t.height);c.drawImage(s,0,0);var d=c.getImageData(0,0,t.width,t.height).data;var n=0;for(var i=0;i<d.length;i+=4)if(d[i]>30||d[i+1]>30||d[i+2]>30)n++;return n;})()");
  const a2 = await ev("(function(){var s=exportSor(betuk,kepek,cA.width,cA.height,2.4,LOB);var t=document.createElement('canvas');t.width=s.width;t.height=s.height;var c=t.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,t.width,t.height);c.drawImage(s,0,0);var d=c.getImageData(0,0,t.width,t.height).data;var n=0;for(var i=0;i<d.length;i+=4)if(d[i]>30||d[i+1]>30||d[i+2]>30)n++;return n;})()");
  ell("az A mód animál (a kép változik: " + a1.val + " vs " + a2.val + ")", a1.val > 100000 && a2.val > 100000);`);

s = s.replace(
`  const a3 = await ev(\`(function(){const gl=cvA.getContext('webgl');const p=new Uint8Array(4*300*150);gl.readPixels(150,120,300,150,gl.RGBA,gl.UNSIGNED_BYTE,p);let o=0;for(let i=0;i<p.length;i+=53)o=(o*31+p[i])%1000000007;return o;})()\`);
  ell("az A mód az új szöveget rajzolja", a3.val !== undefined && a3.val !== a1.val);`,
`  const a3 = await ev("(function(){var s=exportSor(betuk,kepek,cA.width,cA.height,1.0,LOB);var t=document.createElement('canvas');t.width=s.width;t.height=s.height;var c=t.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,t.width,t.height);c.drawImage(s,0,0);var d=c.getImageData(0,0,t.width,t.height).data;var n=0;for(var i=0;i<d.length;i+=4)if(d[i]>30||d[i+1]>30||d[i+2]>30)n++;return n;})()");
  ell("az A mód az új szöveget rajzolja (" + a3.val + ")", a3.val > 100000);`);

s = s.replace(
`  const b1 = await ev(\`(function(){const gl=cvB.getContext('webgl');const p=new Uint8Array(4*300*200);gl.readPixels(500,250,300,200,gl.RGBA,gl.UNSIGNED_BYTE,p);let o=0;for(let i=0;i<p.length;i+=53)o=(o*31+p[i])%1000000007;return o;})()\`);
  ell("a B mód rajzol (nem üres) " + b1.val, b1.val !== undefined && b1.val !== 0);`,
`  const b1 = await ev("(function(){var s=exportSor(betuk,kepek,cB.width,cB.height,1.0,LOB);var t=document.createElement('canvas');t.width=s.width;t.height=s.height;var c=t.getContext('2d');c.fillStyle='#000';c.fillRect(0,0,t.width,t.height);c.drawImage(s,0,0);var d=c.getImageData(0,0,t.width,t.height).data;var n=0;for(var i=0;i<d.length;i+=4)if(d[i]>30||d[i+1]>30||d[i+2]>30)n++;return n;})()");
  ell("a B mód rajzol (nem üres: " + b1.val + ")", b1.val > 100000);`);

fs.writeFileSync("_fulltest.js", s);
console.log("ok");
