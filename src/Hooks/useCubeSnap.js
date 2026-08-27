import {
  useCallback,
  useEffect,
  useRef,
} from "react";

import {
  Quaternion,
  Vector3,
} from "three";

import {
  cartesianToSpherical,
  getFaceNormal,
  getNearestFace,
  getNearestFaceUp,
} from "../Runtime/orbitMath";


const ORBIT_CAMERA_RADIUS =
  5.4;

const SNAPPED_CAMERA_RADIUS =
  4;

const UNSNAP_DURATION =
  180;

const ROTATION_SNAP_DURATION =
  320;

const RADIAL_SNAP_DURATION =
  220;

const ROLL_SNAP_DURATION =
  180;


function easeInOutCubic(
  value,
) {
  if (
    value < 0.5
  ) {
    return (
      4 *
      value *
      value *
      value
    );
  }


  return (
    1 -
    Math.pow(
      -2 *
        value +
        2,
      3,
    ) /
      2
  );
}


function getSignedAngleAroundAxis(
  from,
  to,
  axis,
) {
  const cross =
    new Vector3()
      .crossVectors(
        from,
        to,
      );


  return Math.atan2(
    axis.dot(
      cross,
    ),

    from.dot(
      to,
    ),
  );
}


function useCubeSnap(
  runtime,
) {
  const animationFrameRef =
    useRef(
      null,
    );


  const cancelSnap =
    useCallback(
      () => {
        if (
          animationFrameRef.current !==
          null
        ) {
          cancelAnimationFrame(
            animationFrameRef.current,
          );

          animationFrameRef.current =
            null;
        }
      },
      [],
    );


  const animate =
    useCallback(
      (
        duration,
        onFrame,
        onComplete,
      ) => {
        cancelSnap();


        const startTime =
          performance.now();


        const step = (
          currentTime,
        ) => {
          const elapsed =
            currentTime -
            startTime;

          const progress =
            Math.min(
              elapsed /
                duration,
              1,
            );

          const easedProgress =
            easeInOutCubic(
              progress,
            );


          onFrame(
            easedProgress,
          );


          if (
            progress <
            1
          ) {
            animationFrameRef.current =
              requestAnimationFrame(
                step,
              );

            return;
          }


          animationFrameRef.current =
            null;

          onComplete?.();
        };


        animationFrameRef.current =
          requestAnimationFrame(
            step,
          );
      },
      [
        cancelSnap,
      ],
    );


  const unsnap =
    useCallback(
      () => {
        const startRadius =
          runtime.cameraRadius;


        runtime.setIsSnapped(
          false,
        );

        runtime.setActiveFace(
          null,
        );


        animate(
          UNSNAP_DURATION,

          (
            progress,
          ) => {
            runtime.setCameraRadius(
              startRadius +
                (
                  ORBIT_CAMERA_RADIUS -
                  startRadius
                ) *
                  progress,
            );
          },
        );
      },
      [
        animate,
        runtime,
      ],
    );


  const snapToNearestFace =
    useCallback(
      () => {
        cancelSnap();


        const face =
          getNearestFace(
            runtime.cameraAzimuth,
            runtime.cameraVerticalAngle,
          );


        const targetDirection =
          new Vector3(
            ...getFaceNormal(
              face,
            ),
          ).normalize();


        const cameraDirectionStart =
          new Vector3(
            ...runtime.cameraPosition,
          ).normalize();


        const cameraUpStart =
          new Vector3(
            ...runtime.cameraUp,
          ).normalize();


        const lightPositionStart =
          new Vector3(
            ...runtime.directionalLightPosition,
          );


        const cameraRadiusStart =
          runtime.cameraRadius;


        /*
         * Rotation that moves the current
         * viewing direction exactly onto the
         * nearest cube face normal.
         */

        const snapRotation =
          new Quaternion()
            .setFromUnitVectors(
              cameraDirectionStart,
              targetDirection,
            );


        const identityRotation =
          new Quaternion();


        /*
         * STAGE 1
         *
         * Rotate camera and light toward the
         * face while preserving their relative
         * orientation.
         */

        animate(
          ROTATION_SNAP_DURATION,

          (
            progress,
          ) => {
            const frameRotation =
              new Quaternion()
                .slerpQuaternions(
                  identityRotation,
                  snapRotation,
                  progress,
                );


            const cameraDirection =
              cameraDirectionStart
                .clone()
                .applyQuaternion(
                  frameRotation,
                )
                .normalize();


            const cameraUp =
              cameraUpStart
                .clone()
                .applyQuaternion(
                  frameRotation,
                )
                .normalize();


            const lightPosition =
              lightPositionStart
                .clone()
                .applyQuaternion(
                  frameRotation,
                );


            const cameraSpherical =
              cartesianToSpherical(
                cameraDirection.toArray(),
              );


            runtime.setCameraAzimuth(
              cameraSpherical.azimuth,
            );

            runtime.setCameraVerticalAngle(
              cameraSpherical.verticalAngle,
            );

            runtime.setCameraUp(
              cameraUp.toArray(),
            );


            const lightSpherical =
              cartesianToSpherical(
                lightPosition.toArray(),
              );


            runtime.setDirectionalLightAzimuth(
              lightSpherical.azimuth,
            );

            runtime.setDirectionalLightVerticalAngle(
              lightSpherical.verticalAngle,
            );
          },

          () => {
            /*
             * Calculate the camera-up direction
             * after the positional face snap.
             */

            const snappedCameraUp =
              cameraUpStart
                .clone()
                .applyQuaternion(
                  snapRotation,
                )
                .normalize();


            /*
             * STAGE 2
             *
             * Radially move toward the cube.
             */

            animate(
              RADIAL_SNAP_DURATION,

              (
                progress,
              ) => {
                runtime.setCameraRadius(
                  cameraRadiusStart +
                    (
                      SNAPPED_CAMERA_RADIUS -
                      cameraRadiusStart
                    ) *
                      progress,
                );
              },

              () => {
                /*
                 * STAGE 3
                 *
                 * The camera is now squarely
                 * positioned over the face.
                 *
                 * Find the closest valid cube-up
                 * axis and roll toward it.
                 *
                 * On top/bottom this is the
                 * quarter-turn correction we were
                 * missing before.
                 */

                const targetUp =
                  new Vector3(
                    ...getNearestFaceUp(
                      face,
                      snappedCameraUp.toArray(),
                    ),
                  ).normalize();


                const rollAngle =
                  getSignedAngleAroundAxis(
                    snappedCameraUp,
                    targetUp,
                    targetDirection,
                  );


                animate(
                  ROLL_SNAP_DURATION,

                  (
                    progress,
                  ) => {
                    const rollRotation =
                      new Quaternion()
                        .setFromAxisAngle(
                          targetDirection,
                          rollAngle *
                            progress,
                        );


                    const cameraUp =
                      snappedCameraUp
                        .clone()
                        .applyQuaternion(
                          rollRotation,
                        )
                        .normalize();


                    runtime.setCameraUp(
                      cameraUp.toArray(),
                    );
                  },

                  () => {
                    runtime.setCameraUp(
                      targetUp.toArray(),
                    );

                    runtime.setActiveFace(
                      face,
                    );

                    runtime.setIsSnapped(
                      true,
                    );
                  },
                );
              },
            );
          },
        );
      },
      [
        animate,
        cancelSnap,
        runtime,
      ],
    );


  useEffect(
    () =>
      cancelSnap,
    [
      cancelSnap,
    ],
  );


  return {
    cancelSnap,
    unsnap,
    snapToNearestFace,
  };
}


export default useCubeSnap;