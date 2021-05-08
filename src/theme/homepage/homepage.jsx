import React from "react";
import "./homepage.css";

export default class Homepage extends React.Component {
    constructor() {
        super();
        this.state = {textIdx: 0};
    }

    render() {
        return (
            <>
                <div className={"container"}>
                    <div className={'heading'}>
                        <h1>Product Manage Project</h1>
                    </div>
                    <div className={'description'}>
                        <p>React</p>
                        <p>Hooks</p>
                        <p>Redux</p>
                        <p>React Router</p>
                    </div>
                    <div className={'desc-footer'}>
                        <p className="ls b">Developed by</p>
                        <p className="ls">Karan Panwar</p>
                    </div>
                    <button className="button-dark">Get a quote</button>
                </div>
            </>
        );
    }
}
