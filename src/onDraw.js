import updateSubjectCount
    from './util/updateSubjectCount';

export default function onDraw() {
  //Annotate selected and total number of participants.
    updateSubjectCount(this, '.annote');
}
