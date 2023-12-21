const Note = require("../models/Note")
const User = require("../models/User")
const asyncHandler = require("express-async-handler")

const getAllNotes = asyncHandler(async(req, res)=>{
    const notes = await Note.find().lean()
    if(!notes?.length){
        return res.status(400).json({message:"note not found"})
    }
    res.json(notes)
})

const createNote = asyncHandler(async(req, res)=>{
    const {user, title, text, completed} = req.body
    //confirm data
    if(!user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message:"all fields are required"})
    }
    const noteObject = {user, title, text, completed}
    const note = await Note.create(noteObject)
    if(note){
        return res.status(201).json({message:"note created successfully"})
    }
    else{
        return res.status(400).json({message:"invalid note created"})
    }
})

const updateNote = asyncHandler(async(req, res)=>{
    const {id, user, title, text, completed} = req.body
    if(!id || !user || !title || !text || typeof completed !== 'boolean'){
        return res.status(400).json({message:"all fields are required"})
    }
    const note = await Note.findById(id).exec()
    if(!note){
        return res.status(400).json({message:"note not found"})
    }
    note.user = user,
    note.title = title,
    note.text = text, 
    note.completed = completed

    const updateNote = await note.save()
    res.json({message: "note updated"})
})

const deleteNote = asyncHandler(async(req, res)=>{
    const {id} = req.body
    if(!id){
        return res.status(400).json({message: "id required"})
    }
    const note = await Note.findById(id).exec()
    if(!note){
        return res.status(400).json({message:"note not found"})
    }
    const result = await note.deleteOne()
    res.json({message:"note successfully deleted"})
})

module.exports = {
    getAllNotes,
    createNote,
    updateNote,
    deleteNote
}