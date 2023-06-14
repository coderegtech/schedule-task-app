"use client";
import pin from "@/assets/pin.svg";
import useAuthStore from "@/features/auth";
import useScheduleStore from "@/features/schedule";
import { db } from "@/firebase-config";
import { deleteDoc, doc } from "firebase/firestore";
import Image from "next/image";
import { useState } from "react";
import { BiDotsHorizontal, BiEdit, BiTrash } from "react-icons/bi";
import { Schedule } from "../task.interface";

interface Proptypes extends Schedule {
    openEditModal: () => void
}


export default function Card({ id, name, date, tasks, openEditModal }: Proptypes) {
    const formattedDay = new Intl.DateTimeFormat("en-US", {
        weekday: "long",
    }).format(new Date(date));
    const [activeOption, setActiveOption] = useState(false);
    const removeSchedule = useScheduleStore((state) => state.removeSchedule);
    const selectOneSchedule = useScheduleStore((state) => state.selectOneSchedule);

    const currentUser = useAuthStore((state) => state.currentUser);

    const cardDayColors: any = {
        monday: "rgb(251, 255, 0)",
        tuesday: "rgb(102, 255, 0)",
        wednesday: "rgb(0, 251, 255)",
        thursday: "rgb(255, 136, 0)",
        friday: "rgb(255, 82, 241)",
        saturday: "rgb(255, 0, 0)",
        sunday: "rgb(255, 255, 255)",
    };

    const formattedDate = new Date(date).toLocaleDateString("en-PH", {
        timeZone: "Asia/Manila",
        year: "numeric",
        month: "long",
        day: "numeric",
    });

    const deleteSchedule = async (id: string) => {
        if (confirm("Do want to remove this schedule task?")) {
            await deleteDoc(doc(db, "schedules", id))
                .then((response) => {
                    console.log(response);
                    alert("Schedule Task deleted!");
                    removeSchedule(id);

                })
                .catch((error) => {
                    console.log(error);
                });
        }
    };

    const cardSelected = (id: string) => {
        openEditModal()
        selectOneSchedule(id)
    }



    return (
        <div
            onClick={(e) => {
                setActiveOption(false);
            }}
        >
            <div
                style={{ backgroundColor: cardDayColors[formattedDay.toLowerCase()] }}
                className="shadow-notes relative min-w-[300px] max-w-[400px]  w-full h-[320px] min-h-[320px] bg-blue-400 p-3 z-40 -rotate-2">
                <Image
                    src={pin}
                    width={80}
                    height={80}
                    alt=""
                    className="absolute left-1/2 -top-10 -translate-x-1/2 z-50 drop-shadow-xl"
                />
                <span
                    onClick={(e) => {
                        setActiveOption(!activeOption);
                        e.stopPropagation();
                    }}
                    className={`${activeOption
                        ? "bg-black/80 text-white"
                        : !currentUser
                            ? "hidden"
                            : "block"
                        } absolute right-3 top-3 rounded-full hover:bg-black/80 hover:text-white cursor-pointer`}
                >
                    <BiDotsHorizontal className="text-xl" />
                </span>

                <ul
                    className={`${activeOption ? "block" : "hidden"
                        } absolute -right-12 top-10 bg-white`}
                >
                    <li
                        onClick={() => cardSelected(id)}
                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-300 px-2 py-1 ">
                        <span>
                            <BiEdit />
                        </span>
                        <p>Edit</p>
                    </li>
                    <li
                        onClick={() => deleteSchedule(id)}
                        className="flex items-center gap-1 cursor-pointer hover:bg-gray-300 px-2 py-1 "
                    >
                        <span>
                            <BiTrash />
                        </span>
                        <p>Delete</p>
                    </li>
                </ul>

                <div className="">
                    <h2 className="text-black text-center font-bold pt-6 pb-2 text-2xl">
                        {formattedDay}
                    </h2>

                    <div className="pb-3">
                        <span className="flex gap-2 items-end">
                            <p className="font-semibold">Name: </p>
                            <p>{name.toUpperCase()}</p>
                        </span>
                        <span className="flex gap-2 items-end">
                            <p className="font-semibold">Date: </p>
                            <p>{formattedDate.toUpperCase()}</p>
                        </span>
                    </div>

                    <span className="text-lg font-semibold">Tasks: </span>
                    <ul>
                        {tasks?.map(({ task, completed }) => {
                            return (
                                <li className="flex items-center gap-1">
                                    <span>*</span>
                                    <p
                                        className={`${completed ? "line-through text-gray-700" : ""
                                            }`}
                                    >
                                        {task}
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </div>
        </div>
    );
}
