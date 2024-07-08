import React, { useEffect, useRef, useState } from "react";
import options from "../gameOptions";
import { getPath } from "./utils";
export function Cook() {
    const [imgSrc, setImgSrc] = useState("");
    const [imgSubSrc, setImgSubSrc] = useState("");
    const [showHand, setShowHand] = useState(false);
    const leekRef = useRef<HTMLImageElement>();
    const data = useRef({
        frame: 0,
    });
    const updateImg = () => {
        const info = options.hangupArea.cook;
        const length = info.roleList.length;
        const targetFrame = data.current.frame % length;

        setImgSrc(getPath(info.roleList[targetFrame]));
        setImgSubSrc(getPath(info.hand[targetFrame]));
        if (leekRef.current && data.current.frame % length === 0) {
            shakeArea();
        }
    };
    const shakeArea = () => {
        leekRef.current.animate(
            {
                transform: ["translateX(0px)", "translate(1px, -1px)", "translate(-1px, 1px)", "translate(1px, -1px)", "translate(-1px, 1px)", "translateX(0px)"],
            },
            200
        );
    };
    useEffect(() => {
        document.body.addEventListener("GameFrameUpdate", (e) => {
            data.current.frame = (e as any).detail.frame;
            updateImg();
        });
        document.body.addEventListener("GamePreparePlate", () => {
            setShowHand(true);
        });
        document.body.addEventListener("GamePlatePrepared", () => {
            setShowHand(false);
        });
    }, []);
    return (
        <>
            <img className="cook-table" alt="" draggable="false" src={getPath("/images/chushi-zhuozi.png")}></img>
            {showHand && <img className="cook-leek" ref={leekRef} alt="" draggable="false" src={getPath("/images/chushi-jiucai.png")}></img>}
            <img className="cook" alt="" draggable="false" src={imgSrc}></img>
            {showHand && <img className="cook-hand" alt="" draggable="false" src={imgSubSrc}></img>}
        </>
    );
}
