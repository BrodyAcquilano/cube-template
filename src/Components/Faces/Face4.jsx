import FaceContent from "./FaceContent";


function Face4({
  onChoose,
}) {
  return (
    <FaceContent
      title="THE MUSICIAN"
      body="A street musician stops mid-song and asks you to decide what happens next. He may be taking the metaphor too literally."
      choices={{
        top: {
          label:
            "Request a song about hot dogs.",
          target:
            "top",
        },

        right: {
          label:
            "Ask how to get back where you started.",
          target:
            "front",
        },

        bottom: {
          label:
            "Send him to negotiate with the pigeons.",
          target:
            "bottom",
        },

        left: {
          label:
            "Tip him $20.",
          target:
            "back",
        },
      }}
      onChoose={
        onChoose
      }
    />
  );
}


export default Face4;