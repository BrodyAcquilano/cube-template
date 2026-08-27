import "./Slider.css";


function Slider({
  label,
  value,
  setValue,
  min,
  max,
  step = 1,
}) {
  const handleChange = (
    event,
  ) => {
    setValue(
      Number(
        event.target.value,
      ),
    );
  };


  return (
    <label
      className="slider"
      data-ui-control="true"
    >
      <span className="slider__label">
        {label}
      </span>

      <input
        className="slider__input"
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={
          handleChange
        }
        aria-label={label}
      />

      <span className="slider__value">
        {value}
      </span>
    </label>
  );
}


export default Slider;