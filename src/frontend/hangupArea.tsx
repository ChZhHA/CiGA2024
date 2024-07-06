import React, { useRef, useEffect, useState } from "react";
import "./css/hangupArea.css";

const { ipcRenderer } = window.require("electron");
export default function HangupArea() {
    const coverRef = useRef<HTMLDivElement>();
    const [leek, setLeek] = useState(0);
    const [coin, setCoin] = useState(0);
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
                onMouseEnter={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
                onMouseLeave={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                }}
            >
                <div className="item">
                    <div className="icon leek"></div>
                    <div>{leek}</div>
                </div>
                <div className="item">
                    <div className="icon coin"></div>
                    <div>{coin}</div>
                </div>
            </div>
        </div>
    );
}
