import React, { useEffect, useState } from 'react'

const TodoList = () => {

    const [tasks, setTasks] = useState([])
    const [task, setTask] = useState('')

    useEffect(() => {
        getTasks()
    }, [])

    const getTasks = () =>{
        fetch('http://127.0.0.1:8000/api/task-list')
        .then(res => {return res.json()})
        .then(data => {setTasks(data)})
    }

    const getCookie = (name) => {
        let cookieValue = null;
        if (document.cookie && document.cookie !== '') {
            const cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                const cookie = cookies[i].trim();
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) === (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }

    const handleTaskChange = (e) =>{
        setTask(e.target.value)
        // setTask(e.target.id)
    }

    const handleAddTask = (e) =>{
        e.preventDefault()

        const csrftoken = getCookie('csrftoken')

        let url = 'http://127.0.0.1:8000/api/task-create/'

        const newTask = {
            id:null,
            task: task,
            completed: false,
        }
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify(newTask)
        })
        .then(res => {
            getTasks()
            setTasks([{
                id: null,
                task: '',
                completed:false,
            }])
        }).catch((error) =>{
            console.log('ERROR:', error)
        })
        setTasks([''])
    }

    const deleteTask = (task) =>{

        const csrftoken = getCookie('csrftoken')

        fetch(`http://127.0.0.1:8000/api/task-delete/${task.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
        }).then(res =>{
            getTasks()
        })
    }


    const strikeUnstrike = (task) =>{
        task.completed = !task.completed;
        const csrftoken = getCookie('csrftoken')
        let url = `http://127.0.0.1:8000/api/task-update/${task.id}`

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken,
            },
            body: JSON.stringify({'completed': task.completed, 'task': task.task})
        }).then(() =>{ getTasks() })
    }

  return (
    <div className='container'>

      <div id="task-container">

        <div className="form-wrapper">
            <form action="" className='task-wrapper' onSubmit={handleAddTask}>
                <div className="flex-wrapper">
                <div className="inputBox" style={{flex: 6}}>
                    <input style={{width: '100%', height: '2rem'}} type="text" placeholder='Add task' onChange={handleTaskChange} name='task' className='task'  value={task.task}/>
                </div>

                <div className="inputBox" style={{flex: 1}}>
                    <input style={{padding: '8.2px 15px', cursor: 'pointer'}} type="submit" name='Add' className='btn' />
                </div>
                </div>
            </form>
        </div>

        <div id='list-wrapper'>
            {tasks.map(task =>{
                return <div className='task-wrapper flex-wrapper' key={task.id}>

                    <div style={{flex: 7}} onClick={() => strikeUnstrike(task)}>
                        {task.completed == false ? (<span>{task.task}</span>) : (<strike>{task.task}</strike>)}
                    </div>
                    <div style={{flex: 1}}>
                        <button onClick={() => deleteTask(task)} className='delete-btn'>-</button>
                    </div>

                </div>
            }).reverse()}
        </div>

      </div>

    </div>
  )
}

export default TodoList
