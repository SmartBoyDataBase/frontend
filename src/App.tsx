import React from "react";
import {HashRouter, Route, Switch} from "react-router-dom";
import SignIn from "./view/Superuser/SignIn";
import Main from "./layout/Main";

const App = () => {
    return (
        <HashRouter>
            <Switch>
                <Route exact path="/login" component={SignIn}/>
                <Route path="/" component={Main}/>
            </Switch>
        </HashRouter>
    );
};

export default App;
