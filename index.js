import Game from './js/Game.js';
import { STATUS_SPLASH, STATUS_PLAY, STATUS_PAUSED } from './js/GameModel.js';
import { KEY_UP, KEY_RIGHT, KEY_DOWN, KEY_LEFT } from './js/engine/Keyboard.js';
import { resumeAudioContext } from './js/engine/Sound.js';

(() => {
    const getDimensions = () => {
        const vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 480);
        const vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 480);
        return {
            width : vw * 0.94,
            height : vh * 0.94
        };
    };

    const { width, height } = getDimensions();

    const game = new Game({
        el : document.querySelector('.js-pacman-playground'),
        width,
        height,
        position : 'relative'
    });

    /**
     * Pausa el bucle de juego cuando el contenedor o iframe pierde el foco (blur / visibilitychange).
     */
    const pauseGameLoop = () => {
        if (game.model.status === STATUS_PLAY) {
            game.model.status = STATUS_PAUSED;
        }
    };

    // 1. Gestión de Enfoque (Focus) y Contexto de Audio en la pantalla splash original
    const startBtn = document.getElementById('start-btn');

    if (startBtn) {
        startBtn.addEventListener('click', () => {
            // Forzar foco en la ventana del iframe
            window.focus();

            // Inicializar o reanudar AudioContext
            resumeAudioContext();
        });
    }

    // 2. Ciclo de Vida (Blur / Visibility)
    window.addEventListener('blur', () => {
        pauseGameLoop();
    });

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            pauseGameLoop();
        }
    });

    // 3. Esquema de Controles Híbrido: D-Pad Virtual (Touch + Pointer)
    const dpad = document.querySelector('.virtual-dpad');
    if (dpad) {
        const dirToKey = {
            u : KEY_UP,
            r : KEY_RIGHT,
            d : KEY_DOWN,
            l : KEY_LEFT
        };

        const setDirection = (dir, active, btn) => {
            const keyCode = dirToKey[dir];
            if (!keyCode) return;
            game.keyboard.keys[keyCode] = active;
            if (btn) {
                btn.classList.toggle('active', active);
            }
        };

        dpad.querySelectorAll('[data-dir]').forEach(btn => {
            const dir = btn.getAttribute('data-dir');

            const onPress = (e) => {
                if (e.cancelable) e.preventDefault();
                window.focus();
                resumeAudioContext();
                setDirection(dir, true, btn);
            };

            const onRelease = (e) => {
                if (e.cancelable) e.preventDefault();
                setDirection(dir, false, btn);
            };

            btn.addEventListener('touchstart', onPress, { passive : false });
            btn.addEventListener('touchend', onRelease, { passive : false });
            btn.addEventListener('touchcancel', onRelease, { passive : false });
            btn.addEventListener('mousedown', onPress);
            btn.addEventListener('mouseup', onRelease);
            btn.addEventListener('mouseleave', onRelease);
        });

        const pauseBtn = dpad.querySelector('[data-action="pause"]');
        if (pauseBtn) {
            const togglePause = (e) => {
                if (e.cancelable) e.preventDefault();
                window.focus();
                resumeAudioContext();
                if (game.model.status === STATUS_PLAY) {
                    game.model.status = STATUS_PAUSED;
                } else if (game.model.status === STATUS_PAUSED) {
                    game.model.status = STATUS_PLAY;
                } else if (game.model.status === STATUS_SPLASH) {
                    game.startLevel();
                }
            };
            pauseBtn.addEventListener('touchstart', togglePause, { passive : false });
            pauseBtn.addEventListener('mousedown', togglePause);
        }
    }
})();
