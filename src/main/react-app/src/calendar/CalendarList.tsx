import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from '../layout/AppNavbar';
import {Link} from 'react-router-dom';
import * as React from "react";
import Calendar from "../interfaces/Calendar";


interface Props {
    // your props validation
}

interface State {
    // state types
    isLoading: boolean;
    calendars: Calendar[];
}

export default class CalendarList extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = ({isLoading: true, calendars: []});
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {

        this.setState({isLoading: true});

        fetch('api/calendars')
            .then(response => response.json())
            .then(data => this.setState({calendars: data, isLoading: false}));
    }

    async remove(calendarItem: Calendar) {
        console.log('Calendar: ' + calendarItem);
        await fetch('api/calendar', {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(calendarItem)
        }).then(() => {
            const updatedCalendars = [...this.state.calendars].filter(i => i.id !== calendarItem.id);
            this.setState({calendars: updatedCalendars});
        });
    }

    render() {
        const {calendars, isLoading} = this.state;

        if (isLoading) {
            return <p>Loading...</p>;
        }

        const CalendarList = calendars.map(calendar => {
            return <tr key={calendar.id}>
                <td style={{whiteSpace: 'nowrap'}}>{calendar.name}</td>
                <td>{calendar.countryCode}</td>
                <td>{calendar.events.map(event => {
                    return <div key={event.id}>{new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(event.startDate))}: {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(event.endDate))} {event.summary}</div>
                })}</td>
                <td>{calendar.bank.toString()}</td>
                <td>
                    <ButtonGroup>
                        <Button size="sm" color="primary" tag={Link} to={"/calendar/" + calendar.id}>Edit</Button>
                        <Button size="sm" color="danger" onClick={() => this.remove(calendar)}>Delete</Button>
                    </ButtonGroup>
                </td>
            </tr>
        });

        return (
            <div>
                <AppNavbar/>
                <Container fluid>
                    <div className="float-right">
                        <Button color="success" tag={Link} to="/calendar/new">Add Calendar</Button>
                    </div>
                    <h3>My Calendars</h3>
                    <Table className="mt-4">
                        <thead>
                        <tr>
                            <th data-width="20%">Name</th>
                            <th data-width="10%">Country</th>
                            <th>Events</th>
                            <th data-width="10%">Bank Holidays</th>
                        </tr>
                        </thead>
                        <tbody>
                        {CalendarList}
                        </tbody>
                    </Table>
                </Container>
            </div>
        );
    }
}