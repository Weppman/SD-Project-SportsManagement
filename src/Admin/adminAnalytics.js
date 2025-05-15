import React, { useEffect, useState,useMemo,useRef } from "react";
import { useUser } from "../UserContext";
import Toolbar from '../ToolBar/toolBar';
import AdminToolbar from "../Admin/adminToolBar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './adminAnalytics.css';  // Import the CSS file
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas'; 


export default function AdminUsageTrends() {
  const userType = useUser();
  const [approvedBookings, setApprovedBookings] = useState([]);
  const [timeSlotChartData, setTimeSlotChartData] = useState([]);
  const [usageByFacilityPercentChartData, setUsageByFacilityPercentChartData] = useState([]);
  const [timeSlotPercentChartData, setTimeSlotPercentChartData] = useState([]);
  const [usageByFacilityChartData, setUsageByFacilityChartData] = useState([]);
  const [showTimeSlotGraph, setShowTimeSlotGraph] = useState(false); // Toggle state
  const [showPercentages, setShowPercentages] = useState(false);
  const [isStacked, setIsStacked] = useState(false);
   const chartContainerRef = useRef(null);  // Correctly defined useRef

  const barColors = [
    "#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#a0522d",
    "#dda0dd", "#40e0d0", "#ff6347", "#6a5acd", "#98fb98",
    "#ff1493", "#7fffd4", "#dc143c", "#8a2be2", "#00ced1",
    "#ff8c00", "#8b0000", "#00fa9a", "#6495ed", "#b22222",
    "#2e8b57", "#9932cc", "#ff69b4", "#20b2aa", "#cd5c5c"
  ];

  // Fetch approved bookings
  const fetchApprovedBookings = async () => {
    try {
      const response = await fetch('https://getpendingfuturebookings-mokwbj4tsa-uc.a.run.app'); // Replace with your URL
      const data = await response.json();
      console.log('Fetched approved bookings:', data);
      setApprovedBookings(data.bookings); // Adjust as necessary based on your data
    } catch (error) {
      console.error('Error fetching approved bookings:', error);
    } 
  };

  // Process data for graphing
  useEffect(() => {
    fetchApprovedBookings();
  }, []);

  // Process data for venue usage and time slots
  useEffect(() => {
    const groupedByVenue = {};
    const groupedByTimeSlot = {};
  
    approvedBookings.forEach((booking) => {
      const timeSlot = booking.timeSlot || "Unknown";
      const venue = booking.venueID || "Unknown";
      const rawDate = new Date(booking.date.seconds * 1000);
      const month = rawDate.toLocaleString("default", { month: "short" });
      const year = rawDate.getFullYear();
      const monthKey = `${month} ${year}`;
  
      if (!groupedByVenue[monthKey]) groupedByVenue[monthKey] = { month: monthKey };
      if (!groupedByVenue[monthKey][venue]) groupedByVenue[monthKey][venue] = 0;
      groupedByVenue[monthKey][venue] += 1;
  
      if (!groupedByTimeSlot[timeSlot]) groupedByTimeSlot[timeSlot] = { timeSlot };
      if (!groupedByTimeSlot[timeSlot][venue]) groupedByTimeSlot[timeSlot][venue] = 0;
      groupedByTimeSlot[timeSlot][venue] += 1;
    });
    const allVenues = [...new Set(approvedBookings.map(b => b.venueID))];
    const normalize = (data, key) => {
      return data.map((entry) => {
        const total = allVenues.reduce((sum, venue) => sum + (entry[venue] || 0), 0);
        const percentEntry = { [key]: entry[key] };
        allVenues.forEach((venue) => {
          percentEntry[venue] = total ? (entry[venue] || 0) / total * 100 : 0;
        });
        return percentEntry;
      });
    };
  
    const sortedTimeSlots = Object.keys(groupedByTimeSlot).sort((a, b) => {
      const [aStart] = a.split(" - ").map(time => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
      });
      const [bStart] = b.split(" - ").map(time => {
        const [hour, minute] = time.split(":").map(Number);
        return hour * 60 + minute;
      });
      return aStart - bStart;
    });
  
    const groupedByVenueData = Object.values(groupedByVenue);
    const sortedByTimeSlotData = sortedTimeSlots.map((slot) => groupedByTimeSlot[slot]);
  
    setUsageByFacilityChartData(groupedByVenueData);
    setTimeSlotChartData(sortedByTimeSlotData);
    setUsageByFacilityPercentChartData(normalize(groupedByVenueData, "month"));
    setTimeSlotPercentChartData(normalize(sortedByTimeSlotData, "timeSlot"));
  }, [approvedBookings]);
  const allVenues = useMemo(() => {
    return [...new Set(approvedBookings.map(b => b.venueID))];
  }, [approvedBookings]);
  
