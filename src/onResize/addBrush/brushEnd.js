export default function brushEnd() {
    this.events.participantsSelected.data = this.participantsSelected;
    this.wrap.node().dispatchEvent(this.events.participantsSelected);
    console.log("done brushin'");
}
