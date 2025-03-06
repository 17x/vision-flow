import React, {useState, useEffect, useRef, ReactNode} from 'react';

interface PanableProps {
  children: ReactNode;
}

const Panable: React.FC<PanableProps> = ({children}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [lastPosition, setLastPosition] = useState({x: 0, y: 0});

  // Handler for mouse down (start dragging)
  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === 0) { // Left mouse button
      setIsDragging(true);
      setLastPosition({x: e.clientX, y: e.clientY});
    }
  };

  // Handler for mouse move (dragging)
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging || !canvasRef.current) return;

    const dx = e.clientX - lastPosition.x;
    const dy = e.clientY - lastPosition.y;

    // Move the canvas (example of offset manipulation)
    const canvas = canvasRef.current;
    canvas.style.transform = `translate(${dx}px, ${dy}px)`;

    setLastPosition({x: e.clientX, y: e.clientY});
  };

  // Handler for mouse up (stop dragging)
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Prevent default scrolling behavior when holding space
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      // document.body.style.overflow = 'hidden'; // Disable page scroll
      setIsDragging(true); // Start dragging
      e.preventDefault()
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      document.body.style.overflow = ''; // Re-enable page scroll
      setIsDragging(false); // Stop dragging
    }
  };

  useEffect(() => {
    // Event listeners for mouse events
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    // Event listeners for keyboard events (spacebar)
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);

      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [isDragging, lastPosition]);

  return (
    <div className="panable-container"
         style={{overflow: 'hidden', position: 'relative', width: '100%', height: '100vh'}}>
      {children}
    </div>
  );
};

export default Panable;