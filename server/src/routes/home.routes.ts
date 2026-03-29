import { Router } from "express";

export const homeRouter = Router();

homeRouter.get("/:homeId/state", (req, res) => {
    const { homeId } = req.params;
    res.json({
        homeId,
        updatedAt: new Date(),
        sensors: {
            temp_fridge: {
                name: "Lodówka",
                value: 6,
                unit: "°C",
                online: true,
                lastSeen: new Date(),
            },
            temp_balcony: {
                name: "Balkon",
                value: 20,
                unit: "°C",
                online: true,
                lastSeen: new Date(),
            },  
            temp_room: {
                name: "Pokój",
                value: 21.3,
                unit: "°C",
                online: true,
                lastSeen: new Date(),
            },
            humidity_room: {
                name: "Wilgotność",
                value: 45,
                unit: "%",
                online: true,
                lastSeen: new Date(),
            },
            power_total: {
                name: "Pobór mocy",
                value: 374.8,
                unit: "W",
                online: true,
                lastSeen: new Date(),
            },
        },
        security: {
            door_main: {
                name: "Drzwi wejściowe",
                state: "closed",
                online: true,
                lastSeen: new Date(),
            },
            alarm: {
                armed: false,
                triggered: false,
            },  
        },
        alerts: [],
    });
});