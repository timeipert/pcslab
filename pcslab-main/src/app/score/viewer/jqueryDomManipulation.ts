declare const $: any;

export const fillSingleNoteStandardByThis = (noteThis) => {
  $(noteThis).attr('fill', '#000');
}

export const fillSingleNoteActiveByThis = (noteThis) => {
  $(noteThis).attr('fill', 'rgb(183,7,0)');
}

export const setCursorPointerForEveryNote = () => {
  $('.note').attr('cursor', 'pointer');
}

export const fillSingleNoteActiveById = (noteId) => {
  $('#' + noteId).attr('fill', 'rgb(183,7,0');
}

export const setRenderedScore = (svg) => {
  $('#music').html(svg);
}
