import Ambassadors from "./models/ambassadorModel.js";

const sortXPSeason3 = async () => {
    try {
        const ambassadors = await Ambassadors.find({});

        let count: number = 0;

        if (ambassadors.length > 0) {
            for (let ambassador of ambassadors) {
                ambassador.XP = ambassador.XP + ambassador.season1XP;
                ambassador.maxXP = ambassador.XP;
                await ambassador.save();
                count++
            }
        }

        if (count === ambassadors.length) {
            console.log("XP SUCCESSFULLY SORTED");
        }
    } catch(error: unknown) {
        console.log(error);
    }
}

await sortXPSeason3();