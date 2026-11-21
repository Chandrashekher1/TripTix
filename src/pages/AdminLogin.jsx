import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthContext from '../context/AuthContext'
import { Login_Api } from '../utils/constant'

export default function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const response = await fetch(Login_Api, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(data.message || 'Unable to sign in.')
      if (!data.isAdmin) {
        throw new Error('This account does not have administrator access.')
      }
      const token = response.headers.get('authorization') || data.token
      if (!token) throw new Error('No authentication token was returned.')
      login(token, data._id)
      navigate('/admin', { replace: true })
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return <main className='flex min-h-[70vh] items-center justify-center bg-slate-100 px-4 py-10'>
    <form onSubmit={handleSubmit} className='w-full max-w-md rounded-2xl bg-white p-7 shadow-xl'>
      <p className='text-sm font-bold uppercase tracking-[0.2em] text-emerald-700'>TripTix</p>
      <h1 className='mt-2 text-3xl font-bold text-slate-900'>Admin sign in</h1>
      <p className='mt-2 text-sm text-slate-600'>Use an administrator account to manage routes, buses, seat layouts, and trips.</p>
      {message && <p className='mt-5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800'>{message}</p>}
      <label className='mt-5 flex flex-col gap-1 text-sm font-semibold text-slate-700'>Email
        <input required type='email' value={email} onChange={(event) => setEmail(event.target.value)} className='rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100' />
      </label>
      <label className='mt-4 flex flex-col gap-1 text-sm font-semibold text-slate-700'>Password
        <input required type='password' value={password} onChange={(event) => setPassword(event.target.value)} className='rounded-lg border border-slate-300 px-3 py-2 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100' />
      </label>
      <button disabled={loading} type='submit' className='mt-6 w-full rounded-lg bg-emerald-700 px-4 py-2 font-semibold text-white hover:bg-emerald-800 disabled:opacity-50'>{loading ? 'Signing in…' : 'Sign in as admin'}</button>
      <button type='button' onClick={() => navigate('/')} className='mt-3 w-full rounded-lg px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100'>Back to customer site</button>
    </form>
  </main>
}
