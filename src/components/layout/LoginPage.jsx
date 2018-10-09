import React from 'react'
import { Link } from 'react-router-dom'
import {
  Button,
  Container,
  Form,
  Input,
  Label
} from 'reactstrap'
import imageSource from '../../images/logo.png'

export default class LoginPage extends React.Component {
  render () {
    const login = (this.props.match.params.auth === 'signin') ? true : false
    const title = login ? 'Login' : 'Daftar User Baru'
    const placeholder = {
      username: (login) ? 'Username' : 'Masukkan Username Baru',
      password: (login) ? 'Kata Sandi' : 'Kata Sandi Baru',
      passwordAgain: 'Ketik Ulang Kata Sandi'
    }

    let passwordCheck = (!login) ?
      <Input type='password' className='mb-3' placeholder={placeholder.passwordAgain} required /> :
      <Label check className='pl-5 mb-3'>
        <Input type='checkbox' /> {' '}Remember me
      </Label>

    let toggleLogin = <div className='my-3'>
      {(!login) ? <Link to='/signin'>Masuk</Link> : <Link to='signup'>Daftar User Baru</Link>} | <Link to='/'>Lupa Password</Link>
    </div>

    return (
      <Container className='d-flex flex-column align-items-center bg-white my-3 py-2 rounded'>
        <Form className='mt-md-5'>
          <div className='text-center mb-4'>
            <img src={imageSource} alt='Logo Jawa Barat' height='72' className='mb-4' />
            <h1 className='h3 mb-3 font-weight-normal'>{title}</h1>
            <h1 className='h4'>Sistem informasi Pertanahan</h1>
            <p>Dinas Perumahan Dan Permukiman Provinsi Jawa Barat</p>
          </div>
          <Input type='text' className='mb-3' placeholder={placeholder.username} required='' autoFocus />
          <Input type='password' className='mb-3' placeholder={placeholder.password} required='' />
          {passwordCheck}
          <div className='checbox mb-3'>
            <Button block color='primary'>{title}</Button>
          </div>
          {toggleLogin}
        </Form>
        <footer>
          &copy; 2018, <Link to='/'>Kembali ke Beranda</Link>
        </footer>
      </Container>
    )
  }
}