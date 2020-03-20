import React, { useState, useEffect } from "react";
import { Row, Col, Card, CardHeader, CardFooter, CardBody } from "reactstrap";
import moment from "moment";
import ScreenshotCarousel from "./Carousel";

const ScreenshotLists = ({ screenshots }) => {
    const [carousel, setCarousel] = useState(false);
    const [active, setActive] = useState("");

    const escFunction = _event => {
        if (_event.keyCode === 27) {
            setCarousel(false);
            setActive("");
        }
    };

    const showCarousel = _img => {
        setCarousel(true);
        setActive(_img);
    };

    const hasImage = screenshots => {
        return screenshots.some(s => s.trim() !== '');
    }

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        () => {
            document.removeEventListener("keydown", escFunction, false);
        };
    }, []);

    return (
        <div className="page-screenshots">
            {screenshots && screenshots.length > 0 && (
                <React.Fragment>
                    {carousel && <ScreenshotCarousel items={screenshots} active={active} />}
                    <Row className="items">
                        {screenshots.map(screenshot => {
                            return (
                                <React.Fragment>
                                    {hasImage(screenshot.screenshots) && <Col className="item mb-3" sm="12" lg="4" key={screenshot._id}>
                                        <Card>
                                            <CardHeader>{moment(screenshot.start).format("LLL")}</CardHeader>
                                            <CardBody>
                                                {(() => {
                                                    if (screenshot.screenshots.length > 0) {
                                                        return screenshot.screenshots.map(img => {
                                                            return (
                                                                <img
                                                                    className="pointer"
                                                                    onClick={() => {
                                                                        showCarousel(img);
                                                                    }}
                                                                    key={img}
                                                                    src={img}
                                                                />
                                                            );
                                                        });
                                                    } else {
                                                        return <img src="/img/no-image-available.png" />;
                                                    }
                                                })()}
                                            </CardBody>
                                            <CardFooter>
                                                {screenshot.job.title} - {screenshot.task ? screenshot.task : "No Task"}
                                            </CardFooter>
                                        </Card>
                                    </Col>}
                                </React.Fragment>
                            );
                        })}
                    </Row>
                </React.Fragment>
            )}
        </div>
    );
};

export default ScreenshotLists;
