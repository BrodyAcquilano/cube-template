import FaceContent from "./FaceContent";


function Face2({
  onChoose,
}) {
  return (
    <FaceContent
      title="THE BUS"
      body="A bus arrives with PROBABLY DOWNTOWN on the sign. The driver says exact destinations are overrated."
      choices={{
        top: {
          label:
            "Ask about snacks.",
          target:
            "top",
        },

        right: {
          label:
            "Ride until something happens.",
          target:
            "back",
        },

        bottom: {
          label:
            "Invite the pigeon guy aboard.",
          target:
            "bottom",
        },

        left: {
          label:
            "Immediately get back off.",
          target:
            "front",
        },
      }}
      onChoose={
        onChoose
      }
    />
  );
}


export default Face2;