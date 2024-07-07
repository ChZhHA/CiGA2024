import React, { useEffect, useRef } from "react";
import options from "../gameOptions";
import { getFrameDuring } from "./utils";

interface CustomProps {
    id: number;
    targetPosition: number;
    onDestory: (id: number) => void;
}
enum CustomStatus {
    Comein,
    Sit,
    Eat,
    Finish,
    Destroy,
    Destroyed,
}
export function Custom(props: CustomProps) {
    const customRef = useRef<HTMLDivElement>();
    const roleRef = useRef<HTMLImageElement>();
    const data = useRef({
        status: CustomStatus.Comein,
        nextState: false,
        lastTime: Date.now(),
        dx: 8,
    });
    const onStatusChange = () => {
        if (data.current.status == CustomStatus.Comein) {
            if (data.current.dx === props.targetPosition) {
                data.current.nextState = true;
                data.current.status = CustomStatus.Sit;
                document.body.dispatchEvent(new CustomEvent("GameCustomSit", { detail: { position: props.targetPosition } }));
            } else {
                data.current.dx -= 1;
                customRef.current.style.left = 256 + data.current.dx * 171 + "px";
            }
        } else if (data.current.status == CustomStatus.Destroy) {
            if (data.current.dx === 10) {
                data.current.nextState = true;
                data.current.status = CustomStatus.Destroyed;
                props.onDestory(props.id);
            } else {
                data.current.dx += 1;
                customRef.current.style.left = 256 + data.current.dx * 171 + "px";
                customRef.current.style.zIndex = "0";
            }
        }
        if (data.current.nextState) {
            data.current.nextState = false;
            data.current.lastTime = Date.now();
        }
    };
    const onPlateReady = (e: any) => {
        const position = (e as any).detail.position;
        if (position === props.targetPosition) {
            data.current.status = CustomStatus.Eat;
        }
    };
    const onPlateFinish = (e: any) => {
        const position = (e as any).detail.position;
        if (position === props.targetPosition) {
            data.current.status = CustomStatus.Finish;
            roleRef.current.animate([{ offset: 0.4, transform: "translate(-50%, 0) scale(0.9,1.5) " }], { duration: 300, easing: "ease-out" });
            document.body.dispatchEvent(
                new CustomEvent("GamePay", {
                    detail: {
                        coin: 1,
                    },
                })
            );
        }
    };
    useEffect(() => {
        document.body.addEventListener("GameStateChange", onStatusChange);
        document.body.addEventListener("GamePlateReady", onPlateReady);
        document.body.addEventListener("GamePlateFinish", onPlateFinish);
        let handler: number;
        const update = () => {
            handler = requestAnimationFrame(update);
            const now = Date.now();
            if (!data.current.nextState) {
                let statusTime = 0;
                switch (data.current.status) {
                    case CustomStatus.Comein:
                        break;
                    case CustomStatus.Sit:
                        break;
                    case CustomStatus.Eat:
                        break;
                    case CustomStatus.Finish:
                        statusTime = options.hangupArea.custom.finishWaitDuring;
                        statusTime = getFrameDuring(statusTime);
                        if (now - data.current.lastTime > statusTime) {
                            data.current.nextState = true;
                            data.current.status = CustomStatus.Destroy;
                        }
                        break;
                }
            }
        };
        handler = requestAnimationFrame(update);
        return () => {
            document.body.removeEventListener("GameStateChange", onStatusChange);
            document.body.removeEventListener("GamePlateReady", onPlateReady);
            document.body.removeEventListener("GamePlateFinish", onPlateFinish);

            cancelAnimationFrame(handler);
        };
    }, []);
    return (
        <div className="custom" ref={customRef}>
            <img ref={roleRef} className="role" draggable="false" alt="" src="/images/guke-ren1.png"></img>
        </div>
    );
}
