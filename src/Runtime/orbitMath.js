export const HALF_PI =
  Math.PI / 2;


export function clamp(
  value,
  min,
  max,
) {
  return Math.min(
    Math.max(
      value,
      min,
    ),
    max,
  );
}


export function normalizeAngle(
  angle,
) {
  return Math.atan2(
    Math.sin(
      angle,
    ),
    Math.cos(
      angle,
    ),
  );
}


export function shortestAngleDelta(
  from,
  to,
) {
  return normalizeAngle(
    to - from,
  );
}


export function sphericalToCartesian(
  radius,
  azimuth,
  verticalAngle,
) {
  const horizontalRadius =
    radius *
    Math.cos(
      verticalAngle,
    );


  return [
    horizontalRadius *
      Math.sin(
        azimuth,
      ),

    radius *
      Math.sin(
        verticalAngle,
      ),

    horizontalRadius *
      Math.cos(
        azimuth,
      ),
  ];
}


export function cartesianToSpherical(
  position,
) {
  const [
    x,
    y,
    z,
  ] =
    position;


  const radius =
    Math.hypot(
      x,
      y,
      z,
    );


  if (
    radius === 0
  ) {
    return {
      radius: 0,
      azimuth: 0,
      verticalAngle: 0,
    };
  }


  return {
    radius,

    azimuth:
      normalizeAngle(
        Math.atan2(
          x,
          z,
        ),
      ),

    verticalAngle:
      Math.asin(
        clamp(
          y /
            radius,
          -1,
          1,
        ),
      ),
  };
}


export function getSphericalUp(
  azimuth,
  verticalAngle,
) {
  return [
    -Math.sin(
      verticalAngle,
    ) *
      Math.sin(
        azimuth,
      ),

    Math.cos(
      verticalAngle,
    ),

    -Math.sin(
      verticalAngle,
    ) *
      Math.cos(
        azimuth,
      ),
  ];
}


export function getNearestFace(
  azimuth,
  verticalAngle,
) {
  const [
    x,
    y,
    z,
  ] =
    sphericalToCartesian(
      1,
      azimuth,
      verticalAngle,
    );


  const absX =
    Math.abs(
      x,
    );

  const absY =
    Math.abs(
      y,
    );

  const absZ =
    Math.abs(
      z,
    );


  if (
    absY >= absX &&
    absY >= absZ
  ) {
    return y >= 0
      ? "top"
      : "bottom";
  }


  if (
    absX >= absZ
  ) {
    return x >= 0
      ? "right"
      : "left";
  }


  return z >= 0
    ? "front"
    : "back";
}


const FACE_NORMALS = {
  front: [
    0,
    0,
    1,
  ],

  back: [
    0,
    0,
    -1,
  ],

  right: [
    1,
    0,
    0,
  ],

  left: [
    -1,
    0,
    0,
  ],

  top: [
    0,
    1,
    0,
  ],

  bottom: [
    0,
    -1,
    0,
  ],
};


const FACE_UP_CANDIDATES = {
  front: [
    [0, 1, 0],
    [1, 0, 0],
    [0, -1, 0],
    [-1, 0, 0],
  ],

  back: [
    [0, 1, 0],
    [-1, 0, 0],
    [0, -1, 0],
    [1, 0, 0],
  ],

  right: [
    [0, 1, 0],
    [0, 0, -1],
    [0, -1, 0],
    [0, 0, 1],
  ],

  left: [
    [0, 1, 0],
    [0, 0, 1],
    [0, -1, 0],
    [0, 0, -1],
  ],

  top: [
    [0, 0, -1],
    [1, 0, 0],
    [0, 0, 1],
    [-1, 0, 0],
  ],

  bottom: [
    [0, 0, 1],
    [1, 0, 0],
    [0, 0, -1],
    [-1, 0, 0],
  ],
};


export function getFaceNormal(
  face,
) {
  return FACE_NORMALS[
    face
  ];
}


function dot(
  a,
  b,
) {
  return (
    a[0] *
      b[0] +
    a[1] *
      b[1] +
    a[2] *
      b[2]
  );
}


function normalizeVector(
  vector,
) {
  const length =
    Math.hypot(
      ...vector,
    );


  if (
    length === 0
  ) {
    return [
      0,
      1,
      0,
    ];
  }


  return vector.map(
    (
      value,
    ) =>
      value /
      length,
  );
}


export function getNearestFaceUp(
  face,
  currentUp,
) {
  const normalizedUp =
    normalizeVector(
      currentUp,
    );

  const candidates =
    FACE_UP_CANDIDATES[
      face
    ];


  let bestCandidate =
    candidates[0];

  let bestDot =
    -Infinity;


  for (
    const candidate
    of candidates
  ) {
    const candidateDot =
      dot(
        normalizedUp,
        candidate,
      );


    if (
      candidateDot >
      bestDot
    ) {
      bestDot =
        candidateDot;

      bestCandidate =
        candidate;
    }
  }


  return [
    ...bestCandidate,
  ];
}