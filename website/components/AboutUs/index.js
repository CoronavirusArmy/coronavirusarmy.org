import React from "react";
import { Button } from "reactstrap";
import { connect } from "react-redux";

const AboutUs = ({ user, loggedIn }) => {
    
    return (
        <div className="about-us">
            <img src="/img/virus-image-cover.png" alt="" />
            <div className="content">
                <h4 className="title">About Us</h4>
                <p className="mb-4">CoronavirusArmy is a grassroots volunteer initiative that is organizing in response to the global Coronavirus (COVID-19) pandemic. You can join as a volunteer to help us fight this global pandemic and to be a part of our mission to save lives and provide relief to those suffering.</p>
                {!loggedIn && !user && (
                    <div>
                        <Button tag="a" href="/sign-up" block className="btn-default">
                            Join Us
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    const { user, loggedIn } = state.authentication;
    return { user, loggedIn };
};

export default connect(mapStateToProps)(AboutUs);
