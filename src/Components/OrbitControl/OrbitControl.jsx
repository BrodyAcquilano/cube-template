import {
  useRef,
} from "react";

import {
  clamp,
} from "../../Runtime/orbitMath";

import "./OrbitControl.css";


const MIN_VISUAL_RADIUS =
  24;

const MAX_VISUAL_RADIUS =
  54;

const INACTIVE_NORMAL_THRESHOLD =
  0.985;


function getMagnitude(
  position,
) {
  return Math.hypot(
    ...position,
  );
}


function radiusToVisualRadius(
  radius,
  minRadius,
  maxRadius,
) {
  const normalized =
    (
      radius -
      minRadius
    ) /
    (
      maxRadius -
      minRadius
    );


  return (
    MIN_VISUAL_RADIUS +
    clamp(
      normalized,
      0,
      1,
    ) *
      (
        MAX_VISUAL_RADIUS -
        MIN_VISUAL_RADIUS
      )
  );
}


function visualRadiusToRadius(
  visualRadius,
  minRadius,
  maxRadius,
) {
  const normalized =
    (
      visualRadius -
      MIN_VISUAL_RADIUS
    ) /
    (
      MAX_VISUAL_RADIUS -
      MIN_VISUAL_RADIUS
    );


  return (
    minRadius +
    clamp(
      normalized,
      0,
      1,
    ) *
      (
        maxRadius -
        minRadius
      )
  );
}


function projectPosition(
  position,
  view,
) {
  const [
    x,
    y,
    z,
  ] =
    position;


  const radius =
    getMagnitude(
      position,
    );


  if (
    radius === 0
  ) {
    return {
      u: 0,
      v: 0,
      normal: 1,
    };
  }


  switch (
    view
  ) {
    case "top":
      return {
        u:
          x /
          radius,

        v:
          -z /
          radius,

        normal:
          y /
          radius,
      };


    case "front":
      return {
        u:
          x /
          radius,

        v:
          y /
          radius,

        normal:
          z /
          radius,
      };


    case "right":
      return {
        u:
          -z /
          radius,

        v:
          y /
          radius,

        normal:
          x /
          radius,
      };


    case "left":
      return {
        u:
          z /
          radius,

        v:
          y /
          radius,

        normal:
          -x /
          radius,
      };


    default:
      return {
        u: 0,
        v: 0,
        normal: 1,
      };
  }
}


function rebuildPosition(
  view,
  u,
  v,
  normalSign,
  radius,
) {
  const projectedLengthSquared =
    u *
      u +
    v *
      v;


  let adjustedU =
    u;

  let adjustedV =
    v;


  if (
    projectedLengthSquared >
    0.999
  ) {
    const projectedLength =
      Math.sqrt(
        projectedLengthSquared,
      );


    const scale =
      Math.sqrt(
        0.999,
      ) /
      projectedLength;


    adjustedU *=
      scale;

    adjustedV *=
      scale;
  }


  const normalMagnitude =
    Math.sqrt(
      Math.max(
        0,
        1 -
          adjustedU *
            adjustedU -
          adjustedV *
            adjustedV,
      ),
    );


  const normal =
    normalMagnitude *
    normalSign;


  let direction;


  switch (
    view
  ) {
    case "top":
      direction = [
        adjustedU,
        normal,
        -adjustedV,
      ];

      break;


    case "front":
      direction = [
        adjustedU,
        adjustedV,
        normal,
      ];

      break;


    case "right":
      direction = [
        normal,
        adjustedV,
        -adjustedU,
      ];

      break;


    case "left":
      direction = [
        -normal,
        adjustedV,
        adjustedU,
      ];

      break;


    default:
      direction = [
        0,
        0,
        1,
      ];
  }


  return direction.map(
    (
      value,
    ) =>
      value *
      radius,
  );
}


function getViewLetter(
  view,
) {
  switch (
    view
  ) {
    case "top":
      return "T";

    case "front":
      return "F";

    case "right":
      return "R";

    case "left":
      return "L";

    default:
      return "";
  }
}


