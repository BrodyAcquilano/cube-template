function Lighting({
  ambientLightIntensity,
  directionalLightPosition,
  directionalLightIntensity,
  directionalLightColor,
}) {
  return (
    <>
      <ambientLight
        intensity={
          ambientLightIntensity
        }
      />

      <directionalLight
        position={
          directionalLightPosition
        }
        intensity={
          directionalLightIntensity
        }
        color={
          directionalLightColor
        }
      />
    </>
  );
}


export default Lighting;