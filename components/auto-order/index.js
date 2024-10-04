import InputCheckbox from "../form/form-item/InputCheckbox";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { Table } from "reactstrap";

export default function AutoOrder({
  autoOrderData,
  setAutoOrderData,
  beforeOrderedData,
}) {
  const isBeforeOrdered = (date) => {
    if (!beforeOrderedData) return false;
    date.setHours(5, 0, 0, 0);
    if (date >= beforeOrderedData.from && date <= beforeOrderedData.to)
      return true;
    return false;
  };

  const handleDateChange = (newRange) => {
    setAutoOrderData((prev) => {
      return {
        ...prev,
        start_date: beforeOrderedData ? Date.now() : newRange?.from,
        end_date: newRange?.to,
      };
    });
  };

  const range = {
    from: autoOrderData?.start_date,
    to: autoOrderData?.end_date,
  };

  return (
    <div>
      {!beforeOrderedData && (
        <div className='mb-3'>
          <InputCheckbox
            onChange={(isChecked) =>
              setAutoOrderData((prev) => ({ ...prev, auto_order: isChecked }))
            }
            label='Auto order'
          />
        </div>
      )}

      <div
        style={{
          height: autoOrderData.auto_order || beforeOrderedData ? "405px" : 0,
          transition: "300ms",
          overflow: "hidden",
        }}
      >
        <DayPicker
          mode='range'
          min={2}
          selected={range}
          onSelect={handleDateChange}
          footer={<CalendarFooter range={range} />}
          fromDate={new Date()}
          modifiers={{
            beforeOrdered: isBeforeOrdered,
          }}
          modifiersClassNames={{
            today: "custom-rdp-today",
            beforeOrdered: "rdp-before-ordered",
          }}
        />
      </div>
    </div>
  );
}

function CalendarFooter({ range }) {
  const rangeFrom = range?.from ? format(range.from, "PPP") : "Not selected";
  const rangeTo = range.to ? format(range.to, "PPP") : "Not selected";
  return (
    <Table className="theme-text-black" bordered>
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className='w-50'>{rangeFrom}</td>
          <td className='w-50'>{rangeTo}</td>
        </tr>
      </tbody>
    </Table>
  );
}
