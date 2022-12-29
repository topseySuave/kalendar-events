import { EventData } from "lib/types";
import React from "react";

function FormElements({
  errorState,
  formData,
  handleChange,
  startEventStr,
  editMode = false,
}: {
  errorState: string;
  formData: EventData;
  handleChange: (e: any) => void;
  startEventStr: string;
  editMode: boolean;
}) {
  return (
    <form>
      {errorState && <p className="mb-5 text-red-500">{errorState}</p>}
      <label className="block mb-5">
        <span className="block text-sm font-medium text-slate-700">Title</span>
        <input
          name="title"
          defaultValue={formData.title || ""}
          required
          onChange={handleChange}
          className="border border-slate-300 hover:border-slate-400 rounded-md w-full py-2 px-5 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
        />
      </label>
      <label className="block mb-5">
        <span className="block text-sm font-medium text-slate-700">
          Description
        </span>
        <textarea
          name="description"
          defaultValue={formData.description || ""}
          required
          onChange={handleChange}
          className="border border-slate-300 hover:border-slate-400 rounded-md w-full py-2 px-5 border-slate-200 placeholder-slate-400 contrast-more:border-slate-400 contrast-more:placeholder-slate-500"
        />
      </label>
      <label className="block mb-5">
        <span className="block text-sm font-medium text-slate-700">
          Start Date to End Date
        </span>
        <div className="flex items-center">
          <div className="relative">
            <input
              name="start_date"
              type="date"
              required
              onChange={handleChange}
              min={formData.start_date}
              value={formData.start_date}
              disabled={!!startEventStr && !editMode}
              className="border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
          <span className="mx-4 text-gray-500">to</span>
          <div className="relative">
            <input
              name="end_date"
              onChange={handleChange}
              type="date"
              required
              min={formData.start_date}
              value={formData.end_date}
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
            />
          </div>
        </div>{" "}
      </label>
    </form>
  );
}

export default FormElements;
