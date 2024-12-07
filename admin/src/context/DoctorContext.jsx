import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import {toast} from 'react-toastify'

export const DoctorContext = createContext()

const DoctorContextProvider = (props) => {

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  
  // dToken = doctor token
  const [dToken,setDToken] = useState(localStorage.getItem('dToken')?localStorage.getItem('dToken'):'')

  // appointment Data
  const [appointments , setAppointments] = useState([]) 

  // Dashboard Data
  const [dashData,setDashData] = useState(false)

  // State to store profile data 
  const [profileData ,setProfileData] = useState(false)

  // Show all the appointments
  const getAppointments = async() => {
    try {
      
      const {data} = await axios.get(backendUrl + '/api/doctor/appointments',{headers:{dToken}})
      if(data.success) {
        // reverse the array to get latest appointment
        setAppointments(data.appointments)
        // console.log(data.appointments);
        
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  // Function to mark the appointment completed
  const completeAppointment = async(appointmentId) => {
    try {
      
      const {data} = await axios.post(backendUrl + '/api/doctor/complete-appointment',{appointmentId},{headers:{dToken}})
      if(data.success){
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  // function to mark cancel the appointment on doctor panel
  const cancelAppointment = async(appointmentId) => {
    try {
      
      const {data} = await axios.post(backendUrl + '/api/doctor/cancel-appointment',{appointmentId},{headers:{dToken}})
      if(data.success){
        toast.success(data.message)
        getAppointments()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }


  // Get Dashboard data
  const getDashData = async() => {
    try {
      
      const {data} = await axios.get(backendUrl + '/api/doctor/dashboard',{headers:{dToken}})

      if(data.success) {
        setDashData(data.dashData)
        // console.log(data.dashData);
        
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }

  }

  // function to get profile data
  const getProfileData = async() => {
    try {
      
      const {data} = await axios.get(backendUrl + '/api/doctor/profile',{headers:{dToken}})

      if(data.success) {
        setProfileData(data.profileData)
        // console.log(data.profileData);
        
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error);
      toast.error(error.message)
    }
  }

  const value = {
    dToken,setDToken,
    backendUrl,
    appointments , setAppointments,
    getAppointments,
    completeAppointment,cancelAppointment,
    dashData,setDashData,
    getDashData,
    profileData ,setProfileData,
    getProfileData
  }

  return (
    <DoctorContext.Provider value={value}>
      {props.children}
    </DoctorContext.Provider>
  )
}

export default DoctorContextProvider