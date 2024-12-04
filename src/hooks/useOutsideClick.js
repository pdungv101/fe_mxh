import { useEffect } from "react";

const useOutsideClick = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler();
    };

    // Bind the event listener
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    // Cleanup the event listener on unmount
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useOutsideClick;
