import {
  useRef,
} from "react";

import {
  Quaternion,
  Vector3,
} from "three";

import {
  cartesianToSpherical,
} from "../Runtime/orbitMath";


const DEFAULT_SENSITIVITY =
  0.006;


function useOrbitDrag(
  runtime,
  {
    onDragStart,
    onDragEnd,
    sensitivity =
      DEFAULT_SENSITIVITY,
  } = {},
) {
  const dragRef =
    useRef(
      null,
    );


  const handlePointerDown = (
    event,
  ) => {
    if (
      event.button !== 0
    ) {
      return;
    }


    if (
      event.target instanceof
        Element &&
      event.target.closest(
        "[data-ui-control='true']",
      )
    ) {
      return;
    }


    event.currentTarget.setPointerCapture(
      event.pointerId,
    );


    const cameraDirection =
      new Vector3(
        ...runtime.cameraPosition,
      ).normalize();


    const cameraUp =
      new Vector3(
        ...runtime.cameraUp,
      ).normalize();


    cameraUp
      .addScaledVector(
        cameraDirection,
        -cameraUp.dot(
          cameraDirection,
        ),
      )
      .normalize();


    dragRef.current = {
      pointerId:
        event.pointerId,

      lastX:
        event.clientX,

      lastY:
        event.clientY,

      cameraDirection,

      cameraUp,

      lightPosition:
        new Vector3(
          ...runtime.directionalLightPosition,
        ),
    };


    runtime.setIsDragging(
      true,
    );

    runtime.setIsSnapped(
      false,
    );


    onDragStart?.();
  };


  const handlePointerMove = (
    event,
  ) => {
    const drag =
      dragRef.current;


    if (
      !drag ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }


    const deltaX =
      event.clientX -
      drag.lastX;

    const deltaY =
      event.clientY -
      drag.lastY;


    drag.lastX =
      event.clientX;

    drag.lastY =
      event.clientY;


    const cursorDirection =
      runtime.invertCursor
        ? -1
        : 1;


    const horizontalAngle =
      deltaX *
      sensitivity *
      cursorDirection;

    const verticalAngle =
      deltaY *
      sensitivity *
      cursorDirection;


    /*
     * HORIZONTAL
     */

    const horizontalRotation =
      new Quaternion()
        .setFromAxisAngle(
          drag.cameraUp,
          horizontalAngle,
        );


    drag.cameraDirection
      .applyQuaternion(
        horizontalRotation,
      )
      .normalize();


    drag.lightPosition
      .applyQuaternion(
        horizontalRotation,
      );


    const cameraRight =
      new Vector3()
        .crossVectors(
          drag.cameraUp,
          drag.cameraDirection,
        )
        .normalize();


    /*
     * VERTICAL
     */

    const verticalRotation =
      new Quaternion()
        .setFromAxisAngle(
          cameraRight,
          verticalAngle,
        );


    drag.cameraDirection
      .applyQuaternion(
        verticalRotation,
      )
      .normalize();


    drag.cameraUp
      .applyQuaternion(
        verticalRotation,
      )
      .normalize();


    drag.lightPosition
      .applyQuaternion(
        verticalRotation,
      );


    /*
     * CAMERA
     */

    const cameraSpherical =
      cartesianToSpherical(
        drag.cameraDirection.toArray(),
      );


    runtime.setCameraAzimuth(
      cameraSpherical.azimuth,
    );

    runtime.setCameraVerticalAngle(
      cameraSpherical.verticalAngle,
    );

    runtime.setCameraUp(
      drag.cameraUp.toArray(),
    );


    /*
     * LIGHT
     */

    const lightSpherical =
      cartesianToSpherical(
        drag.lightPosition.toArray(),
      );


    runtime.setDirectionalLightAzimuth(
      lightSpherical.azimuth,
    );

    runtime.setDirectionalLightVerticalAngle(
      lightSpherical.verticalAngle,
    );
  };


  const finishDrag = (
    event,
  ) => {
    const drag =
      dragRef.current;


    if (
      !drag ||
      drag.pointerId !==
        event.pointerId
    ) {
      return;
    }


    if (
      event.currentTarget.hasPointerCapture(
        event.pointerId,
      )
    ) {
      event.currentTarget.releasePointerCapture(
        event.pointerId,
      );
    }


    dragRef.current =
      null;


    runtime.setIsDragging(
      false,
    );


    onDragEnd?.();
  };


  return {
    onPointerDown:
      handlePointerDown,

    onPointerMove:
      handlePointerMove,

    onPointerUp:
      finishDrag,

    onPointerCancel:
      finishDrag,
  };
}


export default useOrbitDrag;