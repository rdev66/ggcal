import * as React from 'react';

import {Link, match, RouteComponentProps, withRouter} from 'react-router-dom';

import {Button, Container, Form, FormGroup, Input, Label, Modal} from 'reactstrap';
import AppNavbar from '../layout/AppNavbar';
import MyCalendar from "../interfaces/Calendar";
import GlencoreEvent from "../interfaces/GlencoreEvent";
import {History} from 'history';
import {instanceOf} from 'prop-types';
import {Cookies, withCookies} from 'react-cookie';
import Calendar from "react-big-calendar";
import BigCalendar from "react-big-calendar";
import moment from "moment";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop/withDragAndDrop";

import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

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
    calendarItem: MyCalendar;
    //csrfToken: string;
    user: User;
    modalIsOpen: boolean;
    selection: any;
}

moment.locale('ko', {
    week: {
        dow: 1,
        doy: 1,
    },
});
const localizer = BigCalendar.momentLocalizer(moment);


const DnDCalendar = withDragAndDrop(Calendar);

class CalendarEdit extends React.Component<Props, State> {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };

    emptyCalendarItem: MyCalendar = {
        id: '',
        name: '',
        countryCode: '',
        year: 0,
        events: [] as GlencoreEvent[],
        externalCalendarUrl: '',
        subscription: ''
    };

    constructor(props: Props) {
        super(props);
        const {cookies} = props;
        this.state = {
            modalIsOpen: false,
            calendarItem: this.emptyCalendarItem,
            selection: {},
            user: {id: '', name: '', email: ''},
        };
        this.handlePropertyChange = this.handlePropertyChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleSelectionChange = this.handleSelectionChange.bind(this);
        this.saveEvent = this.saveEvent.bind(this);

    }


    async componentDidMount() {
        if (this.props.match.params.id !== 'new') {
            try {
                const calendar = await (await fetch(`/api/calendar/${this.props.match.params.id}`
                    , {credentials: 'include'})).json();
                this.setState({calendarItem: calendar});
            } catch (error) {
                console.log(error);
                this.props.history.push('/');
            }
        }

        const response = await fetch('/api/user', {credentials: 'include'});
        const body = await response.text();
        this.setState({user: JSON.parse(body)})
    }

    handlePropertyChange(event: React.ChangeEvent<HTMLInputElement>) {
        let calendarItem: any;
        const target = event.target;
        const value = target.value;
        const name = target.name;
        calendarItem = {...this.state.calendarItem};
        calendarItem[name] = value;
        this.setState({calendarItem: calendarItem});
    }


    handleSelectionChange(event: React.ChangeEvent<HTMLInputElement>) {
        let selectionItem: any;
        const target = event.target;
        const value = target.value;
        const name = target.name;
        selectionItem = {...this.state.selection};
        selectionItem[name] = value;
        this.setState({selection: selectionItem});
    }


    async handleSubmit(event: React.FormEvent) {
        event.preventDefault();
        const {calendarItem} = this.state;

        console.log(JSON.stringify(calendarItem));

        await fetch('/api/calendar', {
            method: (calendarItem.id) ? 'PUT' : 'POST'
            , headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN': this.props.cookies.get('XSRF-TOKEN')
            }
            , credentials: 'include'
            , body: JSON.stringify(calendarItem)
        });

        this.props.history.push('/calendars');
    }


    onEventDrop = ({event, start, end, allDay}: any) => {
        console.log(start);
    };

    handleSelect = (e: any) => {
        this.openModal(e);
    };

    openModal = (e: any) => {
        this.setState({modalIsOpen: true, selection: e});
    };

    saveEvent = (e: any) => {
        console.log(e);
        this.state.calendarItem.events.push({
            id: 0,
            calendarId: this.state.calendarItem.id,
            title: e.target.value,
            start: new Date(),
            end: new Date()
        });
        this.closeModal();
    };

    closeModal = () => {
        this.setState({modalIsOpen: false});
    };

    getStartState() {
        return "Event: ";
    }

    render() {
        const {calendarItem} = this.state;
        const title = <h2>{calendarItem.id ? 'Edit MyCalendar' : 'Add MyCalendar'}</h2>;

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
                    {(!calendarItem.id) ?
                        <FormGroup>
                            <Label for="externalCalendarUrl">Import external calendar file</Label>
                            <Input type="text" name="externalCalendarUrl" id="externalCalendarUrl"
                                   value={calendarItem.externalCalendarUrl || ''}
                                   onChange={this.handlePropertyChange} autoComplete="externalCalendarUrl-level1"/>
                        </FormGroup>

                        :

                        <DnDCalendar
                            selectable={true}
                            defaultDate={new Date()}
                            defaultView="month"
                            localizer={localizer}
                            events={this.state.calendarItem.events}
                            onEventDrop={this.onEventDrop}
                            style={{height: "100vh"}}
                            onSelectSlot={this.handleSelect}
                        />
                    }
                    <FormGroup>
                        <Button color="primary" onClick={this.handleSubmit}>Save</Button>{' '}
                        <Button color="secondary" tag={Link} to="/calendars">Cancel</Button>
                    </FormGroup>
                </Form>
            </Container>
            <Modal
                isOpen={this.state.modalIsOpen}
                onClosed={this.closeModal}
                labelledBy={this.getStartState()}>
                <div>Event:</div>
                <FormGroup>
                    <Label for="name">Event Name</Label>
                    <Input type="text" name="name" id="name"
                           onChange={this.handleSelectionChange} autoComplete="name"/>
                </FormGroup>
                <button className={"btn btn-primary"} onClick={this.saveEvent}>Save</button>
                <button className={"btn btn-secondary"} onClick={this.closeModal}>Cancel</button>
            </Modal>
        </div>
    }
}

export default withCookies(withRouter(CalendarEdit));
