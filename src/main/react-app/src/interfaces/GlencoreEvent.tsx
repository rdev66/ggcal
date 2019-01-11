import Event from './Event'

interface GlencoreEvent extends Event {
    calendarId: string;
}

export default GlencoreEvent;