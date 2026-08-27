import FaceContent from "./FaceContent";


function Face3({
  onChoose,
}) {
  return (
    <FaceContent
      title="$20"
      body="A twenty-dollar bill is trapped under a traffic cone. A squirrel appears to be monitoring the situation."
      choices={{
        top: {
          label:
            "Spend it irresponsibly on snacks.",
          target:
            "top",
        },

        right: {
          label:
            "Ask the musician if it is theirs.",
          target:
            "left",
        },

        bottom: {
          label:
            "Donate $20 to pigeon diplomacy.",
          target:
            "bottom",
        },

        left: {
          label:
            "Use it for bus fare.",
          target:
            "right",
        },
      }}
      onChoose={
        onChoose
      }
    />
  );
}


export default Face3;