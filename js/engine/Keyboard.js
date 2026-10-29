import View from 'rasti/View.js';

/**
 * Key code constant for the Up arrow key.
 * @constant {number}
 */
export const KEY_UP = 38;
/**
 * Key code constant for the Right arrow key.
 * @constant {number}
 */
export const KEY_RIGHT = 39;
/**
 * Key code constant for the Down arrow key.
 * @constant {number}
 */
export const KEY_DOWN = 40;
/**
 * Key code constant for the Left arrow key.
 * @constant {number}
 */
export const KEY_LEFT = 37;

const WASD_MAP = {
    87 : KEY_UP,    // W
    68 : KEY_RIGHT, // D
    83 : KEY_DOWN,  // S
    65 : KEY_LEFT   // A
};
const SCROLL_KEYS = new Set([KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT, 32]);

/**
 * Event name for key up events.
 * @constant {string}
 */
export const EVENT_KEY_UP = 'keyup';
/**
 * Event name for key down events.
 * @constant {string}
 */
export const EVENT_KEY_DOWN = 'keydown';

/**
 * Keyboard event handler class for managing keyboard input.
 * Extends View from rasti framework.
 * @class Keyboard
 * @extends {View}
 */
class Keyboard extends View {
    /**
     * Creates an instance of Keyboard.
     * @param {Object} [options] - Configuration options.
     * @param {HTMLElement} [options.el] - Element to attach keyboard listeners to. Defaults to document.body.
     */
    constructor(options) {
        super({
            el : document && document.body,
            ...options
        });

        this.keys = {};
    }

    /**
     * Handles key up events and updates the keys state.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onKeyUp(event) {
        const code = WASD_MAP[event.keyCode] || event.keyCode;
        this.keys[code] = false;
        this.emit(EVENT_KEY_UP, event);
    }

    /**
     * Handles key down events and updates the keys state.
     * @param {KeyboardEvent} event - The keyboard event.
     */
    onKeyDown(event) {
        if (SCROLL_KEYS.has(event.keyCode) && event.preventDefault) {
            event.preventDefault();
        }
        const code = WASD_MAP[event.keyCode] || event.keyCode;
        this.keys[code] = true;
        this.emit(EVENT_KEY_DOWN, event);
    }

    /**
     * Clears all tracked key states.
     */
    clear() {
        this.keys = {};
    }
}

Keyboard.prototype.events = {
    keyup : 'onKeyUp',
    keydown : 'onKeyDown'
};

export default Keyboard;
