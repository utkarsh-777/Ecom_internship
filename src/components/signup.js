import React from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import {Container, Button, Checkbox, Form } from 'semantic-ui-react';
import { Link } from "react-router-dom";

const Signup = () => {
    const [name,setName] = useState('');
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [flag,setFlag] = useState(false);
    const history = useHistory();

    const handleSubmit = () => {
        fetch("http://localhost:7000/api/signup",{
            method:'POST',
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                username,
                password
            })
        }).then(res=>res.json())
          .then(data=>{
              console.log(data)
              history.push('/login')
          }).catch(err=>{
              console.log(err)
          })
    }

    return(
        <Container style={{marginTop:"40px"}}>
        <Form onSubmit={()=>handleSubmit()}>
            <h1>SignUp To Ecom</h1>
            <Form.Field>
            <label>Name</label>
            <input placeholder='Enter your full Name' onChange={(e)=>setName(e.target.value)} />
            </Form.Field>
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
                <Button type='submit'>Signup</Button>
                :
                <Button disabled type='submit'>Signup</Button>
            }
            
        </Form>
        <p style={{marginTop:"25px"}}>Have an account? <Link to="/login">Login</Link></p>
        </Container>
    )
}

export default Signup;