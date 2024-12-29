/**
 * Utility functions for handling easter egg interactions
 * These functions manage the click detection and positioning logic for easter egg features
 */

interface Position {
  x: number;
  y: number;
}

interface EasterEggConfig {
  requiredClicks: number;
  timeWindow: number;
  cardDimensions: {
    width: number;
    height: number;
  };
}

export class EasterEggHandler {
  private clickCount = 0;
  private clickTimer?: ReturnType<typeof setTimeout>;
  private config: EasterEggConfig;

  constructor(config: EasterEggConfig) {
    this.config = config;
  }

  /**
   * Calculate the position for the easter egg popup ensuring it stays within viewport
   */
  private calculatePosition(clickX: number, clickY: number): Position {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const { width, height } = this.config.cardDimensions;

    let x = clickX;
    let y = clickY;

    // Keep the card within the viewport
    if (x + width / 2 > viewportWidth) {
      x = viewportWidth - width / 2;
    } else if (x - width / 2 < 0) {
      x = width / 2;
    }

    if (y + height > viewportHeight) {
      y = viewportHeight - height;
    }

    return { x, y };
  }

  /**
   * Handle click events and determine if easter egg should be triggered
   */
  handleClick(event: MouseEvent): { triggered: boolean; position?: Position } {
    this.clickCount++;
    if (this.clickTimer) clearTimeout(this.clickTimer);

    if (this.clickCount === this.config.requiredClicks) {
      this.clickCount = 0;
      const position = this.calculatePosition(event.clientX, event.clientY);
      return { triggered: true, position };
    }

    this.clickTimer = setTimeout(() => {
      this.clickCount = 0;
    }, this.config.timeWindow);

    return { triggered: false };
  }

  reset(): void {
    this.clickCount = 0;
    if (this.clickTimer) {
      clearTimeout(this.clickTimer);
    }
  }
}
