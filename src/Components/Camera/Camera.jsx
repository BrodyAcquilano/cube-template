import {
  useLayoutEffect,
  useRef,
} from "react";

import {
  PerspectiveCamera,
} from "@react-three/drei";


function Camera({
  position,
  up,
}) {
  const cameraRef =
    useRef(
      null,
    );


  useLayoutEffect(
    () => {
      const camera =
        cameraRef.current;


      if (!camera) {
        return;
      }


      camera.up.set(
        ...up,
      );


      camera.lookAt(
        0,
        0,
        0,
      );
    },
    [
      position,
      up,
    ],
  );


  return (
    <PerspectiveCamera
      ref={
        cameraRef
      }
      makeDefault
      position={
        position
      }
      fov={50}
      near={0.1}
      far={100}
    />
  );
}


export default Camera;