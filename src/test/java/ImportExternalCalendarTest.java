import lombok.extern.slf4j.Slf4j;
import net.fortuna.ical4j.data.CalendarBuilder;
import net.fortuna.ical4j.data.ParserException;
import net.fortuna.ical4j.model.Calendar;
import net.fortuna.ical4j.model.ComponentList;
import net.fortuna.ical4j.model.component.CalendarComponent;
import net.fortuna.ical4j.model.component.VEvent;
import org.assertj.core.util.Lists;
import org.junit.Test;

import java.io.IOException;
import java.io.InputStreamReader;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.List;

@Slf4j
public class ImportExternalCalendarTest {

    @Test
    public void importExternalCalendarTest() {
        importExternalCalendar();
    }

    private List<VEvent> importExternalCalendar() {

        URL calUrl;
        try {
            calUrl = new URL("https://fcal.ch/privat/fcal_holidays.ics?hl=en&klasse=5&geo=2861");
        } catch (MalformedURLException mue) {
            log.error("Bad URL", mue);
            return null;
        }

        try (InputStreamReader in = new InputStreamReader(calUrl.openStream())) {

            CalendarBuilder builder = new CalendarBuilder();

            Calendar importedCal = builder.build(in);

            ComponentList<CalendarComponent> cs = importedCal.getComponents();

            cs.stream().filter(component -> component instanceof VEvent)
                    .forEach(this::prettyPrintEvent);

        } catch (IOException ioe) {
            log.error("IOE", ioe);
        } catch (ParserException ioe) {
            log.error("PE", ioe);
        }
        return Lists.newArrayList();
    }

    private void prettyPrintEvent(CalendarComponent calendarComponent) {
        VEvent event = (VEvent) calendarComponent;
        log.info("Event name: {}, dates: from {} - to {} ", event.getSummary(), event.getStartDate().getDate(), event.getEndDate().getDate());
    }
}