const calculateUsageSummary = (data) => {
  // Sort months chronologically
  data.sort((a, b) => new Date(a.month) - new Date(b.month));

  data.forEach((monthData) => {
    const { month, ...venueUsages } = monthData;
    const totalUsage = Object.values(venueUsages).reduce((acc, usage) => acc + (usage || 0), 0);
    monthData.totalUsage = totalUsage;
  });

  return data.map((monthData, index) => {
    const { month, totalUsage, ...venueUsages } = monthData;

    if (isNaN(totalUsage)) return null;

    const usageValues = Object.entries(venueUsages).map(([venue, usage]) => ({
      venue,
      usage,
    }));

    usageValues.sort((a, b) => b.usage - a.usage);

    const mostUsed = usageValues[0];
    const leastUsed = usageValues[usageValues.length - 1];

    const previousMonthUsages = index > 0 ? data[index - 1] : null;

    // Calculate total usage for previous month
    const previousMonthTotalUsage = previousMonthUsages ? previousMonthUsages.totalUsage : 0;

    let comparison = "N/A";
    if (previousMonthTotalUsage && totalUsage) {
      comparison = (((totalUsage - previousMonthTotalUsage) / previousMonthTotalUsage) * 100).toFixed(2) + "%";
    }

    // Calculate venue improvements/declines
    let mostImproved = { venue: null, delta: -Infinity };
    let mostDeclined = { venue: null, delta: Infinity };

    if (previousMonthUsages) {
  const nonVenueKeys = new Set(['month', 'totalUsage']);
  const venues = new Set([
    ...Object.keys(venueUsages).filter(k => !nonVenueKeys.has(k)),
    ...Object.keys(previousMonthUsages).filter(k => !nonVenueKeys.has(k))
  ]);

  for (const venue of venues) {
    const currentUsage = venueUsages[venue] || 0;
    const prevUsage = previousMonthUsages[venue] || 0;
    const delta = currentUsage - prevUsage;

    if (delta > mostImproved.delta) {
      mostImproved = { venue, delta };
    }
    if (delta < mostDeclined.delta) {
      mostDeclined = { venue, delta };
    }
  }
}



    return {
      month,
      totalUsage,
      mostUsed,
      leastUsed,
      comparison,
      mostImproved,
      mostDeclined,
    };
  }).filter(Boolean);
};
  const usageSummary = useMemo(() => {
    return calculateUsageSummary(usageByFacilityChartData);
  }, [usageByFacilityChartData]);

 const calculateTimeSlotSummary = (data) => {
  if (!data || data.length === 0) return { mostBooked: null, leastBooked: null, morningTotal: 0, afternoonTotal: 0, changePercent: "N/A" };

  const slotTotals = data.map(slot => {
    const { timeSlot, ...venues } = slot;
    const total = Object.values(venues).reduce((sum, count) => sum + (count || 0), 0);
    return { timeSlot, total };
  });

  // Sort to find most and least booked
  const sorted = [...slotTotals].sort((a, b) => b.total - a.total);

  // Classify as morning (before 12:00) or afternoon
  let morningTotal = 0;
  let afternoonTotal = 0;

  slotTotals.forEach(({ timeSlot, total }) => {
    const [startTime] = timeSlot.split(" - ");
    const [hour] = startTime.split(":").map(Number);

    if (hour < 12) {
      morningTotal += total;
    } else {
      afternoonTotal += total;
    }
  });

  let changePercent = "N/A";
  if (morningTotal > 0) {
    const diff = afternoonTotal - morningTotal;
    changePercent = ((diff / morningTotal) * 100).toFixed(2) + "%";
  }

  return {
    mostBooked: sorted[0],
    leastBooked: sorted[sorted.length - 1],
    morningTotal,
    afternoonTotal,
    changePercent,
  };
};


