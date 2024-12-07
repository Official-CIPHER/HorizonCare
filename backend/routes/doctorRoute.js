import express from 'express'
import { doctorList,loginDoctor,appointmentsDoctor,
  appointmentComplete ,appointmentCancel,
  doctorDashboard ,
  doctorProfile, updateDoctorProfile
 } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list',doctorList)
doctorRouter.post('/login',loginDoctor)
doctorRouter.get('/appointments',authDoctor,appointmentsDoctor)

// Appointment complete and cancel route
doctorRouter.post('/complete-appointment',authDoctor,appointmentComplete)
doctorRouter.post('/cancel-appointment',authDoctor,appointmentCancel)

// Dashboard Data Route
doctorRouter.get('/dashboard',authDoctor,doctorDashboard)

// Doctor profile and update doctor profile
doctorRouter.get('/profile',authDoctor,doctorProfile)
doctorRouter.post('/update-profile',authDoctor,updateDoctorProfile)

export default doctorRouter