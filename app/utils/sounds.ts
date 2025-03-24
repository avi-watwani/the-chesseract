// Sound effect URLs (using lichess sounds)
const SOUND_URLS = {
  move: 'https://lichess1.org/assets/sound/standard/Move.mp3',
  capture: 'https://lichess1.org/assets/sound/standard/Capture.mp3',
  check: 'https://lichess1.org/assets/sound/standard/Check.mp3',
  castle: 'https://lichess1.org/assets/sound/standard/Castle.mp3',
  gameEnd: 'https://lichess1.org/assets/sound/standard/GenericNotify.mp3',
};

class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // Only initialize on the client side
    if (typeof window !== 'undefined') {
      // Preload sounds
      Object.entries(SOUND_URLS).forEach(([key, url]) => {
        const audio = new Audio(url);
        audio.preload = 'auto';
        this.sounds[key] = audio;
      });
    }
  }

  setEnabled(enabled: boolean) {
    this.enabled = enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  playMove() {
    if (this.enabled && this.sounds.move) this.sounds.move.play();
  }

  playCapture() {
    if (this.enabled && this.sounds.capture) this.sounds.capture.play();
  }

  playCheck() {
    if (this.enabled && this.sounds.check) this.sounds.check.play();
  }

  playCastle() {
    if (this.enabled && this.sounds.castle) this.sounds.castle.play();
  }

  playGameEnd() {
    if (this.enabled && this.sounds.gameEnd) this.sounds.gameEnd.play();
  }
}

// Create a singleton instance only on the client side
export const soundManager = typeof window !== 'undefined' ? new SoundManager() : null; 