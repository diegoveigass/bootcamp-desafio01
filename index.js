const express = require('express')

const server = express()

server.listen(3001)

server.use(express.json())

const projects = [{
  "id": "0",
  "title": "Novo projeto",
  "tasks": []
}]

let numOfReqs = 0

// MIDDLEWARES
function requestById (req, res, next) {
  const { id } = req.params
  const project = projects.find(p => p.id == id);
  if(!project) {
    return res.status(400).json({error: `ID: ${id} dont exist`})
  }

  return next()
}

function allRequests (req, res, next) {
  numOfReqs++
  console.log(`Requisições realizadas : ${numOfReqs}, tipo: ${req.method} e URL:${req.url}`)
  return next()
}
// MIDDLEWARES

server.use(allRequests);

// =-=-=-=- CRUD -=-=-=-=

// EXIBIR TODOS OS PROJETOS

server.get('/projects', (req,res) => {
  return res.json(projects)
})

// CRIAR PROJETO

server.post('/projects', (req,res) => {
  const { id, title } = req.body
  const project = {
    id,
    title,
    tasks: []
  }

  projects.push(project)

  return res.json(project)
})

// EDITAR PROJETO

server.put('/projects/:id',requestById, (req, res) => {
  const { id } = req.params
  const { title } = req.body

  const project = projects.find(p => p.id == id)
  project.title = title
  return res.json(project)
})

//DELETAR PROJETO

server.delete('/projects/:id',requestById, (req,res) => {
  const { id } = req.params
  const projectIndex = projects.findIndex(p => p.id == id)
  projects.splice(projectIndex, 1)
  return res.json('Deletado com sucesso!')
})

// PROCURAR 1 ARQUIVO

server.get('/projects/:id',requestById, (req,res) => {
  const { id } = req.params
  const project = projects.find( p => p.id === id)
  return res.json(project)
})

//TASK

server.post('/projects/:id/tasks',requestById, (req, res) => {
  const { id } = req.params
  const { title } = req.body
  const project = projects.find( p => p.id === id)
  
  project.tasks.push(title)
  return res.json(project)

})