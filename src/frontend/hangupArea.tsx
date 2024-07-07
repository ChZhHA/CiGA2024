import React, { useRef, useEffect, useState } from "react";
import options from "../gameOptions";
import "./css/hangupArea.css";
import { getFrameDuring } from "./utils";
import { Custom } from "./custom";
import { Cook } from "./cook";
import { Plate } from "./plate";

const { ipcRenderer } = window.require("electron");
let id = 0;
export default function HangupArea() {
    const coverRef = useRef<HTMLDivElement>();
    const leekRef = useRef<HTMLDivElement>();
    const leekNumRef = useRef<HTMLDivElement>();
    const coinNumRef = useRef<HTMLDivElement>();
    const coinRef = useRef<HTMLDivElement>();
    const beltRef = useRef<HTMLDivElement>();
    const [leek, setLeek] = useState(0);
    const [coin, setCoin] = useState(0);
    const [plates, setPlates] = useState([]);
    const [customs, setCustoms] = useState([]);
    const data = useRef({
        plates: [],
        custom: [],
        platesWaitQueue: [],
        platePrepare: false,
        nextCustomDuring: -1,
        lastCustomComein: -1,
        position: Array.from({ length: options.hangupArea.custom.max }).fill(false),
    });

    const refreshNextCustomDuring = () => {
        data.current.nextCustomDuring = Math.random() * (options.hangupArea.custom.maxCooldown - options.hangupArea.custom.minCooldown) + options.hangupArea.custom.minCooldown;
    };

    useEffect(() => {
        data.current.lastCustomComein = Date.now();
        document.body.addEventListener("GameHarvest", (e) => {
            const { detail } = e as any;
            if (detail.count !== undefined && detail.count > 0) {
                setLeek((leek) => leek + detail.count);
                leekRef.current.animate(
                    [
                        { offset: 0.3, transform: "scale(1.1) rotate(2.5deg)" },
                        { offset: 0.5, transform: "scale(1.2) rotate(-2.5deg)" },
                    ],
                    500
                );
                leekNumRef.current.animate([{ offset: 0.5, transform: "scale(3)" }, {}], { duration: 500, easing: "ease-out" });
            }
        });
        document.body.addEventListener("GamePlatePrepared", (e) => {
            data.current.platePrepare = false;
        });
        document.body.addEventListener("GameStateChange", (e) => {
            beltRef.current.animate(
                [
                    { offset: 0, backgroundPosition: "0 0" },
                    { offset: 0.2, backgroundPosition: "171px 0" },
                    { offset: 1, backgroundPosition: "171px 0" },
                ],
                { duration: getFrameDuring(options.hangupArea.beltMoveDuring), easing: "ease-in-out" }
            );
            const now = Date.now();
            if (data.current.nextCustomDuring === -1) {
                refreshNextCustomDuring();
            }
            if (now - data.current.lastCustomComein >= getFrameDuring(data.current.nextCustomDuring) && data.current.position.includes(false)) {
                addCustom(data.current.position.indexOf(false));
                refreshNextCustomDuring();
                data.current.lastCustomComein = now;
            }
            if (!data.current.platePrepare && data.current.platesWaitQueue.length > 0) {
                const position = data.current.platesWaitQueue.shift();
                addPlate(position);
                data.current.platePrepare = true;
            }
        });
        document.body.addEventListener("GameCustomSit", (e) => {
            const position = (e as any).detail.position;
            data.current.platesWaitQueue.push(position);
        });
        document.body.addEventListener("GamePay", (e) => {
            const coin = (e as any).detail.coin;
            setCoin((now) => now + coin);
            coinRef.current.animate(
                [
                    { offset: 0.3, transform: "scale(1.1) rotate(2.5deg)" },
                    { offset: 0.5, transform: "scale(1.2) rotate(-2.5deg)" },
                ],
                500
            );
            coinNumRef.current.animate([{ offset: 0.5, transform: "scale(3)" }, {}], { duration: 500, easing: "ease-out" });
        });
        let handler: number;
        let lastFrameTime = Date.now();
        const update = () => {
            handler = requestAnimationFrame(update);
            const now = Date.now();
            const deltaTime = now - lastFrameTime;
            lastFrameTime = now;
        };
        handler = requestAnimationFrame(update);
        return () => {
            cancelAnimationFrame(handler);
        };
    }, []);

    const addCustom = (position: number) => {
        data.current.custom.push({ id: ++id, position });
        data.current.position[position] = true;
        setCustoms(data.current.custom.slice());
    };

    const destoryCustom = (id: number) => {
        const custom = data.current.custom.findIndex((item) => item.id === id);
        data.current.position[data.current.custom[custom].position] = false;
        data.current.custom.splice(custom, 1);

        setCustoms(data.current.custom.slice());
    };

    const addPlate = (position: number) => {
        data.current.plates.push({ id: ++id, position });
        setPlates(data.current.plates.slice());
    };

    const destoryPlate = (id: number) => {
        data.current.plates.splice(
            data.current.plates.findIndex((item) => item.id === id),
            1
        );

        setPlates(data.current.plates.slice());
    };
    return (
        <div ref={coverRef} className="hangup-area">
            <div
                className="background"
                onMouseEnter={() => {
                    ipcRenderer.send("set-ignore-mouse-events", true, { forward: true });
                }}
                onMouseLeave={() => {
                    ipcRenderer.send("set-ignore-mouse-events", false);
                }}
            ></div>
            <div className="icon-cover">
                <div className="item" ref={leekRef}>
                    <div className="icon leek"></div>
                    <div ref={leekNumRef}>{leek}</div>
                </div>
                <div className="item" ref={coinRef}>
                    <div className="icon coin"></div>
                    <div ref={coinNumRef}>{coin}</div>
                </div>
            </div>
            <div className="restaurant">
                <div className="table"></div>
                <div className="belts" ref={beltRef}></div>
                <Cook />
                {customs.map((item) => {
                    return <Custom key={item.id} targetPosition={item.position} id={item.id} onDestory={destoryCustom} />;
                })}
                {plates.map((item) => {
                    return <Plate key={item.id} targetPosition={item.position} id={item.id} onDestory={destoryPlate} />;
                })}
            </div>
        </div>
    );
}
