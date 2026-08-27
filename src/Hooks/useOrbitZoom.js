import {
  useEffect,
  useRef,
} from "react";

import {
  clamp,
} from "../Runtime/orbitMath";


const MIN_FREE_RADIUS =
  4.05;

const SNAP_TRIGGER_RADIUS =
  4.35;

const MAX_CAMERA_RADIUS =
  14;

const ZOOM_SENSITIVITY =
  0.004;

const SNAP_DELAY =
  140;


function useOrbitZoom(
  runtime,
  {
    cancelSnap,
    snapToNearestFace,
  },
) {
  const runtimeRef =
    useRef(
      runtime,
    );

  const snapRef =
    useRef(
      snapToNearestFace,
    );

  const snapTimeoutRef =
    useRef(
      null,
    );


  runtimeRef.current =
    runtime;

  snapRef.current =
    snapToNearestFace;


  const clearSnapTimeout =
    () => {
      if (
        snapTimeoutRef.current !==
        null
      ) {
        clearTimeout(
          snapTimeoutRef.current,
        );

        snapTimeoutRef.current =
          null;
      }
    };


  const handleWheel =
    (
      event,
    ) => {
      if (
        event.target instanceof
          Element &&
        event.target.closest(
          "[data-ui-control='true']",
        )
      ) {
        return;
      }


      event.preventDefault();


      clearSnapTimeout();


      const zoomAmount =
        event.deltaY *
        ZOOM_SENSITIVITY;


      /*
       * Positive deltaY:
       * move farther from cube.
       *
       * Negative deltaY:
       * move toward cube.
       */

      let startRadius =
        runtime.cameraRadius;


      /*
       * Wheel-out from the snapped position
       * acts as an unsnap without forcing the
       * normal unsnap animation.
       */

      if (
        zoomAmount > 0 &&
        runtime.isSnapped
      ) {
        cancelSnap();

        runtime.setIsSnapped(
          false,
        );

        runtime.setActiveFace(
          null,
        );


        startRadius =
          Math.max(
            startRadius,
            MIN_FREE_RADIUS,
          );
      }


      /*
       * If we're already snapped and the user
       * tries to zoom even farther inward,
       * there is nowhere else to go.
       */

      if (
        zoomAmount < 0 &&
        runtime.isSnapped
      ) {
        return;
      }


      const nextRadius =
        clamp(
          startRadius +
            zoomAmount,

          MIN_FREE_RADIUS,
          MAX_CAMERA_RADIUS,
        );


      runtime.setCameraRadius(
        nextRadius,
      );


      /*
       * Once wheel movement stops, snap back
       * if the camera has entered the magnetic
       * snap zone.
       *
       * Refs ensure we call the newest runtime
       * and snap function after React has
       * processed the radius update.
       */

      snapTimeoutRef.current =
        setTimeout(
          () => {
            const latestRuntime =
              runtimeRef.current;


            if (
              latestRuntime.isSnapped
            ) {
              return;
            }


            if (
              latestRuntime.cameraRadius <=
              SNAP_TRIGGER_RADIUS
            ) {
              snapRef.current();
            }
          },
          SNAP_DELAY,
        );
    };


  useEffect(
    () => {
      return () => {
        clearSnapTimeout();
      };
    },
    [],
  );


  return {
    onWheel:
      handleWheel,
  };
}


export default useOrbitZoom;