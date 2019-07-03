export function parseMEI(mei) {
  try {
    const first = Date.now();
    let id = -1;
    console.log('Parse MEI (%s chars)', mei.length);
    const meiHeadDelete = mei.mei.replace(/<meiHead>.*?<\/meiHead>/, '');
    const meiWithoutID = meiHeadDelete.replace(/<note(.*?)xml:id="(.*?)"/g, (match, beforeXMLid, xmlid) => {
      id += 1;
      const n = mei.xmldom.filter((note) => {
        return note.attributes['xml:id'] === xmlid;
      });
      n[0].attributes['xml:id'] = id;
      return `<note${beforeXMLid}xml:id="${id}"`;
    });
    const last = Date.now()
    console.log('Transformed (%s chars) on %s', meiWithoutID.length, (last - first) / 1000);
    return {mei: meiWithoutID, obj: mei.xmldom};

  } catch (e) {
    console.log('Error in Webworker', e);
  }
}
