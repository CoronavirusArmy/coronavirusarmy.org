import React from "react";
import App from "next/app";
import withRedux from "next-redux-wrapper";
import { Container } from "reactstrap";
import { Provider } from "react-redux";
import { ToastContainer } from 'react-toastify';

import "../Styles/App.scss";
import Head from '../components/Head';
import Header from '../components/Header';
import { initGA, logPageView } from '../helpers/analytics';
import { store } from "../helpers/Store";

export default withRedux(store)(

    class MyApp extends App {

        componentDidMount () {
            if (!window.GA_INITIALIZED) {
            initGA()
            window.GA_INITIALIZED = true
            }
            logPageView()
        }

        render() {
            const { Component, pageProps, store } = this.props;

            return (
                <Provider store={store}>
                    <ToastContainer />
                    <Head title="CoronavirusArmy" />
                    <Header />
                    <Container>
                        <Component {...pageProps} />
                    </Container>
                </Provider>
            )
        }

    }

)