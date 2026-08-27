import Slider from "../Slider/Slider";

import "./LightingControls.css";


function LightingControls({
  runtime,
}) {
  return (
    <div
      className="lighting-controls"
      data-ui-control="true"
    >
      <Slider
        label="Ambient"
        value={
          runtime.ambientLightIntensity
        }
        setValue={
          runtime.setAmbientLightIntensity
        }
        min={0}
        max={3}
        step={0.05}
      />

      <Slider
        label="Direct"
        value={
          runtime.directionalLightIntensity
        }
        setValue={
          runtime.setDirectionalLightIntensity
        }
        min={0}
        max={5}
        step={0.05}
      />

      <Slider
        label="Hue"
        value={
          runtime.directionalLightHue
        }
        setValue={
          runtime.setDirectionalLightHue
        }
        min={0}
        max={360}
        step={1}
      />

      <Slider
        label="Saturation"
        value={
          runtime.directionalLightSaturation
        }
        setValue={
          runtime.setDirectionalLightSaturation
        }
        min={0}
        max={100}
        step={1}
      />
    </div>
  );
}


export default LightingControls;