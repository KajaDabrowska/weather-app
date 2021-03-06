import React from "react";

// this is by @jacobparis on GitHub
// https://github.com/jacobparis
const FocusTrap = ({ children, isActive }) => {
  const topTabTrap = React.useRef();
  const bottomTabTrap = React.useRef();
  const container = React.useRef();

  React.useEffect(() => {
    const getFocusableElements = () => {
      if (!container.current) return [];

      const FOCUSABLE_SELECTOR = [
        "button",
        "a[href]",
        "input",
        "select",
        "textarea",
        "[tabindex]",
        "[contenteditable]",
      ]
        .map((selector) => `${selector}:not(:disabled):not([disabled])`)
        .join(", ");

      return Array.from(container.current.querySelectorAll(FOCUSABLE_SELECTOR))
        .filter((element) => element !== topTabTrap.current)
        .filter((element) => element !== bottomTabTrap.current);
    };

    const trapFocus = (event) => {
      // Only trap focus in modal form
      if (!isActive) return;

      let elements;
      if (event.target === topTabTrap.current) {
        elements = getFocusableElements();

        if (elements.length > 0) {
          const lastElement = elements[elements.length - 1];
          lastElement.focus();
        }
      }

      if (event.target === bottomTabTrap.current) {
        elements = getFocusableElements();

        if (elements.length > 0) {
          const firstElement = elements[0];
          firstElement.focus();
        }
      }
    };

    document.addEventListener("focusin", trapFocus);

    return () => document.removeEventListener("focusin", trapFocus);
  }, [isActive, topTabTrap, bottomTabTrap, container]);

  return (
    <div ref={container}>
      {isActive && <span ref={topTabTrap} tabIndex="0" />}
      {children}
      {isActive && <span ref={bottomTabTrap} tabIndex="0" />}
    </div>
  );
};
export default FocusTrap;
