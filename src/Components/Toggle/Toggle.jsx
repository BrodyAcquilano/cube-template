import "./Toggle.css";


function Toggle({
  className = "",
  label,
  value,
  setValue,
}) {
  const handleToggle =
    () => {
      setValue(
        !value,
      );
    };


  return (
    <div
      className={
        [
          "toggle",
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
      <button
        className={
          `toggle__track${
            value
              ? " toggle__track--active"
              : ""
          }`
        }
        type="button"
        role="switch"
        aria-checked={
          value
        }
        aria-label={
          label
        }
        onClick={
          handleToggle
        }
      >
        <span className="toggle__thumb" />
      </button>

      <div className="toggle__label">
        {label}
      </div>
    </div>
  );
}


export default Toggle;