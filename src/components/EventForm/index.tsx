import axios, { AxiosResponse } from "axios";
import { findAndUpdateCurrentEvents } from "lib/functions";
import { CurrentEventData, EventData } from "lib/types";
import React, {
  Dispatch,
  SetStateAction,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Modal from "../Modal";
import FormElements from "./FormElements";

function EventForm({
  openModal,
  setOpenModal,
  selectedEventInfo,
  editMode = false,
  setState,
  currentEvents = [],
}: {
  selectedEventInfo: any;
  openModal: boolean;
  editMode?: boolean;
  setOpenModal: (val: boolean) => void;
  setState: Dispatch<SetStateAction<{ currentEvents: CurrentEventData[] }>>;
  currentEvents: CurrentEventData[];
}) {
  // initial state of form data
  const [formData, setFormData] = useState<EventData>({
    start_date: "",
    title: "",
    description: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  // Set a new state for the delete button,
  // so both submit and delete buttons wouldnt share the same state.
  const [isDeleting, setIsDeleting] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // The selectedEventInfo object is passed to the modal form when an event is clicked or a date is selected on the calendar
  // If an event is clicked, the selectedEventInfo object will have a startStr property or an event property
  let startEventStr =
    selectedEventInfo?.start_date ??
    selectedEventInfo?.startStr ??
    selectedEventInfo?.event.startStr;

  useEffect(() => {
    // When the selectedEventInfo object changes, set the form data to the selectedEventInfo startStr string
    if (selectedEventInfo?.startStr) {
      setFormData({
        ...formData,
        start_date: selectedEventInfo?.startStr,
      });
    } else if (!!selectedEventInfo) {
      setFormData({
        ...formData,
        title: selectedEventInfo?.title,
        description: selectedEventInfo?.description,
        end_date: selectedEventInfo?.end_date?.split("T")[0],
        start_date: selectedEventInfo?.start_date?.split("T")[0],
      });
    }
  }, [selectedEventInfo]);

  // Listen for openModal state change to reset form data on close
  useEffect(() => {
    // clean up form data on close modal
    if (!openModal) {
      setFormData({
        start_date: "",
        title: "",
        description: "",
        end_date: "",
      });
    }
  }, [openModal]);

  // Handle form input change event to update form data state
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    e.preventDefault();
    setErrorState("");

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle form submit event to save form data to db
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // get calendar api object
    let calendarAPI = selectedEventInfo.view.calendar;
    calendarAPI.unselect(); // clear date selection

    // validate form data
    if (
      !!formData &&
      formData.title &&
      formData.description &&
      formData.end_date
    ) {
      // correct date format
      formData.start_date = new Date(formData.start_date).toISOString(); // something like "2022-12-31T00:00:00.000Z" from "2022-12-31"
      formData.end_date = new Date(formData.end_date).toISOString(); // something like "2022-12-31T00:00:00.000Z" from "2022-12-31"

      // save to db
      let res: void | AxiosResponse<any, any>;

      // if edit mode, update event in db and calendar with new data and id
      // else create new event in db and calendar
      if (editMode) {
        formData.id = selectedEventInfo?.id;
        res = await axios.put("/api/event", formData).catch((err) => {
          // handle error
        });
      } else {
        res = await axios.post("/api/event", formData).catch((err) => {
          // handle error
        });
      }

      // if error, set error state to display error message
      // @ts-ignore
      if (res?.status !== 200) {
        setErrorState("Something went wrong. Please try again later.");
        return;
      }

      // distructure data from response object
      const { data } = res as any;

      // Update the currentEvents state
      setState({
        currentEvents: findAndUpdateCurrentEvents(currentEvents, data.id, data),
      });

      // If its in Edit mode delete the event from calendar API before adding the updated one
      // A better way to do this would be to have an event.update() method
      if (editMode) {
        selectedEventInfo.event.remove();
      }

      // add new event to @fullcalendar/react api
      calendarAPI.addEvent({
        id: data.id,
        title: data.title,
        start: data.start_date,
        end: data.end_date,
      });

      // close modal and stop loading
      setOpenModal(false);
      setLoading(false);
    } else {
      setLoading(false);

      // set error state to display error message
      setErrorState("Please fill out all fields");
    }
  };

  // Handle delete event
  const handleDelete = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsDeleting(true);
    // delete from db
    const res = await axios
      .delete(`/api/event?eventId=${selectedEventInfo.id}`)
      .catch((err) => {});
    // @ts-ignore
    if (res?.status !== 200) {
      // handle error and set error state to display error message
      setErrorState("Something went wrong. Please try again later.");
      return;
    }

    // Delete event from @fullcalendar/react API
    selectedEventInfo.event.remove();

    // close modal and stop loading
    setOpenModal(false);
    setIsDeleting(false);
  };

  return (
    <Modal
      loading={loading}
      isDeleting={isDeleting}
      handleSubmit={handleSubmit}
      openModal={openModal}
      setOpenModal={setOpenModal}
      editMode={editMode}
      handleDelete={handleDelete}
    >
      <FormElements
        errorState={errorState}
        formData={formData}
        handleChange={handleChange}
        startEventStr={startEventStr}
        editMode={editMode}
      />
    </Modal>
  );
}

export default EventForm;
