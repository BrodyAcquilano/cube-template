import FaceContent from "./FaceContent";


function Face5({
  onChoose,
}) {
  return (
    <FaceContent
      title="THE HOT DOG CART"
      body="The vendor offers today's special: THE ADMINISTRATIVE ERROR. Nobody knows what is in it, including him."
      choices={{
        top: {
          label:
            "Pay with a suspicious $20.",
          target:
            "back",
        },

        right: {
          label:
            "Take one onto the bus.",
          target:
            "right",
        },

        bottom: {
          label:
            "Decline and resume wandering.",
          target:
            "front",
        },

        left: {
          label:
            "Buy one for the musician.",
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


export default Face5;