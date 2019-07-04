declare const tXml;
export function parseXML(xml) {
  const notes = tXml(xml, {filter: (e) => {
      return e.tagName === 'note';
    }});
  console.log("domparser: ", notes);
  return notes;
}
