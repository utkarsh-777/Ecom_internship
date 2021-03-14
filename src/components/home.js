import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useHistory } from "react-router";
import axios from "axios";

import { toast,ToastContainer } from "react-toastify";

import {
    Checkbox,
    Button,
    Icon,
    Menu,
    Segment,
    Sidebar,
    Card,
    Image,
    Grid,
    Header,
    Modal
  } from 'semantic-ui-react'

const Home = () => {
    const history = useHistory();
    const token = localStorage.getItem('token');
    const [visible, setVisible] = React.useState(false);

    const [user,setUser] = useState('');
    const [products,setProducts] = useState('');
    const [open, setOpen] = React.useState(false);

    const [modal,setModal] = useState('');
    const [openDelete,setOpenDelete] = useState(false);

    useEffect(()=>{
        if(!token){
            history.push('/signup')
        }
        else{
            axios.get("http://localhost:7000/api/user",{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            }).then(res=>{
                setUser(res.data)
            })

            axios.get("http://localhost:7000/api/allproduct",{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            }).then(data=>{
                setProducts(data.data)
            })
        }
    },[token,history]);

    const handleSignout = () => {
        localStorage.clear()
        history.push('/login')
    }

    const openModal = (item) => {
        setOpen(true);
        setModal(item);
    }

    const handleUpdate = (item) => {
        localStorage.setItem('item',JSON.stringify(item));
        history.push('/updateitem');
    }

    const handleBuy = (data) => {
        fetch(`http://localhost:7000/api/buyproduct/${data._id}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json",
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
        .then(resp=>{
            console.log(resp)
            if(resp.error){
                setOpen(false)
                axios.get("http://localhost:7000/api/allproduct",{
                    headers:{
                        Authorization:localStorage.getItem('token')
                    }
                }).then(data=>{
                    setProducts(data.data)
                });
                return toast(resp.error,{type:"error"})
            }
            setOpen(false)
            axios.get("http://localhost:7000/api/allproduct",{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            }).then(data=>{
                setProducts(data.data)
            });

            return toast(`Purchased ${resp.name} at Rs ${resp.price}`,{type:"success"})
        })
    }

    const handleDelete = (item) => {
        setOpenDelete(true);
        setModal(item);
    }

    const deleteProduct = (item) => {
        fetch(`http://localhost:7000/api/deleteproduct/${item._id}`,{
            method:"DELETE",
            headers:{
                Authorization:localStorage.getItem('token')
            }
        }).then(res=>res.json())
        .then(resp=>{
            setOpenDelete(false)
            axios.get("http://localhost:7000/api/allproduct",{
                headers:{
                    Authorization:localStorage.getItem('token')
                }
            }).then(data=>{
                setProducts(data.data)
            });

            return toast(`Sucessfully Deleted ${item.name}!`,{type:"warning"})
        })
    }

    return (
            <Sidebar.Pushable as={Segment} style={{height:"auto"}}>
            <Modal
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                open={open}
                >
                <Modal.Header>Buy an Item</Modal.Header>
                <Modal.Content image>
                <Image size="medium" src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                    <Modal.Description>
                    <Header style={{fontSize:"20px"}}>{modal.name}</Header>
                    <p style={{fontSize:'20px'}}>
                        {modal.description}
                    </p>
                    <p>Only {modal.stock} left in stock!</p>
                    <p>Price : <span style={{fontWeight:"bold",color:"red"}}>Rs {modal.price}</span></p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpen(false)}>
                    Cancel
                    </Button>
                    <Button
                    content="Buy"
                    labelPosition='right'
                    icon='checkmark'
                    onClick={() => handleBuy(modal)}
                    positive
                    />
                </Modal.Actions>
            </Modal>
            <Modal
                onClose={() => setOpenDelete(false)}
                onOpen={() => setOpenDelete(true)}
                open={openDelete}
                >
                <Modal.Header>Are you sure you want to delete <span style={{fontWeight:"bold",color:"red"}}>{modal.name}</span> ?</Modal.Header>
                <Modal.Content image>
                <Image size="medium" src='https://react.semantic-ui.com/images/avatar/large/matthew.png' />
                    <Modal.Description>
                    <Header style={{fontSize:"20px"}}>{modal.name}</Header>
                    <p style={{fontSize:'20px'}}>
                        {modal.description}
                    </p>
                    <p>{modal.stock} left in stock</p>
                    <p>Price : <span style={{fontWeight:"bold",color:"red"}}>Rs {modal.price}</span></p>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={() => setOpenDelete(false)}>
                    Cancel
                    </Button>
                    <Button
                    content="Delete Product"
                    labelPosition='right'
                    icon='delete'
                    onClick={() => deleteProduct(modal)}
                    negative
                    />
                </Modal.Actions>
            </Modal>
              <Sidebar
                as={Menu}
                animation='overlay'
                icon='labeled'
                inverted
                onHide={() => setVisible(false)}
                vertical
                visible={visible}
                width='thin'
              >
                <Menu.Item as='a'>
                  <p>Welcome, {user ? user.name : " "}</p>
                  <p>Logged in as <span style={{fontWeight:"bold",color:"red"}}>{user ? user.username : " "}</span></p>
                </Menu.Item>
                <Menu.Item as='a' onClick={()=>history.push('/')}>
                  <Icon name='home' />
                  Home
                </Menu.Item>
                <Menu.Item as='a' onClick={()=>history.push('/create')}>
                  <Icon name='upload' />
                  Create Product
                </Menu.Item>
                <Menu.Item as='a' onClick={()=>handleSignout()}>
                  <Icon name='sign-out' />
                  Sign-Out
                </Menu.Item>
              </Sidebar>
    
              <Sidebar.Pusher dimmed={visible}>
              <Segment>
              <h1>Ecom HomePage</h1>
                  <Checkbox
                    toggle
                    checked={visible}
                    label={{ children: <code>Side-Bar</code> }}
                    onChange={(e, data) => setVisible(data.checked)}
                    />
                    <Grid columns={3} divided>
                    <Grid.Row>
                    <ToastContainer />
                    {products ? 
                        products.map(item=>{
                            return(  
                        <Grid.Column key={item._id}>
                        <Card style={{width:"100%",marginBottom:"20px",marginTop:"20px"}}>
                        <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped ui={false} />
                        <Card.Content>
                        <Card.Header>{item.name}</Card.Header>
                        <Card.Meta>
                            <span className='date'>Price Rs {item.price}</span>
                        </Card.Meta>
                        <Card.Description>
                            {item.description}
                        </Card.Description>
                        </Card.Content>
                        <Card.Content extra>
                        <a href="/">
                            <Icon name='balance scale' />
                            {item.stock} left in Stock
                        </a>
                        </Card.Content>
                        <Button color='green' onClick={()=>openModal(item)}>Buy</Button>
                        <Button color='yellow' onClick={()=>handleUpdate(item)}>Update</Button>
                        <Button color='red' onClick={()=>handleDelete(item)}>Delete</Button>
                    </Card>
                    </Grid.Column>
                            )
                        })
                        :
                    <div></div>
                    }
                    </Grid.Row>
                    </Grid>
                    </Segment>
              </Sidebar.Pusher>
        </Sidebar.Pushable>
      )
}

export default Home;