const timeSlotSummary = useMemo(() => {
  return calculateTimeSlotSummary(timeSlotChartData);
}, [timeSlotChartData]);

const downloadPDF = () => {
  const chartContainer = chartContainerRef.current;

  if (!chartContainer) {
    console.log("Chart container not found.");
    return;
  }

  const headerText = document.getElementById("usage-trends-title").innerText;

  html2canvas(chartContainer).then((canvas) => {
    const imgData = canvas.toDataURL('image/png');
    const doc = new jsPDF('landscape');

    doc.setFontSize(18);
    const headerWidth = doc.getTextWidth(headerText);
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const xPosition = (pageWidth - headerWidth) / 2;

    // Add header text
    doc.text(headerText, xPosition, 10);

    // Add chart image
    const chartYPosition = 20;
    const chartHeight = 160;
    doc.addImage(imgData, 'PNG', 10, chartYPosition, 280, chartHeight);

    // Add new page for summary
    doc.addPage();

    // Construct summary text
    let summaryText = "";
    if (!showTimeSlotGraph) {
      summaryText = usageSummary.map((summary) => {
        return `${summary.month}:
Most Used Venue: ${summary.mostUsed.venue} (${summary.mostUsed.usage} booked)
Least Used Venue: ${summary.leastUsed.venue} (${summary.leastUsed.usage} booked)
Comparison to Previous Month: ${summary.comparison}
Most Improved Venue: ${summary.mostImproved.venue} (${summary.mostImproved.delta >= 0 ? `+${summary.mostImproved.delta}` : summary.mostImproved.delta} bookings)
Most Declined Venue: ${summary.mostDeclined.venue} (${summary.mostDeclined.delta < 0 ? summary.mostDeclined.delta : 0} bookings)\n`;
      }).join("\n\n");
    } else {
      summaryText = `
Most Booked Time Slot: ${timeSlotSummary.mostBooked.timeSlot} (${timeSlotSummary.mostBooked.total} bookings)
Least Booked Time Slot: ${timeSlotSummary.leastBooked.timeSlot} (${timeSlotSummary.leastBooked.total} bookings)
Morning Total: ${timeSlotSummary.morningTotal}
Afternoon Total: ${timeSlotSummary.afternoonTotal}
${timeSlotSummary.changePercent.startsWith("-") ? "Decrease" : "Increase"} from Morning to Afternoon: ${timeSlotSummary.changePercent}
`;
    }

    // Prepare for multi-page summary rendering
    const margin = 10;
    const usableWidth = pageWidth - margin * 2;
    const lineHeight = 6;

    doc.setFontSize(12);
    const lines = doc.splitTextToSize(summaryText, usableWidth);

    let cursorY = margin;

    lines.forEach(line => {
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage();
        cursorY = margin;
      }
      doc.text(line, margin, cursorY);
      cursorY += lineHeight;
    });

    doc.save('usage_trends.pdf');
  }).catch(err => {
    console.error('Error generating PDF:', err);
  });
};





  return (
    <>
      <Toolbar userType={userType} />
      {userType === "admin" && <AdminToolbar />}
  
      <section id="usage-trends-section">
        {/* Tab buttons */}
        <header className="tabs">
  <input
    type="radio"
    id="facility"
    name="graphToggle"
    checked={!showTimeSlotGraph}
    onChange={() => setShowTimeSlotGraph(false)}
    hidden
  />
  <label className="tab" htmlFor="facility">
    Usage by Facility
  </label>

  <input
    type="radio"
    id="timeSlot"
    name="graphToggle"
    checked={showTimeSlotGraph}
    onChange={() => setShowTimeSlotGraph(true)}
    hidden
  />
  <label className="tab" htmlFor="timeSlot">
    Usage by Time Slot
  </label>
</header>
<label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
  <input
    type="checkbox"
    checked={isStacked}
    onChange={(e) => setIsStacked(e.target.checked)}
  />
  Show as Stacked
</label>
<label style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "10px" }}>
  <input
    type="checkbox"
    checked={showPercentages}
    onChange={(e) => setShowPercentages(e.target.checked)}
  />
  Show as Percentages
