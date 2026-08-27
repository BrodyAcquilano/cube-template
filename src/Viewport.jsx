import {
  Canvas,
} from "@react-three/fiber";

import LightingControls from "./Components/LightingControls/LightingControls";
import OrbitControl from "./Components/OrbitControl/OrbitControl";
import Scene from "./Components/Scene/Scene";
import Toggle from "./Components/Toggle/Toggle";

import useCubeSnap from "./Hooks/useCubeSnap";
import useOrbitDrag from "./Hooks/useOrbitDrag";
import useOrbitZoom from "./Hooks/useOrbitZoom";

import useCubeRuntime from "./Runtime/useCubeRuntime";

import "./Viewport.css";


function Viewport() {
  const runtime =
    useCubeRuntime();


  const {
    cancelSnap,
    unsnap,
    snapToNearestFace,
  } =
    useCubeSnap(
      runtime,
    );


  const orbitDrag =
    useOrbitDrag(
      runtime,
      {
        onDragStart:
          unsnap,

        onDragEnd:
          snapToNearestFace,
      },
    );


  const orbitZoom =
    useOrbitZoom(
      runtime,
      {
        cancelSnap,
        snapToNearestFace,
      },
    );


  const beginManualCameraControl =
    () => {
      cancelSnap();

      runtime.setIsSnapped(
        false,
      );

      runtime.setActiveFace(
        null,
      );
    };


  return (
    <div
      className={
        `viewport${
          runtime.isDragging
            ? " viewport--dragging"
            : ""
        }`
      }
      {...orbitDrag}
      {...orbitZoom}
    >
      <Canvas>
        <Scene
          runtime={
            runtime
          }
        />
      </Canvas>


      {runtime.showControls && (
        <>
          <Toggle
            className="viewport__invert-cursor"
            label="Invert Cursor"
            value={
              runtime.invertCursor
            }
            setValue={
              runtime.setInvertCursor
            }
          />

          <OrbitControl
            className="orbit-control--camera"
            side="left"
            label="Camera"
            position={
              runtime.cameraPosition
            }
            minRadius={3}
            maxRadius={14}
            onPositionChange={
              runtime.setCameraPositionFromCartesian
            }
            onInteractionStart={
              beginManualCameraControl
            }
          />

          <OrbitControl
            className="orbit-control--light"
            side="right"
            label="Directional Light"
            position={
              runtime.directionalLightPosition
            }
            minRadius={3}
            maxRadius={12}
            onPositionChange={
              runtime.setDirectionalLightPositionFromCartesian
            }
            onInteractionStart={
              cancelSnap
            }
          />

          <LightingControls
            runtime={
              runtime
            }
          />
        </>
      )}
    </div>
  );
}


export default Viewport;