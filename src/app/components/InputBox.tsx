import React, { useEffect } from "react";

// Input box component
const InputBox = ({
  className,
  type,
  id,
  placeholder,
  value,
  setValue,
  onKeyPress,
  onBlur, // Added onBlur prop
  message,
}) => {
  // 기본 클래스명 : "input-box"
  className = "input-box " + className;

  useEffect(() => {
    const messageBox = document.getElementById(id);
    if (message !== "") {
      messageBox.style.borderColor = messageBox ? "red" : "";
    } else {
      messageBox.style.borderColor = messageBox ? "" : "";
    }
  }, [id, message]);

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      onKeyPress();
    }
  };

  return (
    <div className={className}>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyUp={handleOnKeyPress}
        onBlur={onBlur} // Added onBlur handler
        required
      />
      {message && (
        <span className="input-warn-message" style={{ color: "red" }}>
          {message}
        </span>
      )}
    </div>
  );
};

export default InputBox;
