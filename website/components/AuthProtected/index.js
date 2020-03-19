import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { Container, Alert, Spinner } from "reactstrap";

const AuthProtected = ({ children, loggedIn }) => {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setLoading(false);
    }, []);

    return (
        <Container>
            {loading && (
                <div className="mt-5 text-center">
                    <Spinner size="sm"/>
                </div>
            )}
            {!loading && !loggedIn && (
                <div className="mt-5">
                    <Alert color="danger">Forbidden</Alert>
                </div>
            )}
            {!loading && loggedIn && <React.Fragment>{children}</React.Fragment>}
        </Container>
    );
};

const mapStateToProps = state => {
    const { loggedIn } = state.authentication;
    return { loggedIn };
};

export default connect(mapStateToProps)(AuthProtected);