</label>
  
        {/* Title that changes based on the selected graph */}
        <h2 id="usage-trends-title">
          {showTimeSlotGraph ? "Usage Trends by Time Slot" : "Usage Trends by Facility"}
        </h2>
  
        {/* Conditionally render the graphs */}
  <section id="chart-container" ref={chartContainerRef}>
        <ResponsiveContainer width={1310} height={500}>
  {showTimeSlotGraph ? (
    <BarChart data={showPercentages ? timeSlotPercentChartData : timeSlotChartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="timeSlot" />
      <YAxis
        domain={showPercentages ? [0, 100] : [0, 'auto']}
        tickFormatter={(value) => showPercentages ? `${value}%` : Math.round(value)}
      />
      <Tooltip
        formatter={(value) =>
          showPercentages ? `${parseFloat(value).toFixed(1)}%` : Math.round(value)
        }
      />
      <Legend />
      {allVenues.map((venue, index) => (
        <Bar
          key={venue}
          dataKey={venue}
          fill={barColors[index % barColors.length]}
          stackId={isStacked ? "stack" : undefined}  // Stack bars if isStacked is true
        />
      ))}
    </BarChart>
  ) : (
    <BarChart data={showPercentages ? usageByFacilityPercentChartData : usageByFacilityChartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis
        domain={showPercentages ? [0, 100] : [0, 'auto']}
        tickFormatter={(value) => showPercentages ? `${value}%` : Math.round(value)}
      />
      <Tooltip
        formatter={(value) =>
          showPercentages ? `${parseFloat(value).toFixed(1)}%` : Math.round(value)
        }
      />
      <Legend />
      {allVenues.map((venue, index) => (
        <Bar
          key={venue}
          dataKey={venue}
          fill={barColors[index % barColors.length]}
          stackId={isStacked ? "stack" : undefined}  // Stack bars if isStacked is true
        />
      ))}
    </BarChart>
  )}
</ResponsiveContainer>
</section>
{/* Render the usage summary below the graph */}
       <section id="usage-summary">
  {!showTimeSlotGraph && usageSummary.map((summary, index) => (
    <article id="summary-item" key={index} className="summary-item">
      <h3>{summary.month}</h3>
      <p className="summary-text"><strong>Most Used Venue:</strong> {summary.mostUsed.venue} ({summary.mostUsed.usage} booked)</p>
      <p className="summary-text"><strong>Least Used Venue:</strong> {summary.leastUsed.venue} ({summary.leastUsed.usage} booked)</p>
      <p className="summary-text"><strong>Comparison to Previous Month:</strong> {summary.comparison}</p>
      {summary.mostImproved.venue && (
        <p className="summary-text"><strong>Most Improved Venue:</strong> {summary.mostImproved.venue} ({summary.mostImproved.delta >= 0 ? `+${summary.mostImproved.delta}` : summary.mostImproved.delta} bookings)</p>
      )}
      {summary.mostDeclined.venue && (
        <p className="summary-text"><strong>Most Declined Venue:</strong> {summary.mostDeclined.venue} ({summary.mostDeclined.delta < 0 ? summary.mostDeclined.delta : 0} bookings)</p>
      )}
    </article>
  ))}
</section>
{showTimeSlotGraph && timeSlotSummary?.mostBooked && (
  <section style={{ textAlign: "center", marginTop: "20px" }}>
    <p className="summary-text"><strong>Most Booked Time Slot:</strong> {timeSlotSummary.mostBooked.timeSlot} ({timeSlotSummary.mostBooked.total} bookings)</p>
    <p className="summary-text"><strong>Least Booked Time Slot:</strong> {timeSlotSummary.leastBooked.timeSlot} ({timeSlotSummary.leastBooked.total} bookings)</p>
    <p className="summary-text"><strong>Morning Total:</strong> {timeSlotSummary?.morningTotal}</p>
    <p className="summary-text"><strong>Afternoon Total:</strong> {timeSlotSummary?.afternoonTotal}</p>
    <p className="summary-text"><strong>{timeSlotSummary?.changePercent.startsWith("-")? "Decrease": "Increase"}{" "}from Morning to Afternoon:</strong>{" "} {timeSlotSummary?.changePercent}</p>
  </section>
)}
 <button onClick={downloadPDF}> Download as PDF</button>
      </section>
    </>
  );  
}