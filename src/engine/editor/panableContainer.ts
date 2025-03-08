export interface PanableContainerProps {
  element: HTMLElement;
  onPan?: (deltaX: number, deltaY: number) => void;
}

class PanableContainer {
  // State
  public isPanning: boolean = false;
  public isSpaceKeyPressed: boolean = false;
  // DOM element
  private readonly containerElement: HTMLElement;
  private readonly onPanCallback?: (deltaX: number, deltaY: number) => void;
  // Position tracking
  private pointerPosition = {
    start: {x: 0, y: 0}, last: {x: 0, y: 0}
  };

  constructor({element, onPan}: PanableContainerProps) {
    this.containerElement = element;
    this.onPanCallback = onPan;
    this.initializeContainer();
    this.initializeEventListeners();
  }

  // Cleanup
  public destroy() {
    // Keyboard events
    window.removeEventListener('keydown', this.handleSpaceKeyDown);
    window.removeEventListener('keyup', this.handleSpaceKeyUp);

    // Mouse events
    this.containerElement.removeEventListener('mousedown', this.handleDragStart);
    window.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('mouseup', this.handleMouseUp);
  }

  private initializeContainer() {
    this.containerElement.style.position = 'relative';
    this.containerElement.style.overflow = 'auto';
    this.containerElement.style.cursor = 'default';
    this.containerElement.style.userSelect = 'none';
    this.containerElement.style.scrollbarWidth = 'thin';
    this.containerElement.style.scrollbarColor = 'rgba(0, 0, 0, 0.3) transparent';
    this.containerElement.setAttribute('panable-container', '')
    this.containerElement.style.cssText += `
      ::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }
      ::-webkit-scrollbar-track {
        background: transparent;
      }
      ::-webkit-scrollbar-thumb {
        background: rgba(0, 0, 0, 0.3);
        border-radius: 4px;
      }
    `;
  }

  // Event Listener Setup
  private initializeEventListeners() {
    this.initializeKeyboardEvents();
    this.initializeMouseEvents();
  }

  private initializeKeyboardEvents() {
    window.addEventListener('keydown', this.handleSpaceKeyDown);
    window.addEventListener('keyup', this.handleSpaceKeyUp);
  }

  private initializeMouseEvents() {
    this.containerElement.addEventListener('mousedown', this.handleDragStart);
    window.addEventListener('mousemove', this.handleMouseMove);
    window.addEventListener('mouseup', this.handleDragEnd);
  }

  // Keyboard Event Handlers
  private handleSpaceKeyDown = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      e.preventDefault();
      this.isSpaceKeyPressed = true;
      this.updateCursor('grab');
    }
  };

  private handleSpaceKeyUp = (e: KeyboardEvent) => {
    if (e.code === 'Space') {
      this.isSpaceKeyPressed = false;
      this.isPanning = false;
      this.updateCursor('default');
    }
  };

  // Mouse Event Handlers
  private handleDragStart = (e: MouseEvent) => {
    if (!this.isSpaceKeyPressed) return;

    this.isPanning = true;
    this.updatePointerPosition(e.clientX, e.clientY);
    this.updateCursor('grabbing');
    e.preventDefault();
    e.stopPropagation();
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isPanning) return;
    this.handlePanMove(e.clientX, e.clientY);
  };

  // Common Event Handlers
  private handleDragEnd = () => {
    this.isPanning = false;
    this.updateCursor(this.isSpaceKeyPressed ? 'grab' : 'default');
  };

  private handlePanMove(currentX: number, currentY: number) {
    const deltaX = currentX - this.pointerPosition.last.x;
    const deltaY = currentY - this.pointerPosition.last.y;

    this.updateScrollPosition(deltaX, deltaY);
    this.pointerPosition.last = {x: currentX, y: currentY};
  }

  private updatePointerPosition(x: number, y: number) {
    this.pointerPosition.start = {x, y};
    this.pointerPosition.last = {x, y};
  }

  private updateScrollPosition(deltaX: number, deltaY: number) {
    this.containerElement.scrollLeft -= deltaX;
    this.containerElement.scrollTop -= deltaY;
    this.onPanCallback?.(deltaX, deltaY);
  }

  private updateCursor(cursorType: 'default' | 'grab' | 'grabbing') {
    this.containerElement.style.cursor = cursorType;
  }
}

export default PanableContainer;