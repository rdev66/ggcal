import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import './App.css';
import Home from '../layout/Home';
import CalendarList from '../calendar/CalendarList';
import CalendarEdit from '../calendar/CalendarEdit';
import {CookiesProvider} from 'react-cookie';
import CalendarView from "../calendar/CalendarView";


interface Props {
    // your props validation
}

interface State {
    // state types
}

class App extends Component<Props, State> {
    render() {
        return (
            <CookiesProvider>
                <Router>
                    <Switch>
                        <Route path='/' exact={true} component={Home}/>
                        <Route path='/calendars' exact={true} component={CalendarList}/>
                        <Route path='/calendar/:id' component={CalendarEdit}/>
                        <Route path='/calendars/view' exact={true} component={CalendarView}/>
                    </Switch>
                </Router>
            </CookiesProvider>
        );
    }
}

export default App;