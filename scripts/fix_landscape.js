// Post-process the docx to fix landscape section dimensions
// docx-js emits w:w=11906 w:h=16838 w:orient=landscape (portrait dims)
// We need w:w=16838 w:h=11906 w:orient=landscape (true landscape)

const fs = require('fs');
const JSZip = require('jszip');

const FILE = '/home/z/my-project/download/RPS_Matematika_Dasar_S1_Teknik_Sipil_UNTAG.docx';

(async () => {
  const data = fs.readFileSync(FILE);
  const zip = await JSZip.loadAsync(data);

  let xml = await zip.file('word/document.xml').async('string');

  // Find the section with orient="landscape" and swap its w/w and w/h
  // Pattern: <w:pgSz w:w="11906" w:h="16838" w:orient="landscape"/>
  const before = xml;
  xml = xml.replace(
    /<w:pgSz\s+w:w="(\d+)"\s+w:h="(\d+)"\s+w:orient="landscape"\s*\/>/g,
    (match, w, h) => {
      // Swap so w > h for true landscape
      const newW = Math.max(parseInt(w), parseInt(h));
      const newH = Math.min(parseInt(w), parseInt(h));
      return `<w:pgSz w:w="${newW}" w:h="${newH}" w:orient="landscape"/>`;
    }
  );

  if (xml === before) {
    console.log('⚠️ No landscape pgSz found to patch');
  } else {
    console.log('✅ Patched landscape section dimensions');
  }

  // Also fix header/footer to fit landscape width if needed

  zip.file('word/document.xml', xml);
  const newData = await zip.generateAsync({
    type: 'nodebuffer',
    compression: 'DEFLATE',
  });
  fs.writeFileSync(FILE, newData);
  console.log('✅ Saved patched file:', FILE);
  console.log('   File size:', (newData.length / 1024).toFixed(1), 'KB');
})();
