import {RouteComponentProps} from 'react-router-dom';
import * as React from "react";
import Calendar from "../interfaces/Calendar";
import {instanceOf} from 'prop-types';
import {Cookies} from 'react-cookie';
import BigCalendar from "react-big-calendar";
import moment from 'moment';

const localizer = BigCalendar.momentLocalizer(moment);

interface Props extends RouteComponentProps {
    // your props validation
    cookies: Cookies;
}

interface State {
    // state types
    isLoading: boolean;
    calendar: Calendar;

}

interface Event {
//    id: 10,
//    title: 'Dinner',
//    start: new Date(2015, 3, 12, 20, 0, 0, 0),
//    end: new Date(2015, 3, 12, 21, 0, 0, 0),
    id: number;
    title: string;
    start: Date;
    end: Date;
}

export default class CalendarView extends React.Component<Props, State> {

    static propTypes = {
        cookies: instanceOf(Cookies).isRequired
    };


    componentDidMount() {

        this.setState({isLoading: true});

        fetch('api/calendar/1', {credentials: 'include'})
            .then(response => response.json())
            .then(data => this.setState({calendar: data, isLoading: false}))
            .catch(() => this.props.history.push('/'));
    }

    constructor(props: Props) {
        super(props);
        const {cookies} = props;

        this.state = {
            calendar: {} as Calendar,
            isLoading: true
            //csrfToken: cookies.get('XSRF-TOKEN'),
            //user: {id: '', name: '', email: ''}
        };
    }

    render() {
        return <div>
            <BigCalendar
                localizer={localizer}
                events={this.state.calendar.events}
                startAccessor="start"
                endAccessor="end"
            />
        </div>
    }
}