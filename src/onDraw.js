import updateParticipantCount from './onDraw/updateParticipantCount';
import resetListing from './onDraw/resetListing';

export default function onDraw() {
    //Annotate selected and total number of participants.
    updateParticipantCount(this, '.annote');

    //Reset listing.
    resetListing.call(this);
}
