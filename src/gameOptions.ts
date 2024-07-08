export default {
    fps: 30,

    playArea: {
        leekStateImg: [
            {
                list: ["/images/A_00.png", "/images/A_01.png", "/images/A_02.png", "/images/A_03.png"],
                count: 1,
            },
            {
                list: ["/images/B_01.png", "/images/B_02.png", "/images/B_03.png", "/images/B_04.png"],
                cutImg: "/images/CutB.png",
                type: "B",
                count: 2,
            },
            {
                list: ["/images/B_01.png", "/images/B_02.png", "/images/B_03.png", "/images/B_04.png"],
                cutImg: "/images/CutB.png",
                type: "B",
                count: 2,
            },
            {
                list: ["/images/C_01.png", "/images/C_02.png", "/images/C_03.png", "/images/C_04.png"],
                cutImg: "/images/CutC.png",
                type: "C",
                hint: true,
                count: 5,
            },
            {
                list: ["/images/D_01.png", "/images/D_02.png"],
                loop: false,
                count: 0,
            },
        ],
        leekDeadImg: "/images/BG.png",

        stateDuring: 20,
        harvestDuring: 15,
        frameDuring: 5,
        growDuringMinutes: 1,
        wateringCanFillMinutes: 1,
        defaultWater: 0.5,
    },
    hangupArea: {
        eachPlateCost: 5,
        beltMoveDuring: 20,
        plate: {
            size: 6,
            waitDuring: 120,
            goTransportDuring: 0,
            readyDuring: 0,
            mealDuring: 60,
        },
        cook:{
            roleList:[
                "/images/cook/Back_0.png",
                "/images/cook/Back_1.png",
                "/images/cook/Back_2.png",
                "/images/cook/Back_3.png",
                "/images/cook/Back_4.png",
                "/images/cook/Back_5.png",
                "/images/cook/Back_6.png",
                "/images/cook/Back_7.png",
            ],
            hand:[
                "/images/cook/Front_0.png",
                "/images/cook/Front_1.png",
                "/images/cook/Front_2.png",
                "/images/cook/Front_3.png",
                "/images/cook/Front_4.png",
                "/images/cook/Front_5.png",
                "/images/cook/Front_6.png",
                "/images/cook/Front_7.png",
            ]
        },
        custom: {
            max: 5,
            maxCooldown: 120,
            minCooldown: 50,
            finishWaitDuring: 30,
            types: [
                { body: ["/images/customA/0.png", "/images/customA/1.png", "/images/customA/2.png", "/images/customA/3.png"], hand: ["/images/customA/h0.png", "/images/customA/h1.png", "/images/customA/h2.png", "/images/customA/h3.png"] },
                { body: ["/images/customB/0.png", "/images/customB/1.png", "/images/customB/2.png", "/images/customB/3.png"], hand: ["/images/customB/h0.png", "/images/customB/h1.png", "/images/customB/h2.png", "/images/customB/h3.png"] },
                { body: ["/images/customC/0.png", "/images/customC/1.png", "/images/customC/2.png", "/images/customC/3.png"], hand: ["/images/customC/h0.png", "/images/customC/h1.png", "/images/customC/h2.png", "/images/customC/h3.png"] },
                { body: ["/images/customD/0.png", "/images/customD/1.png", "/images/customD/2.png", "/images/customD/3.png", "/images/customD/4.png", "/images/customD/5.png", "/images/customD/6.png", "/images/customD/7.png"], hand: ["/images/customD/h0.png", "/images/customD/h1.png", "/images/customD/h2.png", "/images/customD/h3.png", "/images/customD/h4.png", "/images/customD/h5.png", "/images/customD/h6.png", "/images/customD/h7.png"] },
            ],
        },
    },
};
