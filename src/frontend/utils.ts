const path = window.require("path");
import options from "../gameOptions";
export function getFrameDuring(frame: number) {
    return (frame / options.fps) * 1000;
}

export function getPath(target: string) {
    return "static:/" + target;
}
