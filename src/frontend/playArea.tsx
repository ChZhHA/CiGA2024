import { useEffect, useState, useRef, ReactNode, ReactElement } from "react";
import "./css/playArea.css";
import options from "../gameOptions";

function getFrameDuring(frame: number) {
    return (frame / options.playArea.fps) * 1000;
}
export default function PlayArea() {
    const [imgSrc, setImgSrc] = useState("");
    const [effectList, setEffectList] = useState<Array<ReactNode>>([]);
    const imgRef = useRef<HTMLImageElement>();
    const countDownRef = useRef<HTMLDivElement>();
    const playAreaRef = useRef<HTMLDivElement>();
    const wateringCanRef = useRef<HTMLDivElement>();
    const imgFrontRef = useRef<HTMLImageElement>();

    const data = useRef({
        stateIndex: 0,
        frame: 0,
        lastStateTime: -1,
        lastFrameTime: -1,
        lastGrowTime: -1,
        grow: false,
        harvest: false,
        harvested: false,
        lockedState: -1,
        dead: false,
        effectList: [],
        water: options.playArea.defaultWater,
        during: 0,
    });

    const shakeArea = () => {
        playAreaRef.current.animate(
            {
                transform: ["translateX(0px)", "translateX(10px)", "translateX(-10px)", "translateX(10px)", "translateX(-10px)", "translateX(0px)"],
            },
            200
        );
    };

    const startGame = () => {
        const deltaTime = data.current.water * options.playArea.growDuringMinutes * 60 * 1000;
        if (data.current.grow) {
            data.current.during += deltaTime;
        } else {
            data.current.during = deltaTime;
            data.current.lastGrowTime = Date.now();
            data.current.dead = false;
            data.current.grow = true;
        }
        data.current.water = 0;
    };

    const resetGame = () => {
        data.current.frame = 0;
        data.current.stateIndex = 0;
        data.current.grow = false;
        data.current.harvest = false;
        data.current.harvested = false;
        data.current.lastFrameTime = -1;
        data.current.lastGrowTime = -1;
        data.current.lastStateTime = -1;
    };

    const harvest = () => {
        const key = Date.now().toString();
        const harvestInfo = options.playArea.leekStateImg[data.current.stateIndex];
        const event = new CustomEvent("GameHarvest", {
            detail: { type: harvestInfo.type, count: harvestInfo.count },
        });
        data.current.harvested = true;
        data.current.lockedState = data.current.stateIndex;
        document.body.dispatchEvent(event);
        const img = (
            <img
                className="cut"
                alt=""
                key={key}
                src={harvestInfo.cutImg}
                onLoad={(e) => {
                    e.currentTarget.animate(
                        [
                            {},
                            {
                                transform: "translate(100px,-100px) rotate(0.3turn)",
                                opacity: 0,
                            },
                        ],
                        {
                            duration: 300,
                            easing: "ease-out",
                            fill: "forwards",
                        }
                    );
                }}
            ></img>
        );
        data.current.effectList.push(img);
        setTimeout(() => {
            data.current.effectList.splice(data.current.effectList.findIndex((item: ReactElement) => item.key === key));
            setEffectList(data.current.effectList.slice());
        }, 300);
        setEffectList(data.current.effectList);
        resetState();
    };

    const resetState = () => {
        data.current.harvested = false;
        data.current.frame = 0;
        data.current.stateIndex = 0;
        data.current.lastFrameTime = -1;
        data.current.lastStateTime = -1;
        emphasizeImg();
    };

    const emphasizeImg = () => {
        imgRef.current.animate(
            [
                {
                    transform: "translateX(-50%) scale(1)",
                },
                {
                    offset: 0.3,
                    transform: "translateX(-50%) scale(1.5)",
                    filter: "drop-shadow(0px 5px 20px black) invert(75%)",
                    opacity: 0.5,
                },
            ],
            {
                duration: 250,
                easing: "ease-out",
            }
        );
    };

    const emphasizeImgSpecial = () => {
        imgFrontRef.current.animate(
            [
                {
                    transform: "translateX(-50%) scale(1)",
                },
                {
                    offset: 0.3,
                    transform: "translateX(-50%) scale(1.5)",
                    filter: "drop-shadow(0px 5px 20px black) invert(75%)",
                },
            ],
            {
                duration: 250,
                easing: "ease-out",
            }
        );
    };

    const updateImg = () => {
        let frameUrl: string;
        if (data.current.dead) {
            frameUrl = options.playArea.leekDeadImg;
        } else {
            const stateLength = options.playArea.leekStateImg.length;
            let targetStateIndex = Math.min(data.current.stateIndex, stateLength - 1);

            if (data.current.harvested) {
                targetStateIndex = 0;
            }
            const stateInfoList = options.playArea.leekStateImg[targetStateIndex];

            const frameLength = stateInfoList.list.length;
            const loop = stateInfoList.loop ?? true;
            const index = loop ? data.current.frame % frameLength : Math.min(data.current.frame, frameLength - 1);
            frameUrl = stateInfoList.list[index];
        }

        setImgSrc(frameUrl);
    };

    useEffect(() => {
        let requireNextFrameHandler: number;
        let lastFrame = Date.now();
        const update = () => {
            requireNextFrameHandler = requestAnimationFrame(update);
            const now = Date.now();
            const deltaTime = now - lastFrame;
            lastFrame = now;

            let frameChange = false;
            let stateChange = false;

            data.current.water += deltaTime / (1000 * 60) / options.playArea.wateringCanFillMinutes;
            data.current.water = Math.min(1, data.current.water);

            wateringCanRef.current.style.height = `${data.current.water * 100}%`;

            if (data.current.grow) {
                const deltaSecond = (data.current.during - (now - data.current.lastGrowTime)) / 1000;
                countDownRef.current.style.opacity = "1";
                countDownRef.current.innerHTML = `${Math.floor(deltaSecond / 60)
                    .toString()
                    .padStart(2, "0")}:${Math.floor(deltaSecond % 60)
                    .toString()
                    .padStart(2, "0")}`;

                if (data.current.lastFrameTime === -1) {
                    data.current.lastFrameTime = now;
                }
                if (data.current.lastStateTime === -1) {
                    data.current.lastStateTime = now;
                }

                if (now - data.current.lastStateTime > getFrameDuring(options.playArea.harvestDuring) && data.current.stateIndex < options.playArea.leekStateImg.length - 1) {
                    data.current.harvest = false;
                }

                if (now - data.current.lastStateTime > getFrameDuring(options.playArea.stateDuring)) {
                    let subNum = 1;
                    if (data.current.harvested) {
                        subNum = 2;
                    }
                    if (data.current.stateIndex < options.playArea.leekStateImg.length - subNum) {
                        data.current.stateIndex++;
                        data.current.frame = 0;
                        data.current.lastStateTime = now;
                        data.current.lastFrameTime = now;
                        stateChange = true;
                        frameChange = true;
                        data.current.harvest = true;
                    } else if (data.current.harvested) {
                        resetState();
                    }
                }
                if (now - data.current.lastFrameTime > getFrameDuring(options.playArea.frameDuring)) {
                    data.current.frame++;
                    data.current.lastFrameTime = now;
                    frameChange = true;
                }
                //
                if (stateChange) {
                    emphasizeImg();
                    if (options.playArea.leekStateImg[data.current.stateIndex].hint && !data.current.harvested) {
                        emphasizeImgSpecial();
                    }
                }
            } else {
                countDownRef.current.innerHTML = "00:00";
                countDownRef.current.style.opacity = "0";
                data.current.harvest = true;
            }
            if (now - data.current.lastGrowTime > data.current.during) {
                data.current.grow = false;
            }
            updateImg();
        };
        requireNextFrameHandler = requestAnimationFrame(update);
        return () => {
            cancelAnimationFrame(requireNextFrameHandler);
        };
    }, []);

    return (
        <div className="play-area" ref={playAreaRef}>
            <div className="count-down" ref={countDownRef}></div>
            <img className="click-area" draggable="false" src={imgSrc} alt="" ref={imgRef} style={{ opacity: 0.5 }}></img>
            <img
                ref={imgFrontRef}
                className="click-area"
                src={imgSrc}
                draggable="false"
                alt=""
                onClick={(e) => {
                    if (data.current.harvested) {
                        resetGame();
                        data.current.dead = true;
                    } else if (data.current.stateIndex === 0) {
                        resetGame();
                        data.current.dead = true;
                        emphasizeImg();
                    } else if (data.current.harvest) {
                        harvest();
                        // resetState();
                    } else {
                        shakeArea();
                    }
                }}
            ></img>
            {effectList}
            <div
                className="watering-can"
                onClick={(e) => {
                    console.log("water");
                    startGame();
                    e.currentTarget.animate(
                        [
                            { offset: 0.3, transform: "translate(-50px, -10px) rotate(-60deg) scale(0.5) " },
                            { offset: 0.8, transform: "translate(-40px, -15px) rotate(-60deg) scale(0.5) " },
                        ],
                        {
                            duration: 1500,
                            easing: "ease-out",
                        }
                    );
                }}
            >
                <div className="watering-can filled" ref={wateringCanRef}></div>
            </div>
        </div>
    );
}
