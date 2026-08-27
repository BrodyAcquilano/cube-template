import {
  useCallback,
  useMemo,
  useState,
} from "react";

import {
  Color,
} from "three";

import {
  cartesianToSpherical,
  getNearestFace,
  getSphericalUp,
  sphericalToCartesian,
} from "./orbitMath";


const INITIAL_CAMERA_AZIMUTH =
  0;

const INITIAL_CAMERA_VERTICAL_ANGLE =
  0;

const INITIAL_CAMERA_RADIUS =
  4;


const INITIAL_DIRECTIONAL_LIGHT_RADIUS =
  Math.sqrt(
    57,
  );

const INITIAL_DIRECTIONAL_LIGHT_AZIMUTH =
  Math.atan2(
    4,
    5,
  );

const INITIAL_DIRECTIONAL_LIGHT_VERTICAL_ANGLE =
  Math.asin(
    4 /
      INITIAL_DIRECTIONAL_LIGHT_RADIUS,
  );


function useCubeRuntime() {
  const [
    cameraAzimuth,
    setCameraAzimuth,
  ] =
    useState(
      INITIAL_CAMERA_AZIMUTH,
    );

  const [
    cameraVerticalAngle,
    setCameraVerticalAngle,
  ] =
    useState(
      INITIAL_CAMERA_VERTICAL_ANGLE,
    );

  const [
    cameraRadius,
    setCameraRadius,
  ] =
    useState(
      INITIAL_CAMERA_RADIUS,
    );

  const [
    cameraUp,
    setCameraUp,
  ] =
    useState(
      () =>
        getSphericalUp(
          INITIAL_CAMERA_AZIMUTH,
          INITIAL_CAMERA_VERTICAL_ANGLE,
        ),
    );


  const [
    ambientLightIntensity,
    setAmbientLightIntensity,
  ] =
    useState(
      0.5,
    );

  const [
    directionalLightIntensity,
    setDirectionalLightIntensity,
  ] =
    useState(
      2,
    );

  const [
    directionalLightHue,
    setDirectionalLightHue,
  ] =
    useState(
      0,
    );

  const [
    directionalLightSaturation,
    setDirectionalLightSaturation,
  ] =
    useState(
      0,
    );

  const [
    directionalLightAzimuth,
    setDirectionalLightAzimuth,
  ] =
    useState(
      INITIAL_DIRECTIONAL_LIGHT_AZIMUTH,
    );

  const [
    directionalLightVerticalAngle,
    setDirectionalLightVerticalAngle,
  ] =
    useState(
      INITIAL_DIRECTIONAL_LIGHT_VERTICAL_ANGLE,
    );

  const [
    directionalLightRadius,
    setDirectionalLightRadius,
  ] =
    useState(
      INITIAL_DIRECTIONAL_LIGHT_RADIUS,
    );


  const [
    isDragging,
    setIsDragging,
  ] =
    useState(
      false,
    );

  const [
    isSnapped,
    setIsSnapped,
  ] =
    useState(
      true,
    );

  const [
    activeFace,
    setActiveFace,
  ] =
    useState(
      "front",
    );

  const [
    showControls,
    setShowControls,
  ] =
    useState(
      true,
    );

  const [
    invertCursor,
    setInvertCursor,
  ] =
    useState(
      false,
    );


  const cameraPosition =
    useMemo(
      () =>
        sphericalToCartesian(
          cameraRadius,
          cameraAzimuth,
          cameraVerticalAngle,
        ),
      [
        cameraRadius,
        cameraAzimuth,
        cameraVerticalAngle,
      ],
    );


  const directionalLightPosition =
    useMemo(
      () =>
        sphericalToCartesian(
          directionalLightRadius,
          directionalLightAzimuth,
          directionalLightVerticalAngle,
        ),
      [
        directionalLightRadius,
        directionalLightAzimuth,
        directionalLightVerticalAngle,
      ],
    );


  const directionalLightColor =
    useMemo(
      () => {
        const color =
          new Color();


        color.setHSL(
          directionalLightHue /
            360,

          directionalLightSaturation /
            100,

          0.5,
        );


        return color;
      },
      [
        directionalLightHue,
        directionalLightSaturation,
      ],
    );


  const currentFace =
    useMemo(
      () =>
        getNearestFace(
          cameraAzimuth,
          cameraVerticalAngle,
        ),
      [
        cameraAzimuth,
        cameraVerticalAngle,
      ],
    );


  const setCameraPositionFromCartesian =
    useCallback(
      (
        position,
      ) => {
        const spherical =
          cartesianToSpherical(
            position,
          );


        setCameraRadius(
          spherical.radius,
        );

        setCameraAzimuth(
          spherical.azimuth,
        );

        setCameraVerticalAngle(
          spherical.verticalAngle,
        );


        setCameraUp(
          getSphericalUp(
            spherical.azimuth,
            spherical.verticalAngle,
          ),
        );
      },
      [],
    );


  const setDirectionalLightPositionFromCartesian =
    useCallback(
      (
        position,
      ) => {
        const spherical =
          cartesianToSpherical(
            position,
          );


        setDirectionalLightRadius(
          spherical.radius,
        );

        setDirectionalLightAzimuth(
          spherical.azimuth,
        );

        setDirectionalLightVerticalAngle(
          spherical.verticalAngle,
        );
      },
      [],
    );


  return {
    cameraAzimuth,
    setCameraAzimuth,

    cameraVerticalAngle,
    setCameraVerticalAngle,

    cameraRadius,
    setCameraRadius,

    cameraPosition,

    cameraUp,
    setCameraUp,

    setCameraPositionFromCartesian,


    ambientLightIntensity,
    setAmbientLightIntensity,


    directionalLightIntensity,
    setDirectionalLightIntensity,

    directionalLightHue,
    setDirectionalLightHue,

    directionalLightSaturation,
    setDirectionalLightSaturation,

    directionalLightColor,

    directionalLightAzimuth,
    setDirectionalLightAzimuth,

    directionalLightVerticalAngle,
    setDirectionalLightVerticalAngle,

    directionalLightRadius,
    setDirectionalLightRadius,

    directionalLightPosition,

    setDirectionalLightPositionFromCartesian,


    currentFace,

    activeFace,
    setActiveFace,

    isDragging,
    setIsDragging,

    isSnapped,
    setIsSnapped,

    showControls,
    setShowControls,

    invertCursor,
    setInvertCursor,
  };
}


export default useCubeRuntime;