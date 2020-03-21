import dotenv from "dotenv";
import request from "request";

import User from "../models/user";

dotenv.config();

const getInSyncData = () => {
    return new Promise((resolve, reject) => {
        const options = {
            uri: `https://api.insync.team/coronavirus/data/${process.env.INSYNC_KEY}`,
            method: "GET",
        };
        request(options, function optionalCallback(err, response, body) {
            if (!err && response.statusCode === 200) {
                resolve(JSON.parse(body));
            } else {
                resolve(null);
            }
        });
    });
};

const sync = async () => {

    try {   
        const res = await getInSyncData();
        if(res) {
            const promises = res.map(r => User.updateOne({email: r.user.email}, {$set: {time: r.totalSeconds}}));
            await Promise.all(promises);
        }
    } finally {
        setTimeout(() => {
            sync();
        }, 1000 * 90);
    }

}

export const cron = () => {

    sync();

}