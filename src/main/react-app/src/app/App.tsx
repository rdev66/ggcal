import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Home from '../layout/Home';
import CalendarList from '../calendar/CalendarList';
import CalendarEdit from '../calendar/CalendarEdit';


interface Props {
    // your props validation
}

interface State {
    // state types
}

class App extends Component<Props, State> {
    render() {
        return (
            <Router>
                <Switch>
                    <Route path='/' exact={true} component={Home}/>
                    <Route path='/calendars' exact={true} component={CalendarList}/>
                    <Route path='/calendar/:id' component={CalendarEdit}/>
                </Switch>
            </Router>
        );
    }
}

export default App;