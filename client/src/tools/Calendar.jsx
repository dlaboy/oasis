'use client'

import { useState, useEffect } from 'react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from '@heroicons/react/20/solid'
import 'bootstrap-icons/font/bootstrap-icons.css';


function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function Calendar({ tasks }) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [days, setDays] = useState([])
  const [selectedDate, setSelectedDate] = useState(null)

  console.log("calendar tasks: ", tasks)

  const today = new Date()

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1))
  }

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1))
  }

  const handleToday = () => {
    setCurrentDate(new Date())
  }

  const monthYearDisplay = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
  const isoDateDisplay = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`

  useEffect(() => {
    generateDays(currentDate)
  }, [currentDate, tasks, selectedDate])

  const generateDays = (date) => {
    const year = date.getFullYear()
    const month = date.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)

    const startDayOfWeek = firstDayOfMonth.getDay() || 7
    const daysInMonth = lastDayOfMonth.getDate()

    const prevMonth = new Date(year, month - 1)
    const daysInPrevMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth() + 1, 0).getDate()

    const totalCells = 42
    const newDays= []

    for (let i = startDayOfWeek - 1; i > 0; i--) {
      const d = new Date(year, month - 1, daysInPrevMonth - i + 1)
      newDays.push({
        date: formatDate(d),
        events: getEventsForDate(formatDate(d)),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: selectedDate === formatDate(d),
      })
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const d = new Date(year, month, i)
      newDays.push({
        date: formatDate(d),
        events: getEventsForDate(formatDate(d)),
        isCurrentMonth: true,
        isToday: isSameDay(d, today),
        isSelected: selectedDate === formatDate(d),
      })
    }

    let nextMonthDay = 1
    while (newDays.length < totalCells) {
      const d = new Date(year, month + 1, nextMonthDay++)
      newDays.push({
        date: formatDate(d),
        events: getEventsForDate(formatDate(d)),
        isCurrentMonth: false,
        isToday: isSameDay(d, today),
        isSelected: selectedDate === formatDate(d),
      })
    }

    setDays(newDays)
  }

  const getEventsForDate = (dateString) => {
    return tasks
      .filter(task => task.Date.startsWith(dateString)) // match day
      .map(task => ({
        id: task._id,
        datetime: task.Date,
      }))
  }

  const isSameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate()

  const formatDate = (d) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`

  const tasksForSelectedDay = selectedDate
    ? tasks.filter(task => task.Date.startsWith(selectedDate))
    : []


    const handleDownload = (reportUrl) => {
        window.open(reportUrl, '_blank');
    };
  return (
    <div className="d-lg-flex h-100 flex-column">
         {/* Tasks Display */}
  {selectedDate && (
    <div className="mt-4 p-3 bg-white rounded shadow-sm">
      <h3 className="h6 fw-semibold text-dark mb-3">
        Report for {selectedDate}
      </h3>
      {tasksForSelectedDay.map((task) => {
        const taskDate = new Date(task.Date);
        // const timeString = taskDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        return (
          <div
            key={task._id}
            className="d-flex flex-md-row flex-column justify-content-between align-items-center border p-2 rounded mb-2 bg-light"
          >
            <span className="fw-medium">Date: {task.Date}</span>
            <span className="fw-medium">Total:${task.Total}</span>
            {task.Report ? (
            <button
              className='btn text-secondary'
              onClick={() => handleDownload(task.Report)}
                >
                Open Report
                </button>
            ) : (
                'No Report'
            )}
            {/* <span className="text-muted small">A</span> */}
          </div>
        );
      })}
    </div>
  )}
  {/* Calendar Header */}
  <header className="d-flex align-items-center justify-content-between border-bottom px-4 py-3">
    <h1 className="h5 fw-semibold text-dark mb-0">
      <time dateTime={isoDateDisplay}>{monthYearDisplay}</time>
    </h1>
    <div className="d-flex align-items-center">
      <div className="d-flex align-items-center bg-white shadow-sm rounded border">
        <button
          type="button"
          onClick={handlePreviousMonth}
          className="btn btn-light border-end rounded-start"
        >
          {/* <ChevronLeftIcon className="bi bi-chevron-left" /> */}
            <i className="bi bi-chevron-left"></i>

        </button>
        <button
          type="button"
          onClick={handleToday}
          className="btn btn-light d-none d-md-block border-start border-end"
        >
          Today
        </button>
        <button
          type="button"
          onClick={handleNextMonth}
          className="btn btn-light border-start rounded-end"
        >
          {/* <ChevronRightIcon className="bi bi-chevron-right" /> */}
            <i className="bi bi-chevron-right"></i>

        </button>
      </div>
    </div>
  </header>

  {/* Calendar Grid */}
  <div className="shadow border">
    <div className="text-center border-bottom fw-semibold text-muted d-flex flex-row w-100">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((d) => (
          <div className="py-2 border-end w-100" key={d}>
            {d}
          </div>
        ))}
     </div>

    <div className="d-none d-md-flex flex-wrap">
      {days.map((day) => (
        <div
          key={day.date}
          onClick={() => setSelectedDate(day.date)}
          className={`position-relative p-2 border ${
            day.isCurrentMonth ? 'bg-white' : 'bg-light text-muted',
            day.isSelected && 'bg-dark text-white'

          }`}
          style={{ 
            cursor: 'pointer',
            minHeight: '80px',
            border: day.isSelected ? '2px solid #0d6efd' : '', // Bootstrap primary border
            borderRadius: day.isSelected ? '0.25rem' : '',
            backgroundColor: day.isSelected ? '#0d6efd' : '',
            color: day.isSelected ? 'white' : '',
            width: '14.28%' }}
        >
          <time
            dateTime={day.date}
            className={`d-flex justify-content-center align-items-center rounded-circle ${
              day.isToday ? 'bg-primary text-white fw-bold' : ''
            }`}
            style={{ width: '24px', height: '24px', marginBottom: '5px' }}
          >
            {parseInt(day.date.split('-')[2])}
          </time>
          {day.events.length > 0 && (
            <ul className="list-unstyled mt-2 mb-0">
              {day.events.slice(0, 2).map((event) => (
                <li key={event._id} className="text-truncate small fw-medium text-dark">
                  {event.Date}
                </li>
              ))}
              {day.events.length > 2 && (
                <li className="text-muted small">+ {day.events.length - 2} more</li>
              )}
            </ul>
          )}
           <div className="d-flex flex-wrap-reverse mt-auto">
              {day.events.map((event) => (
                <span key={event.id} className="me-1 mb-1 rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }} />
              ))}
            </div>
        </div>
      ))}
    </div>

   {/* Mobile Grid */}
