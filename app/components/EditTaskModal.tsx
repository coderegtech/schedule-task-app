"use client";

import useScheduleStore from "@/features/schedule";
import { db } from "@/firebase-config";
import { deleteDoc, doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useState } from "react";
import { BsCheck } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import { Tasks } from "../task.interface";
interface Proptype {
    closeModal: () => void;
}

export default function EditTaskModal({ closeModal }: Proptype) {
    const selectedData = useScheduleStore(state => state.selectedData)
    const removeSchedule = useScheduleStore((state) => state.removeSchedule);
    const updateSchedule = useScheduleStore((state) => state.updateSchedule);
    const [tasks, setTask] = useState<Tasks[]>(selectedData.tasks);
    const [taskInput, setTaskInput] = useState("");
    const [name, setName] = useState(selectedData.name);
    const [date, setDate] = useState<any>(selectedData.date);


    const submitEditScheduleTask = async (event: any) => {
        event.preventDefault();

        const newUpdatedScheduleTask = {
            name: name,
            date: date,
            tasks: [...tasks],
            createdAt: serverTimestamp(),
        };

        await setDoc(doc(db, "schedules", selectedData.id), newUpdatedScheduleTask).then(res => {

            alert("New Schedule Task Updated!");
            closeModal();
            updateSchedule(selectedData.id, newUpdatedScheduleTask);

        }).catch(error => {
            console.log(error);

        })

    };

    const addPersonTask = () => {
        const newPersonTask: Tasks = {
            id: Math.floor(Math.random() * 100).toString(),
            task: taskInput,
            completed: false,
            createdAt: new Date(Date.now()),
        };
        setTask((prev) => [...prev, newPersonTask]);
        setTaskInput("");
    };

    const removeTask = async (id: string) => {
        await deleteDoc(doc(db, "schedules", id)).then(res => {
            const updatedTask = tasks.filter(task => task.id !== id)
            setTask(updatedTask);
            removeSchedule(id)
        }).catch(error => {
            console.log(error);
        })
    };

    const updateTask = async (id: string) => {
        const updatedTask = tasks.map(task => task.id === id ? { ...task, completed: true } : task)
        setTask(updatedTask)
    };

    return (
        <div className=" absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-lg  w-full rounded-md bg-white z-50 p-3 shadow-2xl border border-gray-300">
            <h2 className="text-3xl font-bold ">Edit Schedule Task</h2>

            <form
                className="w-full flex flex-col gap-2 py-3 "
                onSubmit={submitEditScheduleTask}
            >
                <label htmlFor="" className="text-sm text-gray-500">
                    Name
                </label>
                <input
                    className=" px-3 py-2 border-2 border-gray-500 focus:outline outline-2 outline-black/80 rounded-sm"
                    type="text"
                    value={name}
                    placeholder="Enter name..."
                    onChange={(e) => setName(e.target.value)}
                    required
                />

                <label htmlFor="" className="text-sm text-gray-500">
                    Date
                </label>
                <input type="date" onChange={(e) => setDate(e.target.value)} value={date} required />

                <label htmlFor="" className="text-sm text-gray-500">
                    Task
                </label>
                <span className="flex w-full gap-1 items-center">
                    <input
                        className="w-full px-3 py-2  border-2 border-gray-500 focus:outline outline-2 outline-black/80 rounded-sm"
                        value={taskInput}
                        type="text"
                        placeholder="Input task..."
                        onChange={(e) => setTaskInput(e.target.value)}
                    />
                    <button
                        disabled={!taskInput}
                        className="min-w-[100px] bg-black text-white px-3 py-2"
                        type="button"
                        onClick={addPersonTask}
                    >
                        Add Task
                    </button>
                </span>

                <div className="w-full min-h-[150px] h-full border-2 border-gray-500 rounded-sm p-2 relative">
                    <ul className="h-full overflow-y-auto absolute inset-0 w-full px-3">
                        {!tasks ||
                            (tasks?.length === 0 && (
                                <span className="text-xl text-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                                    No Tasks
                                </span>
                            ))}
                        {tasks?.map(({ task, id, completed }) => {
                            return (
                                <li key={id} className="flex justify-between items-center py-2">
                                    <p className={`${completed ? 'line-through' : ''}`}>{task}</p>
                                    <div className="flex gap-1 justify-between items-center">
                                        <span
                                            onClick={() => updateTask(id)}
                                            className="text-lg cursor-pointer"
                                        >
                                            <BsCheck className="text-[green]" />
                                        </span>
                                        <span
                                            className="text-lg cursor-pointer"
                                            onClick={() => removeTask(id)}
                                        >
                                            <RxCross2 className="text-[red]" />
                                        </span>
                                    </div>

                                </li>
                            );
                        })}
                    </ul>
                </div>

                <div className="flex gap-2 justify-end pt-5">
                    <button className="bg-blue-800 text-white px-3 py-2" disabled={!name} type="submit">
                        Submit
                    </button>
                    <button
                        className="bg-[red] text-white px-3 py-2"
                        onClick={closeModal}
                    >
                        Close
                    </button>
                </div>
            </form>
        </div>
    );
}
