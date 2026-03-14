// src/components/Voice/HoverSpeak.jsx
import { useHoverSpeak } from "../../hooks/useHoverSpeak";

const HoverSpeak = ({
  children,
  description,
  delay = 500,
  priority = "normal",
  category = "general",
  onlyOnce = false,
  className = "",
  ...props
}) => {
  const elementRef = useHoverSpeak(description, {
    delay,
    priority,
    category,
    onlyOnce,
  });

  return (
    <div ref={elementRef} className={className} {...props}>
      {children}
    </div>
  );
};

export default HoverSpeak;
