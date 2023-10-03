import { ReactiveControllerHost } from 'lit';

type Anchor = {
    x: number; 
    y: number; 
    width: number;
}

export class AnchorController {
    constructor(
        private host: ReactiveControllerHost & HTMLElement, 
        private targetSelector = "[popovertarget]", 
        private popoverSelector = "[popover]"
    ) {
        this.host.addController(this);
    }

    get popoverElement(): HTMLElement {
        return this.host.shadowRoot?.querySelector(this.popoverSelector) as HTMLElement;
    }

    get targetElement(): HTMLElement {
        return this.host.shadowRoot?.querySelector(this.targetSelector) as HTMLElement;
    }

    hostConnected() {
        window.addEventListener('scroll', this.positionPopover.bind(this));
    }

    hostUpdated() {
        this.popoverElement.addEventListener('toggle', this.positionPopover.bind(this)); 
    }

    hostDisconnected() {
        window.removeEventListener('scroll', this.positionPopover.bind(this));
    }

    computePosition(targetElement: HTMLElement, popoverElement: HTMLElement): Promise<Anchor> {
        return new Promise((resolve) => {
            const targetRect = targetElement.getBoundingClientRect();
            const popoverRect = popoverElement.getBoundingClientRect();

            const x = targetRect.left + window.scrollX;
            const targetBottom = targetRect.bottom + window.scrollY;
            const targetTop = targetRect.top + window.scrollY;
            const popoverHeight = popoverRect.height;

            let y = targetBottom;

            // Check if the popover overflows the viewport
            if (y + popoverHeight > window.innerHeight + window.scrollY) {
                // If it overflows, position it above the target element
                y = targetTop - popoverHeight;
            }

            const width = targetRect.width;

            resolve({ x, y, width });
        });
    }

    positionPopover() {
        if (this.popoverElement && this.targetElement) {
            const calculatePosition = () => {
                this.computePosition(this.targetElement, this.popoverElement).then(({ x, y, width }: Anchor) => {
                    Object.assign(this.popoverElement.style, {
                        left: `${x}px`,
                        top: `${y}px`,
                        width: `${width}px`
                    });
                });
            };
    
            // Use requestAnimationFrame to ensure synchronized calculation
            requestAnimationFrame(calculatePosition);
        }
    }
}