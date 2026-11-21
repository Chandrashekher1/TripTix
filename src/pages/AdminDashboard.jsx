import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bus_API, Profile_API, Route_API, Seat_API, Trip_API } from '../utils/constant'
import AuthContext from '../context/AuthContext'

const emptyBus = {
  routesId: '', busNumber: '', busType: '', operator: '', dep_time: '', arrivalTime: '',
  isAc: false, isSleeper: false, isSeater: true, isWifi: false, price: '', totalSeat: '', rating: '1',
}

const emptyRoute = { origin: '', destination: '', distance: '' }
const emptySeat = { seatNumber: '', seatPreference: 'window' }

const tabs = [
  ['buses', 'Buses'],
  ['seats', 'Seat layouts'],
  ['trips', 'Trips'],
  ['routes', 'Routes'],
]

const toDateTimeInput = (value) => {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset() * 60_000
  return new Date(date.getTime() - offset).toISOString().slice(0, 16)
}

function Field({ label, children }) {
  return <label className='flex flex-col gap-1 text-sm font-medium text-slate-700'><span>{label}</span>{children}</label>
}

function TextInput({ value, onChange, ...props }) {
  return <input value={value} onChange={onChange} className='w-full rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100' {...props} />
}

function ActionButton({ children, className = '', ...props }) {
  return <button className={`rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${className}`} {...props}>{children}</button>
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { token, logout } = useContext(AuthContext)
  const [activeTab, setActiveTab] = useState('buses')
  const [authorized, setAuthorized] = useState(null)
  const [routes, setRoutes] = useState([])
  const [buses, setBuses] = useState([])
  const [selectedBusId, setSelectedBusId] = useState('')
  const [seats, setSeats] = useState([])
  const [trips, setTrips] = useState([])
  const [busForm, setBusForm] = useState(emptyBus)
  const [routeForm, setRouteForm] = useState(emptyRoute)
  const [seatForm, setSeatForm] = useState(emptySeat)
  const [tripDate, setTripDate] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)

  const headers = useMemo(() => ({ Authorization: token }), [token])

  const request = useCallback(async (url, options = {}) => {
    const response = await fetch(url, { ...options, headers: { ...headers, ...(options.headers || {}) } })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) throw new Error(data.message || data.error || 'Request failed.')
    return data
  }, [headers])

  const loadCatalog = useCallback(async () => {
    const [routeResult, busResult] = await Promise.all([
      request(`${Route_API.replace('?', '')}/admin/all`),
      request(`${Bus_API}/admin/all`),
    ])
    setRoutes(routeResult.data || [])
    setBuses(busResult.data || [])
  }, [request])

  const loadBusInventory = useCallback(async (busId) => {
    if (!busId) {
      setSeats([])
      setTrips([])
      return
    }
    const [seatResult, tripResult] = await Promise.all([
      request(`${Seat_API}/${busId}`),
      request(`${Trip_API}?busId=${busId}`),
    ])
    setSeats(seatResult.data || [])
    setTrips(tripResult.data || [])
  }, [request])

  useEffect(() => {
    if (!token) {
      setAuthorized(false)
      return
    }
    const load = async () => {
      try {
        const profile = await request(`${Profile_API}/me`)
        if (!profile.data?.isAdmin) {
          setAuthorized(false)
          return
        }
        setAuthorized(true)
        await loadCatalog()
      } catch {
        setAuthorized(false)
      }
    }
    load()
  }, [token, request, loadCatalog])

  useEffect(() => {
    loadBusInventory(selectedBusId).catch((err) => {
      setSeats([])
      setTrips([])
      if (selectedBusId) setMessage(err.message)
    })
  }, [selectedBusId, loadBusInventory])

  const run = async (work, successMessage) => {
    setBusy(true)
    setMessage('')
    try {
      await work()
      setMessage(successMessage)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setBusy(false)
    }
  }

  const saveRoute = () => run(async () => {
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `${Route_API.replace('?', '')}/${editingId}` : Route_API.replace('?', '')
    await request(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(routeForm) })
    setRouteForm(emptyRoute)
    setEditingId(null)
    await loadCatalog()
  }, editingId ? 'Route updated.' : 'Route created.')

  const saveBus = () => run(async () => {
    const form = new FormData()
    Object.entries(busForm).forEach(([key, value]) => form.append(key, String(value)))
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `${Bus_API}/${editingId}` : Bus_API
    await request(url, { method, body: form })
    setBusForm(emptyBus)
    setEditingId(null)
    await loadCatalog()
  }, editingId ? 'Bus updated.' : 'Bus created.')

  const saveSeat = () => run(async () => {
    if (!selectedBusId) throw new Error('Choose a bus first.')
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `${Seat_API}/${editingId}` : `${Seat_API}/add`
    const body = editingId ? seatForm : { ...seatForm, busId: selectedBusId }
    await request(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setSeatForm(emptySeat)
    setEditingId(null)
    await loadBusInventory(selectedBusId)
  }, editingId ? 'Seat updated.' : 'Seat created.')

  const saveTrip = () => run(async () => {
    if (!selectedBusId || !tripDate) throw new Error('Choose a bus and departure date.')
    const method = editingId ? 'PATCH' : 'POST'
    const url = editingId ? `${Trip_API}/${editingId}` : Trip_API
    const body = editingId ? { departureDate: new Date(tripDate).toISOString() } : { busId: selectedBusId, departureDate: new Date(tripDate).toISOString() }
    await request(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    setTripDate('')
    setEditingId(null)
    await loadBusInventory(selectedBusId)
  }, editingId ? 'Trip updated.' : 'Trip and its seat inventory created.')

  const remove = (url, successMessage, reload) => run(async () => {
    if (!window.confirm('This action cannot be undone. Continue?')) return
    await request(url, { method: 'DELETE' })
    await reload()
  }, successMessage)

  const selectBus = (id) => {
    setSelectedBusId(id)
    setEditingId(null)
    setSeatForm(emptySeat)
    setTripDate('')
  }

  if (authorized === null) return <div className='min-h-[60vh] p-12 text-center text-slate-600'>Checking administrator access…</div>

  if (!authorized) {
    return <main className='mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center'>
      <h1 className='text-3xl font-bold text-slate-900'>Administrator access required</h1>
      <p className='text-slate-600'>Sign in with an account whose <code>isAdmin</code> value is enabled.</p>
      <ActionButton className='bg-emerald-700 text-white hover:bg-emerald-800' onClick={() => navigate('/admin/login')}>Admin sign in</ActionButton>
    </main>
  }

  const selectedBus = buses.find((bus) => bus._id === selectedBusId)

  return <main className='min-h-screen bg-slate-100 px-4 py-8 text-slate-900 md:px-8'>
    <div className='mx-auto max-w-7xl'>
      <header className='mb-7 flex flex-col gap-4 rounded-2xl bg-slate-900 p-6 text-white md:flex-row md:items-center md:justify-between'>
        <div><p className='text-sm font-semibold uppercase tracking-widest text-emerald-300'>TripTix</p><h1 className='text-3xl font-bold'>Admin console</h1><p className='mt-1 text-slate-300'>Manage route catalog, buses, physical seat layouts, and trips.</p></div>
        <div className='flex gap-2'><ActionButton className='bg-white text-slate-900 hover:bg-slate-200' onClick={() => navigate('/')}>Customer site</ActionButton><ActionButton className='bg-rose-600 text-white hover:bg-rose-700' onClick={() => { logout(); navigate('/') }}>Sign out</ActionButton></div>
      </header>

      <div className='mb-6 flex flex-wrap gap-2'>{tabs.map(([key, label]) => <ActionButton key={key} onClick={() => { setActiveTab(key); setEditingId(null) }} className={activeTab === key ? 'bg-emerald-700 text-white' : 'bg-white text-slate-700 hover:bg-emerald-50'}>{label}</ActionButton>)}</div>
      {message && <div className='mb-5 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900'>{message}</div>}

      {activeTab === 'routes' && <section className='grid gap-6 lg:grid-cols-[370px_1fr]'>
        <form onSubmit={(e) => { e.preventDefault(); saveRoute() }} className='h-fit rounded-2xl bg-white p-5 shadow-sm'>
          <h2 className='mb-5 text-xl font-bold'>{editingId ? 'Edit route' : 'Add route'}</h2>
          <div className='space-y-4'><Field label='Origin'><TextInput required value={routeForm.origin} onChange={(e) => setRouteForm({ ...routeForm, origin: e.target.value })} /></Field><Field label='Destination'><TextInput required value={routeForm.destination} onChange={(e) => setRouteForm({ ...routeForm, destination: e.target.value })} /></Field><Field label='Distance (km)'><TextInput required type='number' min='1' value={routeForm.distance} onChange={(e) => setRouteForm({ ...routeForm, distance: e.target.value })} /></Field></div>
          <div className='mt-5 flex gap-2'><ActionButton disabled={busy} className='bg-emerald-700 text-white hover:bg-emerald-800' type='submit'>{editingId ? 'Save route' : 'Create route'}</ActionButton>{editingId && <ActionButton type='button' className='bg-slate-200' onClick={() => { setEditingId(null); setRouteForm(emptyRoute) }}>Cancel</ActionButton>}</div>
        </form>
        <Table columns={['Origin', 'Destination', 'Distance', 'Actions']} rows={routes.map((route) => [route.origin, route.destination, `${route.distance} km`, <div className='flex gap-2' key={route._id}><ActionButton className='bg-amber-100 text-amber-900' onClick={() => { setEditingId(route._id); setRouteForm({ origin: route.origin, destination: route.destination, distance: route.distance }) }}>Edit</ActionButton><ActionButton className='bg-rose-100 text-rose-800' onClick={() => remove(`${Route_API.replace('?', '')}/${route._id}`, 'Route deleted.', loadCatalog)}>Delete</ActionButton></div>])} empty='No routes yet.' />
      </section>}

      {activeTab === 'buses' && <section className='grid gap-6 lg:grid-cols-[420px_1fr]'>
        <form onSubmit={(e) => { e.preventDefault(); saveBus() }} className='h-fit rounded-2xl bg-white p-5 shadow-sm'>
          <h2 className='mb-5 text-xl font-bold'>{editingId ? 'Edit bus' : 'Add bus'}</h2>
          <div className='grid gap-4 sm:grid-cols-2'><Field label='Route'><select required value={busForm.routesId} onChange={(e) => setBusForm({ ...busForm, routesId: e.target.value })} className='rounded-lg border border-slate-300 px-3 py-2'><option value=''>Select</option>{routes.map((route) => <option key={route._id} value={route._id}>{route.origin} → {route.destination}</option>)}</select></Field><Field label='Bus number'><TextInput required value={busForm.busNumber} onChange={(e) => setBusForm({ ...busForm, busNumber: e.target.value })} /></Field><Field label='Operator'><TextInput required value={busForm.operator} onChange={(e) => setBusForm({ ...busForm, operator: e.target.value })} /></Field><Field label='Bus type'><TextInput required value={busForm.busType} onChange={(e) => setBusForm({ ...busForm, busType: e.target.value })} /></Field><Field label='Departure'><TextInput required type='datetime-local' value={busForm.dep_time} onChange={(e) => setBusForm({ ...busForm, dep_time: e.target.value })} /></Field><Field label='Arrival'><TextInput required type='datetime-local' value={busForm.arrivalTime} onChange={(e) => setBusForm({ ...busForm, arrivalTime: e.target.value })} /></Field><Field label='Fare (₹)'><TextInput required type='number' min='0' value={busForm.price} onChange={(e) => setBusForm({ ...busForm, price: e.target.value })} /></Field><Field label='Seats'><TextInput required type='number' min='1' value={busForm.totalSeat} onChange={(e) => setBusForm({ ...busForm, totalSeat: e.target.value })} /></Field></div>
          <div className='mt-4 grid grid-cols-2 gap-3'>{[['isAc', 'Air conditioned'], ['isSeater', 'Seater'], ['isSleeper', 'Sleeper'], ['isWifi', 'Wi-Fi']].map(([key, label]) => <label className='flex items-center gap-2 text-sm' key={key}><input type='checkbox' checked={busForm[key]} onChange={(e) => setBusForm({ ...busForm, [key]: e.target.checked })} />{label}</label>)}</div>
          <div className='mt-5 flex gap-2'><ActionButton disabled={busy} className='bg-emerald-700 text-white hover:bg-emerald-800' type='submit'>{editingId ? 'Save bus' : 'Create bus'}</ActionButton>{editingId && <ActionButton type='button' className='bg-slate-200' onClick={() => { setEditingId(null); setBusForm(emptyBus) }}>Cancel</ActionButton>}</div>
        </form>
        <Table columns={['Bus', 'Route', 'Fare', 'Actions']} rows={buses.map((bus) => [<div key={bus._id}><strong>{bus.busNumber}</strong><div className='text-xs text-slate-500'>{bus.operator} · {bus.busType}</div></div>, `${bus.routesId?.origin || 'Unknown'} → ${bus.routesId?.destination || 'route'}`, `₹${bus.price}`, <div className='flex gap-2' key={bus._id}><ActionButton className='bg-amber-100 text-amber-900' onClick={() => { setEditingId(bus._id); setBusForm({ routesId: bus.routesId?._id || bus.routesId, busNumber: bus.busNumber, busType: bus.busType, operator: bus.operator, dep_time: toDateTimeInput(bus.dep_time), arrivalTime: toDateTimeInput(bus.arrivalTime), isAc: bus.isAc, isSleeper: bus.isSleeper, isSeater: bus.isSeater, isWifi: bus.isWifi, price: bus.price, totalSeat: bus.totalSeat, rating: bus.rating || 1 }) }}>Edit</ActionButton><ActionButton className='bg-rose-100 text-rose-800' onClick={() => remove(`${Bus_API}/${bus._id}`, 'Bus deleted.', loadCatalog)}>Delete</ActionButton></div>])} empty='No buses yet. Add a route, then add a bus.' />
      </section>}

      {(activeTab === 'seats' || activeTab === 'trips') && <section className='space-y-6'>
        <div className='rounded-2xl bg-white p-5 shadow-sm'><Field label='Selected bus'><select value={selectedBusId} onChange={(e) => selectBus(e.target.value)} className='mt-1 w-full max-w-xl rounded-lg border border-slate-300 px-3 py-2'><option value=''>Choose a bus</option>{buses.map((bus) => <option key={bus._id} value={bus._id}>{bus.busNumber} — {bus.operator}</option>)}</select></Field>{selectedBus && <p className='mt-2 text-sm text-slate-500'>Managing {selectedBus.busNumber}. Add its physical seat layout before creating a trip.</p>}</div>
        {activeTab === 'seats' && <div className='grid gap-6 lg:grid-cols-[330px_1fr]'>
          <form onSubmit={(e) => { e.preventDefault(); saveSeat() }} className='h-fit rounded-2xl bg-white p-5 shadow-sm'><h2 className='mb-5 text-xl font-bold'>{editingId ? 'Edit seat' : 'Add physical seat'}</h2><div className='space-y-4'><Field label='Seat number'><TextInput required placeholder='A1' value={seatForm.seatNumber} onChange={(e) => setSeatForm({ ...seatForm, seatNumber: e.target.value })} /></Field><Field label='Preference'><select value={seatForm.seatPreference} onChange={(e) => setSeatForm({ ...seatForm, seatPreference: e.target.value })} className='w-full rounded-lg border border-slate-300 px-3 py-2'><option value='window'>Window</option><option value='aisle'>Aisle</option><option value='middle'>Middle</option></select></Field></div><div className='mt-5 flex gap-2'><ActionButton disabled={busy || !selectedBusId} className='bg-emerald-700 text-white hover:bg-emerald-800' type='submit'>{editingId ? 'Save seat' : 'Add seat'}</ActionButton>{editingId && <ActionButton type='button' className='bg-slate-200' onClick={() => { setEditingId(null); setSeatForm(emptySeat) }}>Cancel</ActionButton>}</div></form>
          <Table columns={['Seat', 'Preference', 'Actions']} rows={seats.map((seat) => [seat.seatNumber, seat.seatPreference, <div className='flex gap-2' key={seat._id}><ActionButton className='bg-amber-100 text-amber-900' onClick={() => { setEditingId(seat._id); setSeatForm({ seatNumber: seat.seatNumber, seatPreference: seat.seatPreference }) }}>Edit</ActionButton><ActionButton className='bg-rose-100 text-rose-800' onClick={() => remove(`${Seat_API}/${seat._id}`, 'Seat removed.', () => loadBusInventory(selectedBusId))}>Delete</ActionButton></div>])} empty='Select a bus to manage its physical seat layout.' />
        </div>}
        {activeTab === 'trips' && <div className='grid gap-6 lg:grid-cols-[360px_1fr]'>
          <form onSubmit={(e) => { e.preventDefault(); saveTrip() }} className='h-fit rounded-2xl bg-white p-5 shadow-sm'><h2 className='mb-5 text-xl font-bold'>{editingId ? 'Edit trip' : 'Schedule trip'}</h2><Field label='Departure date and time'><TextInput required type='datetime-local' value={tripDate} onChange={(e) => setTripDate(e.target.value)} /></Field><div className='mt-5 flex gap-2'><ActionButton disabled={busy || !selectedBusId} className='bg-emerald-700 text-white hover:bg-emerald-800' type='submit'>{editingId ? 'Save trip' : 'Create trip inventory'}</ActionButton>{editingId && <ActionButton type='button' className='bg-slate-200' onClick={() => { setEditingId(null); setTripDate('') }}>Cancel</ActionButton>}</div></form>
          <Table columns={['Departure', 'Trip ID', 'Actions']} rows={trips.map((trip) => [new Date(trip.departureDate).toLocaleString(), trip._id, <div className='flex gap-2' key={trip._id}><ActionButton className='bg-amber-100 text-amber-900' onClick={() => { setEditingId(trip._id); setTripDate(toDateTimeInput(trip.departureDate)) }}>Edit</ActionButton><ActionButton className='bg-rose-100 text-rose-800' onClick={() => remove(`${Trip_API}/${trip._id}`, 'Trip and its inventory deleted.', () => loadBusInventory(selectedBusId))}>Delete</ActionButton></div>])} empty='Select a bus to see its trips.' />
        </div>}
      </section>}
    </div>
  </main>
}

function Table({ columns, rows, empty }) {
  return <div className='overflow-x-auto rounded-2xl bg-white shadow-sm'><table className='min-w-full text-left text-sm'><thead className='bg-slate-50 text-slate-600'><tr>{columns.map((column) => <th className='px-5 py-4 font-semibold' key={column}>{column}</th>)}</tr></thead><tbody>{rows.length > 0 ? rows.map((row, rowIndex) => <tr key={rowIndex} className='border-t border-slate-100'>{row.map((cell, cellIndex) => <td key={cellIndex} className='px-5 py-4'>{cell}</td>)}</tr>) : <tr><td colSpan={columns.length} className='px-5 py-8 text-center text-slate-500'>{empty}</td></tr>}</tbody></table></div>
}
