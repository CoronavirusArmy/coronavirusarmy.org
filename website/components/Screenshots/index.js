import React, { useState, useEffect } from "react";
import { Spinner } from "reactstrap";

import { UserService } from "../../services/User";
import CustomPagination from "../../components/CustomPagination";
import ScreenshotLists from "./Components/List";

const Screenshots = ({ userId }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [screenshots, setScreenshots] = useState(null);

    const getData = page => {
        if (!data || (data && page !== data.page)) {
            setLoading(true);
            UserService.screenshots(userId, page)
                .then(res => {
                    setLoading(false);
                    setData(res.screenshots);
                    setScreenshots(res.screenshots.docs);
                })
                .catch(err => {
                    setLoading(false);
                });
        }
    };

    useEffect(() => {
        getData(1);
    }, [userId]);

    return (
        <div className="screenshots">
            {loading && (
                <div className="text-center">
                    <Spinner size="sm" />
                </div>
            )}
            {!loading && data && data.totalDocs > 0 && (
                <div className="mt-5">
                    <h4 className="mb-4">Screenshots</h4>
                    <ScreenshotLists screenshots={screenshots} />
                    <div className="mt-5 float-right">
                        <CustomPagination callback={getData} {...data} />
                    </div>
                    <div className="clearfix"></div>
                </div>
            )}
        </div>
    );
};

export default Screenshots;
