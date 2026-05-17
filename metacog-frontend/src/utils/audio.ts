"use client";

class RetroSynth {
  private ctx: AudioContext | null = null;
  private isInitialized = false;

  private getContext() {
    if (!this.ctx && typeof window !== "undefined") {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public init() {
    if (this.isInitialized) return;
    const ctx = this.getContext();
    if (ctx && ctx.state === "suspended") {
      ctx.resume();
    }
    this.isInitialized = true;
  }

  public playTick() {
    // Menu select: High, quick square pop
    const ctx = this.getContext();
    if (!ctx) return;
    this.init();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  public playDamage() {
    // Damage: Low crunchy sawtooth drop (like taking a hit in DOOM)
    const ctx = this.getContext();
    if (!ctx) return;
    this.init();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(120, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playHeal() {
    // Heal: Quick ascending major third (like picking up a health pack)
    const ctx = this.getContext();
    if (!ctx) return;
    this.init();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(440, ctx.currentTime);
    osc.frequency.setValueAtTime(554.37, ctx.currentTime + 0.08); // C#5
    osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.16); // E5

    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.2);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.25);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }

  public playSuccess() {
    // Fanfare: E4 -> G#4 -> B4
    const ctx = this.getContext();
    if (!ctx) return;
    this.init();

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = "square";
    osc2.type = "sawtooth";

    const t = ctx.currentTime;
    
    // E4
    osc1.frequency.setValueAtTime(329.63, t);
    osc2.frequency.setValueAtTime(329.63, t);
    
    // G#4
    osc1.frequency.setValueAtTime(415.30, t + 0.15);
    osc2.frequency.setValueAtTime(415.30, t + 0.15);
    
    // B4
    osc1.frequency.setValueAtTime(493.88, t + 0.3);
    osc2.frequency.setValueAtTime(493.88, t + 0.3);

    gainNode.gain.setValueAtTime(0, t);
    gainNode.gain.linearRampToValueAtTime(0.15, t + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.15, t + 0.5);
    gainNode.gain.linearRampToValueAtTime(0, t + 0.7);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start();
    osc2.start();
    osc1.stop(t + 0.8);
    osc2.stop(t + 0.8);
  }

  public playBuzzer() {
    // Error/Buzzer: Low grating square wave
    const ctx = this.getContext();
    if (!ctx) return;
    this.init();

    const osc = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(80, ctx.currentTime);
    osc.frequency.linearRampToValueAtTime(60, ctx.currentTime + 0.3);

    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

    osc.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.3);
  }
}

// Export a singleton instance
export const audioSynth = new RetroSynth();
