import * as React from 'react';
import '../app/App.css';
import AppNavbar from './AppNavbar';
import {Link, match} from 'react-router-dom';
import {Button, Container} from 'reactstrap';
import {History} from "history";
import Calendar from "../interfaces/Calendar";

interface Identifiable {
    id: string;
}

interface Props {
    // your props validation
    match: match<Identifiable>;
    history: History;
}

interface State {
    // state types
    isLoading: boolean;
    calendars: Calendar[];
}

export default class Home extends React.Component<Props, State> {
    render() {
        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <Button color="link"><Link to="/calendars">Manage Calendars</Link></Button>
                </Container>
            </div>
        );
    }
}