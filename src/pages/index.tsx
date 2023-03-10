import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import axios from "axios";
import { CurrentEventData, EventData } from "lib/types";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import EventForm from "components/EventForm";
import { findEvent } from "lib/functions";

type Props = {
  events: EventData[];
};

function renderEventContent(eventInfo) {
  return (
    <>
      <b className="event-time">{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

const App: React.FC<Props> = ({ events: propEvents }) => {
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [state, setState] = React.useState<{
    currentEvents: CurrentEventData[];
  }>({
    // Set initial state of calendar events to propEvents from server
    currentEvents: propEvents?.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      date: event.start_date,
      end: event.end_date,
      start_date: event.start_date,
      end_date: event.end_date,
      classNames: ["event-date"],
    })),
  });
  const [selectedEventInfo, setSelectedEventInfo] = useState(null);

  // Handle event click on calendar to open modal form to edit event
  const handleEventClick = (eventInfo) => {
    setEditMode(true);

    // Find event in propEvents array to get a particular event data to pass to modal form
    const event = findEvent(
      state.currentEvents as unknown as EventData[],
      eventInfo.event.id
    );

    /**
     * There is a side effect where, when an event is first created without reload,
     * the event is not added to the `currentEvents` state and this will cause the `findEvent` function to return undefined...
     * A solution for this is the `findAndUpdateCurrentEvents` but this is also introduces a complication where the calendar view misbehaves.
     * All these is due to the Fullcalendar Package, this issues can be solved by using a custom package or a different reliable one.
     **/

    setOpenModal(true);
    const newEventInfo = {
      ...eventInfo,
      ...event,
      startStr: eventInfo.startStr,
      view: eventInfo.view,
    };
    setSelectedEventInfo(newEventInfo);
  };

  // Handle date selection on calendar to open modal form to add event or edit event if editMode is true
  const handleDateSelect = (selectedEventInfo) => {
    setEditMode(false);
    setOpenModal(true);
    setSelectedEventInfo(selectedEventInfo);
  };

  return (
    <Layout>
      <div className="page">
        <h1 className="py-3.5 px-4.5 text-2xl text-center">
          Gabriel's Calendar Event
        </h1>
        <h4 className="mb-4 text-md text-center text-gray-500">
          Click on a date to add an event
        </h4>
        <main>
          <div className="Calendar-Container">
            {/* Render Event Form modal Component */}
            <EventForm
              selectedEventInfo={selectedEventInfo}
              openModal={openModal}
              setOpenModal={setOpenModal}
              editMode={editMode}
              setState={setState}
              currentEvents={state.currentEvents}
            />

            {/* Render Calendar Component */}
            <FullCalendar
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              headerToolbar={{
                left: "prev,next today",
                center: "title",
                right: "dayGridMonth,timeGridWeek,timeGridDay",
              }}
              editable={true}
              selectable={true}
              // @ts-ignore
              events={state.currentEvents}
              select={handleDateSelect}
              eventClick={handleEventClick}
              eventContent={renderEventContent} // custom render function
            />
          </div>
        </main>
      </div>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Fetch all events before page renders
  const events = await axios.get(
    "https://kalendar-events.vercel.app/api/event"
  );

  return {
    props: { events: events.data },
  };
};

export default React.memo(App);
