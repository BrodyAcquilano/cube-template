import FaceContent from "./FaceContent";


function Face1({
  onChoose,
}) {
  return (
    <FaceContent
      title="WELCOME TO THE CUBE"
      body="You are standing on a city corner with ten minutes to waste and absolutely no plan."
      choices={{
        top: {
          label:
            "Get a snack.",
          target:
            "top",
        },

        right: {
          label:
            "Catch the next bus.",
          target:
            "right",
        },

        bottom: {
          label:
            "Investigate the pigeons.",
          target:
            "bottom",
        },

        left: {
          label:
            "Follow the music.",
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


export default Face1;