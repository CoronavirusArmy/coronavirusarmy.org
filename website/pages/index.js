import React from "react";
import { Row, Col } from "reactstrap";

import QuestionAnswer from "../components/QuestionAnswer";
import AboutUs from "../components/AboutUs";
import LatestVolunteers from "../components/LatestVolunteers";

const Home = () => {
    const questions = [
        {
            q: `How can volunteers on the internet make a difference?`,
            a: `There are thousands of ways we can help. We will prioritize requests from front-line medical workers. We will also work to stop big events that spread infections, we will work to help teachers and employers implement remote-teaching and work-from-home, work to pressure governments to act and hold them accountable, work to petition shame and initiate boycotts for companies that won’t let employees wear masks or work-from-home when feasible, and much more!`
        },
        {
            q: `We are on the front-lines fighting the coronavirus, can you help us?`,
            a: `Absolutely! If you have an opportunity for us to volunteer to help in the fight against this pandemic please contact us immediately! We will triage and prioritize requests daily so that we can focus on the ones that seem the most urgent and impactful.`
        },
        {
            q: `I would volunteer but I’m not sure I have the skills you’re looking for`,
            a: `You don't need any special skills to volunteer with us! The only requirement is a desire to make a difference in this pandemic! Of course, if you do happen to be an Epidemiologist that would be awesome too.`
        },
        {
            q: `Can I donate money?`,
            a: `No, sorry. Right now we’re not even incorporated; we’re just trying to organize some grassroot efforts. We hope to incorporate as a non-profit soon.`
        }
    ];

    return (
        <Row className="mt-5 pt-3 homepage">
            <Col sm="12" className="mb-4">
                <h2 className="page-title">Volunteer to Fight the Coronavirus Pandemic</h2>
            </Col>
            <Col md="12" lg="5" xl="4" className="mb-4">
                <AboutUs />
            </Col>
            <Col md="12" lg="7" xl="8" className="mb-4">
                {questions.map((item, i) => {
                    return <QuestionAnswer key={`question-${i}`} question={item.q} answer={item.a} />;
                })}
            </Col>
        </Row>
    );
};

export default Home;
