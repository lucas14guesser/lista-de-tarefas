import './App.css'

import { useState, useEffect } from 'react'
import {BsTrash, BsBookmarkCheck, BsBookmarkCheckFill} from 'react-icons/bs'

const API = "http://localhost:5000"

function App() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [time, setTime] = useState("")
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(false)

  // Load todos on page load
  useEffect(() => {
    const loadData = async() => {
      setLoading(true)

      const res = await fetch(API + '/todos')
        .then((res) => res.json())
        .then((data) => data)
        .catch((err) => console.log(err))

        setLoading(false)

        setTodos(res)
    }

    loadData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()

    const todo = {
      id: Math.random(),
      title,
      description,
      time,
      done: false,
    }

    // Envio paara API
    await fetch(API + '/todos', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    setTodos((prevState) => [...prevState, todo])

    setTitle('')
    setDescription('')
    setTime('')
  }

  function handleDelete(id) {
    fetch(`http://localhost:5000/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      })
      .then((resp) => resp.json())
      .then(() => {
        setTodos(todos.filter((todo) => todo.id !== id))
      })
      .catch((err) => console.log(err))

  }

  const handleEdit = async (todo) => {

    todo.done = !todo.done

    const data = await fetch(API + '/todos' + todo.id, {
      method: 'PUT',  
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },   
    })

    setTodos((prevState) => prevState.map((t) => (t.id === data.id ? (t = data) : t)))
  }

  if(loading) {
    return <p>Carregando...</p>
  }

  return (
    <div className="App">
      <div className='todo_header'>
        <h1>Tarefas</h1>
      </div>
      <div className='form_todo'>
        <h2>Insira a sua próxima tarefa:</h2>
          <form onSubmit={handleSubmit}>
            <div className='form_control'> 
              <label htmlFor='title'>Tarefa:</label>
              <input
                type='text'
                name='title'
                placeholder='Título da tarefa'
                onChange={(e) => setTitle(e.target.value)}
                value={title || ''}
                required              
              ></input>
            </div>
            <div className='form_control'> 
              <label htmlFor='description'>Descrição:</label>
              <input
                type='text'
                name='description'
                placeholder='Descreva a tarefa'
                onChange={(e) => setDescription(e.target.value)}
                value={description || ''}
                required              
              ></input>
            </div>
            <div className='form_control'> 
              <label htmlFor='time'>Duração:</label>
              <input
                type='number'
                name='time'
                placeholder='Tempo estimado (em horas)'
                onChange={(e) => setTime(e.target.value)}
                value={time || ''}
                required              
              ></input>
            </div>
            <input 
              type='submit'
              value='Criar tarefa'            
            ></input>
          </form>
      </div>
      <div className='list_todo'>
        <h2>Lista de tarefas:</h2>
        {todos.length === 0 && <p>Não há tarefas!</p>}
        {todos.map((todo) => (
          <div className='todo' key={todo.id}>
            <h3 className={todo.done ? 'todo_done' : ''}>{todo.title}</h3>
            <p>Descrição: {todo.description}</p>
            <p>Duração: {todo.time} horas</p>
            <div className='actions'>
              <span onClick={() => handleEdit(todo)}>
                {!todo.done ? <BsBookmarkCheck /> : <BsBookmarkCheckFill />}
              </span>
              <BsTrash onClick={() => handleDelete(todo.id)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App
