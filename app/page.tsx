
"use client"
import useAuthStore from "@/features/auth"
import useScheduleStore from "@/features/schedule"
import { auth, db } from "@/firebase-config"
import { onAuthStateChanged, signOut } from "firebase/auth"
import {
  collection,
  onSnapshot,
  orderBy,
  query
} from 'firebase/firestore'
import Link from "next/link"
import { useEffect, useState } from "react"
import AddTaskModal from "./components/AddTaskModal"
import Card from "./components/Card"
import EditTaskModal from "./components/EditTaskModal"
import Loading from "./components/Loading"
export default function Home() {
  const [activeAddTaskModal, setActiveAddTaskModal] = useState(false)
  const [activeEditTaskModal, setActiveEditTaskModal] = useState(false)

  const { currentUser, setCurrentUser, isLoading: userLoading } = useAuthStore(state => ({
    isLoading: state.isLoading,
    currentUser: state.currentUser,
    setCurrentUser: state.setCurrentUser
  }))
  const fetching = useScheduleStore(state => state.fetching)
  const isLoading = useScheduleStore(state => state.isLoading)
  const getAllSchedule = useScheduleStore(state => state.getAllSchedule)
  const schedules = useScheduleStore(state => state.schedule)

  const getCurrentUser = async () => {
    await onAuthStateChanged(auth, user => {
      setCurrentUser(user)
    })
  }


  const getAllSchedules = async () => {
    fetching()
    const q = query(collection(db, "schedules"), orderBy('createdAt', 'asc'))
    const unsubscribe = onSnapshot(q, snapshots => {
      const data = snapshots.docs.map(doc => ({ ...doc.data(), id: doc.id }))
      getAllSchedule(data)
    })
  }

  useEffect(() => {
    if (!isLoading) getAllSchedules()
    if (!userLoading) getCurrentUser()
  }, [])

  const logoutAdmin = async () => {
    await signOut(auth).then(() => {
      alert("Admin logged out")
      setCurrentUser(null)
    }).catch(err => {
      console.log(err)
    })
  }


  return (
    <div className="relative w-full h-screen bg-center bg-wall bg-cover bg-no-repeat  overflow-hidden">
      <div className="max-w-[2080px] mx-auto w-full h-full overflow-y-auto py-5">
        <header className="w-full min-h-[80px] flex items-center justify-end gap-3 px-16 py-5 ">


          {currentUser ?
            <div className="flex gap-3 items-center">
              <button className="px-3 py-2 font-semibold font-sans text-white  bg-[green]" type="button" onClick={() => setActiveAddTaskModal(true)}>ADD TASK</button>
              <button className="px-3 py-2 font-semibold font-sans text-black  bg-[yellow]" type="button" onClick={logoutAdmin}>LOGOUT</button>
            </div>
            : (
              <Link href="/login" className="px-3 py-2 font-semibold font-sans text-black  bg-[yellow] ">LOGIN</Link>
            )}


        </header>

        <h1 className="title text-center text-title font-bold text-white font-sans drop-shadow-2xl">SCHEDULE TASKS</h1>

        {/* cards container */}
        <div className="pt-16 px-5  w-full flex flex-wrap justify-center items-center gap-20">

          {isLoading ? (<Loading />) : schedules.length === 0 ? (<span className="text-3xl text-white font-bold">No Schedules Available</span>) : schedules?.map((schedule) => {
            return (<Card key={schedule.id} {...schedule} openEditModal={() => setActiveEditTaskModal(true)} />)
          })}
        </div>


        {/* add task modal */}
        {activeAddTaskModal && <AddTaskModal closeModal={() => setActiveAddTaskModal(false)} />}
        {activeEditTaskModal && <EditTaskModal closeModal={() => setActiveEditTaskModal(false)} />}
      </div>
    </div>
  )
}