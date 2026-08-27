import {
  Text,
} from "@react-three/drei";


const TEXT_Z =
  0.015;


const TEXT_OUTLINE_WIDTH =
  0.0025;


function FaceChoice({
  children,
  position,
  rotation = [
    0,
    0,
    0,
  ],
  target,
  onChoose,
}) {
  const handleClick =
    (
      event,
    ) => {
      event.stopPropagation();


      onChoose?.(
        target,
      );
    };


  return (
    <Text
      position={[
        position[0],
        position[1],
        TEXT_Z,
      ]}
      rotation={
        rotation
      }
      fontSize={0.045}
      maxWidth={1.05}
      lineHeight={1.2}
      outlineWidth={
        TEXT_OUTLINE_WIDTH
      }
      outlineColor="#000000"
      anchorX="center"
      anchorY="middle"
      textAlign="center"
      onClick={
        handleClick
      }
    >
      {children}
    </Text>
  );
}


function FaceContent({
  title,
  body,
  choices,
  onChoose,
}) {
  return (
    <group>
      <Text
        position={[
          0,
          0.34,
          TEXT_Z,
        ]}
        fontSize={0.085}
        maxWidth={1.25}
        lineHeight={1.05}
        outlineWidth={
          TEXT_OUTLINE_WIDTH
        }
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {title}
      </Text>


      <Text
        position={[
          0,
          0.04,
          TEXT_Z,
        ]}
        fontSize={0.052}
        maxWidth={1.22}
        lineHeight={1.35}
        outlineWidth={
          TEXT_OUTLINE_WIDTH
        }
        outlineColor="#000000"
        anchorX="center"
        anchorY="middle"
        textAlign="center"
      >
        {body}
      </Text>


      <FaceChoice
        position={[
          0,
          0.79,
        ]}
        target={
          choices.top.target
        }
        onChoose={
          onChoose
        }
      >
        {choices.top.label}
      </FaceChoice>


      <FaceChoice
        position={[
          0.79,
          0,
        ]}
        rotation={[
          0,
          0,
          -Math.PI /
            2,
        ]}
        target={
          choices.right.target
        }
        onChoose={
          onChoose
        }
      >
        {choices.right.label}
      </FaceChoice>


      <FaceChoice
        position={[
          0,
          -0.79,
        ]}
        target={
          choices.bottom.target
        }
        onChoose={
          onChoose
        }
      >
        {choices.bottom.label}
      </FaceChoice>


      <FaceChoice
        position={[
          -0.79,
          0,
        ]}
        rotation={[
          0,
          0,
          Math.PI /
            2,
        ]}
        target={
          choices.left.target
        }
        onChoose={
          onChoose
        }
      >
        {choices.left.label}
      </FaceChoice>
    </group>
  );
}


export default FaceContent;