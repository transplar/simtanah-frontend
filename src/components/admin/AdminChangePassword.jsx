import React from 'react'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import { baseAPIURL } from '../../utils/config'

const styles = theme => ({
  root: {
    maxWidth: 320,
    padding: theme.spacing.unit * 2,
  },
  buttonContainer: {
    marginTop: theme.spacing.unit,
  },
  messageContainer: {
    padding: theme.spacing.unit,
  },
})

class AdminChangePassword extends React.Component {
  state = {
    message: ''
  }

  handleSubmit = event => {
    const data = {
      old_password: event.target.old_password.value,
      new_password: event.target.new_password.value,
      new_password_confirm: event.target.new_password_confirm.value
    }
    const url = `${baseAPIURL}/users/changepassword`
    fetch(url, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(data)
    }).then(response => response.json())
      .then(json => this.setState({message: json.message}))
      .catch(error => this.setState({message: error.toString()}))
    event.target.reset()
    event.preventDefault()
  }

  render () {
    const { classes } = this.props
    const { message } = this.state

    return(
      <div className={classes.root}>
        <Typography variant='headline'>
          Ganti Password
        </Typography>
        <Typography className={classes.messageContainer}>
          {message}
        </Typography>
        <form onSubmit={this.handleSubmit}>
          <TextField
            fullWidth
            required
            name='old_password'
            label='Password Lama'
            type='password'
            />
          <TextField
            fullWidth
            required
            name='new_password'
            label='Password Baru'
            type='password'
            />
          <TextField
            fullWidth
            required
            name='new_password_confirm'
            label='Password Baru (Ulangi)'
            type='password'
            />
          <Typography className={classes.buttonContainer} align='center'>
            <Button variant='outlined' color='primary' type='submit'>Simpan</Button>
          </Typography>
        </form>
      </div>
    )
  }
}

export default withStyles(styles)(AdminChangePassword)
