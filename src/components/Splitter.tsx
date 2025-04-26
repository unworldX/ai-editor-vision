import React, { useCallback, useEffect, useRef, useState } from 'react';

interface SplitterProps {
  direction?: 'horizontal' | 'vertical';
  defaultSize?: number;
  minSize?: number;
  maxSize?: number;
  children: [React.ReactNode, React.ReactNode];
}

export const Splitter: React.FC<SplitterProps> = ({
  direction = 'vertical',
  defaultSize = 200,
  minSize = 100,
  maxSize = 500,
  children,
}) => {
  const [size, setSize] = useState(defaultSize);
  const [isResizing, setIsResizing] = useState(false);
  const splitterRef = useRef<HTMLDivElement>(null);

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback(
    (e: MouseEvent) => {
      if (!isResizing || !splitterRef.current) return;

      const rect = splitterRef.current.parentElement?.getBoundingClientRect();
      if (!rect) return;

      let newSize;
      if (direction === 'vertical') {
        newSize = e.clientX - rect.left;
      } else {
        newSize = e.clientY - rect.top;
      }

      newSize = Math.max(minSize, Math.min(maxSize, newSize));
      setSize(newSize);
    },
    [isResizing, direction, minSize, maxSize]
  );

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
    }

    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
    };
  }, [isResizing, resize, stopResizing]);

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction === 'vertical' ? 'row' : 'column',
    height: '100%',
    width: '100%',
  };

  const firstPanelStyle: React.CSSProperties = {
    flexShrink: 0,
    [direction === 'vertical' ? 'width' : 'height']: size,
  };

  const splitterStyle: React.CSSProperties = {
    flexShrink: 0,
    backgroundColor: '#2d2d2d',
    [direction === 'vertical' ? 'width' : 'height']: '1px',
    cursor: direction === 'vertical' ? 'col-resize' : 'row-resize',
    userSelect: 'none',
  };

  return (
    <div style={containerStyle}>
      <div style={firstPanelStyle}>{children[0]}</div>
      <div
        ref={splitterRef}
        style={splitterStyle}
        onMouseDown={startResizing}
        className="hover:bg-[#007acc]"
      />
      <div style={{ flex: 1 }}>{children[1]}</div>
    </div>
  );
};