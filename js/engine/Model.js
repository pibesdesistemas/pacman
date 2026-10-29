import Model from 'rasti/Model.js';

/**
 * Model class that extends rasti Model to use localStorage for persistence.
 * @class ModelLocalStorage
 * @extends {Model}
 */
class ModelLocalStorage extends Model {
    /**
     * Creates an instance of ModelLocalStorage.
     * @param {Object} attrs - Attributes to initialize the model with.
     */
    constructor(attrs) {
        super(attrs);
    }

    /**
     * Fetches data from localStorage using the model's URL as the key.
     * If data exists, it parses and sets it on the model.
     */
    fetch() {
        try {
            if (this.url && window.localStorage) {
                const item = window.localStorage.getItem(this.url);
                if (item) this.set(JSON.parse(item));
            }
        } catch {
            // Ignore SecurityError when running inside a restricted sandboxed iframe
        }
    }

    /**
     * Saves the model data to localStorage using the model's URL as the key.
     * The model is serialized to JSON before storing.
     */
    save() {
        try {
            if (this.url && window.localStorage) {
                window.localStorage.setItem(this.url, JSON.stringify(this));
            }
        } catch {
            // Ignore SecurityError when running inside a restricted sandboxed iframe
        }
    }
}

export default ModelLocalStorage;
