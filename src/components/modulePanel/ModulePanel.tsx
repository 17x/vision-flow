import React, {useState, useCallback, useRef, useEffect} from 'react';
import {ModuleList} from "./ModuleList.tsx";

interface ModulePanelProps {
  className?: string;
}

export const ModulePanel: React.FC<ModulePanelProps> = ({className = ''}) => {
  const [width, setWidth] = useState<number>(300);
  const isDragging = useRef(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection while dragging
  }, []);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging.current) return;

    const maxWidth = window.innerWidth * 0.9;
    const newWidth = Math.min(Math.max(0, e.clientX), maxWidth);
    e.stopPropagation()
    setWidth(newWidth);
  }, []);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    isDragging.current = false;
    document.body.style.cursor = 'default';
    document.body.style.userSelect = '';
    e.stopPropagation()
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return (
    <div
      ref={panelRef}
      style={{width: `${width}px`}}
      className="relative h-full flex-shrink-0 border-r border-gray-200"
    >
      <div className={`h-full  p-6  bg-white overflow-hidden ${className}`}>
        <span>Module List</span>
        <ModuleList/>
      </div>
      <div
        className="absolute z-10 top-0 -right-1 w-2 h-full bg-transparent hover:bg-gray-200 cursor-col-resize transition-colors"
        onMouseDown={handleMouseDown}
      />
    </div>
  );
};