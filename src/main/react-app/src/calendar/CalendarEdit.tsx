import * as React from 'react';

import {Link, match, RouteComponentProps, withRouter} from 'react-router-dom';

import {Button, Container, Form, FormGroup, Input, Label} from 'reactstrap';
import AppNavbar from '../layout/AppNavbar';
import Calendar from "../interfaces/Calendar";
import {History} from 'history';
import GlencoreEvent from "../interfaces/GlencoreEvent";


interface Identifiable {
    id: string;
}

interface Props extends RouteComponentProps {
    // your props validation
    match: match<Identifiable>;
    history: History;
}

interface State {
    // state types
    calendarItem: Calendar;
}

class CalendarEdit extends React.Component<Props, State> {

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
        this.state = {
            calendarItem: this.emptyCalendarItem
        };
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            const group = await (await fetch(`/api/group/${this.props.match.params.id}`)).json();
            this.setState({calendarItem: group});
        }
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
        const {calendarItem} = this.state;

        await fetch('/api/calendar', {
            method: (calendarItem.id) ? 'PUT' : 'POST',
            headers: {
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
            <AppNavbar/>
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

const WithRouterComponentClass = withRouter(CalendarEdit);

export default WithRouterComponentClass;