<div
  className="d-lg-none"
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(7, minmax(80vw, 1fr))',
    gap: '4px', // Espacio entre días
    padding: '0 8px' // margen lateral opcional
  }}
>
  {days.map((day) => (
    <button
      key={day.date}
      onClick={() => setSelectedDate(day.date)}
      type="button"
      className={`btn p-2 d-flex flex-column align-items-start ${
        day.isSelected ? 'text-white bg-dark' :
        day.isToday ? 'text-primary fw-semibold' :
        !day.isCurrentMonth ? 'text-muted' : 'text-dark'
      }`}
      style={{ 
        cursor: 'pointer',
        minHeight: '80px',
        border: day.isSelected ? '2px solid #0d6efd' : '',
        borderRadius: day.isSelected ? '0.25rem' : '',
        backgroundColor: day.isSelected ? '#0d6efd' : '',
        color: day.isSelected ? 'white' : '',
        height: '90px',
        width: '100%' // fuerza a ocupar la celda completa
      }}
    >
      <time className={`${day.isSelected ? 'bg-dark rounded-circle d-flex justify-content-center align-items-center text-white' : ''}`}>
        {parseInt(day.date.split('-')[2])}
      </time>
      <span className="visually-hidden">{day.events.length} events</span>
      {day.events.length > 0 && (
        <div className="d-flex flex-wrap-reverse mt-auto">
          {day.events.map((event) => (
            <span key={event.id} className="me-1 mb-1 rounded-circle bg-secondary" style={{ width: '6px', height: '6px' }} />
          ))}
        </div>
      )}
    </button>
  ))}
</div>

  </div>

 
</div>

  )
}
