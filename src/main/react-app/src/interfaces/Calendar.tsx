import GlencoreEvent from './GlencoreEvent';

interface Calendar {
    id: string
    name: string;
    countryCode: string;
    bank: boolean;
    year: number;
    events: GlencoreEvent[];
    externalCalendarUrl: URL;
}

export default Calendar;