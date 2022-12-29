import axios, { AxiosResponse } from "axios";
import { EventData } from "lib/types";
import React, { SyntheticEvent, useEffect, useState } from "react";
import Modal from "../Modal";
import FormElements from "./FormElements";

function EventForm({
  openModal,
  setOpenModal,
  selectInfo,
  editMode = false,
}: {
  selectInfo: any;
  openModal: boolean;
  editMode?: boolean;
  setOpenModal: (val: boolean) => void;
}) {
  // initial state of form data
  const [formData, setFormData] = useState<EventData>({
    start_date: "",
    title: "",
    description: "",
    end_date: "",
  });
  const [loading, setLoading] = useState(false);
  const [errorState, setErrorState] = useState(null);

  // The selectInfo object is passed to the modal form when an event is clicked or a date is selected on the calendar
  // If an event is clicked, the selectInfo object will have a startStr property or an event property
  let startEventStr = selectInfo?.startStr ?? selectInfo?.event.startStr;

  useEffect(() => {
    // When the selectInfo object changes, set the form data to the selectInfo startStr object
    if (selectInfo?.startStr) {
      setFormData({
        ...formData,
        start_date: selectInfo?.startStr,
      });
    } else if (!!selectInfo) {
      setFormData({
        ...formData,
        title: selectInfo?.title,
        description: selectInfo?.description,
        end_date: selectInfo?.end_date?.split("T")[0],
        start_date: selectInfo?.start_date?.split("T")[0],
      });
    }
  }, [startEventStr]);

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
    let calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // clear date selection

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
        formData.id = selectInfo?.id;
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

      // distructure data from response object and set loading to false
      const { data } = res as any;
      setLoading(false);

      // add new event to calendar api
      calendarApi.addEvent({
        id: data.id,
        title: data.title,
        start: data.start_date,
        end: data.end_date,
      });

      // close modal
      setOpenModal(false);
    } else {
      setLoading(false);

      // set error state to display error message
      setErrorState("Please fill out all fields");
    }
  };

  // Handle delete event
  const handleDelete = async (e: SyntheticEvent) => {
    e.preventDefault();
    setLoading(true);
    // delete from db
    const res = await axios
      .delete(`/api/event?eventId=${selectInfo.id}`)
      .catch((err) => {});
    // @ts-ignore
    if (res?.status !== 200) {
      // handle error and set error state to display error message
      setErrorState("Something went wrong. Please try again later.");
      return;
    }

    // Delete event from calendar API
    selectInfo.event.remove();

    // close modal
    setOpenModal(false);
    setLoading(false);
  };

  return (
    <Modal
      loading={loading}
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
