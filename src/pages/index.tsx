import React, { useState } from "react";
import { GetServerSideProps } from "next";
import Layout from "../components/Layout";
import axios from "axios";
import { EventData } from "lib/types";
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
  const [state, setState] = React.useState({
    // Set initial state of calendar events to propEvents from server
    currentEvents: propEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: event.start_date,
      end: event.end_date,
      classNames: ["event-date"],
    })),
  });
  const [selectInfo, setSelectInfo] = useState(null);

  // Handle event click on calendar to open modal form to edit event
  const handleEventClick = (clickInfo) => {
    setEditMode(true);
    // Find event in propEvents array to get a particular event data to pass to modal form
    const event = findEvent(propEvents, clickInfo.event.id);
    setOpenModal(true);
    setSelectInfo({
      ...clickInfo,
      ...event,
      startStr: clickInfo.startStr,
      view: clickInfo.view,
    });
  };

  // Handle date selection on calendar to open modal form to add event or edit event if editMode is true
  const handleDateSelect = (selectInfo) => {
    setEditMode(false);
    setOpenModal(true);
    setSelectInfo(selectInfo);
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
              selectInfo={selectInfo}
              openModal={openModal}
              setOpenModal={setOpenModal}
              editMode={editMode}
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
  // @ts-ignore
  const events = await axios.get("http://localhost:3000/api/event");

  return {
    props: { events: events.data },
  };
};

export default React.memo(App);
