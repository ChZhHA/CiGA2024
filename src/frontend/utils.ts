import options from "../gameOptions";

export function getFrameDuring(frame: number) {
    return (frame / options.fps) * 1000;
}