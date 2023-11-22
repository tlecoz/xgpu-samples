import { VertexBuffer, FloatBuffer } from "xgpu";
import { SoundSpectrum } from "./SoundSpectrum";

export class SoundSpectrumBuffer extends VertexBuffer {

    protected spectrum: SoundSpectrum;
    protected ready: boolean = false;

    constructor(attributeName: string, nbValue: number) {
        const o: any = {};
        o[attributeName] = new FloatBuffer();
        super(o, { stepMode: "instance", datas: new Float32Array(nbValue) })
    }

    public init(audioFileUrl: string, onReady?: () => void) {

        this.spectrum = new SoundSpectrum(audioFileUrl, this.datas.length, () => {
            this.ready = true;
            if (onReady) onReady();
        })
    }

    public play(): void {
        this.spectrum.play((audioData: Uint8Array) => {
            //update the buffer with audiodata 

            const buf = new Float32Array(audioData);
            const smooth = 0.5;
            for (let i = 0; i < buf.length; i++) {
                this.datas[i] -= (this.datas[i] - buf[i]) * smooth;
            }

            this.mustBeTransfered = true;

        })
    }

    public destroyGpuResource(): void {

        if (this.spectrum) {
            this.spectrum.stop();
            this.spectrum = null;
        }

        super.destroyGpuResource();
    }

    public get isReady(): boolean { return this.ready; }
    public get volume(): number { return this.spectrum.volume }
    public set volume(n: number) { if (this.spectrum) this.spectrum.volume = n; }
    public get length(): number { if (this.datas) return this.datas.length; }
}