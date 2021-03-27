const { response } = require('express');
const Doctor = require('../models/doctors');

const getDoctors = async(req, res = response) => {

    const doctors = await Doctor.find().populate('user', 'name img')
                                       .populate('hospital', 'name img');

    res.json({
        ok: true,
        doctors
    });
}

const getDoctorById = async(req, res = response) => {

    const id = req.params.id;

    try{
        const doctor = await Doctor.findById(id)
                                    .populate('user', 'name img')
                                    .populate('hospital', 'name img');
    
        res.json({
            ok: true,
            doctor
        })
    } catch(error){
        console.log(error)
        res.json({
            ok: true,
            msg: 'doctor not finded'
        })
    }
}

const createDoctor = async(req, res = response) => {

    const uid = req.uid;
    const doctor = new Doctor({
        user: uid,
        ...req.body
    });
    try {
        const doctorDB = await doctor.save();
        res.json({
            ok: true,
            doctor: doctorDB,
        });
        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            ok: false,
            msg: "talk to an administrator"
        });
    }
}

const updateDoctor = async(req, res = response) => {
    const id = req.params.id;
    const uid = req.uid;
    try {
        const doctor = await Doctor.findById(id);
        if(!doctor){
            return res.status(404).json({
                ok: true,
                msg: 'Doctor not found by id'
            });            
        }
        const doctorChanges = {
            ...req.body,
            user: uid
        }
        const updatedDoctor = await Doctor.findByIdAndUpdate(id, doctorChanges, {new: true});
        res.json({
            ok: true,
            doctor: updatedDoctor
        });
    } catch (error) {
        console.log(error);
        require.status(500).json({
            ok: false,
            msg: 'talk to an administrator'
        });
    }
}

const deleteDoctor = async(req, res = response) => {
    const id = req.params.id; 
        try {
            const doctor = await Doctor.findById(id);
            if(!doctor){
                return res.status(404).json({
                    ok: true,
                    msg: 'Doctor not found by id'
                });            
            }
            await Doctor.findByIdAndDelete(id);
            res.json({
                ok: true,
                msg: 'doctor deleted'
            });
        } catch (error) {
            console.log(error);
            require.status(500).json({
                ok: false,
                msg: 'talk to an administrator'
            });
        }
}

module.exports = {
    getDoctors,
    getDoctorById,
    createDoctor,
    updateDoctor,
    deleteDoctor
}