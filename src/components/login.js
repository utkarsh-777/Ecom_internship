import React from "react"
import { useState } from "react"
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import {Container, Button, Checkbox, Form } from 'semantic-ui-react'

const Login = () => {
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [flag,setFlag] = useState(false);
    const history = useHistory();

    const handleSubmit = () => {
        fetch("http://localhost:7000/api/login",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                username,
                password
            })
        }).then(res=>res.json())
          .then(data=>{
              localStorage.setItem('token',data.token)
              history.push('/')
          }).catch(err=>{
              console.log(err)
          })
    }

    return(
        <Container style={{marginTop:"40px"}}>
        <Form onSubmit={()=>handleSubmit()}>
            <h1>Login To Ecom</h1>
            <Form.Field>
            <label>Username</label>
            <input placeholder='Choose a Username' onChange={(e)=>setUsername(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <label>Password</label>
            <input placeholder='Choose a Password' type='password' onChange={(e)=>setPassword(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <Checkbox onChange={()=>setFlag(!flag)} label='I agree to the Terms and Conditions' />
            </Form.Field>
            {flag ? 
                <Button type='submit'>Login</Button>
                :
                <Button disabled type='submit'>Login</Button>
            }
        </Form>
        <p style={{marginTop:"25px"}}>Do not have an account? <Link to="/signup">Signup</Link></p>
        </Container>
    )
}

export default Login;