import * as React from 'react';

import {Link, match, RouteComponentProps, withRouter} from 'react-router-dom';

import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../layout/AppNavbar';
import Calendar from "../interfaces/Calendar";
import {History} from 'history';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import GlencoreEvent from "../interfaces/GlencoreEvent";


interface Identifiable {
    id: string;
}

interface Props extends RouteComponentProps {
    // your props validation
    match: match<Identifiable>;
    history: History;
    cookies: Cookies;
}

interface User {
    id: string;
    name: string;
    email: string;
}

interface State {
    // state types
    calendarItem: Calendar;
    csrfToken: string;
    user: User;
}

class CalendarEdit extends React.Component<Props, State> {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    emptyCalendarItem: Calendar = {
        id: '',
        name: '',
        countryCode: '',
        bank: false,
        year: 0,
        events: [] as GlencoreEvent[]
    };

    constructor(props: Props) {
        super(props);
        const {cookies} = props;
        this.state = {
            calendarItem: this.emptyCalendarItem,
            csrfToken: cookies.get('XSRF-TOKEN'),
            user: {id: '', name: '', email: ''}
        };
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            try {
                const calendar = await (await fetch(`/api/calendar/${this.props.match.params.id}`
                    , {credentials: 'include'})).json();
                this.setState({calendarItem: calendar});
            } catch (error) {
                this.props.history.push('/');
            }
        }

        const response = await fetch('/api/user', {credentials: 'include'});
        const body = await response.text();
        this.setState({user: JSON.parse(body)})
    }

    handlePropertyChange(event: React.ChangeEvent<HTMLInputElement>) {
        console.log('called');
        let calendarItem: any;
        const target = event.target;
        const value = target.value;
        const name = target.name;
        calendarItem = {...this.state.calendarItem};
        calendarItem[name] = value;
        this.setState({calendarItem: calendarItem});
    }

    async handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const {calendarItem, csrfToken} = this.state;

        await fetch('/api/calendar', {
            method: (calendarItem.id) ? 'PUT' : 'POST',
            headers: {
                'X-XSRF-TOKEN': csrfToken,
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(calendarItem),
        });
        this.props.history.push('/calendars');
    }

    render() {
        const {calendarItem} = this.state;
        const title = <h2>{calendarItem.id ? 'Edit Calendar' : 'Add Calendar'}</h2>;

        return <div>
            <AppNavbar user={this.state.user}/>
            <Container>
                {title}
                <Form onSubmit={this.handleSubmit}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input type="text" name="name" id="name" value={calendarItem.name || ''}
                               onChange={this.handlePropertyChange} autoComplete="name"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="countryCode">Country Code</Label>
                        <Input type="text" name="countryCode" id="countryCode" value={calendarItem.countryCode || ''}
                               onChange={this.handlePropertyChange} autoComplete="countryCode-level1"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="year">Year</Label>
                        <Input type="text" name="year" id="year" value={calendarItem.year || ''}
                               onChange={this.handlePropertyChange} autoComplete="year-level1"/>
                    </FormGroup>
                    <FormGroup>
                        <Label for="bank">Bank</Label>
                        <Input type="text" name="bank" id="bank" value={calendarItem.bank.toString() || ''}
                               onChange={this.handlePropertyChange} autoComplete="bank-level1"/>
                    </FormGroup>
                    <FormGroup>
                        <Button color="primary" type="submit">Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/calendars">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
        </div>
    }
}

export default withCookies(withRouter(CalendarEdit));
