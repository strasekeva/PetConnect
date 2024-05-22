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
