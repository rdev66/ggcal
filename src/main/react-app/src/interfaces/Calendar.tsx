import GlencoreEvent from './GlencoreEvent';

interface Calendar {
    id: string
    name: string;
    countryCode: string;
    bank: boolean;
    year: number;
    events: GlencoreEvent[];
}

export default Calendar;