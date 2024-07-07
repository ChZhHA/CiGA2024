import React, { useEffect, useRef, useState } from "react";
import options from "../gameOptions";
import { getFrameDuring } from "./utils";
enum PlateStatus {
    Wait,
    GoTransport,
    Transport,
    Ready,
    Meal,
    GoDestory,
    Destroy,
    Destoryed,
}
interface PlateProps {
    id: number;
    targetPosition: number;
    onDestory: (id: number) => void;
}
export function Plate(props: PlateProps) {
    const plateRef = useRef<HTMLImageElement>();
    const data = useRef({
        status: PlateStatus.Wait,
        nextState: false,
        lastTime: Date.now(),
        dx: 0,
    });
    const [number, setNumber] = useState(0);
    const stateChangeListener = () => {
        if (data.current.status == PlateStatus.Transport) {
            if (data.current.dx === props.targetPosition + 1) {
                data.current.nextState = true;
                data.current.status = PlateStatus.Ready;
            } else {
                data.current.dx += 1;
                plateRef.current.style.left = 85 + data.current.dx * 171 + "px";
            }
        }
        if (data.current.status == PlateStatus.Destroy) {
            data.current.dx += 1;
            plateRef.current.style.left = 85 + data.current.dx * 171 + "px";
            if (data.current.dx > 10) {
                props.onDestory(props.id);
                data.current.status = PlateStatus.Destoryed;
            }
        }
        if (data.current.nextState) {
            data.current.nextState = false;
            data.current.lastTime = Date.now();
        }
    };
    useEffect(() => {
        document.body.addEventListener("GameStateChange", stateChangeListener);
        let handler: number;
        const update = () => {
            handler = requestAnimationFrame(update);
            const now = Date.now();
            if (!data.current.nextState) {
                let statusTime = 0;
                switch (data.current.status) {
                    case PlateStatus.Wait:
                        {
                            statusTime = options.hangupArea.plate.waitDuring;
                            statusTime = getFrameDuring(statusTime);
                            const progress = (now - data.current.lastTime) / statusTime;
                            setNumber(Math.round(progress * options.hangupArea.plate.size));
                            if (now - data.current.lastTime > statusTime) {
                                data.current.nextState = true;
                                data.current.status = PlateStatus.GoTransport;
                            }
                        }
                        break;
                    case PlateStatus.GoTransport:
                        {
                            plateRef.current.style.bottom = "-15px";
                            data.current.nextState = true;
                            data.current.status = PlateStatus.Transport;
                            document.body.dispatchEvent(
                                new CustomEvent("GamePlatePrepared", {
                                    detail: {
                                        position: props.targetPosition,
                                    },
                                })
                            );
                        }
                        break;
                    case PlateStatus.Transport:
                        break;
                    case PlateStatus.Ready:
                        {
                            plateRef.current.style.bottom = "15px";
                            data.current.nextState = true;
                            data.current.status = PlateStatus.Meal;
                            document.body.dispatchEvent(
                                new CustomEvent("GamePlateReady", {
                                    detail: {
                                        position: props.targetPosition,
                                    },
                                })
                            );
                        }
                        break;
                    case PlateStatus.Meal:
                        {
                            statusTime = options.hangupArea.plate.mealDuring;
                            statusTime = getFrameDuring(statusTime);
                            const progress = (now - data.current.lastTime) / statusTime;
                            setNumber(Math.round((1 - progress) * options.hangupArea.plate.size));
                            if (now - data.current.lastTime > statusTime) {
                                data.current.nextState = true;
                                data.current.status = PlateStatus.GoDestory;
                                document.body.dispatchEvent(
                                    new CustomEvent("GamePlateFinish", {
                                        detail: {
                                            position: props.targetPosition,
                                        },
                                    })
                                );
                            }
                        }
                        break;
                    case PlateStatus.GoDestory:
                        {
                            plateRef.current.style.bottom = "-15px";
                            data.current.nextState = true;
                            data.current.status = PlateStatus.Destroy;
                        }
                        break;
                    default:
                }
            }
        };
        handler = requestAnimationFrame(update);
        return () => {
            cancelAnimationFrame(handler);
            document.body.removeEventListener("GameStateChange", stateChangeListener);
        };
    }, []);
    return (
        <div className="plate-cover" ref={plateRef} style={{ zIndex: 10000 - props.id }}>
            <img src="/images/panzi.png" alt="" className="plate"></img>
            {number > 0 && <img src="/images/jiucaihezi.png" alt="" className="jiaozi"></img>}
            {number > 1 && <img src="/images/jiucaihezi.png" alt="" className="jiaozi"></img>}
            {number > 2 && <img src="/images/jiucaihezi.png" alt="" className="jiaozi"></img>}
            {number > 3 && <img src="/images/jiucaihezi.png" alt="" className="jiaozi"></img>}
            {number > 4 && <img src="/images/jiucaihezi.png" alt="" className="jiaozi"></img>}
            {number > 5 && <img src="/images/jiucaihezi.png" alt="" className="jiaozi"></img>}
        </div>
    );
}
