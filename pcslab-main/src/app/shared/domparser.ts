declare const tXml;
export function parseXML(xml) {
  const notes = tXml(xml, {filter: (e) => {
      return e.tagName === 'note';
    }});
  console.log(notes);
  return notes;
}
