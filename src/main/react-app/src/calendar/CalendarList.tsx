import {Button, ButtonGroup, Container, Table} from 'reactstrap';
import AppNavbar from '../layout/AppNavbar';
import {Link, RouteComponentProps, withRouter} from 'react-router-dom';
import * as React from "react";
import Calendar from "../interfaces/Calendar";
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';

interface Props extends RouteComponentProps {
    // your props validation
    cookies: Cookies;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface State {
    // state types
    isLoading: boolean;
    calendars: Calendar[];
    csrfToken: string;
    user: User;
}

class CalendarList extends React.Component<Props, State> {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    constructor(props: Props) {
        super(props);
        const {cookies} = props;

        this.state = {
            calendars: [],
            isLoading: true,
            csrfToken: cookies.get('XSRF-TOKEN'),
            user: {id: '', name: '', email: ''}
        };
        this.remove = this.remove.bind(this);
    }

    componentDidMount() {

        this.setState({isLoading: true});

        fetch('api/calendars', {credentials: 'include'})
            .then(response => response.json())
            .then(data => this.setState({calendars: data, isLoading: false}))
            .catch(() => this.props.history.push('/'));
    }

    async remove(calendarItem: Calendar) {
        console.log('Calendar: ' + calendarItem);
        await fetch('api/calendar', {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': this.state.csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include',
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
                    }).format(new Date(event.start))}: {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: '2-digit'
                    }).format(new Date(event.end))} {event.title}</div>
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
                <AppNavbar user={this.state.user} csrfToken={this.state.csrfToken}/>
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

export default withCookies(withRouter(CalendarList));
