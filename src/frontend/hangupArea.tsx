import React, { useRef, useEffect, useState } from "react";
import options from "../gameOptions";
import "./css/hangupArea.css";

const { ipcRenderer } = window.require("electron");
export default function HangupArea() {
    const coverRef = useRef<HTMLDivElement>();
    const leekRef = useRef<HTMLDivElement>();
    const coinRef = useRef<HTMLDivElement>();
    const [leek, setLeek] = useState(0);
    const [coin, setCoin] = useState(0);

    useEffect(() => {
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
            }
        });
    }, []);
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
            <div
                className="icon-cover"
                // onMouseEnter={(e) => {
                //     e.stopPropagation();
                //     e.preventDefault();
                // }}
                // onMouseLeave={(e) => {
                //     e.stopPropagation();
                //     e.preventDefault();
                // }}
            >
                <div className="item" ref={leekRef}>
                    <div className="icon leek"></div>
                    <div>{leek}</div>
                </div>
                <div className="item" ref={coinRef}>
                    <div className="icon coin"></div>
                    <div>{coin}</div>
                </div>
            </div>
            <div className="restaurant">
                <div className="table"></div>
                <div className="belts" style={{ animationDuration: options.hangupArea.beltMoveDuring + "ms" }}></div>
                <img className="cook-table" alt="" draggable="false" src="/images/chushi-zhuozi.png"></img>
                <img className="cook" alt="" draggable="false" src="/images/chushi-ren.png"></img>
            </div>
        </div>
    );
}
