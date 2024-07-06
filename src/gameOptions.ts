export default {
    playArea: {
        leekStateImg: [
            {
                list: ["/images/A_00.png", "/images/A_01.png", "/images/A_02.png", "/images/A_03.png"],
            },
            {
                list: ["/images/B_01.png", "/images/B_02.png", "/images/B_03.png", "/images/B_04.png"],
                cutImg: "/images/CutB.png",
                type: "B",
            },
            {
                list: ["/images/B_01.png", "/images/B_02.png", "/images/B_03.png", "/images/B_04.png"],
                cutImg: "/images/CutB.png",
                type: "B",
            },
            {
                list: ["/images/C_01.png", "/images/C_02.png", "/images/C_03.png", "/images/C_04.png"],
                cutImg: "/images/CutC.png",
                type: "C",
                hint: true,
            },
            {
                list: ["/images/D_01.png", "/images/D_02.png"],
                loop: false,
            },
        ],
        leekDeadImg: "/images/BG.png",

        fps: 30,
        stateDuring: 20,
        harvestDuring: 15,
        frameDuring: 5,
        growDuringMinutes: 1,
        wateringCanFillMinutes: 0.1,
        defaultWater: 0.5,
    },
    hangupArea: {},
};
