import React, { useState } from 'react';
import Navbar from "components/Navbars/Navbar.js";
import SimpleFooter from "components/Footers/SimpleFooter.js";
import CardsFooter from "components/Footers/CardsFooter.js";
import { InlineWidget } from "react-calendly";

class Koledar extends React.Component {
    componentDidMount() {
        document.documentElement.scrollTop = 0;
        document.scrollingElement.scrollTop = 0;
        this.refs.main.scrollTop = 0;
      }
    render() {
        return (
            <>
            <Navbar />
            <section className="section section-shaped section-lg">
                <div className="shape shape-style-1 shape-default alpha-4">
                <span />
                </div>
            </section>
            <main ref="main">
                <div className="container mt-5">
                <h2>Koledar</h2>
                <InlineWidget url="https://calendly.com/zupanclara03" styles={{height: '700px'}} />
            </div>
            </main>
            <CardsFooter />
            </>
        );
    }
}

export default Koledar;