function OrbitProjection({
  view,
  position,
  minRadius,
  maxRadius,
  onPositionChange,
  onInteractionStart,
}) {
  const projectionRef =
    useRef(
      null,
    );

  const interactionRef =
    useRef(
      null,
    );


  const radius =
    getMagnitude(
      position,
    );


  const visualRadius =
    radiusToVisualRadius(
      radius,
      minRadius,
      maxRadius,
    );


  const projection =
    projectPosition(
      position,
      view,
    );


  const isInactive =
    Math.abs(
      projection.normal,
    ) >=
    INACTIVE_NORMAL_THRESHOLD;


  const handleX =
    projection.u *
    visualRadius;

  const handleY =
    -projection.v *
    visualRadius;


  const getPointerPosition =
    (
      event,
    ) => {
      const projectionElement =
        projectionRef.current;


      if (
        !projectionElement
      ) {
        return null;
      }


      const bounds =
        projectionElement
          .getBoundingClientRect();


      const centerX =
        bounds.left +
        bounds.width /
          2;

      const centerY =
        bounds.top +
        bounds.height /
          2;


      const deltaX =
        event.clientX -
        centerX;

      const deltaY =
        event.clientY -
        centerY;


      return {
        deltaX,
        deltaY,

        distance:
          Math.hypot(
            deltaX,
            deltaY,
          ),
      };
    };


  const updateFromPointer =
    (
      event,
    ) => {
      const interaction =
        interactionRef.current;


      if (
        !interaction
      ) {
        return;
      }


      const pointer =
        getPointerPosition(
          event,
        );


      if (
        !pointer
      ) {
        return;
      }


      /*
       * Moving farther from the projection
       * center grows the actual orbit radius.
       *
       * Moving inward shrinks it.
       */

      const radialDelta =
        pointer.distance -
        interaction.startPointerDistance;


      const nextVisualRadius =
        clamp(
          interaction.startVisualRadius +
            radialDelta,

          MIN_VISUAL_RADIUS,
          MAX_VISUAL_RADIUS,
        );


      const nextRadius =
        visualRadiusToRadius(
          nextVisualRadius,
          minRadius,
          maxRadius,
        );


      /*
       * Direction is still determined by
       * the orthographic projection.
       */

      const u =
        pointer.deltaX /
        nextVisualRadius;

      const v =
        -pointer.deltaY /
        nextVisualRadius;


      onPositionChange(
        rebuildPosition(
          view,
          u,
          v,
          interaction.normalSign,
          nextRadius,
        ),
      );
    };


  const handlePointerDown =
    (
      event,
    ) => {
      if (
        isInactive
      ) {
        return;
      }


      event.stopPropagation();


      const pointer =
        getPointerPosition(
          event,
        );


      if (
        !pointer
      ) {
        return;
      }


      event.currentTarget
        .setPointerCapture(
          event.pointerId,
        );


      interactionRef.current = {
        pointerId:
          event.pointerId,

        startPointerDistance:
          pointer.distance,

        startVisualRadius:
          visualRadius,

        normalSign:
          projection.normal >= 0
            ? 1
            : -1,
      };


      onInteractionStart?.();
    };


  const handlePointerMove =
    (
      event,
    ) => {
      const interaction =
        interactionRef.current;


      if (
        !interaction ||
        interaction.pointerId !==
          event.pointerId
      ) {
        return;
      }


      event.stopPropagation();


      updateFromPointer(
        event,
      );
    };


  const handlePointerUp =
    (
      event,
    ) => {
      const interaction =
        interactionRef.current;


      if (
        !interaction ||
        interaction.pointerId !==
          event.pointerId
      ) {
        return;
      }


      event.stopPropagation();


      if (
        event.currentTarget
          .hasPointerCapture(
            event.pointerId,
          )
      ) {
        event.currentTarget
          .releasePointerCapture(
            event.pointerId,
          );
      }


      interactionRef.current =
        null;
    };


  return (
    <div
      ref={
        projectionRef
      }
      className={
        [
          "orbit-projection",
          `orbit-projection--${view}`,

          isInactive
            ? "orbit-projection--inactive"
            : "",
        ]
          .filter(
            Boolean,
          )
          .join(
            " ",
          )
      }
      onPointerDown={
        handlePointerDown
      }
      onPointerMove={
        handlePointerMove
      }
      onPointerUp={
        handlePointerUp
      }
      onPointerCancel={
        handlePointerUp
      }
    >
      <div
        className={
          `orbit-projection__geometry${
            isInactive
              ? " orbit-projection__geometry--hidden"
              : ""
          }`
        }
      >
        <div
          className="orbit-projection__ring"
          style={{
            width:
              visualRadius *
              2,

            height:
              visualRadius *
              2,
          }}
        />

        <div
          className="orbit-projection__handle"
          style={{
            transform:
              `translate(${handleX}px, ${handleY}px)`,
          }}
        />
      </div>

      <div className="orbit-projection__cube">
        {
          getViewLetter(
            view,
          )
        }
      </div>
    </div>
  );
}


function OrbitControl({
  className = "",
  side = "left",
  label,
  position,
  minRadius,
  maxRadius,
  onPositionChange,
  onInteractionStart,
}) {
  const sideView =
    side === "left"
      ? "right"
      : "left";


  return (
    <div
      className={
        [
          "orbit-control",
          `orbit-control--${side}`,
          className,
        ]
          .filter(
            Boolean,
          )
          .join(
            " ",
          )
      }
      data-ui-control="true"
    >
      <span className="orbit-control__label">
        {label}
      </span>

      <OrbitProjection
        view="top"
        position={
          position
        }
        minRadius={
          minRadius
        }
        maxRadius={
          maxRadius
        }
        onPositionChange={
          onPositionChange
        }
        onInteractionStart={
          onInteractionStart
        }
      />

      <OrbitProjection
        view="front"
        position={
          position
        }
        minRadius={
          minRadius
        }
        maxRadius={
          maxRadius
        }
        onPositionChange={
          onPositionChange
        }
        onInteractionStart={
          onInteractionStart
        }
      />

      <OrbitProjection
        view={
          sideView
        }
        position={
          position
        }
        minRadius={
          minRadius
        }
        maxRadius={
          maxRadius
        }
        onPositionChange={
          onPositionChange
        }
        onInteractionStart={
          onInteractionStart
        }
      />
    </div>
  );
}


export default OrbitControl;