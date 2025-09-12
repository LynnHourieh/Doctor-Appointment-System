import { useEffect, useState } from "react";
import Button from "../../components/button/Button";
import Select from "../../components/select/Select";
import "./settings-style.scss";

type DayName =
  | "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday" | "Sunday";

type DayWindow = { startTime: string; endTime: string };
type Availability = Record<DayName, DayWindow>;

const dayNames: DayName[] = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

// API uses 0=Sunday..6=Saturday (based on your sample)
const dowToName = (n: number): DayName =>
  (["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as DayName[])[n];

const nameToDow = (name: DayName) =>
  (["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"] as DayName[]).indexOf(name);

const Settings = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL;
  const doctorId = localStorage.getItem("userId") || "";

  const [availability, setAvailability] = useState<Availability>(() => {
    // initialize all days to OFF
    const off: DayWindow = { startTime: "OFF", endTime: "OFF" };
    return Object.fromEntries(dayNames.map(d => [d, { ...off }])) as Availability;
  });

  console.log("Current availability state:", availability);

  const timeOptions = [
    { text: "OFF", value: "OFF" },
    { text: "08:00 AM", value: "08:00" },
    { text: "09:00 AM", value: "09:00" },
    { text: "10:00 AM", value: "10:00" },
    { text: "11:00 AM", value: "11:00" },
    { text: "12:00 PM", value: "12:00" },
    { text: "01:00 PM", value: "13:00" },
    { text: "02:00 PM", value: "14:00" },
    { text: "03:00 PM", value: "15:00" },
    { text: "04:00 PM", value: "16:00" },
    { text: "05:00 PM", value: "17:00" },
    { text: "06:00 PM", value: "18:00" },
  ];

  useEffect(() => {
    fetchAvailability();
  }, []);

  const fetchAvailability = async () => {
    try {
      const res = await fetch(`${baseUrl}/availability/${doctorId}`);
      const data: Array<{ dayOfWeek: number; startTime: string; endTime: string }> = await res.json();
console.log("Fetched availability:", data);
      // start from all OFF
      const next: Availability = Object.fromEntries(
        dayNames.map(d => [d, { startTime: "OFF", endTime: "OFF" }])
      ) as Availability;

      // fill days that have windows
      for (const row of data) {
        const dayName = dowToName(row.dayOfWeek);
        // if your API can return multiple windows per day and your UI only supports one,
        // this will take the last one in the array. Adjust if needed.
        next[dayName] = {
          startTime: row.startTime ?? "OFF",
          endTime: row.endTime ?? "OFF",
        };
      }
      setAvailability(next);
    } catch (e) {
      console.error("Error fetching availability:", e);
    }
  };

  const handleChange = (day: DayName, field: "startTime" | "endTime", value: string) => {
    setAvailability(prev => {
      const curr = prev[day] || { startTime: "OFF", endTime: "OFF" };
      // If either side is set to OFF, force both to OFF (optional UX rule)
      if (value === "OFF") {
        return { ...prev, [day]: { startTime: "OFF", endTime: "OFF" } };
      }
      const updated = { ...curr, [field]: value };
      return { ...prev, [day]: updated };
    });
  };

  const save = async () => {
    // Build payload for API: only include days that are not OFF
    const payload = dayNames.flatMap((day): Array<{ dayOfWeek: number; startTime: string; endTime: string }> => {
      const win = availability[day];
      if (!win || win.startTime === "OFF" || win.endTime === "OFF") return [];
      return [{ dayOfWeek: nameToDow(day), startTime: win.startTime, endTime: win.endTime }];
    });

    try {
      await fetch(`${baseUrl}/availability/${doctorId}`, {
        method: "PUT",            
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ availability: payload }),
      });
      // optionally re-fetch to reflect canonical server state
      await fetchAvailability();
    } catch (e) {
      console.error("Error saving availability:", e);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-title">
        <h2 className="settings-title-text">Availability Settings</h2>
        <div className="settings-line"></div>
      </div>
      <p>Set your weekly working hours</p>

      <div className="settings-card">
        {dayNames.map((day) => (
          <div key={day} className="settings-time-slot">
            <span>{day}</span>
            <Select
              name="startTime"
              options={timeOptions}
              defaultValue="OFF"
              value={availability[day]?.startTime ?? "OFF"}
              onChange={(name, value: string) => handleChange(day, "startTime", value)}
            />
            <Select
              name="endTime"
              options={timeOptions}
              defaultValue="OFF"
              value={availability[day]?.endTime ?? "OFF"}
              onChange={(name, value: string) => handleChange(day, "endTime", value)}
            />
          </div>
        ))}
      </div>

      <Button text="Save Changes" onClickHandler={save} id="settings-save-button" />
    </div>
  );
};

export default Settings;
