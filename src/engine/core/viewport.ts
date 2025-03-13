const ElementNotInViewport = (rect: BoundingRect, viewport: BoundingRect): boolean => {
  return (
    rect.right < viewport.left ||
    rect.bottom < viewport.top ||
    rect.left > viewport.right ||
    rect.top > viewport.bottom
  );
};


export {ElementNotInViewport}