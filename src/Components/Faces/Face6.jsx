import FaceContent from "./FaceContent";


function Face6({
  onChoose,
}) {
  return (
    <FaceContent
      title="THE NEGOTIATIONS"
      body="A stranger is trying to convince six pigeons to form a labor union. Negotiations have stalled."
      choices={{
        top: {
          label:
            "Back away and act normal.",
          target:
            "front",
        },

        right: {
          label:
            "Move negotiations onto the bus.",
          target:
            "right",
        },

        bottom: {
          label:
            "Offer $20 to fund the union.",
          target:
            "back",
        },

        left: {
          label:
            "Recruit the musician as mediator.",
          target:
            "left",
        },
      }}
      onChoose={
        onChoose
      }
    />
  );
}


export default Face6;