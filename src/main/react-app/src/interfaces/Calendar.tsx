import GlencoreEvent from './GlencoreEvent';

interface Calendar {
    id: string
    name: string;
    countryCode: string;
    year: number;
    events: GlencoreEvent[];
    externalCalendarUrl: string;
    subscription: string;
}

export default Calendar;