import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import {toast,ToastContainer} from "react-toastify";

import {
    Form,
    Container,
    Button
  } from 'semantic-ui-react'

const UpdateItem = () => {

    const data = JSON.parse(localStorage.getItem('item'));
    const [name,setName] = useState('')
    const [description,setDescription] = useState('')
    const [url,setUrl] = useState('')
    const [price,setPrice] = useState('')
    const [stock,setStock] = useState('')

    const history = useHistory();

    useEffect(()=>{
        setName(data.name)
        setDescription(data.description)
        setUrl(data.url)
        setPrice(data.price)
        setStock(data.stock)
    },[data.name,data.description,data.url,data.price,data.stock]);

    const handleSubmit = () => {
        fetch(`http://localhost:7000/api/updateproduct/${data._id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:localStorage.getItem('token')
            },
            body:JSON.stringify({
                name,
                description,
                url,
                price,
                stock
            })
        }).then(res=>res.json())
        .then(data=>{
            return toast(`Sucessfully updated ${data.name}`,{type:'success'})
        })
    }

    return (
        <Container>
        <ToastContainer />
        <Form style={{marginTop:"40px"}}>
        <h1>Update Item</h1>
            <Form.Field>
            <label>Name of Item</label>
            <input value={name} onChange={(e)=>setName(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <label>Description</label>
            <input value={description} type='text' onChange={(e)=>setDescription(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <label>URL</label>
            <input value={url} type='text' onChange={(e)=>setUrl(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <label>Price</label>
            <input value={price} type='number' onChange={(e)=>setPrice(e.target.value)} />
            </Form.Field>
            <Form.Field>
            <label>Stock</label>
            <input value={stock} type='number' onChange={(e)=>setStock(e.target.value)} />
            </Form.Field>
            <Button primary onClick={()=>handleSubmit()}>Save</Button>
            <Button secondary onClick={()=>history.push('/')}>Back</Button>
        </Form>        
        </Container>  
      )
}

export default UpdateItem;