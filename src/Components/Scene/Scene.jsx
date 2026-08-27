import Camera from "../Camera/Camera";
import Cube from "../Cube/Cube";
import Lighting from "../Lighting/Lighting";


function Scene({
  runtime,
}) {
  return (
    <>
      <color
        attach="background"
        args={[
          "#f2f2f2",
        ]}
      />

      <Camera
        position={
          runtime.cameraPosition
        }
        up={
          runtime.cameraUp
        }
      />

      <Lighting
        ambientLightIntensity={
          runtime.ambientLightIntensity
        }
        directionalLightPosition={
          runtime.directionalLightPosition
        }
        directionalLightIntensity={
          runtime.directionalLightIntensity
        }
        directionalLightColor={
          runtime.directionalLightColor
        }
      />

      <Cube />
    </>
  );
}


export default Scene;